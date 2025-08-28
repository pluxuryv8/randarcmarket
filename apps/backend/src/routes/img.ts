import { Router } from 'express';
const router = Router();

/**
 * GET /api/img?url=<https://...> — простой прокси с CORS и Cache-Control
 * НИКАКОЙ обработки IPFS здесь не делаем (у вас уже есть toHttp).
 */
router.get('/', async (req,res)=>{
  const url = String(req.query.url||'');
  if (!url || !url.startsWith('http')) return res.status(400).end();

  try {
    const r = await fetch(url);
    if (!r.ok) return res.status(502).end();
    res.setHeader('Cache-Control','public, max-age=600');
    res.setHeader('Content-Type', r.headers.get('content-type') || 'image/*');
    const buf = Buffer.from(await r.arrayBuffer());
    res.end(buf);
  } catch {
    res.status(502).end();
  }
});
export default router;
