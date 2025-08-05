import { FilterOption, SortOption } from '../types';

// Демо данные (теперь будут заменены реальными)
export const DEMO_WEAPONS = [
  {
    id: 'ak47-1', name: 'AK-47 | Redline', float: 0.15, imageUrl: 'https://via.placeholder.com/300x200/8B0000/FFFFFF?text=AK-47+Redline', steamPrice: 1250.50, marketPrice: 1100.00, rarity: 'classified', wear: 'Field-Tested'
  },
  {
    id: 'awp-1', name: 'AWP | Dragon Lore', float: 0.01, imageUrl: 'https://via.placeholder.com/300x200/FFD700/FFFFFF?text=AWP+Dragon+Lore', steamPrice: 15000.00, marketPrice: 14000.00, rarity: 'contraband', wear: 'Factory New'
  },
  {
    id: 'm4a1s-1', name: 'M4A1-S | Hyper Beast', float: 0.09, imageUrl: 'https://via.placeholder.com/300x200/27AE60/FFFFFF?text=M4A1-S+Hyper+Beast', steamPrice: 950.25, marketPrice: 820.00, rarity: 'restricted', wear: 'Minimal Wear'
  },
  {
    id: 'ak47-2', name: 'AK-47 | Fire Serpent', float: 0.04, imageUrl: 'https://via.placeholder.com/300x200/E74C3C/FFFFFF?text=AK-47+Fire+Serpent', steamPrice: 15000.00, marketPrice: 14000.00, rarity: 'contraband', wear: 'Factory New'
  },
  {
    id: 'm4a4-2', name: 'M4A4 | Howl', float: 0.05, imageUrl: 'https://via.placeholder.com/300x200/F39C12/FFFFFF?text=M4A4+Howl', steamPrice: 35000.00, marketPrice: 32000.00, rarity: 'contraband', wear: 'Factory New'
  }
];

export const RARITY_COLORS = {
  consumer: '#B0C3D9',      // Ширпотреб (белый)
  industrial: '#5E98D9',    // Промышленное качество (светло-синий)
  milspec: '#4B69FF',       // Армейское качество (тёмно-синий)
  restricted: '#8847FF',    // Запрещённое (фиолетовый)
  classified: '#D32CE6',    // Засекреченное (розовый)
  covert: '#EB4B4B',        // Тайное (красный)
  contraband: '#FFD700'     // Контрабандное (золотой)
};

export const WEAR_COLORS = {
  'Factory New': '#10B981',     // 0.00-0.07
  'Minimal Wear': '#3B82F6',    // 0.07-0.15
  'Field-Tested': '#F59E0B',    // 0.15-0.37
  'Well-Worn': '#F97316',       // 0.37-0.44
  'Battle-Scarred': '#EF4444'   // 0.44-1.00
};

export const WEAR_RANGES = {
  'Factory New': { min: 0.00, max: 0.07 },
  'Minimal Wear': { min: 0.07, max: 0.15 },
  'Field-Tested': { min: 0.15, max: 0.37 },
  'Well-Worn': { min: 0.37, max: 0.44 },
  'Battle-Scarred': { min: 0.44, max: 1.00 }
};

export const FILTER_OPTIONS: FilterOption[] = [
  { value: 'all', label: 'Все предметы' },
  { value: 'consumer', label: 'Ширпотреб' },
  { value: 'industrial', label: 'Промышленное' },
  { value: 'milspec', label: 'Армейское' },
  { value: 'restricted', label: 'Запрещённое' },
  { value: 'classified', label: 'Засекреченное' },
  { value: 'covert', label: 'Тайное' },
  { value: 'contraband', label: 'Контрабандное' }
];

export const SORT_OPTIONS: SortOption[] = [
  { value: 'name', label: 'По названию' },
  { value: 'price_steam', label: 'По цене Steam' },
  { value: 'price_market', label: 'По цене Market' },
  { value: 'price_difference', label: 'По разнице цен' },
  { value: 'rarity', label: 'По редкости' },
  { value: 'wear', label: 'По износу' },
  { value: 'float', label: 'По float' },
  { value: 'weapon', label: 'По оружию' },
  { value: 'category', label: 'По категории' }
];

// Категории оружия
export const WEAPON_CATEGORIES = [
  'Rifles',
  'Pistols', 
  'SMGs',
  'Shotguns',
  'Sniper Rifles',
  'Machineguns'
];

// Конфигурация Vanta.js для фона
export const VANTA_CONFIG = {
  el: null,
  THREE: null,
  mouseControls: false,
  touchControls: false,
  gyroControls: false,
  minHeight: 200.0,
  minWidth: 200.0,
  scale: 0.5,
  scaleMobile: 0.5,
  color: 0x8B0000,
  backgroundColor: 0x000000,
  showDots: false,
  points: 4.0,
  maxDistance: 50.0,
  spacing: 50.0,
  showLines: false,
  lineColor: 0x8B0000,
  lineWidth: 1.0,
  alpha: 0.3,
  beta: 0.0,
  gamma: 0.0,
  theta: 0.0,
  phi: 0.0,
  delta: 0.0,
  epsilon: 0.0,
  zeta: 0.0,
  eta: 0.0,
  thetaDelta: 0.0,
  phiDelta: 0.0,
  gammaDelta: 0.0,
  deltaDelta: 0.0,
  epsilonDelta: 0.0,
  zetaDelta: 0.0,
  etaDelta: 0.0,
}; 