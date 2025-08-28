import type { Request, Response, NextFunction } from 'express';
import { getEnv } from '../config/env';

export function isAdmin(req: Request, res: Response, next: NextFunction) {
  const env = getEnv();
  const adminsTg = (env.ADMIN_TG_IDS || '').split(',').map(s=>s.trim()).filter(Boolean);
  const adminsWal = (env.ADMIN_WALLETS || '').split(',').map(s=>s.trim()).filter(Boolean);

  const user = (req as any).user as { id?:string; tgId?:string; wallet?:string } | undefined;
  if (!user) return res.status(401).json({ success:false, error:'Unauthorized' });

  const ok = (user.tgId && adminsTg.includes(String(user.tgId))) ||
            (user.wallet && adminsWal.includes(String(user.wallet)));
  if (!ok) return res.status(403).json({ success:false, error:'Forbidden' });

  next();
}
