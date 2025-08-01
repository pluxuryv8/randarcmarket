// src/steamSchema.ts
import dotenv from 'dotenv';
dotenv.config();

const STEAM_KEY = process.env.STEAM_API_KEY!;
const APP_ID = 730;

let iconMap: Record<string, string> = {};

export async function loadSteamSchema(): Promise<void> {
  console.log('🔄 Загружаю схему предметов из Steam...');
  const url = `https://api.steampowered.com/IEconItems_${APP_ID}/GetSchema/v2/?key=${STEAM_KEY}&language=ru`;
  console.log('→ Fetch URL:', url);

  const response = await fetch(url);
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Steam API вернул ${response.status}: ${text}`);
  }

  const data = await response.json();
  const items = data.result?.items_game?.items || [];

  iconMap = {};
  for (const info of items) {
    const name = info.market_hash_name;
    const iconHash = info.icon_url;
    if (typeof name === 'string' && typeof iconHash === 'string') {
      iconMap[name] = iconHash;
    }
  }

  console.log(`✅ Загружено ${Object.keys(iconMap).length} иконок.`);
}

export function getIconMap(): Record<string, string> {
  return iconMap;
}
