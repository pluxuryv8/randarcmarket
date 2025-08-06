import axios from 'axios';

// Простые интерфейсы для работы с данными
export interface CSGOSkin {
  id: string;
  name: string;
  market_hash_name: string;
  image: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  weapon_type: string;
  price_range: { min: number; max: number };
}

// Интерфейс для данных из ByMykel API
interface SteamItem {
  id: string;
  name: string;
  market_hash_name: string;
  image: string;
  icon_url?: string;
  icon_url_large?: string;
  rarity?: {
    name: string;
  };
  weapon?: {
    name: string;
  };
  collections?: Array<{
    name: string;
  }>;
}

/**
 * Простой сервис для получения скинов CS:GO
 */
class SteamAPIService {
  // URL для JSON со всеми скинами
  private static readonly SKINS_JSON_URL = 
    'https://raw.githubusercontent.com/ByMykel/CSGO-API/main/public/api/en/skins.json';

  // CDN для картинок Steam
  private static readonly STEAM_CDN = 
    'https://community.cloudflare.steamstatic.com/economy/image';
  
  private static skinsCache: CSGOSkin[] | null = null;

  /**
   * Получить базовый список скинов из GitHub
   */
  static async fetchAllSkins(): Promise<SteamItem[]> {
    console.log('🔄 Загружаем скины из ByMykel API...');
    
    try {
      const response = await axios.get<SteamItem[]>(this.SKINS_JSON_URL);
      console.log('✅ Получено скинов:', response.data.length);
      return response.data;
    } catch (error) {
      console.error('❌ Ошибка загрузки скинов:', error);
      throw error;
    }
  }

  /**
   * Преобразовать записи SteamItem в CSGOSkin с корректной картинкой
   */
  static mapToCSGOSkins(items: SteamItem[]): CSGOSkin[] {
    console.log('🔄 Обрабатываем скины...');

    return items.map((item, index) => {
      // Получаем icon_url из данных
      const icon = item.image || item.icon_url || item.icon_url_large;
      let imageUrl = 'https://via.placeholder.com/300x200?text=No+Image';

      if (icon) {
        // Если это уже полная ссылка, используем как есть
        if (icon.startsWith('http')) {
          imageUrl = icon;
        } else {
          // Склеиваем с CDN и добавляем параметры
          const cleanIcon = icon.replace(/^\/+/, '');
          imageUrl = `${this.STEAM_CDN}/${cleanIcon}`;
        }
      }

      // Определяем редкость
      const rarityName = item.rarity?.name || 'Consumer Grade';
      const rarity = this.mapRarityToOurSystem(rarityName);

      // Определяем тип оружия
      const weaponName = item.weapon?.name || this.extractWeaponFromName(item.name) || 'Unknown';
      const weaponType = this.getWeaponTypeFromName(weaponName);

      // Генерируем диапазон цен
      const priceRange = this.getPriceRangeByRarity(rarity);

      console.log(`🖼️ Обработан скин #${index + 1}: ${item.name}, изображение: ${imageUrl}`);

      return {
        id: item.id || `skin_${index}`,
        name: item.name || 'Unknown Skin',
        market_hash_name: item.market_hash_name || `${item.name} (Factory New)`,
        image: imageUrl,
        rarity,
        weapon_type: weaponType,
        price_range: priceRange
      };
    });
  }

  /**
   * Главный метод: получает и возвращает готовый список CSGOSkin[]
   */
  static async getCSGOItems(): Promise<CSGOSkin[]> {
    try {
      // Проверяем кеш
      if (this.skinsCache) {
        console.log('✅ Используем кешированные данные скинов:', this.skinsCache.length);
        return this.skinsCache;
      }

      // 1) Скачиваем JSON
      const allSkins = await this.fetchAllSkins();

      // 2) Фильтруем и отбираем разнообразие оружия
      const diverseSkins = this.selectDiverseWeapons(allSkins);

      // 3) Мапим в CSGOSkin и кешируем
      const csgoSkins = this.mapToCSGOSkins(diverseSkins);
      this.skinsCache = csgoSkins;

      console.log('✅ Обработано и закешировано скинов:', csgoSkins.length);
      return csgoSkins;

    } catch (error) {
      console.error('❌ Ошибка в getCSGOItems:', error);
      
      // Fallback к простым данным
      console.log('🔄 Используем fallback данные...');
      return this.getFallbackSkins();
    }
  }

  /**
   * Отбирает разнообразное оружие из всех скинов
   */
  private static selectDiverseWeapons(allSkins: SteamItem[]): SteamItem[] {
    console.log('🔄 Отбираем разнообразное оружие...');

    // Категории оружия, которые хотим включить
    const weaponCategories = {
      rifles: [] as SteamItem[],        // AK-47, M4A4, M4A1-S
      snipers: [] as SteamItem[],       // AWP, SSG 08
      pistols: [] as SteamItem[],       // Glock, USP, Desert Eagle
      knives: [] as SteamItem[],        // Karambit, Bayonet, etc
      smgs: [] as SteamItem[],          // MP7, UMP-45
      shotguns: [] as SteamItem[],      // XM1014, Nova
      others: [] as SteamItem[]         // Остальное
    };

    // Сортируем скины по категориям
    for (const skin of allSkins) {
      const weaponName = (skin.weapon?.name || skin.name || '').toLowerCase();
      
      if (this.isRifle(weaponName)) {
        weaponCategories.rifles.push(skin);
      } else if (this.isSniper(weaponName)) {
        weaponCategories.snipers.push(skin);
      } else if (this.isPistol(weaponName)) {
        weaponCategories.pistols.push(skin);
      } else if (this.isKnife(weaponName)) {
        weaponCategories.knives.push(skin);
      } else if (this.isSMG(weaponName)) {
        weaponCategories.smgs.push(skin);
      } else if (this.isShotgun(weaponName)) {
        weaponCategories.shotguns.push(skin);
      } else {
        weaponCategories.others.push(skin);
      }
    }

    // Отбираем по несколько из каждой категории для разнообразия
    const selectedSkins: SteamItem[] = [
      ...weaponCategories.rifles.slice(0, 15),    // 15 винтовок
      ...weaponCategories.snipers.slice(0, 8),    // 8 снайперских
      ...weaponCategories.pistols.slice(0, 10),   // 10 пистолетов
      ...weaponCategories.knives.slice(0, 8),     // 8 ножей
      ...weaponCategories.smgs.slice(0, 5),       // 5 пистолетов-пулеметов
      ...weaponCategories.shotguns.slice(0, 2),   // 2 дробовика
      ...weaponCategories.others.slice(0, 2)      // 2 других
    ];

    console.log(`✅ Отобрано оружия по категориям:
    🔫 Винтовки: ${weaponCategories.rifles.length} (взято ${Math.min(15, weaponCategories.rifles.length)})
    🎯 Снайперские: ${weaponCategories.snipers.length} (взято ${Math.min(8, weaponCategories.snipers.length)})
    🔫 Пистолеты: ${weaponCategories.pistols.length} (взято ${Math.min(10, weaponCategories.pistols.length)})
    🗡️ Ножи: ${weaponCategories.knives.length} (взято ${Math.min(8, weaponCategories.knives.length)})
    💥 ПП: ${weaponCategories.smgs.length} (взято ${Math.min(5, weaponCategories.smgs.length)})
    🎯 Дробовики: ${weaponCategories.shotguns.length} (взято ${Math.min(2, weaponCategories.shotguns.length)})
    ❓ Другое: ${weaponCategories.others.length} (взято ${Math.min(2, weaponCategories.others.length)})
    
    📦 Итого отобрано: ${selectedSkins.length} скинов`);

    return selectedSkins;
  }

  // Методы для определения типа оружия
  private static isRifle(name: string): boolean {
    return name.includes('ak-47') || name.includes('ak47') || 
           name.includes('m4a4') || name.includes('m4a1') || 
           name.includes('aug') || name.includes('famas') ||
           name.includes('galil') || name.includes('sg 553');
  }

  private static isSniper(name: string): boolean {
    return name.includes('awp') || name.includes('ssg 08') || 
           name.includes('scar-20') || name.includes('g3sg1');
  }

  private static isPistol(name: string): boolean {
    return name.includes('glock') || name.includes('usp') || 
           name.includes('p250') || name.includes('desert eagle') || 
           name.includes('deagle') || name.includes('five-seven') ||
           name.includes('tec-9') || name.includes('cz75') ||
           name.includes('p2000') || name.includes('dual berettas');
  }

  private static isKnife(name: string): boolean {
    return name.includes('knife') || name.includes('karambit') || 
           name.includes('bayonet') || name.includes('butterfly') ||
           name.includes('flip') || name.includes('gut') ||
           name.includes('huntsman') || name.includes('falchion') ||
           name.includes('bowie') || name.includes('shadow daggers');
  }

  private static isSMG(name: string): boolean {
    return name.includes('mp7') || name.includes('mp9') || 
           name.includes('ump-45') || name.includes('p90') ||
           name.includes('pp-bizon') || name.includes('mac-10');
  }

  private static isShotgun(name: string): boolean {
    return name.includes('xm1014') || name.includes('nova') ||
           name.includes('mag-7') || name.includes('sawed-off');
  }

  /**
   * Простая функция для извлечения названия оружия из полного названия
   */
  private static extractWeaponFromName(fullName: string): string {
    if (!fullName) return '';
    
    // Обычно формат: "Weapon | SkinName"
    const parts = fullName.split('|');
    return parts[0]?.trim() || '';
  }

  /**
   * Определяет тип оружия из названия
   */
  private static getWeaponTypeFromName(weaponName: string): string {
    const name = weaponName.toLowerCase();
    
    if (name.includes('ak-47') || name.includes('m4a4') || name.includes('m4a1') || name.includes('aug') || name.includes('famas')) {
      return 'rifles';
    } else if (name.includes('awp') || name.includes('ssg') || name.includes('scar')) {
      return 'sniper-rifles';
    } else if (name.includes('glock') || name.includes('usp') || name.includes('p250') || name.includes('desert eagle') || name.includes('deagle')) {
      return 'pistols';
    } else if (name.includes('knife') || name.includes('karambit') || name.includes('bayonet') || name.includes('butterfly')) {
      return 'knives';
    } else {
      return 'other';
    }
  }

  /**
   * Мапит редкость Steam в нашу систему
   */
  private static mapRarityToOurSystem(steamRarity: string): 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' {
    const rarity = steamRarity.toLowerCase();
    
    if (rarity.includes('consumer') || rarity.includes('common')) {
      return 'common';
    } else if (rarity.includes('industrial') || rarity.includes('uncommon')) {
      return 'uncommon';
    } else if (rarity.includes('mil-spec') || rarity.includes('rare')) {
      return 'rare';
    } else if (rarity.includes('restricted') || rarity.includes('epic')) {
      return 'epic';
    } else if (rarity.includes('classified') || rarity.includes('covert') || rarity.includes('legendary') || rarity.includes('extraordinary')) {
      return 'legendary';
    }
    
    return 'common';
  }

  /**
   * Генерирует диапазон цен на основе редкости
   */
  private static getPriceRangeByRarity(rarity: string): { min: number; max: number } {
    switch (rarity) {
      case 'legendary': return { min: 100, max: 3000 };
      case 'epic': return { min: 50, max: 500 };
      case 'rare': return { min: 20, max: 200 };
      case 'uncommon': return { min: 10, max: 100 };
      case 'common': return { min: 5, max: 50 };
      default: return { min: 10, max: 100 };
    }
  }

  /**
   * Fallback данные если API не работает
   */
  private static getFallbackSkins(): CSGOSkin[] {
    return [
      {
        id: 'fallback_1',
        name: 'AK-47 | Redline',
        market_hash_name: 'AK-47 | Redline (Field-Tested)',
        image: 'https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszJemkV09-5lpKKqPrxN7LEmyVQ7MEpiLuSrYmnjQO3-UdsZGHyd4_Bd1RrNQ7T_FK9kL_ng5Hu75iY1zI97W6Oag/330x192',
        rarity: 'rare',
        weapon_type: 'rifles',
        price_range: { min: 25, max: 75 }
      },
      {
        id: 'fallback_2',
        name: 'AWP | Dragon Lore',
        market_hash_name: 'AWP | Dragon Lore (Field-Tested)',
        image: 'https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17PLfYQJD_9W7m5a0mvLwOq7c2GpStJAgiO-Q9LWt3lCwqBE5Y2D0coSRJlQ2M1vS_1W9w-3mg8S-u53JyHFhvw/330x192',
        rarity: 'legendary',
        weapon_type: 'sniper-rifles',
        price_range: { min: 1500, max: 3000 }
      },
      {
        id: 'fallback_3',
        name: 'Karambit | Doppler',
        market_hash_name: 'Karambit | Doppler (Factory New)',
        image: 'https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf3qr3czxb49KzgL-KmsjwPKvBmm5D19d4h-_BpNWjjFG18hBsNTzxJ4KVdAE4MlvV_VDsybrt05Oi_MOew/330x192',
        rarity: 'legendary',
        weapon_type: 'knives',
        price_range: { min: 1200, max: 1800 }
      }
    ];
  }

  /**
   * Метод для получения изображения (для совместимости)
   */
  static async getItemImage(marketHashName: string): Promise<string> {
    // Этот метод оставлен для совместимости
    return 'https://via.placeholder.com/300x200?text=Loading';
  }

  /**
   * Очистить кеш
   */
  static clearCache(): void {
    this.skinsCache = null;
    console.log('🗑️ Кеш скинов очищен');
  }
}

export default SteamAPIService;