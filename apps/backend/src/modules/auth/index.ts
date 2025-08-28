import { Router } from 'express';
import cookie from 'cookie';
import { signAccess, signRefresh, verifyToken } from './jwt';
import { issueJti, revokeJti, isActiveJti } from './refresh';
import { verifyTelegramAuth } from './telegram';
import { getEnv } from '../../config/env';

export const authRouter = Router();

/**
 * DEV login (только если ENABLE_DEV_AUTH=true) — для локальных тестов
 * /api/auth/dev-login?user=<id>&tgId=<telegram_id>
 */
authRouter.post('/dev-login', (req,res)=>{
  if (getEnv().ENABLE_DEV_AUTH !== 'true') return res.status(404).end();
  const id = String(req.query.user || 'dev');
  const tgId = req.query.tgId ? String(req.query.tgId) : undefined;
  const access = signAccess({ id, tgId });
  const jti = issueJti();
  const refresh = signRefresh({ id }, jti);
  const ck = cookie.serialize('refresh_token', refresh, {
    httpOnly: true, sameSite: 'lax', secure: getEnv().NODE_ENV==='production', path: '/'
  });
  res.setHeader('Set-Cookie', ck);
  res.json({ success:true, access });
});

authRouter.post('/refresh', (req, res) => {
  try {
    const cookies = cookie.parse(req.headers.cookie || '');
    const token = cookies['refresh_token'];
    if (!token) return res.status(401).json({ success:false, error:'No refresh' });
    const payload = verifyToken<{ sub:string; jti?:string }>(token);
    if (!isActiveJti(payload.jti)) return res.status(401).json({ success:false, error:'Revoked' });
    // rotate
    revokeJti(payload.jti!);
    const jti = issueJti();
    const access = signAccess({ id: payload.sub });
    const refresh = signRefresh({ id: payload.sub }, jti);
    const ck = cookie.serialize('refresh_token', refresh, {
      httpOnly: true, sameSite: 'lax', secure: getEnv().NODE_ENV==='production', path: '/'
    });
    res.setHeader('Set-Cookie', ck);
    res.json({ success:true, access });
  } catch {
    res.status(401).json({ success:false, error:'Refresh failed' });
  }
});

authRouter.post('/logout', (req,res)=>{
  try {
    const cookies = cookie.parse(req.headers.cookie || '');
    const token = cookies['refresh_token'];
    if (token) {
      const payload = verifyToken<{ jti?:string }>(token);
      if (payload.jti) revokeJti(payload.jti);
    }
  } catch {}
  const ck = cookie.serialize('refresh_token','',{ httpOnly:true, sameSite:'lax', secure:getEnv().NODE_ENV==='production', path:'/', maxAge:0 });
  res.setHeader('Set-Cookie', ck);
  res.json({ success:true });
});

authRouter.get('/me', (req,res)=>{
  const hdr = req.headers.authorization;
  if (!hdr?.startsWith('Bearer ')) return res.json({ authenticated:false });
  try {
    const payload = verifyToken<{ sub:string; tgId?:string; wallet?:string }>(hdr.slice(7));
    res.json({ authenticated:true, id:payload.sub, tgId:payload.tgId, wallet:payload.wallet });
  } catch {
    res.json({ authenticated:false });
  }
});

authRouter.post('/telegram/verify', (req,res) => {
  // ожидание: body содержит данные виджета telegram: id, first_name, auth_date, hash, ...
  const ok = verifyTelegramAuth(req.body || {});
  if (!ok) return res.status(401).json({ success:false, error:'Invalid telegram signature' });

  const id = String((req.body as any).id);
  const access = signAccess({ id, tgId: id });
  const jti = issueJti();
  const refresh = signRefresh({ id }, jti);
  const ck = cookie.serialize('refresh_token', refresh, {
    httpOnly: true, sameSite: 'lax', secure: getEnv().NODE_ENV==='production', path: '/'
  });
  res.setHeader('Set-Cookie', ck);
  res.json({ success:true, access });
});
