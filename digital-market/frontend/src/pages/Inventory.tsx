import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Tooltip,
  LinearProgress,
  Alert,
  Button,
  Divider
} from '@mui/material';
import {
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  Add as AddIcon,
  AttachMoney as MoneyIcon,
  TrendingUp as TrendingUpIcon,
  Inventory as InventoryIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import SteamAPIService, { CSGOSkin } from '../services/steamApi';
import './Inventory.css';

interface InventoryItem extends CSGOSkin {
  purchaseDate: string;
  purchasePrice: number;
  currentPrice: number;
  profit: number;
  change: number;
  status: 'owned' | 'selling' | 'sold';
  float: number;
  wear: string;
  steamPrice: number;
  marketPrice: number;
  quantity: number;
  condition: 'factory-new' | 'minimal-wear' | 'field-tested' | 'well-worn' | 'battle-scarred';
}

const Inventory: React.FC = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType] = useState('all');
  const [sortBy, setSortBy] = useState('steamPrice');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  // Загрузка данных инвентаря
  useEffect(() => {
    const loadInventory = async () => {
      setLoading(true);
      try {
        console.log('🔄 Загружаем инвентарь...');
        
        // Получаем реальные скины
        const realSkins = await SteamAPIService.getCSGOItems();
        
        // Генерируем данные инвентаря на основе реальных скинов
        const inventoryItems: InventoryItem[] = realSkins.slice(0, 30).map((skin, index) => {
          const conditions = ['factory-new', 'minimal-wear', 'field-tested', 'well-worn', 'battle-scarred'] as const;
          const wears = ['Factory New', 'Minimal Wear', 'Field-Tested', 'Well-Worn', 'Battle-Scarred'];
          
          const condition = conditions[Math.floor(Math.random() * conditions.length)];
          const wear = wears[conditions.indexOf(condition)];
          
          // Генерируем цены как в Steam
          const basePrice = Math.floor(Math.random() * (skin.price_range.max - skin.price_range.min)) + skin.price_range.min;
          const steamPrice = basePrice;
          const marketPrice = Math.floor(steamPrice * (0.85 + Math.random() * 0.3)); // Market price обычно ниже Steam
          const purchasePrice = Math.floor(steamPrice * (0.8 + Math.random() * 0.4));
          const currentPrice = steamPrice;
          
          // Генерируем дату покупки
          const daysAgo = Math.floor(Math.random() * 180); // До 180 дней назад
          const purchaseDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString();
          
          return {
            ...skin,
            purchaseDate,
            purchasePrice,
            currentPrice,
            profit: currentPrice - purchasePrice,
            change: Math.round(((currentPrice - purchasePrice) / purchasePrice) * 100 * 100) / 100,
            status: 'owned' as const,
            float: parseFloat((Math.random() * 0.8).toFixed(3)),
            wear,
            condition,
            steamPrice,
            marketPrice,
            quantity: 1
          };
        });

        setItems(inventoryItems);
        console.log('✅ Инвентарь загружен:', inventoryItems.length, 'предметов');
        
      } catch (error) {
        console.error('❌ Ошибка загрузки инвентаря:', error);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    loadInventory();
  }, []);

  // Фильтрация и сортировка
  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || item.weapon_type === filterType;
    
    return matchesSearch && matchesType;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'steamPrice':
        return b.steamPrice - a.steamPrice;
      case 'marketPrice':
        return b.marketPrice - a.marketPrice;
      case 'profit':
        return b.profit - a.profit;
      default:
        return 0;
    }
  });

  // Статистика
  const totalSteamValue = items.reduce((sum, item) => sum + item.steamPrice, 0);
  const totalMarketValue = items.reduce((sum, item) => sum + item.marketPrice, 0);

  // Получение цвета редкости
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return '#eb4b4b';
      case 'epic': return '#8847ff';
      case 'rare': return '#d32ce6';
      case 'uncommon': return '#4b69ff';
      case 'common': return '#b0c3d9';
      default: return '#cccccc';
    }
  };

  // Форматирование цены в стиле Steam
  const formatPrice = (price: number) => {
    return `${price.toLocaleString('ru-RU')}₽`;
  };

  // Компонент элемента инвентаря
  const InventoryItemComponent = ({ item, index }: { item: InventoryItem; index: number }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.02 }}
      className="inventory-item-row"
    >
      <Box className="item-checkbox-container">
        <input
          type="checkbox"
          className="item-checkbox"
          title={`Выбрать ${item.name}`}
          checked={selectedItems.includes(item.id)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedItems([...selectedItems, item.id]);
            } else {
              setSelectedItems(selectedItems.filter(id => id !== item.id));
            }
          }}
        />
      </Box>

      <Box className="item-image-section">
        <Box 
          className="item-rarity-border"
          sx={{ borderLeftColor: getRarityColor(item.rarity) }}
        >
          <img
            src={item.image}
            alt={item.name}
            className="item-image-small"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://via.placeholder.com/80x60?text=No+Image';
            }}
          />
        </Box>
      </Box>

      <Box className="item-info-section">
        <Typography className="item-name-compact">
          {item.name}
        </Typography>
        <Typography className="item-condition">
          {item.wear}
        </Typography>
        {item.float && (
          <Typography className="item-float">
            FN: {item.float.toFixed(3)}
          </Typography>
        )}
      </Box>

      <Box className="item-prices-section">
        <Box className="price-column">
          <Typography className="price-label">Цена Steam</Typography>
          <Typography className="steam-price">
            {formatPrice(item.steamPrice)}
          </Typography>
        </Box>
        <Box className="price-column">
          <Typography className="price-label">Цена Market</Typography>
          <Typography className="market-price">
            {formatPrice(item.marketPrice)}
          </Typography>
        </Box>
      </Box>

      <Box className="item-actions-section">
        <Tooltip title="Просмотр на рынке">
          <IconButton size="small" className="action-btn">
            <VisibilityIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Добавить на продажу">
          <IconButton size="small" className="action-btn sell-btn">
            <AddIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </motion.div>
  );

  return (
    <Box className="steam-inventory-page">
      {/* Заголовок в стиле Redline */}
      <Box className="steam-header">
        <Box className="steam-profile-section">
          <Box className="steam-avatar">
            <img 
              src="https://avatars.akamai.steamstatic.com/b5bd56c1aa4644a474a2e4972be27ef9e82e517e_full.jpg" 
              alt="Profile"
              className="avatar-image"
            />
          </Box>
          <Box>
            <Typography className="steam-username">Randar Market User</Typography>
            <Typography className="steam-level">В сети</Typography>
          </Box>
        </Box>

        <Typography variant="h5" className="inventory-title">
          Предметы на продажу
        </Typography>
      </Box>

      {/* Статистика */}
      <Box className="steam-stats">
        <Box className="stats-item">
          <InventoryIcon className="stats-icon" />
          <Box>
            <Typography className="stats-value">{items.length}</Typography>
            <Typography className="stats-label">Предметов</Typography>
          </Box>
        </Box>
        <Box className="stats-item">
          <MoneyIcon className="stats-icon steam-value" />
          <Box>
            <Typography className="stats-value steam-value">{formatPrice(totalSteamValue)}</Typography>
            <Typography className="stats-label">Стоимость Steam</Typography>
          </Box>
        </Box>
        <Box className="stats-item">
          <TrendingUpIcon className="stats-icon market-value" />
          <Box>
            <Typography className="stats-value market-value">{formatPrice(totalMarketValue)}</Typography>
            <Typography className="stats-label">Стоимость Market</Typography>
          </Box>
        </Box>
      </Box>

      {/* Фильтры в стиле Steam */}
      <Box className="steam-filters">
        <TextField
          placeholder="Поиск"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon className="search-icon" />
          }}
          className="steam-search"
          size="small"
        />

        <FormControl size="small" className="steam-select">
          <InputLabel>Цена</InputLabel>
          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <MenuItem value="steamPrice">По цене Steam</MenuItem>
            <MenuItem value="marketPrice">По цене Market</MenuItem>
            <MenuItem value="name">По названию</MenuItem>
            <MenuItem value="profit">По прибыли</MenuItem>
          </Select>
        </FormControl>

        <Typography className="items-count">
          Выбрано: {selectedItems.length} | Установить цену
        </Typography>
      </Box>

      {/* Действия с выбранными предметами */}
      {selectedItems.length > 0 && (
        <Box className="steam-bulk-actions">
          <Button className="bulk-action-btn">
            Сгруппировать
          </Button>
          <Button className="bulk-action-btn">
            Добавить все
          </Button>
          <Button className="bulk-action-btn">
            Очистить
          </Button>
        </Box>
      )}

      <Divider className="steam-divider" />

      {/* Список предметов */}
      <Box className="steam-inventory-content">
        {loading ? (
          <Box className="loading-container">
            <LinearProgress className="steam-loading" />
            <Typography className="loading-text">
              Загрузка инвентаря...
            </Typography>
          </Box>
        ) : sortedItems.length === 0 ? (
          <Alert severity="info" className="no-items-alert">
            Предметы не найдены. Попробуйте изменить поиск.
          </Alert>
        ) : (
          <Box className="inventory-items-list">
            <AnimatePresence>
              {sortedItems.map((item, index) => (
                <InventoryItemComponent key={item.id} item={item} index={index} />
              ))}
            </AnimatePresence>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Inventory;