import type { Request, Response, NextFunction } from 'express';
import { getEnv } from '../config/env';

export function verifyTelegramWebhook(req: Request, res: Response, next: NextFunction) {
  const env = getEnv();
  const secret = env.TELEGRAM_WEBHOOK_SECRET;
  if (!secret) return res.status(500).json({ success:false, error:'No webhook secret configured' });

  const header = req.headers['x-telegram-bot-api-secret-token'] || req.headers['x-telegram-bot-secret-token'];
  if (header !== secret) return res.status(401).json({ success:false, error:'Invalid webhook secret' });

  next();
}
