// Радар система - типы и интерфейсы

export interface InventoryItem {
  id: string;
  name: string;
  imageUrl: string;
  purchasePrice: number;
  currentMarketPrice: number;
  purchaseDate: string;
  holdFeeRate: number; // процент за час хранения (например 0.0005 = 0.05%)
  autoSell: boolean;
  rarity: string;
  float?: number;
  wear?: string;
  category: 'weapon' | 'knife' | 'gloves' | 'sticker' | 'case';
}

export interface TradeRecord {
  id: string;
  itemId: string;
  itemName: string;
  buyPrice: number;
  sellPrice?: number;
  profit?: number;
  holdFee: number;
  timestamp: string;
  sellTimestamp?: string;
  status: 'bought' | 'sold' | 'holding' | 'cancelled';
  duration?: number; // время удержания в часах
}

export interface RadarSession {
  id: string;
  userId: string;
  initialBudget: number;
  currentBudget: number;
  totalProfit: number;
  totalInvested: number;
  activeItem?: InventoryItem;
  state: 'idle' | 'scanning' | 'awaitingDecision' | 'completed' | 'paused';
  settings: RadarSettings;
  history: TradeRecord[];
  createdAt: string;
  lastActivity: string;
  scanCount: number;
  successfulTrades: number;
}

export interface RadarSettings {
  scanInterval: number; // секунды между сканированиями
  maxHoldTime: number; // максимальное время удержания в часах
  targetProfitPercent: number; // целевой процент прибыли
  maxBudgetPerItem: number; // максимальная сумма на один предмет
  categories: string[]; // категории для поиска
  autoSell: boolean; // автоматическая продажа
  notifications: {
    push: boolean;
    email: boolean;
    telegram: boolean;
  };
  riskLevel: 'low' | 'medium' | 'high'; // уровень риска
  stopLossPercent: number; // процент убытка для автостопа
}

export interface RadarSignal {
  id: string;
  type: 'buy' | 'sell' | 'alert';
  asset: string;
  price: number;
  change: number;
  confidence: number;
  timestamp: Date;
  source: 'steam' | 'telegram' | 'nft';
  rarity: string;
  float: number;
  // Расширенные поля для новой системы
  potentialProfit: number;
  potentialProfitPercent: number;
  riskLevel: 'low' | 'medium' | 'high';
  recommendedAction: 'buy' | 'skip' | 'watch';
  marketTrend: 'rising' | 'falling' | 'stable';
  liquidityScore: number; // от 0 до 100
}

export interface RadarStats {
  totalSessions: number;
  totalProfit: number;
  totalInvested: number;
  successRate: number;
  averageHoldTime: number; // в часах
  averageProfitPerTrade: number;
  totalHoldFees: number;
  bestTrade: {
    itemName: string;
    profit: number;
    profitPercent: number;
  };
  worstTrade: {
    itemName: string;
    loss: number;
    lossPercent: number;
  };
}

export interface RadarAlert {
  id: string;
  type: 'purchase' | 'sale' | 'profit_target' | 'stop_loss' | 'hold_fee_warning' | 'session_complete';
  title: string;
  message: string;
  itemName?: string;
  amount?: number;
  timestamp: string;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high' | 'critical';
  actionRequired: boolean;
}

export interface RadarDecision {
  sessionId: string;
  action: 'continue' | 'withdraw' | 'hold' | 'sell_now';
  reinvestAmount?: number;
  sellPrice?: number;
  notes?: string;
}

// API Response типы
export interface RadarApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface StartRadarRequest {
  budget: number;
  settings: RadarSettings;
}

export interface DepositRequest {
  amount: number;
  paymentMethod: 'card' | 'crypto' | 'bank' | 'balance';
}

export interface WithdrawRequest {
  amount: number;
  method: 'card' | 'crypto' | 'bank';
  address?: string;
}

// Real-time события
export interface RadarEvent {
  type: 'scan_started' | 'item_found' | 'purchase_completed' | 'decision_required' | 'session_ended' | 'error';
  sessionId: string;
  data: any;
  timestamp: string;
}

// Утилитарные типы
export type RadarState = RadarSession['state'];
export type NotificationType = keyof RadarSettings['notifications'];
export type TradeStatus = TradeRecord['status'];
export type AlertType = RadarAlert['type'];
export type AlertPriority = RadarAlert['priority'];

// Константы
export const RADAR_CONSTANTS = {
  MIN_BUDGET: 100, // минимальный депозит
  MAX_BUDGET: 1000000, // максимальный депозит
  MIN_SCAN_INTERVAL: 5, // минимальный интервал сканирования в секундах
  MAX_SCAN_INTERVAL: 300, // максимальный интервал
  DEFAULT_HOLD_FEE_RATE: 0.0005, // 0.05% в час
  MAX_HOLD_TIME: 168, // максимальное время удержания (неделя)
  DEFAULT_TARGET_PROFIT: 15, // процент прибыли по умолчанию
  SCAN_TIMEOUT: 30000, // таймаут сканирования в мс
} as const;

export const RARITY_COLORS = {
  'Consumer Grade': '#b0c3d9',
  'Industrial Grade': '#5e98d9',
  'Mil-Spec': '#4b69ff',
  'Restricted': '#8847ff',
  'Classified': '#d32ce6',
  'Covert': '#eb4b4b',
  'Contraband': '#e4ae39',
} as const;

export const WEAPON_CATEGORIES = {
  'Pistols': ['Glock-18', 'USP-S', 'P2000', 'Tec-9', 'P250', 'Five-SeveN', 'CZ75-Auto', 'Desert Eagle', 'Dual Berettas', 'R8 Revolver'],
  'SMGs': ['Mac-10', 'MP9', 'MP7', 'UMP-45', 'P90', 'PP-Bizon', 'MP5-SD'],
  'Rifles': ['FAMAS', 'Galil AR', 'AK-47', 'M4A4', 'M4A1-S', 'SG 553', 'AUG', 'AWP', 'SSG 08', 'SCAR-20', 'G3SG1'],
  'Shotguns': ['Nova', 'XM1014', 'Sawed-Off', 'MAG-7'],
  'Machine Guns': ['M249', 'Negev'],
  'Knives': ['Bayonet', 'M9 Bayonet', 'Karambit', 'Gut Knife', 'Flip Knife', 'Huntsman Knife', 'Falchion Knife', 'Bowie Knife', 'Butterfly Knife', 'Shadow Daggers', 'Paracord Knife', 'Survival Knife', 'Ursus Knife', 'Navaja Knife', 'Stiletto Knife', 'Talon Knife', 'Skeleton Knife', 'Nomad Knife'],
  'Gloves': ['Specialist Gloves', 'Driver Gloves', 'Hand Wraps', 'Moto Gloves', 'Hydra Gloves', 'Bloodhound Gloves', 'Sport Gloves', 'Broken Fang Gloves']
} as const;