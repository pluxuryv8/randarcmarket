import { prisma } from '../db/client';
import crypto from 'crypto';
import { radarReservationsTotal, radarReservationsActive } from '../observability/metrics';

export interface WinnerInfo {
  userId: string;
  weight: number;
  itemAddress?: string;
  priceTon?: number;
  source?: string;
}

export interface ReservationParams {
  roundId: string;
  userId: string;
  itemAddress: string;
  priceTon: number;
  source: string;
  ttlMs?: number;
}

export interface ReservationResult {
  id: string;
  reserveToken: string;
  expiresAt: Date;
}

/**
 * Проверяет, является ли пользователь победителем раунда
 */
export async function isUserWinnerOfRound(
  roundId: string, 
  userId: string
): Promise<{ok: boolean, itemAddress?: string, priceTon?: number, source?: string}> {
  try {
    const round = await prisma.radarRound.findUnique({
      where: { id: roundId },
      select: { 
        itemAddress: true, 
        winnersJson: true, 
        status: true 
      }
    });

    if (!round) {
      return { ok: false };
    }

    if (round.status !== 'revealed') {
      return { ok: false };
    }

    if (!round.winnersJson) {
      return { ok: false };
    }

    // Парсим winnersJson (строка JSON)
    const winners: WinnerInfo[] = JSON.parse(round.winnersJson);
    
    const winner = winners.find(w => w.userId === userId);
    
    if (!winner) {
      return { ok: false };
    }

    return {
      ok: true,
      itemAddress: round.itemAddress,
      priceTon: winner.priceTon || 0.1, // MVP: дефолтная цена
      source: winner.source || 'randar'
    };
  } catch (error) {
    console.error('Error checking winner:', error);
    return { ok: false };
  }
}

/**
 * Создает резервацию для победителя раунда
 */
export async function createReservation(params: ReservationParams): Promise<ReservationResult> {
  const { roundId, userId, itemAddress, priceTon, source, ttlMs = 8000 } = params;

  // Проверяем, что пользователь является победителем
  const winnerCheck = await isUserWinnerOfRound(roundId, userId);
  if (!winnerCheck.ok) {
    throw new Error('User is not a winner of this round');
  }

  // Проверяем, есть ли уже активная резервация
  const existingReservation = await prisma.radarReservation.findFirst({
    where: {
      roundId,
      userId,
      status: 'pending'
    }
  });

  if (existingReservation) {
    // Идемпотентность: возвращаем существующую резервацию
    return {
      id: existingReservation.id,
      reserveToken: existingReservation.reserveToken,
      expiresAt: existingReservation.expiresAt
    };
  }

  // Генерируем случайный токен
  const reserveToken = crypto.randomBytes(16).toString('hex');
  
  // Вычисляем время истечения
  const expiresAt = new Date(Date.now() + ttlMs);

  // Создаем резервацию
  const reservation = await prisma.radarReservation.create({
    data: {
      roundId,
      itemAddress,
      source,
      userId,
      priceTon,
      status: 'pending',
      reserveToken,
      expiresAt
    }
  });

  // Update metrics
  radarReservationsTotal.inc({ status: 'pending' });
  radarReservationsActive.inc();

  return {
    id: reservation.id,
    reserveToken: reservation.reserveToken,
    expiresAt: reservation.expiresAt
  };
}

/**
 * Истекает просроченные резервации
 */
export async function expireStaleReservations(): Promise<number> {
  try {
    const result = await prisma.radarReservation.updateMany({
      where: {
        status: 'pending',
        expiresAt: {
          lt: new Date()
        }
      },
      data: {
        status: 'expired'
      }
    });

    // Update metrics
    if (result.count > 0) {
      radarReservationsTotal.inc({ status: 'expired' }, result.count);
      radarReservationsActive.dec(result.count);
    }

    return result.count;
  } catch (error) {
    console.error('Error expiring reservations:', error);
    return 0;
  }
}

/**
 * Отменяет резервацию
 */
export async function cancelReservation(id: string, userId: string): Promise<boolean> {
  try {
    const result = await prisma.radarReservation.updateMany({
      where: {
        id,
        userId,
        status: 'pending'
      },
      data: {
        status: 'cancelled'
      }
    });

    // Update metrics
    if (result.count > 0) {
      radarReservationsTotal.inc({ status: 'cancelled' });
      radarReservationsActive.dec();
    }

    return result.count > 0;
  } catch (error) {
    console.error('Error cancelling reservation:', error);
    return false;
  }
}

/**
 * Получает резервации пользователя
 */
export async function getUserReservations(
  userId: string, 
  limit: number = 20
): Promise<any[]> {
  try {
    const reservations = await prisma.radarReservation.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      select: {
        id: true,
        status: true,
        itemAddress: true,
        priceTon: true,
        expiresAt: true,
        roundId: true,
        createdAt: true,
        source: true
      }
    });

    return reservations;
  } catch (error) {
    console.error('Error getting user reservations:', error);
    return [];
  }
}
