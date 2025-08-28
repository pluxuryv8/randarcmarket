import jwt from 'jsonwebtoken';
import { Request } from 'express';
import { getEnv } from '../../config/env';

type JwtUser = { id: string; tgId?: string; wallet?: string };

export interface AuthenticatedRequest extends Request {
  user?: {
    sub: string;
    user_id: string;
    username?: string;
    tgId?: string;
    wallet?: string;
  };
}

export function signAccess(user: JwtUser) {
  const env = getEnv();
  return jwt.sign({ sub: user.id, tgId: user.tgId, wallet: user.wallet }, env.JWT_SECRET, { expiresIn: env.JWT_ACCESS_TTL as any });
}
export function signRefresh(user: JwtUser, tokenId: string) {
  const env = getEnv();
  return jwt.sign({ sub: user.id, jti: tokenId }, env.JWT_SECRET, { expiresIn: env.JWT_REFRESH_TTL as any });
}
export function verifyToken<T=any>(token: string): T {
  const env = getEnv();
  return jwt.verify(token, env.JWT_SECRET) as T;
}

// Legacy compatibility functions
export function authenticateJWT(req: AuthenticatedRequest, res: any, next: any) {
  const hdr = req.headers.authorization;
  if (!hdr?.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Authorization header required' });
  }
  const token = hdr.slice(7);
  try {
    const payload = verifyToken<{ sub: string; tgId?: string; wallet?: string }>(token);
    req.user = { 
      sub: payload.sub, 
      user_id: payload.sub, 
      tgId: payload.tgId, 
      wallet: payload.wallet 
    };
    return next();
  } catch {
    return res.status(401).json({ success: false, error: 'Invalid token' });
  }
}

export function requireSubscription(req: AuthenticatedRequest, res: any, next: any) {
  // TODO: Check if user has active subscription
  // For MVP, we'll allow all authenticated users
  next();
}
