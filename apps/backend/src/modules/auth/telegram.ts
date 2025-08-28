import { createHmac, createHash } from 'crypto';
import { getEnv } from '../../config/env';

// Проверка данных Telegram Login Widget (fields + hash)
export function verifyTelegramAuth(data: Record<string,string|number>): boolean {
  const env = getEnv();
  if (!env.TELEGRAM_BOT_TOKEN) return false;

  const { hash, ...rest } = data as any;
  const entries = Object.keys(rest)
    .sort()
    .map(k => `${k}=${rest[k]}`)
    .join('\n');

  const secret = createHash('sha256').update(env.TELEGRAM_BOT_TOKEN).digest(); // key = sha256(bot_token)
  const hmac = createHmac('sha256', secret).update(entries).digest('hex');

  return hmac === hash;
}
