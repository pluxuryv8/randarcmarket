import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export interface Collection {
  id: string;
  title: string;
  image: string;
  floor: number;
  volume24h: number;
  supply: number;
  owners: number;
  description?: string;
}

export interface Item {
  address: string;
  title: string;
  image: string;
  price?: number;
  isForSale: boolean;
  traits: Record<string, string>;
  collectionId: string;
  rarity?: number;
  lastSale?: number;
  owner?: string;
}

export interface ItemPage {
  items: Item[];
  total: number;
  cursor?: string;
}

export interface TraitBucket {
  trait: string;
  value: string;
  count: number;
}

export interface MarketFilters {
  collectionId?: string;
  forSale?: boolean;
  minPrice?: number;
  maxPrice?: number;
  traits?: Record<string, string>;
  sort?: 'price' | 'recently_listed' | 'recently_sold' | 'volume_24h';
  order?: 'asc' | 'desc';
  limit?: number;
  cursor?: string;
  search?: string;
}

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export const marketService = {
  // Коллекции
  getCollections: async (params?: Record<string, any>): Promise<Collection[]> => {
    const response = await api.get('/nft/collections', { params });
    return response.data.data || [];
  },

  getCollectionById: async (id: string): Promise<Collection> => {
    const response = await api.get(`/nft/collections/${id}`);
    return response.data.data;
  },

  getCollectionTraits: async (id: string): Promise<TraitBucket[]> => {
    const response = await api.get(`/nft/collections/${id}/traits`);
    return response.data.data || [];
  },

  // Предметы
  getItems: async (filters: MarketFilters = {}): Promise<ItemPage> => {
    const response = await api.get('/nft/items', { params: filters });
    return response.data.data || { items: [], total: 0 };
  },

  getItem: async (address: string): Promise<Item> => {
    const response = await api.get(`/nft/items/${address}`);
    return response.data.data;
  },

  // Активность
  getActivity: async (params?: Record<string, any>): Promise<ItemPage> => {
    const response = await api.get('/nft/activity', { params });
    return response.data.data || { items: [], total: 0 };
  },

  // Поиск
  search: async (query: string): Promise<ItemPage> => {
    const response = await api.get('/nft/search', { params: { q: query } });
    return response.data.data || { items: [], total: 0 };
  },

  // Утилиты для фильтров
  buildFiltersFromURL: (searchParams: URLSearchParams): MarketFilters => {
    const filters: MarketFilters = {};
    
    if (searchParams.get('collectionId')) {
      filters.collectionId = searchParams.get('collectionId')!;
    }
    
    if (searchParams.get('forSale')) {
      filters.forSale = searchParams.get('forSale') === 'true';
    }
    
    if (searchParams.get('minPrice')) {
      filters.minPrice = Number(searchParams.get('minPrice'));
    }
    
    if (searchParams.get('maxPrice')) {
      filters.maxPrice = Number(searchParams.get('maxPrice'));
    }
    
    if (searchParams.get('sort')) {
      filters.sort = searchParams.get('sort') as MarketFilters['sort'];
    }
    
    if (searchParams.get('order')) {
      filters.order = searchParams.get('order') as MarketFilters['order'];
    }
    
    if (searchParams.get('limit')) {
      filters.limit = Number(searchParams.get('limit'));
    }
    
    if (searchParams.get('cursor')) {
      filters.cursor = searchParams.get('cursor')!;
    }
    
    if (searchParams.get('search')) {
      filters.search = searchParams.get('search')!;
    }
    
    // Обработка трейтов
    const traits: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      if (key.startsWith('traits[') && key.endsWith(']')) {
        const traitName = key.slice(7, -1);
        traits[traitName] = value;
      }
    });
    
    if (Object.keys(traits).length > 0) {
      filters.traits = traits;
    }
    
    return filters;
  },

  buildURLFromFilters: (filters: MarketFilters): URLSearchParams => {
    const params = new URLSearchParams();
    
    if (filters.collectionId) {
      params.set('collectionId', filters.collectionId);
    }
    
    if (filters.forSale !== undefined) {
      params.set('forSale', filters.forSale.toString());
    }
    
    if (filters.minPrice !== undefined) {
      params.set('minPrice', filters.minPrice.toString());
    }
    
    if (filters.maxPrice !== undefined) {
      params.set('maxPrice', filters.maxPrice.toString());
    }
    
    if (filters.sort) {
      params.set('sort', filters.sort);
    }
    
    if (filters.order) {
      params.set('order', filters.order);
    }
    
    if (filters.limit) {
      params.set('limit', filters.limit.toString());
    }
    
    if (filters.cursor) {
      params.set('cursor', filters.cursor);
    }
    
    if (filters.search) {
      params.set('search', filters.search);
    }
    
    // Обработка трейтов
    if (filters.traits) {
      Object.entries(filters.traits).forEach(([trait, value]) => {
        params.set(`traits[${trait}]`, value);
      });
    }
    
    return params;
  }
};

export default marketService;
