import { Router } from 'express';
import fetch from 'node-fetch';
const router = Router();

router.get('/', async (req, res) => {
  const apiKey = process.env.STEAM_API_KEY!;
  const lang = process.env.LANGUAGE || 'ru';
  const url = `https://api.steampowered.com/IEconItems_730/GetSchema/v1/?key=${apiKey}&language=${lang}`;
  try {
    const resp = await fetch(url);
    if (!resp.ok) throw new Error(`Steam API ${resp.status}`);
    const data = await resp.json();
    res.json(data);
  } catch (e) {
    console.error('Steam schema load error:', e);
    res.status(500).json({ error: 'Failed to load Steam schema' });
  }
});

export default router;
