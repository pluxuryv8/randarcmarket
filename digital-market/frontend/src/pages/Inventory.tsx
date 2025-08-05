import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  LinearProgress,
  Alert
} from '@mui/material';
import {
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Inventory as InventoryIcon,
  AttachMoney as MoneyIcon,
  Timeline as TimelineIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';

interface InventoryItem {
  id: string;
  name: string;
  type: string;
  rarity: string;
  price: number;
  change: number;
  float: number;
  wear: string;
  status: 'active' | 'sold' | 'pending';
  purchaseDate: string;
  purchasePrice: number;
  currentPrice: number;
  profit: number;
}

const Inventory: React.FC = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterRarity, setFilterRarity] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  // Генерация тестовых данных
  useEffect(() => {
    const generateItems = () => {
      const types = ['AK-47', 'M4A4', 'AWP', 'Desert Eagle', 'Glock-18', 'USP-S'];
      const rarities = ['Consumer Grade', 'Industrial Grade', 'Mil-Spec Grade', 'Restricted', 'Classified', 'Covert'];
      const wears = ['Factory New', 'Minimal Wear', 'Field-Tested', 'Well-Worn', 'Battle-Scarred'];
      const statuses = ['active', 'sold', 'pending'];

      const mockItems: InventoryItem[] = Array.from({ length: 20 }, (_, index) => {
        const type = types[Math.floor(Math.random() * types.length)];
        const rarity = rarities[Math.floor(Math.random() * rarities.length)];
        const wear = wears[Math.floor(Math.random() * wears.length)];
        const status = statuses[Math.floor(Math.random() * statuses.length)] as 'active' | 'sold' | 'pending';
        const purchasePrice = Math.random() * 1000 + 100;
        const currentPrice = purchasePrice * (0.8 + Math.random() * 0.6);
        const profit = currentPrice - purchasePrice;

        return {
          id: `item_${index + 1}`,
          name: `${type} | ${rarity}`,
          type,
          rarity,
          price: Math.round(currentPrice * 100) / 100,
          change: Math.round((Math.random() - 0.5) * 20 * 100) / 100,
          float: Math.round(Math.random() * 1000) / 1000,
          wear,
          status,
          purchaseDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
          purchasePrice: Math.round(purchasePrice * 100) / 100,
          currentPrice: Math.round(currentPrice * 100) / 100,
          profit: Math.round(profit * 100) / 100
        };
      });

      setItems(mockItems);
      setLoading(false);
    };

    setTimeout(generateItems, 1000);
  }, []);

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || item.type === filterType;
    const matchesRarity = filterRarity === 'all' || item.rarity === filterRarity;
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    
    return matchesSearch && matchesType && matchesRarity && matchesStatus;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'price':
        return b.price - a.price;
      case 'profit':
        return b.profit - a.profit;
      case 'change':
        return b.change - a.change;
      default:
        return 0;
    }
  });

  const totalValue = items.reduce((sum, item) => sum + item.currentPrice, 0);
  const totalProfit = items.reduce((sum, item) => sum + item.profit, 0);
  const activeItems = items.filter(item => item.status === 'active').length;

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Covert': return '#eb4b4b';
      case 'Classified': return '#8847ff';
      case 'Restricted': return '#d32ce6';
      case 'Mil-Spec Grade': return '#4b69ff';
      case 'Industrial Grade': return '#5e98d9';
      case 'Consumer Grade': return '#b0c3d9';
      default: return '#cccccc';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10b981';
      case 'sold': return '#f59e0b';
      case 'pending': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Активен';
      case 'sold': return 'Продан';
      case 'pending': return 'В ожидании';
      default: return status;
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #000000 0%, #1a0000 50%, #000000 100%)',
      color: '#ffffff',
      padding: '20px'
    }}>
      {/* Анимированный фон */}
      <div className="page-background" />

      {/* Заголовок */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h3" className="page-title">
            📦 Инвентарь
          </Typography>
          <Typography variant="h6" className="page-subtitle">
            Управление вашими активами и отслеживание прибыли
          </Typography>
        </Box>
      </motion.div>

      {/* Статистика */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1 }}
      >
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Box sx={{ width: '25%' }}>
            <Card className="glass-card">
              <CardContent sx={{ textAlign: 'center' }}>
                <MoneyIcon sx={{ fontSize: 40, color: '#10b981', mb: 1 }} />
                <Typography variant="h5" sx={{ color: '#10b981', fontWeight: 'bold' }}>
                  {totalValue.toLocaleString()} ₽
                </Typography>
                <Typography variant="body2" sx={{ color: '#cccccc' }}>
                  Общая стоимость
                </Typography>
              </CardContent>
            </Card>
          </Box>
          
          <Box sx={{ width: '25%' }}>
            <Card className="glass-card">
              <CardContent sx={{ textAlign: 'center' }}>
                <TrendingUpIcon sx={{ fontSize: 40, color: '#f59e0b', mb: 1 }} />
                <Typography variant="h5" sx={{ color: '#f59e0b', fontWeight: 'bold' }}>
                  {totalProfit.toLocaleString()} ₽
                </Typography>
                <Typography variant="body2" sx={{ color: '#cccccc' }}>
                  Общая прибыль
                </Typography>
              </CardContent>
            </Card>
          </Box>
          
          <Box sx={{ width: '25%' }}>
            <Card className="glass-card">
              <CardContent sx={{ textAlign: 'center' }}>
                <InventoryIcon sx={{ fontSize: 40, color: '#3b82f6', mb: 1 }} />
                <Typography variant="h5" sx={{ color: '#3b82f6', fontWeight: 'bold' }}>
                  {activeItems}
                </Typography>
                <Typography variant="body2" sx={{ color: '#cccccc' }}>
                  Активных предметов
                </Typography>
              </CardContent>
            </Card>
          </Box>
          
          <Box sx={{ width: '25%' }}>
            <Card className="glass-card">
              <CardContent sx={{ textAlign: 'center' }}>
                <TimelineIcon sx={{ fontSize: 40, color: '#8b5cf6', mb: 1 }} />
                <Typography variant="h5" sx={{ color: '#8b5cf6', fontWeight: 'bold' }}>
                  {items.length}
                </Typography>
                <Typography variant="body2" sx={{ color: '#cccccc' }}>
                  Всего предметов
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Grid>
      </motion.div>

      {/* Фильтры и поиск */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <Card className="glass-card" sx={{ mb: 4 }}>
          <CardContent>
            <Grid container spacing={3} alignItems="center">
              <Box sx={{ width: '33.33%' }}>
                <TextField
                  fullWidth
                  placeholder="Поиск предметов..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: <SearchIcon sx={{ color: '#cccccc', mr: 1 }} />
                  }}
                  className="glass-input"
                />
              </Box>
              
              <Box sx={{ width: '16.67%' }}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: '#cccccc' }}>Тип</InputLabel>
                  <Select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="gradient-select"
                  >
                    <MenuItem value="all">Все типы</MenuItem>
                    <MenuItem value="AK-47">AK-47</MenuItem>
                    <MenuItem value="M4A4">M4A4</MenuItem>
                    <MenuItem value="AWP">AWP</MenuItem>
                    <MenuItem value="Desert Eagle">Desert Eagle</MenuItem>
                    <MenuItem value="Glock-18">Glock-18</MenuItem>
                    <MenuItem value="USP-S">USP-S</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              
              <Box sx={{ width: '16.67%' }}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: '#cccccc' }}>Редкость</InputLabel>
                  <Select
                    value={filterRarity}
                    onChange={(e) => setFilterRarity(e.target.value)}
                    className="gradient-select"
                  >
                    <MenuItem value="all">Все редкости</MenuItem>
                    <MenuItem value="Consumer Grade">Consumer Grade</MenuItem>
                    <MenuItem value="Industrial Grade">Industrial Grade</MenuItem>
                    <MenuItem value="Mil-Spec Grade">Mil-Spec Grade</MenuItem>
                    <MenuItem value="Restricted">Restricted</MenuItem>
                    <MenuItem value="Classified">Classified</MenuItem>
                    <MenuItem value="Covert">Covert</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              
              <Box sx={{ width: '16.67%' }}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: '#cccccc' }}>Статус</InputLabel>
                  <Select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="gradient-select"
                  >
                    <MenuItem value="all">Все статусы</MenuItem>
                    <MenuItem value="active">Активен</MenuItem>
                    <MenuItem value="sold">Продан</MenuItem>
                    <MenuItem value="pending">В ожидании</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              
              <Box sx={{ width: '16.67%' }}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: '#cccccc' }}>Сортировка</InputLabel>
                  <Select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="gradient-select"
                  >
                    <MenuItem value="name">По названию</MenuItem>
                    <MenuItem value="price">По цене</MenuItem>
                    <MenuItem value="profit">По прибыли</MenuItem>
                    <MenuItem value="change">По изменению</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Grid>
          </CardContent>
        </Card>
      </motion.div>

      {/* Таблица предметов */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        {loading ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <LinearProgress className="gradient-progress" />
            <Typography sx={{ color: '#cccccc', mt: 2 }}>
              Загрузка инвентаря...
            </Typography>
          </Box>
        ) : (
          <Card className="glass-card">
            <CardContent>
              <TableContainer component={Paper} className="glass-table">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Предмет</TableCell>
                      <TableCell>Тип</TableCell>
                      <TableCell>Редкость</TableCell>
                      <TableCell>Цена</TableCell>
                      <TableCell>Изменение</TableCell>
                      <TableCell>Прибыль</TableCell>
                      <TableCell>Float</TableCell>
                      <TableCell>Статус</TableCell>
                      <TableCell>Действия</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sortedItems.map((item) => (
                      <TableRow key={item.id} hover>
                        <TableCell>
                          <Box>
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                              {item.name}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#cccccc' }}>
                              {item.wear}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={item.type} 
                            size="small"
                            sx={{ backgroundColor: '#374151', color: '#ffffff' }}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={item.rarity} 
                            size="small"
                            sx={{ 
                              backgroundColor: getRarityColor(item.rarity),
                              color: '#ffffff',
                              fontWeight: 600
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {item.price.toLocaleString()} ₽
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {item.change >= 0 ? (
                              <TrendingUpIcon sx={{ color: '#10b981', fontSize: 16 }} />
                            ) : (
                              <TrendingDownIcon sx={{ color: '#ef4444', fontSize: 16 }} />
                            )}
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                color: item.change >= 0 ? '#10b981' : '#ef4444',
                                fontWeight: 600
                              }}
                            >
                              {item.change >= 0 ? '+' : ''}{item.change}%
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: item.profit >= 0 ? '#10b981' : '#ef4444',
                              fontWeight: 600
                            }}
                          >
                            {item.profit >= 0 ? '+' : ''}{item.profit.toLocaleString()} ₽
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ color: '#cccccc' }}>
                            {item.float.toFixed(3)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={getStatusText(item.status)} 
                            size="small"
                            sx={{ 
                              backgroundColor: getStatusColor(item.status),
                              color: '#ffffff',
                              fontWeight: 600
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Tooltip title="Просмотр">
                              <IconButton size="small" sx={{ color: '#3b82f6' }}>
                                <VisibilityIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Редактировать">
                              <IconButton size="small" sx={{ color: '#f59e0b' }}>
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Удалить">
                              <IconButton size="small" sx={{ color: '#ef4444' }}>
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              
              {sortedItems.length === 0 && (
                <Alert severity="info" className="gradient-alert" sx={{ mt: 2 }}>
                  Предметы не найдены. Попробуйте изменить фильтры.
                </Alert>
              )}
            </CardContent>
          </Card>
        )}
      </motion.div>
    </Box>
  );
};

export default Inventory;
