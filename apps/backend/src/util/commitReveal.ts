import crypto from 'crypto';

/**
 * Генерирует случайный 32-байтовый seed в hex формате
 */
export function generateSeed(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Создает SHA256 хеш от seed для commit фазы
 */
export function hashSeed(seed: string): string {
  return crypto.createHash('sha256').update(seed).digest('hex');
}

/**
 * Создает HMAC-SHA256 от serverSeed и publicSalt для reveal фазы
 */
export function makeRand(serverSeed: string, publicSalt: string): string {
  return crypto.createHmac('sha256', serverSeed).update(publicSalt).digest('hex');
}

/**
 * Проверяет, что commit соответствует reveal
 */
export function verifyCommitReveal(seedHash: string, serverSeed: string): boolean {
  return hashSeed(serverSeed) === seedHash;
}

/**
 * Генерирует случайное число от 0 до 1 на основе rand
 */
export function randToFloat(rand: string): number {
  // Берем первые 8 символов rand и конвертируем в число от 0 до 1
  const hex = rand.substring(0, 8);
  const decimal = parseInt(hex, 16);
  return decimal / 0xffffffff; // Нормализуем к [0, 1)
}
