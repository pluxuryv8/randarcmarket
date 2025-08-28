import type { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../modules/auth/jwt';

export function authGuard(req: Request, res: Response, next: NextFunction) {
  const hdr = req.headers.authorization;
  if (!hdr?.startsWith('Bearer ')) return res.status(401).json({ success:false, error:'Unauthorized' });
  const token = hdr.slice(7);
  try {
    const payload = verifyToken<{ sub: string; tgId?: string; wallet?: string }>(token);
    (req as any).user = { id: payload.sub, tgId: payload.tgId, wallet: payload.wallet };
    return next();
  } catch {
    return res.status(401).json({ success:false, error:'Unauthorized' });
  }
}
