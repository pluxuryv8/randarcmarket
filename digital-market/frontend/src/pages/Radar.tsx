import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  Switch,
  FormControlLabel,
  Alert,
  LinearProgress,
  TextField,
  Slider,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Warning,
  PlayArrow,
  Stop,
  Refresh,
  AccountBalance,
  ShoppingCart,
  Settings,
  AutoGraph
} from '@mui/icons-material';
import { motion } from 'framer-motion';

interface RadarSignal {
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
}

interface RadarSettings {
  isActive: boolean;
  deposit: number;
  minPrice: number;
  maxPrice: number;
  categories: string[];
  autoSell: boolean;
  targetProfit: number;
  holdFee: number;
}

const Radar: React.FC = () => {
  const [signals, setSignals] = useState<RadarSignal[]>([]);
  const [settings, setSettings] = useState<RadarSettings>({
    isActive: false,
    deposit: 1000,
    minPrice: 100,
    maxPrice: 1000,
    categories: ['skins'],
    autoSell: false,
    targetProfit: 100,
    holdFee: 0.05
  });
  const [loading, setLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const API_BASE_URL = 'http://localhost:4001/api/radar';

  // Загрузка сигналов
  const fetchSignals = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}`);
      if (response.ok) {
        const data = await response.json();
        setSignals(data.signals.map((signal: any) => ({
          ...signal,
          timestamp: new Date(signal.timestamp)
        })));
      }
    } catch (error) {
      console.error('Ошибка загрузки сигналов:', error);
    } finally {
      setLoading(false);
    }
  };

  // Запуск/остановка радара
  const toggleRadar = async () => {
    try {
      const endpoint = settings.isActive ? 'stop' : 'start';
      const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(settings)
      });
      
      if (response.ok) {
        setSettings(prev => ({ ...prev, isActive: !prev.isActive }));
      }
    } catch (error) {
      console.error('Ошибка управления радаром:', error);
    }
  };

  // Обновление данных
  useEffect(() => {
    fetchSignals();
    const interval = setInterval(fetchSignals, 5000);
    return () => clearInterval(interval);
  }, []);

  const getSignalColor = (type: string) => {
    switch (type) {
      case 'buy': return '#4caf50';
      case 'sell': return '#f44336';
      case 'alert': return '#ff9800';
      default: return '#9e9e9e';
    }
  };

  const getSignalIcon = (type: string) => {
    switch (type) {
      case 'buy': return <TrendingUp />;
      case 'sell': return <TrendingDown />;
      case 'alert': return <Warning />;
      default: return <Warning />;
    }
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'steam': return '🎮';
      case 'telegram': return '📱';
      case 'nft': return '🖼️';
      default: return '❓';
    }
  };

  const filteredSignals = signals.filter(signal => 
    signal.price >= settings.minPrice && 
    signal.price <= settings.maxPrice
  );

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #000000 0%, #1a0000 50%, #000000 100%)',
      color: '#ffffff',
      padding: '20px'
    }}>
      {/* Заголовок */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h3" sx={{ 
            fontWeight: 900, 
            background: 'linear-gradient(45deg, #8B0000, #DC2626)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 2
          }}>
            🎯 Auto-Buy Radar
          </Typography>
          <Typography variant="h6" sx={{ color: '#cccccc', mb: 3 }}>
            Автоматический поиск и покупка выгодных предложений
          </Typography>
        </Box>
      </motion.div>

      {/* Статус и управление */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1 }}
      >
        <Card sx={{ 
          background: 'rgba(0, 0, 0, 0.8)', 
          border: '1px solid rgba(139, 0, 0, 0.3)',
          backdropFilter: 'blur(10px)',
          mb: 4
        }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Box>
                <Typography variant="h6" sx={{ color: '#ffffff', mb: 1 }}>
                  Статус радара
                </Typography>
                <Chip 
                  label={settings.isActive ? 'Активен' : 'Остановлен'}
                  sx={{ 
                    backgroundColor: settings.isActive ? '#4caf50' : '#f44336',
                    color: '#ffffff',
                    fontWeight: 'bold'
                  }}
                />
              </Box>
              
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Button
                  variant="outlined"
                  startIcon={<Settings />}
                  onClick={() => setShowSettings(!showSettings)}
                  sx={{
                    borderColor: '#8B0000',
                    color: '#ffffff',
                    '&:hover': { borderColor: '#DC2626', backgroundColor: 'rgba(139, 0, 0, 0.1)' }
                  }}
                >
                  Настройки
                </Button>
                
                <Button
                  variant="outlined"
                  startIcon={<Refresh />}
                  onClick={fetchSignals}
                  disabled={loading}
                  sx={{
                    borderColor: '#8B0000',
                    color: '#ffffff',
                    '&:hover': { borderColor: '#DC2626', backgroundColor: 'rgba(139, 0, 0, 0.1)' }
                  }}
                >
                  Обновить
                </Button>
                
                <Button
                  variant="contained"
                  startIcon={settings.isActive ? <Stop /> : <PlayArrow />}
                  onClick={toggleRadar}
                  sx={{
                    backgroundColor: settings.isActive ? '#f44336' : '#4caf50',
                    '&:hover': { 
                      backgroundColor: settings.isActive ? '#d32f2f' : '#45a049' 
                    }
                  }}
                >
                  {settings.isActive ? 'Остановить' : 'Запустить'}
                </Button>
              </Box>
            </Box>

            {/* Депозит и статистика */}
            <Grid container spacing={3}>
              <Box sx={{ width: '50%' }}>
                <Box sx={{ textAlign: 'center' }}>
                  <AccountBalance sx={{ fontSize: 40, color: '#4caf50', mb: 1 }} />
                  <Typography variant="h5" sx={{ color: '#4caf50', fontWeight: 'bold' }}>
                    {settings.deposit.toLocaleString()} ₽
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#cccccc' }}>
                    Депозит
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ width: '50%' }}>
                <Box sx={{ textAlign: 'center' }}>
                  <ShoppingCart sx={{ fontSize: 40, color: '#2196f3', mb: 1 }} />
                  <Typography variant="h5" sx={{ color: '#2196f3', fontWeight: 'bold' }}>
                    {filteredSignals.length}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#cccccc' }}>
                    Найдено предложений
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid container spacing={3}>
              <Box sx={{ width: '50%' }}>
                <Box sx={{ textAlign: 'center' }}>
                  <AutoGraph sx={{ fontSize: 40, color: '#ff9800', mb: 1 }} />
                  <Typography variant="h5" sx={{ color: '#ff9800', fontWeight: 'bold' }}>
                    {settings.autoSell ? 'Включена' : 'Выключена'}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#cccccc' }}>
                    Авто-продажа
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ width: '50%' }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h5" sx={{ color: '#9c27b0', fontWeight: 'bold' }}>
                    {settings.holdFee}%
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#cccccc' }}>
                    Сбор за хранение
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </CardContent>
        </Card>
      </motion.div>

      {/* Настройки */}
      {showSettings && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card sx={{ 
            background: 'rgba(0, 0, 0, 0.8)', 
            border: '1px solid rgba(139, 0, 0, 0.3)',
            backdropFilter: 'blur(10px)',
            mb: 4
          }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3, color: '#ffffff' }}>
                ⚙️ Настройки радара
              </Typography>
              
              <Grid container spacing={3}>
                <Box sx={{ width: '50%' }}>
                  <TextField
                    fullWidth
                    label="Депозит (₽)"
                    type="number"
                    value={settings.deposit}
                    onChange={(e) => setSettings(prev => ({ ...prev, deposit: Number(e.target.value) }))}
                    sx={{ mb: 2 }}
                  />
                  
                  <Typography variant="body2" sx={{ color: '#cccccc', mb: 1 }}>
                    Диапазон цен: {settings.minPrice} - {settings.maxPrice} ₽
                  </Typography>
                  <Slider
                    value={[settings.minPrice, settings.maxPrice]}
                    onChange={(_, value) => setSettings(prev => ({ 
                      ...prev, 
                      minPrice: value[0], 
                      maxPrice: value[1] 
                    }))}
                    min={0}
                    max={5000}
                    sx={{ color: '#8B0000' }}
                  />
                </Box>
                
                <Box sx={{ width: '50%' }}>
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel sx={{ color: '#cccccc' }}>Категории</InputLabel>
                    <Select
                      multiple
                      value={settings.categories}
                      onChange={(e) => setSettings(prev => ({ 
                        ...prev, 
                        categories: typeof e.target.value === 'string' ? [e.target.value] : e.target.value 
                      }))}
                      sx={{ color: '#ffffff' }}
                    >
                      <MenuItem value="skins">CS:GO Скины</MenuItem>
                      <MenuItem value="telegram">Telegram Гивты</MenuItem>
                      <MenuItem value="nft">NFT</MenuItem>
                    </Select>
                  </FormControl>
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.autoSell}
                        onChange={(e) => setSettings(prev => ({ ...prev, autoSell: e.target.checked }))}
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': {
                            color: '#8B0000'
                          },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                            backgroundColor: '#8B0000'
                          }
                        }}
                      />
                    }
                    label="Авто-продажа"
                    sx={{ color: '#cccccc' }}
                  />
                  
                  {settings.autoSell && (
                    <TextField
                      fullWidth
                      label="Целевая прибыль (₽)"
                      type="number"
                      value={settings.targetProfit}
                      onChange={(e) => setSettings(prev => ({ ...prev, targetProfit: Number(e.target.value) }))}
                      sx={{ mt: 2 }}
                    />
                  )}
                </Box>
              </Grid>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Сигналы */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ color: '#ffffff', mb: 2 }}>
            🎯 Найденные предложения ({filteredSignals.length})
          </Typography>
          
          {loading && <LinearProgress sx={{ mb: 2 }} />}
        </Box>

        <Grid container spacing={2}>
          {filteredSignals.map((signal, index) => (
            <Box sx={{ width: '100%', md: '50%', lg: '33.33%' }} key={signal.id}>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card sx={{ 
                  background: 'rgba(0, 0, 0, 0.8)', 
                  border: `2px solid ${getSignalColor(signal.type)}`,
                  backdropFilter: 'blur(10px)',
                  height: '100%'
                }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Chip
                        icon={getSignalIcon(signal.type)}
                        label={signal.type === 'buy' ? 'ПОКУПКА' : signal.type === 'sell' ? 'ПРОДАЖА' : 'ВНИМАНИЕ'}
                        sx={{
                          backgroundColor: getSignalColor(signal.type),
                          color: '#ffffff',
                          fontWeight: 'bold'
                        }}
                        size="small"
                      />
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="caption" sx={{ color: '#cccccc' }}>
                          {getSourceIcon(signal.source)}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#cccccc' }}>
                          {new Date(signal.timestamp).toLocaleTimeString()}
                        </Typography>
                      </Box>
                    </Box>

                    <Typography variant="h5" sx={{ color: '#ffffff', fontWeight: 'bold', mb: 1 }}>
                      {signal.asset}
                    </Typography>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6" sx={{ color: '#ffffff' }}>
                        ${signal.price.toFixed(2)}
                      </Typography>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          color: signal.change >= 0 ? '#4caf50' : '#f44336',
                          fontWeight: 'bold'
                        }}
                      >
                        {signal.change >= 0 ? '+' : ''}{signal.change.toFixed(2)}%
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Typography variant="body2" sx={{ color: '#cccccc', mr: 1 }}>
                        Уверенность: {signal.confidence.toFixed(1)}%
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={signal.confidence}
                        sx={{
                          flexGrow: 1,
                          height: 6,
                          borderRadius: 3,
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: getSignalColor(signal.type)
                          }
                        }}
                      />
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Chip 
                        label={signal.rarity} 
                        size="small" 
                        sx={{ backgroundColor: '#666', color: '#fff' }}
                      />
                      <Typography variant="caption" sx={{ color: '#cccccc' }}>
                        Float: {signal.float.toFixed(3)}
                      </Typography>
                    </Box>

                    <Button
                      fullWidth
                      variant="contained"
                      sx={{
                        mt: 2,
                        backgroundColor: getSignalColor(signal.type),
                        '&:hover': { backgroundColor: getSignalColor(signal.type) }
                      }}
                    >
                      Купить за {signal.price.toFixed(2)} ₽
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </Box>
          ))}
        </Grid>

        {filteredSignals.length === 0 && (
          <Alert severity="info" sx={{ mt: 2 }}>
            {settings.isActive ? 'Поиск предложений...' : 'Радар остановлен. Запустите для поиска предложений.'}
          </Alert>
        )}
      </motion.div>
    </Box>
  );
};

export default Radar;
