import { z } from 'zod';

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development','test','production']).default('development'),

  PORT: z.string().transform(Number).default('8080'),
  CLIENT_ORIGIN: z.string().default('http://localhost:5173'), // может быть список через запятую

  JWT_SECRET: z.string().min(32),
  JWT_ACCESS_TTL: z.string().default('15m'),
  JWT_REFRESH_TTL: z.string().default('30d'),

  // Telegram
  TELEGRAM_BOT_TOKEN: z.string().optional(),
  TELEGRAM_WEBHOOK_SECRET: z.string().optional(),
  TELEGRAM_BOT_NAME: z.string().optional(),

  // Admin
  ADMIN_TG_IDS: z.string().optional(),     // CSV
  ADMIN_WALLETS: z.string().optional(),    // CSV

  // Ton/Tonconnect/Indexers
  TONAPI_KEY: z.string().optional(),
  NFTSCAN_TON_API_KEY: z.string().optional(),

  ENABLE_DEV_AUTH: z.string().optional(), // "true" для локальной заглушки логина
});

export type Env = z.infer<typeof EnvSchema>;

let cached: Env | null = null;
export function getEnv(): Env {
  if (cached) return cached;
  const parsed = EnvSchema.safeParse(process.env);
  if (!parsed.success) {
    // в dev можно не падать жёстко, но в prod — падаем
    const msg = parsed.error.issues.map(i=>`${i.path.join('.')}: ${i.message}`).join('; ');
    if (process.env.NODE_ENV === 'production') {
      throw new Error('ENV validation error: ' + msg);
    } else {
      console.warn('ENV validation warnings:', msg);
    }
  }
  cached = (parsed.success ? parsed.data : (parsed as any).data) as Env;
  return cached!;
}
