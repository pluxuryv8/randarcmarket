import { prisma } from '../db/client';
import { generateSeed, hashSeed, makeRand, randToFloat, verifyCommitReveal } from '../util/commitReveal';
import { getLatestBlockHash } from '../util/ton';
import { 
  radarRoundsTotal, 
  radarRoundCloseDuration, 
  radarEntriesTotal, 
  radarCommitRevealFailures,
  radarActiveRounds 
} from '../observability/metrics';

export interface RadarEntry {
  id: string;
  userId: string;
  tier: 'free' | 'pro';
  weight: number;
}

export interface RadarWinner {
  userId: string;
  weight: number;
}

export interface RadarResult {
  caught: boolean;
  itemAddress: string;
  reveal: {
    serverSeed: string;
    publicSalt: string;
    rand: string;
  };
}

/**
 * Создает новый раунд или присоединяется к существующему
 */
export async function createOrJoinRound(
  itemAddress: string, 
  userId: string, 
  tier: 'free' | 'pro'
): Promise<{ roundId: string; roundEndsAt: Date; seedHash: string }> {
  
  // Определяем вес в зависимости от tier
  const weight = tier === 'pro' ? 1.25 : 1.0;
  
  // Ищем открытый раунд для этого NFT
  let round = await prisma.radarRound.findFirst({
    where: {
      itemAddress,
      status: 'open',
      endsAt: { gt: new Date() }
    }
  });

  if (!round) {
    // Создаем новый раунд
    const serverSeed = generateSeed();
    const seedHash = hashSeed(serverSeed);
    const startsAt = new Date();
    const endsAt = new Date(startsAt.getTime() + 500); // 500ms раунд

    round = await prisma.radarRound.create({
      data: {
        itemAddress,
        startsAt,
        endsAt,
        seedHash,
        serverSeed,
        status: 'open'
      }
    });

    // Метрики: создание раунда
    radarRoundsTotal.inc({ status: 'open' });
    radarActiveRounds.inc();

    // Запускаем таймер для автоматического закрытия
    setTimeout(() => closeRound(round!.id), 500);
  }

  // Проверяем, не участвует ли уже пользователь
  const existingEntry = await prisma.radarEntry.findUnique({
    where: {
      roundId_userId: {
        roundId: round.id,
        userId
      }
    }
  });

  if (existingEntry) {
    throw new Error('User already joined this round');
  }

  // Добавляем участника
  await prisma.radarEntry.create({
    data: {
      roundId: round.id,
      userId,
      tier,
      weight
    }
  });

  // Метрики: добавление участника
  radarEntriesTotal.inc({ tier });

  return {
    roundId: round.id,
    roundEndsAt: round.endsAt,
    seedHash: round.seedHash
  };
}

/**
 * Закрывает раунд и определяет победителей
 */
export async function closeRound(roundId: string): Promise<void> {
  const startTime = Date.now();
  
  const round = await prisma.radarRound.findUnique({
    where: { id: roundId },
    include: { entries: true }
  });

  if (!round || round.status !== 'open') {
    return;
  }

  // Получаем TON block hash как public salt
  const publicSalt = await getLatestBlockHash();
  
  // Создаем итоговый rand
  const rand = makeRand(round.serverSeed!, publicSalt);
  
  // Выбираем победителей
  const winners = pickWeightedWinners(round.entries, rand);
  
  // Логируем commit-reveal данные
  console.log(`🔐 Radar round ${roundId} reveal:`, {
    seedHash: round.seedHash,
    publicSalt,
    rand,
    winnersCount: winners.length
  });
  
  // Обновляем раунд
  await prisma.radarRound.update({
    where: { id: roundId },
    data: {
      publicSalt,
      rand,
      winnersJson: JSON.stringify(winners),
      status: 'revealed'
    }
  });

  // Метрики: закрытие раунда
  const closeDuration = Date.now() - startTime;
  radarRoundCloseDuration.observe({ status: 'revealed' }, closeDuration);
  radarRoundsTotal.inc({ status: 'closed' });
  radarRoundsTotal.inc({ status: 'revealed' });
  radarActiveRounds.dec();

  // Проверяем целостность commit-reveal
  if (!verifyCommitReveal(round.seedHash, round.serverSeed!)) {
    radarCommitRevealFailures.inc();
    console.error(`❌ Commit-reveal verification failed for round ${roundId}`);
  }
}

/**
 * Получает результат для пользователя
 */
export async function getResult(roundId: string, userId: string): Promise<RadarResult> {
  const round = await prisma.radarRound.findUnique({
    where: { id: roundId },
    include: { entries: true }
  });

  if (!round) {
    throw new Error('Round not found');
  }

  // Проверяем, участвовал ли пользователь
  const entry = round.entries.find(e => e.userId === userId);
  if (!entry) {
    throw new Error('User did not participate in this round');
  }

  // Если раунд еще открыт, закрываем его
  if (round.status === 'open' && round.endsAt < new Date()) {
    await closeRound(roundId);
    // Перезагружаем данные
    const updatedRound = await prisma.radarRound.findUnique({
      where: { id: roundId }
    });
    if (updatedRound) {
      round.status = updatedRound.status;
      round.publicSalt = updatedRound.publicSalt;
      round.rand = updatedRound.rand;
      round.winnersJson = updatedRound.winnersJson;
    }
  }

  if (round.status !== 'revealed') {
    throw new Error('Round not yet revealed');
  }

  // Проверяем, является ли пользователь победителем
  const winners = round.winnersJson ? JSON.parse(round.winnersJson) as RadarWinner[] : [];
  const isWinner = winners.some(w => w.userId === userId);

  return {
    caught: isWinner,
    itemAddress: round.itemAddress,
    reveal: {
      serverSeed: round.serverSeed!,
      publicSalt: round.publicSalt!,
      rand: round.rand!
    }
  };
}

/**
 * Выбирает победителей на основе взвешенной рулетки
 */
function pickWeightedWinners(entries: any[], rand: string): RadarWinner[] {
  if (entries.length === 0) {
    return [];
  }

  const randomValue = randToFloat(rand);
  const totalWeight = entries.reduce((sum, entry) => sum + entry.weight, 0);
  
  let currentWeight = 0;
  for (const entry of entries) {
    currentWeight += entry.weight / totalWeight;
    if (randomValue <= currentWeight) {
      return [{ userId: entry.userId, weight: entry.weight }];
    }
  }

  // Fallback - возвращаем последнего участника
  const lastEntry = entries[entries.length - 1];
  return [{ userId: lastEntry.userId, weight: lastEntry.weight }];
}

/**
 * Получает статистику раунда
 */
export async function getRoundStats(roundId: string) {
  const round = await prisma.radarRound.findUnique({
    where: { id: roundId },
    include: { entries: true }
  });

  if (!round) {
    throw new Error('Round not found');
  }

  const totalEntries = round.entries.length;
  const freeEntries = round.entries.filter(e => e.tier === 'free').length;
  const proEntries = round.entries.filter(e => e.tier === 'pro').length;
  const totalWeight = round.entries.reduce((sum, e) => sum + e.weight, 0);

  return {
    roundId,
    itemAddress: round.itemAddress,
    status: round.status,
    totalEntries,
    freeEntries,
    proEntries,
    totalWeight,
    startsAt: round.startsAt,
    endsAt: round.endsAt
  };
}
