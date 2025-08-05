import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  Alert,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Warning,
  Refresh,
  Download
} from '@mui/icons-material';
import { motion } from 'framer-motion';

interface RadarSignal {
  id: string;
  type: 'buy' | 'sell' | 'alert';
  asset: string;
  price: number;
  change: number;
  volume: number;
  confidence: number;
  timestamp: Date;
  status: 'active' | 'completed' | 'failed';
}

const RadarPage: React.FC = () => {
  const [signals, setSignals] = useState<RadarSignal[]>([]);
  const [loading, setLoading] = useState(false);

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

  // Загрузка начальных данных
  useEffect(() => {
    fetchSignals();
    const interval = setInterval(fetchSignals, 10000);
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

  const exportSignals = () => {
    const csvContent = [
      ['ID', 'Тип', 'Актив', 'Цена', 'Изменение', 'Объем', 'Уверенность', 'Время'],
      ...signals.map(signal => [
        signal.id,
        signal.type,
        signal.asset,
        signal.price.toString(),
        signal.change.toString(),
        signal.volume.toString(),
        signal.confidence.toString(),
        signal.timestamp.toLocaleString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `radar_signals_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h3" sx={{ 
              fontWeight: 900, 
              background: 'linear-gradient(45deg, #8B0000, #DC2626)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 1
            }}>
              📊 История сигналов
            </Typography>
            <Typography variant="h6" sx={{ color: '#cccccc' }}>
              Детальный анализ торговых сигналов
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<Download />}
              onClick={exportSignals}
              sx={{
                borderColor: '#8B0000',
                color: '#ffffff',
                '&:hover': { borderColor: '#DC2626', backgroundColor: 'rgba(139, 0, 0, 0.1)' }
              }}
            >
              Экспорт
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
          </Box>
        </Box>
      </motion.div>

      {/* Статистика */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1 }}
      >
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {[
            { label: 'Всего сигналов', value: signals.length, color: '#2196f3' },
            { label: 'Покупки', value: signals.filter(s => s.type === 'buy').length, color: '#4caf50' },
            { label: 'Продажи', value: signals.filter(s => s.type === 'sell').length, color: '#f44336' },
            { label: 'Предупреждения', value: signals.filter(s => s.type === 'alert').length, color: '#ff9800' }
          ].map((stat, index) => (
            <Box sx={{ width: '25%' }} key={index}>
              <Card sx={{ 
                background: 'rgba(0, 0, 0, 0.8)', 
                border: '1px solid rgba(139, 0, 0, 0.3)',
                backdropFilter: 'blur(10px)',
                textAlign: 'center'
              }}>
                <CardContent>
                  <Typography variant="h4" sx={{ color: stat.color, fontWeight: 'bold' }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#cccccc' }}>
                    {stat.label}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Grid>
      </motion.div>

      {/* Таблица сигналов */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <Card sx={{ 
          background: 'rgba(0, 0, 0, 0.8)', 
          border: '1px solid rgba(139, 0, 0, 0.3)',
          backdropFilter: 'blur(10px)'
        }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 3, color: '#ffffff' }}>
              📋 Список всех сигналов ({signals.length})
            </Typography>
            
            {loading && <LinearProgress sx={{ mb: 2 }} />}
            
            <TableContainer component={Paper} sx={{ background: 'transparent' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: '#cccccc', fontWeight: 'bold' }}>Тип</TableCell>
                    <TableCell sx={{ color: '#cccccc', fontWeight: 'bold' }}>Актив</TableCell>
                    <TableCell sx={{ color: '#cccccc', fontWeight: 'bold' }}>Цена</TableCell>
                    <TableCell sx={{ color: '#cccccc', fontWeight: 'bold' }}>Изменение</TableCell>
                    <TableCell sx={{ color: '#cccccc', fontWeight: 'bold' }}>Объем</TableCell>
                    <TableCell sx={{ color: '#cccccc', fontWeight: 'bold' }}>Уверенность</TableCell>
                    <TableCell sx={{ color: '#cccccc', fontWeight: 'bold' }}>Время</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {signals.map((signal) => (
                    <TableRow key={signal.id} sx={{ '&:hover': { backgroundColor: 'rgba(139, 0, 0, 0.1)' } }}>
                      <TableCell>
                        <Chip
                          icon={getSignalIcon(signal.type)}
                          label={signal.type.toUpperCase()}
                          sx={{
                            backgroundColor: getSignalColor(signal.type),
                            color: '#ffffff',
                            fontWeight: 'bold'
                          }}
                          size="small"
                        />
                      </TableCell>
                      <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>
                        {signal.asset}
                      </TableCell>
                      <TableCell sx={{ color: '#ffffff' }}>
                        ${signal.price.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: signal.change >= 0 ? '#4caf50' : '#f44336',
                            fontWeight: 'bold'
                          }}
                        >
                          {signal.change >= 0 ? '+' : ''}{signal.change.toFixed(2)}%
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ color: '#cccccc' }}>
                        ${(signal.volume / 1000).toFixed(0)}K
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography variant="body2" sx={{ color: '#cccccc', mr: 1 }}>
                            {signal.confidence.toFixed(1)}%
                          </Typography>
                          <LinearProgress 
                            variant="determinate" 
                            value={signal.confidence}
                            sx={{
                              width: 60,
                              height: 6,
                              borderRadius: 3,
                              backgroundColor: 'rgba(255, 255, 255, 0.1)',
                              '& .MuiLinearProgress-bar': {
                                backgroundColor: getSignalColor(signal.type)
                              }
                            }}
                          />
                        </Box>
                      </TableCell>
                      <TableCell sx={{ color: '#cccccc' }}>
                        {new Date(signal.timestamp).toLocaleTimeString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            
            {signals.length === 0 && (
              <Alert severity="info" sx={{ mt: 2 }}>
                Нет сигналов для отображения
              </Alert>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </Box>
  );
};

export default RadarPage;
