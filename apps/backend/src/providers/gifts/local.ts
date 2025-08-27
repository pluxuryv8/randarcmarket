import type { GiftsProvider, Collection, Item, ItemPage, TraitBucket } from './types';
import { toHttp } from '../../util/media';

// Локальные мок данные для fallback
const localCollections: Collection[] = [
  {
    id: 'astral-shards',
    address: 'EQD...astral',
    title: 'Astral Shards',
    cover: 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=400&h=400&fit=crop',
    supply: 150,
    owners: 120,
    floorTon: 12.5,
    volume24hTon: 850.25
  },
  {
    id: 'bday-candles',
    address: 'EQD...candles',
    title: 'B-Day Candles',
    cover: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
    supply: 200,
    owners: 180,
    floorTon: 8.75,
    volume24hTon: 620.50
  },
  {
    id: 'berry-boxes',
    address: 'EQD...berries',
    title: 'Berry Boxes',
    cover: 'https://images.unsplash.com/photo-1485921325833-c519f76c4927?w=400&h=400&fit=crop',
    supply: 100,
    owners: 85,
    floorTon: 15.25,
    volume24hTon: 1100.75
  },
  {
    id: 'big-years',
    address: 'EQD...years',
    title: 'Big Years',
    cover: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=400&h=400&fit=crop',
    supply: 75,
    owners: 65,
    floorTon: 22.0,
    volume24hTon: 1500.00
  },
  {
    id: 'bonded-rings',
    address: 'EQD...rings',
    title: 'Bonded Rings',
    cover: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop',
    supply: 120,
    owners: 95,
    floorTon: 18.5,
    volume24hTon: 1250.30
  },
  {
    id: 'bow-ties',
    address: 'EQD...bows',
    title: 'Bow Ties',
    cover: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop',
    supply: 80,
    owners: 65,
    floorTon: 15.75,
    volume24hTon: 950.25
  },
  {
    id: 'bunny-muffins',
    address: 'EQD...muffins',
    title: 'Bunny Muffins',
    cover: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop',
    supply: 120,
    owners: 100,
    floorTon: 9.5,
    volume24hTon: 750.50
  },
  {
    id: 'candy-canes',
    address: 'EQD...candies',
    title: 'Candy Canes',
    cover: 'https://images.unsplash.com/photo-1546173159-315724a31696?w=400&h=400&fit=crop',
    supply: 90,
    owners: 75,
    floorTon: 6.25,
    volume24hTon: 450.75
  },
  {
    id: 'cookie-hearts',
    address: 'EQD...cookies',
    title: 'Cookie Hearts',
    cover: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=400&fit=crop',
    supply: 110,
    owners: 85,
    floorTon: 7.8,
    volume24hTon: 680.30
  }
];

const localItems: Item[] = [
  {
    id: '1',
    address: 'EQD...astral001',
    title: 'Astral Shard #001',
    image: 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=300&h=300&fit=crop',
    animationUrl: undefined,
    priceTon: 25.5,
    forSale: true,
    lastSaleTon: 22.0,
    collectionId: 'astral-shards',
    traits: [
      { name: 'Type', value: 'Shard' },
      { name: 'Rarity', value: 'Legendary' },
      { name: 'Color', value: 'Purple' }
    ],
    updatedAt: '2024-08-24T10:30:00Z'
  },
  {
    id: '2',
    address: 'EQD...astral002',
    title: 'Astral Shard #002',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop',
    animationUrl: undefined,
    priceTon: 12.75,
    forSale: true,
    lastSaleTon: 11.5,
    collectionId: 'astral-shards',
    traits: [
      { name: 'Type', value: 'Shard' },
      { name: 'Rarity', value: 'Rare' },
      { name: 'Color', value: 'Blue' }
    ],
    updatedAt: '2024-08-24T09:15:00Z'
  },
  {
    id: '3',
    address: 'EQD...candle001',
    title: 'B-Day Candle #001',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop',
    animationUrl: undefined,
    priceTon: 8.25,
    forSale: true,
    lastSaleTon: 7.8,
    collectionId: 'bday-candles',
    traits: [
      { name: 'Type', value: 'Candle' },
      { name: 'Rarity', value: 'Common' },
      { name: 'Color', value: 'Pink' }
    ],
    updatedAt: '2024-08-23T16:45:00Z'
  },
  {
    id: '4',
    address: 'EQD...berry001',
    title: 'Berry Box #001',
    image: 'https://images.unsplash.com/photo-1485921325833-c519f76c4927?w=300&h=300&fit=crop',
    animationUrl: undefined,
    priceTon: 18.0,
    forSale: true,
    lastSaleTon: 16.5,
    collectionId: 'berry-boxes',
    traits: [
      { name: 'Type', value: 'Box' },
      { name: 'Rarity', value: 'Rare' },
      { name: 'Berry', value: 'Strawberry' }
    ],
    updatedAt: '2024-08-24T11:20:00Z'
  },
  {
    id: '5',
    address: 'EQD...year001',
    title: 'Big Year #001',
    image: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=300&h=300&fit=crop',
    animationUrl: undefined,
    priceTon: 35.0,
    forSale: false,
    lastSaleTon: 32.0,
    collectionId: 'big-years',
    traits: [
      { name: 'Type', value: 'Year' },
      { name: 'Rarity', value: 'Legendary' },
      { name: 'Year', value: '2024' }
    ],
    updatedAt: '2024-08-22T14:30:00Z'
  },
  {
    id: '6',
    address: 'EQD...ring001',
    title: 'Bonded Ring #001',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=300&h=300&fit=crop',
    animationUrl: undefined,
    priceTon: 22.5,
    forSale: true,
    lastSaleTon: 20.0,
    collectionId: 'bonded-rings',
    traits: [
      { name: 'Type', value: 'Ring' },
      { name: 'Rarity', value: 'Rare' },
      { name: 'Material', value: 'Gold' }
    ],
    updatedAt: '2024-08-24T08:45:00Z'
  },
  {
    id: '7',
    address: 'EQD...bow001',
    title: 'Bow Tie #001',
    image: toHttp('ipfs://QmTestBow1'),
    animationUrl: undefined,
    priceTon: 15.75,
    forSale: true,
    lastSaleTon: 14.0,
    collectionId: 'bow-ties',
    traits: [
      { name: 'Type', value: 'Tie' },
      { name: 'Rarity', value: 'Common' },
      { name: 'Color', value: 'Red' }
    ],
    updatedAt: '2024-08-24T07:30:00Z'
  },
  {
    id: '8',
    address: 'EQD...bunny001',
    title: 'Bunny Muffin #001',
    image: toHttp('https://example.com/bunny-muffin-1.jpg'),
    animationUrl: undefined,
    priceTon: 9.5,
    forSale: true,
    lastSaleTon: 8.25,
    collectionId: 'bunny-muffins',
    traits: [
      { name: 'Type', value: 'Muffin' },
      { name: 'Rarity', value: 'Common' },
      { name: 'Flavor', value: 'Chocolate' }
    ],
    updatedAt: '2024-08-24T06:15:00Z'
  },
  {
    id: '9',
    address: 'EQD...candy001',
    title: 'Candy Cane #001',
    image: toHttp('ipfs/QmTestCandy1'),
    animationUrl: undefined,
    priceTon: 6.25,
    forSale: false,
    lastSaleTon: 5.5,
    collectionId: 'candy-canes',
    traits: [
      { name: 'Type', value: 'Cane' },
      { name: 'Rarity', value: 'Common' },
      { name: 'Color', value: 'Red' }
    ],
    updatedAt: '2024-08-24T05:45:00Z'
  },
  {
    id: '10',
    address: 'EQD...cookie001',
    title: 'Cookie Heart #001',
    image: undefined,
    animationUrl: undefined,
    priceTon: 7.8,
    forSale: true,
    lastSaleTon: 7.0,
    collectionId: 'cookie-hearts',
    traits: [
      { name: 'Type', value: 'Cookie' },
      { name: 'Rarity', value: 'Rare' },
      { name: 'Shape', value: 'Heart' }
    ],
    updatedAt: '2024-08-24T05:45:00Z'
  }
];

// Фильтрация и сортировка
const filterItems = (items: Item[], params: any): Item[] => {
  return items.filter(item => {
    if (params.collectionId && item.collectionId !== params.collectionId) return false;
    if (params.forSale !== undefined && item.forSale !== params.forSale) return false;
    if (params.minPrice && (!item.priceTon || item.priceTon < params.minPrice)) return false;
    if (params.maxPrice && (!item.priceTon || item.priceTon > params.maxPrice)) return false;
    if (params.search && !item.title.toLowerCase().includes(params.search.toLowerCase())) return false;
    return true;
  });
};

const sortItems = (items: Item[], sort: string, order: 'asc' | 'desc'): Item[] => {
  const sorted = [...items];
  switch (sort) {
    case 'price':
      sorted.sort((a, b) => {
        const priceA = a.priceTon || 0;
        const priceB = b.priceTon || 0;
        return order === 'asc' ? priceA - priceB : priceB - priceA;
      });
      break;
    case 'listed_at':
      sorted.sort((a, b) => {
        const dateA = new Date(a.updatedAt || 0).getTime();
        const dateB = new Date(b.updatedAt || 0).getTime();
        return order === 'asc' ? dateA - dateB : dateB - dateA;
      });
      break;
    case 'sold_at':
      sorted.sort((a, b) => {
        const saleA = a.lastSaleTon || 0;
        const saleB = b.lastSaleTon || 0;
        return order === 'asc' ? saleA - saleB : saleB - saleA;
      });
      break;
  }
  return sorted;
};

export const LocalProvider: GiftsProvider = {
  async listCollections(): Promise<Collection[]> {
    return localCollections;
  },

  async getCollectionById(id: string): Promise<Collection | null> {
    return localCollections.find(c => c.id === id) || null;
  },

  async getTraits(): Promise<TraitBucket[]> {
    return [];
  },

  async listItems(params: any): Promise<ItemPage> {
    let filtered = filterItems(localItems, params);
    
    if (params.sort) {
      filtered = sortItems(filtered, params.sort, params.order || 'desc');
    }
    
    const limit = params.limit || 24;
    const offset = params.cursor ? parseInt(params.cursor) : 0;
    
    const result = filtered.slice(offset, offset + limit);
    const nextCursor = offset + limit < filtered.length ? (offset + limit).toString() : null;
    
    return {
      items: result,
      nextCursor
    };
  },

  async getItem(address: string): Promise<Item | null> {
    return localItems.find(i => i.address === address) || null;
  },

  async listActivity(): Promise<any[]> {
    return [];
  }
};
