import { signAccess } from '../modules/auth/jwt';

export interface TestUser {
  id: string;
  tier?: 'free' | 'pro';
  tgId?: string;
  wallet?: string;
}

/**
 * Создает тестовый JWT токен для E2E тестов
 */
export function createTestToken(user: TestUser = { id: 'e2e-user', tier: 'pro' }): string {
  return signAccess({
    id: user.id,
    tgId: user.tgId,
    wallet: user.wallet
  });
}

/**
 * Возвращает заголовок авторизации для тестов
 */
export function authHeader(user?: TestUser): { Authorization: string } {
  const token = createTestToken(user);
  return { Authorization: `Bearer ${token}` };
}

/**
 * Создает несколько тестовых пользователей для тестов с несколькими участниками
 */
export function createTestUsers(count: number = 2): TestUser[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `e2e-user-${i + 1}`,
    tier: i === 0 ? 'pro' : 'free' // Первый пользователь pro, остальные free
  }));
}
