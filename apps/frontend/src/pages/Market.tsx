import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  InputAdornment,
  IconButton,
  Badge,
  Stack,
  Slider,
  Tabs,
  Tab,
  Divider,
  CircularProgress
} from '@mui/material';
import {
  Search as SearchIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  ShoppingCart as CartIcon,
  LocalOffer as LocalOfferIcon,
  TrendingUp as TrendingUpIcon,
  Star as StarIcon,
  Visibility as VisibilityIcon,
  FilterList as FilterListIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import NET from 'vanta/dist/vanta.net.min';
import * as THREE from 'three';
import SteamAPIService, { CSGOSkin } from '../services/steamApi';
import './Marketplace.css';

interface MarketItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  condition: 'factory-new' | 'minimal-wear' | 'field-tested' | 'well-worn' | 'battle-scarred';
  seller: {
    name: string;
    avatar: string;
    rating: number;
    verified: boolean;
  };
  category: string;
  views: number;
  likes: number;
  isHot: boolean;
  discount?: number;
  tags: string[];
  float?: number;
  stickers?: string[];
  market_hash_name?: string;
  collection?: string;
}

const Marketplace: React.FC = () => {
  const [vantaEffect, setVantaEffect] = useState<any>(null);
  const [items, setItems] = useState<MarketItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MarketItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [categoryTab, setCategoryTab] = useState(0);
  const [priceRange, setPriceRange] = useState([0, 15000]);
  const [selectedRarity, setSelectedRarity] = useState('all');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [cart, setCart] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);

  const categories = ['Все', 'Винтовки', 'Пистолеты', 'Ножи', 'Снайперки', 'Гранаты'];

  // Загрузка данных из Steam API
  useEffect(() => {
    const loadSteamItems = async () => {
      setIsLoading(true);
      setLoadingError(null);
      
      try {
        console.log('🔄 Загрузка данных из Steam API...');
        const steamItems = await SteamAPIService.getCSGOItems();
        console.log('✅ Получено скинов из Steam API:', steamItems.length);
        
        // Преобразуем Steam данные в формат маркетплейса
        // Преобразуем Steam скины в данные маркетплейса
        const marketItems: MarketItem[] = steamItems.map((steamItem, index) => {
          // Генерируем случайные данные продавца и статистики
          const sellers = [
            { name: 'ProTrader', rating: 4.9, verified: true },
            { name: 'SkinKing', rating: 4.8, verified: true },
            { name: 'MarketMaster', rating: 4.7, verified: false },
            { name: 'WeaponDealer', rating: 4.6, verified: true },
            { name: 'RareCollector', rating: 5.0, verified: true }
          ];
          
          const conditions = ['factory-new', 'minimal-wear', 'field-tested', 'well-worn', 'battle-scarred'] as const;
          const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
          const randomSeller = sellers[Math.floor(Math.random() * sellers.length)];
          
          // Используем ценовой диапазон из Steam данных
          const priceRange = steamItem.price_range;
          const basePrice = Math.floor(Math.random() * (priceRange.max - priceRange.min)) + priceRange.min;
          const hasDiscount = Math.random() > 0.7;
          const discount = hasDiscount ? Math.floor(Math.random() * 30) + 5 : undefined;
          const finalPrice = hasDiscount ? Math.floor(basePrice * (1 - discount! / 100)) : basePrice;
          
          return {
            id: steamItem.id,
            name: steamItem.name,
            price: finalPrice,
            originalPrice: hasDiscount ? basePrice : undefined,
            image: steamItem.image, // Используем прямое изображение из гарантированных данных
            rarity: steamItem.rarity,
            condition: randomCondition,
            seller: {
              name: randomSeller.name,
              avatar: '',
              rating: randomSeller.rating,
              verified: randomSeller.verified
            },
            category: steamItem.weapon_type,
            views: Math.floor(Math.random() * 5000) + 100,
            likes: Math.floor(Math.random() * 500) + 10,
            isHot: Math.random() > 0.8,
            discount: discount,
            tags: [steamItem.weapon_type, steamItem.rarity],
            float: parseFloat((Math.random() * 0.8).toFixed(3)),
            market_hash_name: steamItem.market_hash_name
          };
        });
        
        console.log('✅ Обработано товаров для маркетплейса:', marketItems.length);
        setItems(marketItems);
        setFilteredItems(marketItems);
        
      } catch (error) {
        console.error('❌ Ошибка загрузки данных Steam:', error);
        setLoadingError('Не удалось загрузить данные из Steam API. Попробуйте обновить страницу.');
        
        // Fallback данные
        const fallbackItems: MarketItem[] = [
          {
            id: 'fallback_1',
            name: 'AK-47 | Redline',
            price: 750,
            originalPrice: 890,
            image: 'https://via.placeholder.com/330x192/DC2626/FFFFFF?text=AK-47+Redline',
            rarity: 'epic',
            condition: 'minimal-wear',
            seller: { name: 'ProTrader', avatar: '', rating: 4.9, verified: true },
            category: 'rifles',
            views: 1250,
            likes: 89,
            isHot: true,
            discount: 16,
            tags: ['популярное', 'редкое'],
            float: 0.12,
            market_hash_name: 'AK-47 | Redline (Minimal Wear)'
          }
        ];
        
        setItems(fallbackItems);
        setFilteredItems(fallbackItems);
      } finally {
        setIsLoading(false);
      }
    };

    loadSteamItems();
  }, []);

  // Инициализация Vanta.js фона
  useEffect(() => {
    if (!vantaEffect && backgroundRef.current) {
      const effect = NET({
        el: backgroundRef.current,
        THREE: THREE,
        color: 0x8B0000,
        backgroundColor: 0x000000,
        points: 8,
        maxDistance: 25,
        spacing: 20,
        showLines: true,
        lineColor: 0x8B0000,
        lineWidth: 1.2,
        scale: 1.0,
        showDots: true,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        animationSpeed: 0.8
      });
      setVantaEffect(effect);
    }

    return () => {
      if (vantaEffect) {
        vantaEffect.destroy();
      }
    };
  }, [vantaEffect]);

  // Фильтрация и сортировка товаров
  useEffect(() => {
    let filtered = items.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const categoryMap = ['all', 'rifles', 'pistols', 'knives', 'sniper-rifles', 'grenades'];
      const matchesCategory = categoryTab === 0 || item.category === categoryMap[categoryTab];
      
      const matchesPrice = item.price >= priceRange[0] && item.price <= priceRange[1];
      const matchesRarity = selectedRarity === 'all' || item.rarity === selectedRarity;
      
      return matchesSearch && matchesCategory && matchesPrice && matchesRarity;
    });

    // Сортировка
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'popular':
        filtered.sort((a, b) => b.views - a.views);
        break;
      case 'newest':
        filtered.sort((a, b) => b.likes - a.likes);
        break;
      case 'discount':
        filtered.sort((a, b) => (b.discount || 0) - (a.discount || 0));
        break;
    }

    setFilteredItems(filtered);
  }, [items, searchQuery, sortBy, categoryTab, priceRange, selectedRarity]);

  const toggleFavorite = (itemId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(itemId)) {
        newFavorites.delete(itemId);
      } else {
        newFavorites.add(itemId);
      }
      return newFavorites;
    });
  };

  const toggleCart = (itemId: string) => {
    setCart(prev => {
      const newCart = new Set(prev);
      if (newCart.has(itemId)) {
        newCart.delete(itemId);
      } else {
        newCart.add(itemId);
      }
      return newCart;
    });
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return '#b0b3b8';
      case 'uncommon': return '#56b947';
      case 'rare': return '#4b69ff';
      case 'epic': return '#8847ff';
      case 'legendary': return '#d32ce6';
      default: return '#b0b3b8';
    }
  };

  return (
    <Box className="randar-marketplace">
      {/* Анимированный фон */}
      <Box ref={backgroundRef} className="randar-background" />
      
      {/* Полноэкранный контент */}
      <Box className="marketplace-container">
        {/* Верхняя панель */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="top-panel"
        >
          <Paper className="main-header" elevation={0}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="h3" className="marketplace-title">
                  <span className="title-accent">RANDAR</span> MARKETPLACE
                </Typography>
                <Stack direction="row" spacing={3} className="stats-row">
                  <Stack direction="row" spacing={1} alignItems="center">
                    <LocalOfferIcon className="stat-icon" />
                    <Typography variant="body2">{filteredItems.length} товаров</Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <TrendingUpIcon className="stat-icon" />
                    <Typography variant="body2">Активная торговля</Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <VisibilityIcon className="stat-icon" />
                    <Typography variant="body2">24/7 мониторинг</Typography>
                  </Stack>
                </Stack>
              </Box>
              <Stack direction="row" spacing={2} alignItems="center">
                <Button
                  variant="outlined"
                  startIcon={<FilterListIcon />}
                  onClick={() => setShowFilters(!showFilters)}
                  className="filter-toggle"
                >
                  Фильтры
                </Button>
                <Button
                  variant="contained"
                  startIcon={
                    <Badge badgeContent={cart.size} color="secondary">
                      <CartIcon />
                    </Badge>
                  }
                  className="cart-button"
                >
                  Корзина ₽{cart.size * 1250}
                </Button>
              </Stack>
            </Stack>
          </Paper>

          {/* Панель навигации и поиска */}
          <Paper className="navigation-panel" elevation={0}>
            <Stack direction="row" spacing={3} alignItems="center">
              {/* Категории */}
              <Tabs 
                value={categoryTab} 
                onChange={(_, newValue) => setCategoryTab(newValue)}
                className="category-tabs"
                variant="scrollable"
                scrollButtons="auto"
              >
                {categories.map((category, index) => (
                  <Tab key={index} label={category} className="category-tab" />
                ))}
              </Tabs>

              <Divider orientation="vertical" flexItem />

              {/* Поиск */}
              <TextField
                placeholder="Поиск оружия, скинов, ножей..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon className="search-icon" />
                    </InputAdornment>
                  ),
                }}
                className="search-field"
                size="medium"
              />

              {/* Сортировка */}
              <FormControl size="medium" className="sort-select">
                <InputLabel>Сортировка</InputLabel>
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  label="Сортировка"
                >
                  <MenuItem value="popular">Популярность</MenuItem>
                  <MenuItem value="price-low">Цена: дешевле</MenuItem>
                  <MenuItem value="price-high">Цена: дороже</MenuItem>
                  <MenuItem value="newest">Новинки</MenuItem>
                  <MenuItem value="discount">Скидки</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </Paper>

          {/* Панель расширенных фильтров */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Paper className="filters-panel" elevation={0}>
                <Stack direction="row" spacing={4} alignItems="center">
                  <FormControl size="small" sx={{ minWidth: 150 }}>
                    <InputLabel>Редкость</InputLabel>
                    <Select
                      value={selectedRarity}
                      onChange={(e) => setSelectedRarity(e.target.value)}
                      label="Редкость"
                    >
                      <MenuItem value="all">Любая</MenuItem>
                      <MenuItem value="common">Обычная</MenuItem>
                      <MenuItem value="uncommon">Необычная</MenuItem>
                      <MenuItem value="rare">Редкая</MenuItem>
                      <MenuItem value="epic">Эпическая</MenuItem>
                      <MenuItem value="legendary">Легендарная</MenuItem>
                    </Select>
                  </FormControl>

                  <Box sx={{ flex: 1, maxWidth: 400 }}>
                    <Typography variant="body2" className="filter-label" gutterBottom>
                      Ценовой диапазон: ₽{priceRange[0]} - ₽{priceRange[1]}
                    </Typography>
                    <Slider
                      value={priceRange}
                      onChange={(_, newValue) => setPriceRange(newValue as number[])}
                      valueLabelDisplay="auto"
                      min={0}
                      max={15000}
                      step={50}
                      className="price-slider"
                    />
                  </Box>

                  <Typography variant="body2" className="filter-info">
                    Найдено товаров: {filteredItems.length}
                  </Typography>
                </Stack>
              </Paper>
            </motion.div>
          )}
        </motion.div>

        {/* Основная сетка товаров */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="items-section"
        >
          {/* Индикатор загрузки */}
          {isLoading && (
            <Paper className="loading-container" elevation={0}>
              <CircularProgress 
                size={60} 
                thickness={4}
                sx={{ 
                  color: '#DC2626',
                  marginBottom: 2
                }} 
              />
              <Typography variant="h5" className="loading-title">
                Загружаем скины из Steam API...
              </Typography>
              <Typography variant="body1" className="loading-subtitle">
                Получаем актуальные данные об оружии
              </Typography>
            </Paper>
          )}

          {/* Ошибка загрузки */}
          {loadingError && !isLoading && (
            <Paper className="error-container" elevation={0}>
              <Typography variant="h4" className="error-title" gutterBottom>
                ⚠️ Ошибка загрузки
              </Typography>
              <Typography variant="body1" className="error-subtitle" gutterBottom>
                {loadingError}
              </Typography>
              <Button
                variant="contained"
                onClick={() => window.location.reload()}
                className="retry-button"
                sx={{ marginTop: 2 }}
              >
                Попробовать снова
              </Button>
            </Paper>
          )}

          {/* Сетка товаров */}
          {!isLoading && !loadingError && (
            <Box className="items-grid">
              {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                whileHover={{ y: -8, scale: 1.03 }}
                className="item-wrapper"
              >
                <Card className="item-card">
                  {/* Бейджи */}
                  <Box className="item-badges">
                    {item.isHot && (
                      <Chip label="🔥 ХИТ" size="small" className="hot-badge" />
                    )}
                    {item.discount && (
                      <Chip label={`-${item.discount}%`} size="small" className="discount-badge" />
                    )}
                    <Chip
                      label={item.rarity.toUpperCase()}
                      size="small"
                      className="rarity-badge"
                      style={{ backgroundColor: getRarityColor(item.rarity) }}
                    />
                  </Box>

                  {/* Изображение */}
                  <Box className="item-image-container">
                    <img src={item.image} alt={item.name} className="item-image" />
                    
                    {/* Оверлей с действиями */}
                    <Box className="item-overlay">
                      <IconButton
                        onClick={() => toggleFavorite(item.id)}
                        className="action-btn favorite-btn"
                        size="small"
                      >
                        {favorites.has(item.id) ? (
                          <FavoriteIcon className="favorite-active" />
                        ) : (
                          <FavoriteBorderIcon />
                        )}
                      </IconButton>
                    </Box>
                  </Box>

                  <CardContent className="item-content">
                    {/* Название товара */}
                    <Typography variant="h6" className="item-name" gutterBottom>
                      {item.name}
                    </Typography>

                    {/* Информация о состоянии */}
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                      <Typography variant="body2" className="item-condition">
                        {item.condition.toUpperCase()}
                      </Typography>
                      {item.float && (
                        <Typography variant="caption" className="item-float">
                          Float: {item.float}
                        </Typography>
                      )}
                    </Stack>

                    {/* Цена */}
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                      <Typography variant="h5" className="item-price">
                        ₽{item.price.toLocaleString()}
                      </Typography>
                      {item.originalPrice && (
                        <Typography variant="body2" className="original-price">
                          ₽{item.originalPrice.toLocaleString()}
                        </Typography>
                      )}
                    </Stack>

                    {/* Продавец */}
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                      <Typography variant="body2" className="seller-name">
                        {item.seller.name}
                        {item.seller.verified && (
                          <StarIcon className="verified-icon" sx={{ ml: 0.5, fontSize: 14 }} />
                        )}
                      </Typography>
                      <Typography variant="caption" className="seller-rating">
                        ⭐ {item.seller.rating}
                      </Typography>
                    </Stack>

                    {/* Статистика */}
                    <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                      <Typography variant="caption" className="item-stat">
                        👁 {item.views}
                      </Typography>
                      <Typography variant="caption" className="item-stat">
                        ❤ {item.likes}
                      </Typography>
                    </Stack>

                    {/* Кнопка покупки */}
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={() => toggleCart(item.id)}
                      className="buy-button"
                    >
                      {cart.has(item.id) ? 'Убрать из корзины' : 'Добавить в корзину'}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
              ))}
            </Box>
          )}

          {/* Сообщение если нет товаров */}
          {!isLoading && !loadingError && filteredItems.length === 0 && (
            <Paper className="no-items-message" elevation={0}>
              <Typography variant="h4" className="no-items-title" gutterBottom>
                Товары не найдены
              </Typography>
              <Typography variant="body1" className="no-items-subtitle">
                Попробуйте изменить параметры поиска или фильтры
              </Typography>
            </Paper>
          )}
        </motion.div>
      </Box>
    </Box>
  );
};

export default Marketplace;