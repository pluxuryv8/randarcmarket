import express from 'express';
import fs from 'fs';
import path from 'path';

const router = express.Router();

// Загружаем данные скинов из файла
const loadSkinsData = () => {
  try {
    const skinsPath = path.join(__dirname, '../../../skins.json');
    const data = fs.readFileSync(skinsPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Ошибка загрузки skins.json:', error);
    return [];
  }
};

// Steam API ключ
const STEAM_API_KEY = 'F0E76856718EE13B8F6BA149E5C02CF8';

// Создаем красивый SVG placeholder с названием оружия
const createWeaponPlaceholder = (weaponName: string) => {
  const svg = `<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#2c3e50;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#34495e;stop-opacity:1" />
      </linearGradient>
    </defs>
    <rect width="300" height="200" fill="url(#grad1)"/>
    <rect x="10" y="10" width="280" height="180" fill="none" stroke="#95a5a6" stroke-width="2" rx="10"/>
    <text x="150" y="90" font-family="Arial, sans-serif" font-size="18" fill="#ecf0f1" text-anchor="middle" font-weight="bold">${weaponName.toUpperCase()}</text>
    <text x="150" y="120" font-family="Arial, sans-serif" font-size="12" fill="#bdc3c7" text-anchor="middle">CS:GO SKIN</text>
    <circle cx="150" cy="150" r="15" fill="none" stroke="#e74c3c" stroke-width="2"/>
    <text x="150" y="155" font-family="Arial, sans-serif" font-size="10" fill="#e74c3c" text-anchor="middle" font-weight="bold">CS</text>
  </svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
};

// База данных изображений скинов
const skinImages: { [key: string]: string } = {
  // AK-47 скины
  'AK-47 | Searing Rage': 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszFJTwW0N_phWaOcP9h0v_6Zqj4R6JvjvxT9_7w3gK0r0JqYz_3J4GpJwY4Pw/360fx252f',
  'AK-47 | The Outsiders': 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszFJTwW0N_phWaOcP9h0v_6Zqj4R6JvjvxT9_7w3gK0r0JqYz_3J4GpJwY4Pw/360fx252f',
  'AK-47 | Inheritance': 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszFJTwW0N_phWaOcP9h0v_6Zqj4R6JvjvxT9_7w3gK0r0JqYz_3J4GpJwY4Pw/360fx252f',
  'AK-47 | Hydroponic': 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszFJTwW0N_phWaOcP9h0v_6Zqj4R6JvjvxT9_7w3gK0r0JqYz_3J4GpJwY4Pw/360fx252f',
  'AK-47 | Cartel': 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszFJTwW0N_phWaOcP9h0v_6Zqj4R6JvjvxT9_7w3gK0r0JqYz_3J4GpJwY4Pw/360fx252f',
  'AK-47 | Case Hardened': 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszFJTwW0N_phWaOcP9h0v_6Zqj4R6JvjvxT9_7w3gK0r0JqYz_3J4GpJwY4Pw/360fx252f',
  'AK-47 | Phantom Disruptor': 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszFJTwW0N_phWaOcP9h0v_6Zqj4R6JvjvxT9_7w3gK0r0JqYz_3J4GpJwY4Pw/360fx252f',
  'AK-47 | Neon Revolution': 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszFJTwW0N_phWaOcP9h0v_6Zqj4R6JvjvxT9_7w3gK0r0JqYz_3J4GpJwY4Pw/360fx252f',
  'AK-47 | Legion of Anubis': 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszFJTwW0N_phWaOcP9h0v_6Zqj4R6JvjvxT9_7w3gK0r0JqYz_3J4GpJwY4Pw/360fx252f',
  'AK-47 | Asiimov': 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszFJTwW0N_phWaOcP9h0v_6Zqj4R6JvjvxT9_7w3gK0r0JqYz_3J4GpJwY4Pw/360fx252f',
  'AK-47 | Uncharted': 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszFJTwW0N_phWaOcP9h0v_6Zqj4R6JvjvxT9_7w3gK0r0JqYz_3J4GpJwY4Pw/360fx252f',
  'AK-47 | Redline': 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszFJTwW0N_phWaOcP9h0v_6Zqj4R6JvjvxT9_7w3gK0r0JqYz_3J4GpJwY4Pw/360fx252f',
  'AK-47 | Ice Coaled': 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszFJTwW0N_phWaOcP9h0v_6Zqj4R6JvjvxT9_7w3gK0r0JqYz_3J4GpJwY4Pw/360fx252f',
  'AK-47 | Aquamarine Revenge': 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszFJTwW0N_phWaOcP9h0v_6Zqj4R6JvjvxT9_7w3gK0r0JqYz_3J4GpJwY4Pw/360fx252f',
  'AK-47 | Elite Build': 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszFJTwW0N_phWaOcP9h0v_6Zqj4R6JvjvxT9_7w3gK0r0JqYz_3J4GpJwY4Pw/360fx252f',
  'AK-47 | Nightwish': 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszFJTwW0N_phWaOcP9h0v_6Zqj4R6JvjvxT9_7w3gK0r0JqYz_3J4GpJwY4Pw/360fx252f',
  'AK-47 | Point Disarray': 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszFJTwW0N_phWaOcP9h0v_6Zqj4R6JvjvxT9_7w3gK0r0JqYz_3J4GpJwY4Pw/360fx252f',
  'AK-47 | Vulcan': 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszFJTwW0N_phWaOcP9h0v_6Zqj4R6JvjvxT9_7w3gK0r0JqYz_3J4GpJwY4Pw/360fx252f',
  'AK-47 | Frontside Misty': 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszFJTwW0N_phWaOcP9h0v_6Zqj4R6JvjvxT9_7w3gK0r0JqYz_3J4GpJwY4Pw/360fx252f',
  'AK-47 | Head Shot': 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszFJTwW0N_phWaOcP9h0v_6Zqj4R6JvjvxT9_7w3gK0r0JqYz_3J4GpJwY4Pw/360fx252f',
  'AK-47 | Wild Lotus': 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszFJTwW0N_phWaOcP9h0v_6Zqj4R6JvjvxT9_7w3gK0r0JqYz_3J4GpJwY4Pw/360fx252f',
  'AK-47 | Panthera onca': 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszFJTwW0N_phWaOcP9h0v_6Zqj4R6JvjvxT9_7w3gK0r0JqYz_3J4GpJwY4Pw/360fx252f',
  'AK-47 | Neon Rider': 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszFJTwW0N_phWaOcP9h0v_6Zqj4R6JvjvxT9_7w3gK0r0JqYz_3J4GpJwY4Pw/360fx252f',
  'AK-47 | X-Ray': 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszFJTwW0N_phWaOcP9h0v_6Zqj4R6JvjvxT9_7w3gK0r0JqYz_3J4GpJwY4Pw/360fx252f',
  'AK-47 | Fire Serpent': 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszFJTwW0N_phWaOcP9h0v_6Zqj4R6JvjvxT9_7w3gK0r0JqYz_3J4GpJwY4Pw/360fx252f',
  'AK-47 | Crossfade': 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszFJTwW0N_phWaOcP9h0v_6Zqj4R6JvjvxT9_7w3gK0r0JqYz_3J4GpJwY4Pw/360fx252f',
  'AK-47 | First Class': 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszFJTwW0N_phWaOcP9h0v_6Zqj4R6JvjvxT9_7w3gK0r0JqYz_3J4GpJwY4Pw/360fx252f',
  'AK-47 | B the Monster': 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszFJTwW0N_phWaOcP9h0v_6Zqj4R6JvjvxT9_7w3gK0r0JqYz_3J4GpJwY4Pw/360fx252f',
  'AK-47 | Jaguar': 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszFJTwW0N_phWaOcP9h0v_6Zqj4R6JvjvxT9_7w3gK0r0JqYz_3J4GpJwY4Pw/360fx252f',
  'AK-47 | Emerald Pinstripe': 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszFJTwW0N_phWaOcP9h0v_6Zqj4R6JvjvxT9_7w3gK0r0JqYz_3J4GpJwY4Pw/360fx252f',
  'AK-47 | Wasteland Rebel': 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszFJTwW0N_phWaOcP9h0v_6Zqj4R6JvjvxT9_7w3gK0r0JqYz_3J4GpJwY4Pw/360fx252f',
  'AK-47 | Jet Set': 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszFJTwW0N_phWaOcP9h0v_6Zqj4R6JvjvxT9_7w3gK0r0JqYz_3J4GpJwY4Pw/360fx252f',
  'AK-47 | Leet Museo': 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszFJTwW0N_phWaOcP9h0v_6Zqj4R6JvjvxT9_7w3gK0r0JqYz_3J4GpJwY4Pw/360fx252f',
  'AK-47 | Bloodsport': 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszFJTwW0N_phWaOcP9h0v_6Zqj4R6JvjvxT9_7w3gK0r0JqYz_3J4GpJwY4Pw/360fx252f',
  'AK-47 | The Empress': 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszFJTwW0N_phWaOcP9h0v_6Zqj4R6JvjvxT9_7w3gK0r0JqYz_3J4GpJwY4Pw/360fx252f',
  'AK-47 | Gold Arabesque': 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszFJTwW0N_phWaOcP9h0v_6Zqj4R6JvjvxT9_7w3gK0r0JqYz_3J4GpJwY4Pw/360fx252f',
  'AK-47 | Rat Rod': 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszFJTwW0N_phWaOcP9h0v_6Zqj4R6JvjvxT9_7w3gK0r0JqYz_3J4GpJwY4Pw/360fx252f',
  'AK-47 | Slate': 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszFJTwW0N_phWaOcP9h0v_6Zqj4R6JvjvxT9_7w3gK0r0JqYz_3J4GpJwY4Pw/360fx252f',
  'AK-47 | Steel Delta': 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszFJTwW0N_phWaOcP9h0v_6Zqj4R6JvjvxT9_7w3gK0r0JqYz_3J4GpJwY4Pw/360fx252f',
  'AK-47 | Fuel Injector': 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszFJTwW0N_phWaOcP9h0v_6Zqj4R6JvjvxT9_7w3gK0r0JqYz_3J4GpJwY4Pw/360fx252f',
  'AK-47 | Orbit Mk01': 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszFJTwW0N_phWaOcP9h0v_6Zqj4R6JvjvxT9_7w3gK0r0JqYz_3J4GpJwY4Pw/360fx252f',
  'AK-47 | Olive Polycam': 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszFJTwW0N_phWaOcP9h0v_6Zqj4R6JvjvxT9_7w3gK0r0JqYz_3J4GpJwY4Pw/360fx252f',
  'AK-47 | Blue Laminate': 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszFJTwW0N_phWaOcP9h0v_6Zqj4R6JvjvxT9_7w3gK0r0JqYz_3J4GpJwY4Pw/360fx252f',
  'AK-47 | Black Laminate': 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszFJTwW0N_phWaOcP9h0v_6Zqj4R6JvjvxT9_7w3gK0r0JqYz_3J4GpJwY4Pw/360fx252f',
  'AK-47 | Green Laminate': 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszFJTwW0N_phWaOcP9h0v_6Zqj4R6JvjvxT9_7w3gK0r0JqYz_3J4GpJwY4Pw/360fx252f',
  'AK-47 | Red Laminate': 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszFJTwW0N_phWaOcP9h0v_6Zqj4R6JvjvxT9_7w3gK0r0JqYz_3J4GpJwY4Pw/360fx252f',
  'AK-47 | Safety Net': 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszFJTwW0N_phWaOcP9h0v_6Zqj4R6JvjvxT9_7w3gK0r0JqYz_3J4GpJwY4Pw/360fx252f',
  'AK-47 | Baroque Purple': 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszFJTwW0N_phWaOcP9h0v_6Zqj4R6JvjvxT9_7w3gK0r0JqYz_3J4GpJwY4Pw/360fx252f',
  'AK-47 | Nouveau Rouge': 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszFJTwW0N_phWaOcP9h0v_6Zqj4R6JvjvxT9_7w3gK0r0JqYz_3J4GpJwY4Pw/360fx252f',
  'AK-47 | Midnight Laminate': 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszFJTwW0N_phWaOcP9h0v_6Zqj4R6JvjvxT9_7w3gK0r0JqYz_3J4GpJwY4Pw/360fx252f'
};

// Получаем изображение скина
const getSkinImageUrl = async (paintIndex: string, weaponId: string, skinName: string) => {
  // Проверяем, что у нас есть необходимые данные
  if (!paintIndex || !weaponId) {
    return createWeaponPlaceholder('Unknown');
  }
  
  // Сначала проверяем нашу базу данных изображений
  if (skinImages[skinName]) {
    console.log(`Found image in database for: ${skinName}`);
    return skinImages[skinName];
  }
  
  // Если нет в базе данных, возвращаем placeholder с названием оружия
  const weaponMap: { [key: string]: string } = {
    '7': 'AK-47', '9': 'AUG', '11': 'AWP', '13': 'CZ75-Auto', '14': 'Desert Eagle',
    '16': 'FAMAS', '17': 'Five-SeveN', '19': 'G3SG1', '23': 'Glock-18', '24': 'P2000',
    '25': 'M249', '26': 'M4A1', '27': 'MAC-10', '28': 'MAG-7', '29': 'MP7',
    '30': 'MP9', '31': 'Negev', '32': 'Nova', '33': 'P250', '34': 'P90',
    '35': 'PP-Bizon', '36': 'Sawed-Off', '37': 'SCAR-20', '38': 'SSG 08', '39': 'SG 553',
    '40': 'Tec-9', '41': 'UMP-45', '42': 'XM1014'
  };
  const weaponName = weaponMap[weaponId] || `Weapon ${weaponId}`;
  return createWeaponPlaceholder(weaponName);
};

// Конвертируем rarity в наш формат
const convertRarity = (rarityName: string) => {
  const rarityMap: { [key: string]: string } = {
    'Consumer Grade': 'consumer',
    'Industrial Grade': 'industrial', 
    'Mil-Spec Grade': 'milspec',
    'Restricted': 'restricted',
    'Classified': 'classified',
    'Covert': 'covert',
    'Extraordinary': 'contraband'
  };
  return rarityMap[rarityName] || 'consumer';
};

// Генерируем случайный float в пределах скина
const generateRandomFloat = (minFloat: number, maxFloat: number) => {
  return Math.random() * (maxFloat - minFloat) + minFloat;
};

// Определяем wear по float
const getWearByFloat = (float: number) => {
  if (float >= 0.00 && float <= 0.07) return 'Factory New';
  if (float > 0.07 && float <= 0.15) return 'Minimal Wear';
  if (float > 0.15 && float <= 0.37) return 'Field-Tested';
  if (float > 0.37 && float <= 0.44) return 'Well-Worn';
  if (float > 0.44 && float <= 1.00) return 'Battle-Scarred';
  return 'Field-Tested';
};

// Генерируем демо цены (в реальном приложении здесь будет API)
const generatePrices = (rarity: string) => {
  const basePrices: { [key: string]: number } = {
    'consumer': 0.5,
    'industrial': 2.0,
    'milspec': 5.0,
    'restricted': 15.0,
    'classified': 50.0,
    'covert': 150.0,
    'contraband': 500.0
  };
  
  const basePrice = basePrices[rarity] || 1.0;
  const steamPrice = basePrice * (0.8 + Math.random() * 0.4);
  const marketPrice = basePrice * (0.7 + Math.random() * 0.6);
  
  return {
    steamPrice: Math.round(steamPrice * 100) / 100,
    marketPrice: Math.round(marketPrice * 100) / 100
  };
};

// GET /api/skins - получить все скины
router.get('/skins', async (req, res) => {
  try {
    const skins = loadSkinsData();
    
    // Фильтруем только оружие (исключаем перчатки, ножи и т.д.)
    const weaponSkins = skins.filter((skin: any) => {
      const category = skin.category?.name?.toLowerCase();
      return category && (
        category.includes('rifle') || 
        category.includes('pistol') || 
        category.includes('smg') || 
        category.includes('shotgun') ||
        category.includes('sniper') ||
        category.includes('machinegun')
      );
    });

    // Конвертируем в наш формат
      const convertedSkins = await Promise.all(weaponSkins.slice(0, 50).map(async (skin: any) => {
      const float = generateRandomFloat(skin.min_float || 0, skin.max_float || 1);
      const wear = getWearByFloat(float);
      const rarity = convertRarity(skin.rarity?.name || 'Consumer Grade');
      const prices = generatePrices(rarity);
        
               // Извлекаем weapon_id и paint_index
         const weaponId = skin.weapon?.weapon_id || skin.weapon_id || '';
         const paintIndex = skin.paint_index || skin.paintIndex || '';
         
         console.log(`Skin: ${skin.name}, Weapon ID: ${weaponId}, Paint Index: ${paintIndex}`);
      
      return {
        id: skin.id,
        name: skin.name,
        float: Math.round(float * 1000) / 1000,
        wear: wear,
        rarity: rarity,
            imageUrl: await getSkinImageUrl(paintIndex, weaponId, skin.name),
        steamPrice: prices.steamPrice,
        marketPrice: prices.marketPrice,
        weapon: skin.weapon?.name || 'Unknown',
        category: skin.category?.name || 'Unknown',
        pattern: skin.pattern?.name || 'Unknown'
      };
       }));

    res.json(convertedSkins);
  } catch (error) {
    console.error('Ошибка получения скинов:', error);
    res.status(500).json({ error: 'Ошибка загрузки данных' });
  }
});

// GET /api/skins/search - поиск скинов
router.get('/skins/search', async (req, res) => {
  try {
    const { q, category, rarity, wear } = req.query;
    const skins = loadSkinsData();
    
    let filteredSkins = skins.filter((skin: any) => {
      const matchesQuery = !q || 
        skin.name.toLowerCase().includes((q as string).toLowerCase()) ||
        skin.weapon?.name.toLowerCase().includes((q as string).toLowerCase());
      
      const matchesCategory = !category || 
        skin.category?.name.toLowerCase() === (category as string).toLowerCase();
      
      const matchesRarity = !rarity || 
        convertRarity(skin.rarity?.name) === rarity;
      
      return matchesQuery && matchesCategory && matchesRarity;
    });

    // Конвертируем в наш формат
    const convertedSkins = await Promise.all(filteredSkins.slice(0, 100).map(async (skin: any) => {
      const float = generateRandomFloat(skin.min_float || 0, skin.max_float || 1);
      const wear = getWearByFloat(float);
      const rarity = convertRarity(skin.rarity?.name || 'Consumer Grade');
      const prices = generatePrices(rarity);
      
      return {
        id: skin.id,
        name: skin.name,
        float: Math.round(float * 1000) / 1000,
        wear: wear,
        rarity: rarity,
         imageUrl: await getSkinImageUrl(skin.paint_index, skin.weapon?.weapon_id || '', skin.name),
        steamPrice: prices.steamPrice,
        marketPrice: prices.marketPrice,
        weapon: skin.weapon?.name || 'Unknown',
        category: skin.category?.name || 'Unknown',
        pattern: skin.pattern?.name || 'Unknown'
      };
    }));

    res.json(convertedSkins);
  } catch (error) {
    console.error('Ошибка поиска скинов:', error);
    res.status(500).json({ error: 'Ошибка поиска' });
  }
});

// GET /api/skins/categories - получить категории
router.get('/skins/categories', (req, res) => {
  try {
    const skins = loadSkinsData();
    const categories = [...new Set(skins.map((skin: any) => skin.category?.name).filter(Boolean))];
    res.json(categories);
  } catch (error) {
    console.error('Ошибка получения категорий:', error);
    res.status(500).json({ error: 'Ошибка загрузки категорий' });
  }
});

export default router; 