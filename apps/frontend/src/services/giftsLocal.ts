import { GiftCollection, GiftItem, TraitBucket, ItemPage } from '../types/domain';
import { collections, items, traitBuckets } from '../mock/gifts.data';

// Имитация задержки сети
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Фильтрация и сортировка на клиенте
const filterItems = (
  items: GiftItem[],
  filters: {
    collectionId?: string;
    forSale?: boolean;
    minPrice?: number;
    maxPrice?: number;
    traits?: Record<string, string[]>;
    search?: string;
  }
) => {
  return items.filter(item => {
    // Фильтр по коллекции
    if (filters.collectionId && item.collectionId !== filters.collectionId) {
      return false;
    }

    // Фильтр по статусу продажи
    if (filters.forSale !== undefined && item.forSale !== filters.forSale) {
      return false;
    }

    // Фильтр по цене
    if (filters.minPrice && (!item.priceTon || item.priceTon < filters.minPrice)) {
      return false;
    }
    if (filters.maxPrice && (!item.priceTon || item.priceTon > filters.maxPrice)) {
      return false;
    }

    // Фильтр по трейтам
    if (filters.traits) {
      for (const [traitName, traitValues] of Object.entries(filters.traits)) {
        if (traitValues.length > 0) {
          const itemTrait = item.traits.find(t => t.name === traitName);
          if (!itemTrait || !traitValues.includes(itemTrait.value)) {
            return false;
          }
        }
      }
    }

    // Поиск по названию
    if (filters.search && !item.title.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }

    return true;
  });
};

const sortItems = (items: GiftItem[], sort: string, order: 'asc' | 'desc') => {
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
    case 'volume_24h':
      // Для демо используем lastSaleTon как volume
      sorted.sort((a, b) => {
        const volumeA = a.lastSaleTon || 0;
        const volumeB = b.lastSaleTon || 0;
        return order === 'asc' ? volumeA - volumeB : volumeB - volumeA;
      });
      break;
  }
  
  return sorted;
};

export const giftsApi = {
  async getCollections(params?: {
    search?: string;
    sort?: 'volume_24h' | 'floor' | 'price';
    order?: 'asc' | 'desc';
    limit?: number;
    offset?: number;
  }): Promise<GiftCollection[]> {
    await delay(300);
    
    let filtered = collections;
    
    if (params?.search) {
      filtered = filtered.filter(c => 
        c.title.toLowerCase().includes(params.search!.toLowerCase())
      );
    }
    
    if (params?.sort) {
      filtered.sort((a, b) => {
        const aValue = a[params.sort!] || 0;
        const bValue = b[params.sort!] || 0;
        return params.order === 'asc' ? aValue - bValue : bValue - aValue;
      });
    }
    
    const offset = params?.offset || 0;
    const limit = params?.limit || 24;
    
    return filtered.slice(offset, offset + limit);
  },

  async getCollectionById(id: string): Promise<GiftCollection> {
    await delay(200);
    const collection = collections.find(c => c.id === id);
    if (!collection) {
      throw new Error('Collection not found');
    }
    return collection;
  },

  async getTraits(collectionId: string): Promise<TraitBucket[]> {
    await delay(200);
    return traitBuckets[collectionId] || [];
  },

  async getItems(params: {
    collectionId?: string;
    forSale?: boolean;
    minPrice?: number;
    maxPrice?: number;
    traits?: Record<string, string[]>;
    search?: string;
    sort?: 'price' | 'listed_at' | 'sold_at' | 'volume_24h';
    order?: 'asc' | 'desc';
    limit?: number;
    cursor?: string | null;
  }): Promise<ItemPage> {
    await delay(400);
    
    let filtered = filterItems(items, params);
    
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

  async getItem(address: string): Promise<GiftItem> {
    await delay(200);
    const item = items.find(i => i.address === address);
    if (!item) {
      throw new Error('Item not found');
    }
    return item;
  },

  async getActivity(params: { collectionId?: string; since?: string }): Promise<any[]> {
    await delay(300);
    
    // Имитация активности
    const activities = items
      .filter(item => !params.collectionId || item.collectionId === params.collectionId)
      .map(item => ({
        id: `activity_${item.id}`,
        type: 'sale',
        item: item,
        price: item.lastSaleTon,
        timestamp: item.updatedAt,
        buyer: 'EQD...buyer123',
        seller: 'EQD...seller456'
      }))
      .slice(0, 10);
    
    return activities;
  }
};
