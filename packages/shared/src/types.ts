// User types
export interface User {
  id: string;
  tg_id: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  photo_url?: string;
  wallet_address?: string;
  created_at: Date;
  updated_at: Date;
}

// Subscription types
export interface Subscription {
  id: string;
  user_id: string;
  status: 'active' | 'expired' | 'cancelled';
  start_date: Date;
  end_date: Date;
  price_ton: number;
  created_at: Date;
}

// Watchlist types
export interface WatchlistFilter {
  id: string;
  user_id: string;
  collection_address?: string;
  min_price?: number;
  max_price?: number;
  min_rarity?: number;
  max_rarity?: number;
  below_floor_percent?: number;
  created_at: Date;
}

// Radar types
export interface RadarSignal {
  id: string;
  user_id: string;
  filter_id: string;
  item_address: string;
  collection_address: string;
  item_name: string;
  price: number;
  floor_price: number;
  rarity_score?: number;
  signal_type: 'below_floor' | 'price_drop' | 'rarity_match' | 'volume_spike';
  message: string;
  created_at: Date;
  read: boolean;
}

// NFT types
export interface NFTCollection {
  address: string;
  name: string;
  description?: string;
  image_url?: string;
  floor_price?: number;
  volume_24h?: number;
  items_count?: number;
  owners_count?: number;
  created_at?: Date;
}

export interface NFTItem {
  address: string;
  collection_address: string;
  name: string;
  description?: string;
  image_url?: string;
  attributes?: Record<string, any>;
  price?: number;
  owner?: string;
  last_sale?: number;
  rarity_score?: number;
  created_at?: Date;
}

// Drop types
export interface Drop {
  id: string;
  name: string;
  description: string;
  image_url?: string;
  price_ton: number;
  max_participants: number;
  current_participants: number;
  status: 'upcoming' | 'active' | 'ended' | 'cancelled';
  start_date: Date;
  end_date: Date;
  created_at: Date;
}

// Payment types
export interface OrderPayload {
  order_id: string;
  user_id: string;
  amount_nano: string;
  amount_ton: number;
  receiver: string;
  comment: string;
  payload?: string;
  status: 'pending' | 'confirmed' | 'failed';
  created_at: Date;
  confirmed_at?: Date;
}

// Telegram types
export interface TelegramAuthData {
  id: string;
  first_name?: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: string;
  hash: string;
}

// TonConnect types
export interface TonConnectTransaction {
  to: string;
  amount: string;
  payload?: string;
  comment?: string;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Constants
export const SUBSCRIPTION_PRICE_TON = 25;
export const SUBSCRIPTION_PERIOD_DAYS = 30;
export const RADAR_TICK_INTERVAL_MS = 30000; // 30 seconds
export const CACHE_TTL_SECONDS = 30;
