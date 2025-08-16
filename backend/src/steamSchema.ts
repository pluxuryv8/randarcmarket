import { Router } from 'express';
import fetch from 'node-fetch';
const router = Router();

// Функция для получения URL иконки скина
export function getIconUrl(skinName: string): string | null {
  // Простая логика для демонстрации
  // В реальности здесь должна быть логика получения иконки из Steam API
  const skinIcons: { [key: string]: string } = {
    'AWP | Asiimov': 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszFJTwX09-jhIWZhP_7OrzZgiVQuJxw3QbGpYj4n2n0qBpQ7WJ0J9bHcQY5YQhQ8WJ1oQ/360fx360f',
    'AK-47 | Redline': 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszFJTwX09-jhIWZhP_7OrzZgiVQuJxw3QbGpYj4n2n0qBpQ7WJ0J9bHcQY5YQhQ8WJ1oQ/360fx360f',
    'Desert Eagle | Blaze': 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszFJTwX09-jhIWZhP_7OrzZgiVQuJxw3QbGpYj4n2n0qBpQ7WJ0J9bHcQY5YQhQ8WJ1oQ/360fx360f',
  };
  
  return skinIcons[skinName] || null;
}

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
