// backend/src/steamSchema.ts

/**
 * Модуль для загрузки схемы предметов из Steam и получения URL иконок
 */

const STEAM_KEY = process.env.STEAM_API_KEY!; // Ваш Steam API-ключ
const APP_ID = 730;                             // CS:GO AppID

// Мапа market_hash_name → icon_url hash
let iconMap: Record<string, string> = {};

/**
 * Загружает схему предметов из Steam Web API и заполняет iconMap
 */
export async function loadSteamSchema(): Promise<void> {
  console.log('🔄 Загружаю схему предметов из Steam...');
  const url = `https://api.steampowered.com/IEconItems_${APP_ID}/GetSchemaForGame/v2/?key=${STEAM_KEY}&language=ru`;
  const response = await fetch(url);
  const data: any = await response.json();
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

/**
 * Возвращает полный URL иконки для заданного marketHashName.
 * Если точного совпадения нет, ищет первый ключ, содержащий подстроку.
 */
export function getIconUrl(marketHashName: string): string | null {
  let hash = iconMap[marketHashName];

  if (!hash) {
    // Фоллбэк: ищем ключ, содержащий наше имя
    const fallbackKey = Object.keys(iconMap).find(key =>
      key.includes(marketHashName)
    );
    if (fallbackKey) {
      console.log(`🕵️‍♂️ Fallback: '${marketHashName}' → '${fallbackKey}'`);
      hash = iconMap[fallbackKey];
    }
  }

  if (!hash) return null;

  // Формируем URL к Steam CDN
  return `https://steamcdn-a.akamaihd.net/economy/image/${hash}/360fx360f`;
}