// Основные типы приложения
export interface Item {
  id: string;
  name: string;
  float: number;
  wear: string;
  rarity: RarityType;
  imageUrl: string;
  steamPrice: number;
  marketPrice: number;
  weapon?: string;
  category?: string;
  pattern?: string;
}

export interface User {
  id: string;
  username: string;
  email?: string;
  avatar?: string;
  steamId?: string;
  telegramId?: string;
  inventory?: Item[];
}

export interface Trade {
  id: string;
  itemId: string;
  sellerId: string;
  buyerId?: string;
  price: number;
  status: 'active' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

export interface MarketStats {
  totalItems: number;
  totalMarketValue: number;
  contrabandItems: number;
  activeTrades: number;
}

export type RarityType = 'consumer' | 'industrial' | 'milspec' | 'restricted' | 'classified' | 'covert' | 'contraband';
export type WearType = 'Factory New' | 'Minimal Wear' | 'Field-Tested' | 'Well-Worn' | 'Battle-Scarred';
export type SortType = 'name' | 'price_steam' | 'price_market' | 'price_difference' | 'rarity' | 'wear' | 'float' | 'weapon' | 'category';

export interface FilterOption {
  value: string;
  label: string;
}

export interface SortOption {
  value: SortType;
  label: string;
}

export interface SkinData {
  id: string;
  name: string;
  description: string;
  weapon: {
    id: string;
    weapon_id: number;
    name: string;
  };
  category: {
    id: string;
    name: string;
  };
  pattern: {
    id: string;
    name: string;
  };
  min_float: number;
  max_float: number;
  rarity: {
    id: string;
    name: string;
    color: string;
  };
  stattrak: boolean;
  souvenir: boolean;
  paint_index: string;
  wears: Array<{
    id: string;
    name: string;
  }>;
} 