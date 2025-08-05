import { RARITY_COLORS, WEAR_COLORS } from './constants';
import { Item, SortType } from '../types';

// Форматирование цены
export const formatPrice = (price: number): string => {
  if (price >= 1000) {
    return `$${(price / 1000).toFixed(1)}k`;
  }
  return `$${price.toFixed(2)}`;
};

// Получение цвета редкости
export const getRarityColor = (rarity: string): string => {
  return RARITY_COLORS[rarity as keyof typeof RARITY_COLORS] || '#888';
};

// Получение цвета износа
export const getWearColor = (wear: string): string => {
  return WEAR_COLORS[wear as keyof typeof WEAR_COLORS] || '#888';
};

// Фильтрация предметов
export const filterItems = (items: Item[], search: string, filter: string): Item[] => {
  return items.filter(item => {
    const matchesSearch = !search || 
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      (item.weapon && item.weapon.toLowerCase().includes(search.toLowerCase())) ||
      (item.category && item.category.toLowerCase().includes(search.toLowerCase()));
    
    const matchesFilter = filter === 'all' || item.rarity === filter;
    
    return matchesSearch && matchesFilter;
  });
};

// Получение задержки анимации
export const getAnimationDelay = (index: number): string => {
  return `${index * 0.1}s`;
};

// Валидация email
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Обрезка текста
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

// Генерация ID
export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

// Определение износа по float
export const getWearByFloat = (float: number): string => {
  if (float >= 0.00 && float <= 0.07) return 'Factory New';
  if (float > 0.07 && float <= 0.15) return 'Minimal Wear';
  if (float > 0.15 && float <= 0.37) return 'Field-Tested';
  if (float > 0.37 && float <= 0.44) return 'Well-Worn';
  if (float > 0.44 && float <= 1.00) return 'Battle-Scarred';
  return 'Field-Tested';
};

// Сортировка предметов
export const sortItems = (items: Item[], sortBy: SortType, sortOrder: 'asc' | 'desc') => {
  return [...items].sort((a, b) => {
    let aValue: any, bValue: any;
    
    switch (sortBy) {
      case 'name':
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      case 'price_steam':
        aValue = a.steamPrice;
        bValue = b.steamPrice;
        break;
      case 'price_market':
        aValue = a.marketPrice;
        bValue = b.marketPrice;
        break;
      case 'price_difference':
        aValue = Math.abs(a.steamPrice - a.marketPrice);
        bValue = Math.abs(b.steamPrice - b.marketPrice);
        break;
      case 'rarity':
        const rarityOrder = { 
          'consumer': 1, 'industrial': 2, 'milspec': 3, 'restricted': 4, 
          'classified': 5, 'covert': 6, 'contraband': 7 
        };
        aValue = rarityOrder[a.rarity as keyof typeof rarityOrder] || 0;
        bValue = rarityOrder[b.rarity as keyof typeof rarityOrder] || 0;
        break;
      case 'wear':
        const wearOrder = { 
          'Factory New': 1, 'Minimal Wear': 2, 'Field-Tested': 3, 
          'Well-Worn': 4, 'Battle-Scarred': 5 
        };
        aValue = wearOrder[a.wear as keyof typeof wearOrder] || 0;
        bValue = wearOrder[b.wear as keyof typeof wearOrder] || 0;
        break;
      case 'float':
        aValue = a.float;
        bValue = b.float;
        break;
      case 'weapon':
        aValue = (a.weapon || '').toLowerCase();
        bValue = (b.weapon || '').toLowerCase();
        break;
      case 'category':
        aValue = (a.category || '').toLowerCase();
        bValue = (b.category || '').toLowerCase();
        break;
      default:
        return 0;
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });
};

// Получение статистики инвентаря
export const getInventoryStats = (items: Item[]) => {
  const totalSteamValue = items.reduce((sum, item) => sum + item.steamPrice, 0);
  const totalMarketValue = items.reduce((sum, item) => sum + item.marketPrice, 0);
  const contrabandItems = items.filter(item => item.rarity === 'contraband').length;
  
  return {
    totalItems: items.length,
    totalSteamValue,
    totalMarketValue,
    priceDifference: totalSteamValue - totalMarketValue,
    isPriceUp: totalSteamValue > totalMarketValue,
    contrabandItems
  };
}; 