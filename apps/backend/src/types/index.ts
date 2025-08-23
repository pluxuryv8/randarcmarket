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

export interface Subscription {
  id: string;
  user_id: string;
  status: 'active' | 'expired' | 'cancelled';
  start_date: Date;
  end_date: Date;
  amount_ton: number;
  order_id: string;
  created_at: Date;
}

export interface WatchlistFilter {
  id: string;
  user_id: string;
  collection_address?: string;
  min_price?: number;
  max_price?: number;
  rarity_filter?: string[];
  below_floor_percent?: number;
  created_at: Date;
}

export interface RadarSignal {
  id: string;
  user_id: string;
  filter_id: string;
  item_address: string;
  signal_type: 'price_drop' | 'rarity_match' | 'volume_spike' | 'below_floor';
  message: string;
  created_at: Date;
}

export interface NFTCollection {
  address: string;
  name: string;
  description?: string;
  image_url?: string;
  floor_price?: number;
  volume_24h?: number;
  items_count?: number;
  owners_count?: number;
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
}

export interface Drop {
  id: string;
  name: string;
  description: string;
  image_url: string;
  price_ton: number;
  max_participants?: number;
  start_date: Date;
  end_date: Date;
  status: 'upcoming' | 'active' | 'ended';
  participants_count: number;
}

export interface OrderPayload {
  order_id: string;
  user_id: string;
  amount_ton: number;
  receiver: string;
  comment: string;
  created_at: Date;
}

export interface TelegramAuthData {
  id: string;
  first_name?: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: string;
  hash: string;
}

export interface TonConnectTransaction {
  to: string;
  amount: string;
  payload?: string;
  comment: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
