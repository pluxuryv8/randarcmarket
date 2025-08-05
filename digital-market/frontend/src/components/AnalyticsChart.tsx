import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  LinearProgress,
  Chip
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  ShowChart,
  Analytics,
  Timeline,
  Assessment
} from '@mui/icons-material';
import { motion } from 'framer-motion';

interface AnalyticsData {
  performance: {
    totalSignals: number;
    successfulTrades: number;
    failedTrades: number;
    accuracy: number;
    totalProfit: number;
    averageProfit: number;
  };
  trends: {
    buySignals: number;
    sellSignals: number;
    alertSignals: number;
    mostProfitableAsset: string;
    leastProfitableAsset: string;
  };
  marketInsights: {
    volatility: number;
    trendStrength: number;
    marketSentiment: 'bullish' | 'bearish';
    topPerformingAssets: string[];
  };
}

interface AnalyticsChartProps {
  data: AnalyticsData;
}

const AnalyticsChart: React.FC<AnalyticsChartProps> = ({ data }) => {
  const getSentimentColor = (sentiment: string) => {
    return sentiment === 'bullish' ? '#4caf50' : '#f44336';
  };

  const getSentimentIcon = (sentiment: string) => {
    return sentiment === 'bullish' ? <TrendingUp /> : <TrendingDown />;
  };

  return (
    <Box sx={{ padding: '20px' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Typography variant="h4" sx={{ 
          mb: 4, 
          color: '#ffffff',
          textAlign: 'center',
          fontWeight: 'bold'
        }}>
          📊 Аналитика производительности
        </Typography>
      </motion.div>

      <Grid container spacing={3}>
        {/* Производительность */}
        <Box sx={{ width: '100%', md: '50%' }}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Card sx={{ 
              background: 'rgba(0, 0, 0, 0.8)', 
              border: '1px solid rgba(139, 0, 0, 0.3)',
              backdropFilter: 'blur(10px)',
              height: '100%'
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Assessment sx={{ color: '#8B0000', mr: 2, fontSize: 30 }} />
                  <Typography variant="h6" sx={{ color: '#ffffff' }}>
                    Производительность
                  </Typography>
                </Box>

                <Grid container spacing={2}>
                  <Box sx={{ width: '50%' }}>
                    <Box sx={{ textAlign: 'center', mb: 2 }}>
                      <Typography variant="h4" sx={{ color: '#4caf50', fontWeight: 'bold' }}>
                        {data.performance.totalSignals}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#cccccc' }}>
                        Всего сигналов
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ width: '50%' }}>
                    <Box sx={{ textAlign: 'center', mb: 2 }}>
                      <Typography variant="h4" sx={{ color: '#2196f3', fontWeight: 'bold' }}>
                        {data.performance.successfulTrades}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#cccccc' }}>
                        Успешных сделок
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ width: '100%' }}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" sx={{ color: '#cccccc', mb: 1 }}>
                        Точность: {data.performance.accuracy}%
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={data.performance.accuracy}
                        sx={{
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          height: 8,
                          borderRadius: 4,
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: '#4caf50'
                          }
                        }}
                      />
                    </Box>
                  </Box>
                  
                  <Box sx={{ width: '50%' }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h5" sx={{ color: '#ff9800', fontWeight: 'bold' }}>
                        ${data.performance.totalProfit.toFixed(2)}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#cccccc' }}>
                        Общая прибыль
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ width: '50%' }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h5" sx={{ color: '#9c27b0', fontWeight: 'bold' }}>
                        ${data.performance.averageProfit.toFixed(2)}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#cccccc' }}>
                        Средняя прибыль
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </CardContent>
            </Card>
          </motion.div>
        </Box>

        {/* Тренды */}
        <Box sx={{ width: '100%', md: '50%' }}>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Card sx={{ 
              background: 'rgba(0, 0, 0, 0.8)', 
              border: '1px solid rgba(139, 0, 0, 0.3)',
              backdropFilter: 'blur(10px)',
              height: '100%'
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Timeline sx={{ color: '#8B0000', mr: 2, fontSize: 30 }} />
                  <Typography variant="h6" sx={{ color: '#ffffff' }}>
                    Тренды сигналов
                  </Typography>
                </Box>

                <Grid container spacing={2}>
                  <Box sx={{ width: '33.33%' }}>
                    <Box sx={{ textAlign: 'center', mb: 2 }}>
                      <Typography variant="h4" sx={{ color: '#4caf50', fontWeight: 'bold' }}>
                        {data.trends.buySignals}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#cccccc' }}>
                        Покупка
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ width: '33.33%' }}>
                    <Box sx={{ textAlign: 'center', mb: 2 }}>
                      <Typography variant="h4" sx={{ color: '#f44336', fontWeight: 'bold' }}>
                        {data.trends.sellSignals}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#cccccc' }}>
                        Продажа
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ width: '33.33%' }}>
                    <Box sx={{ textAlign: 'center', mb: 2 }}>
                      <Typography variant="h4" sx={{ color: '#ff9800', fontWeight: 'bold' }}>
                        {data.trends.alertSignals}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#cccccc' }}>
                        Предупреждения
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ width: '100%' }}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" sx={{ color: '#cccccc', mb: 1 }}>
                        Самый прибыльный актив:
                      </Typography>
                      <Chip 
                        label={data.trends.mostProfitableAsset}
                        sx={{ 
                          backgroundColor: '#4caf50',
                          color: '#ffffff',
                          fontWeight: 'bold'
                        }}
                      />
                    </Box>
                  </Box>
                  
                  <Box sx={{ width: '100%' }}>
                    <Box>
                      <Typography variant="body2" sx={{ color: '#cccccc', mb: 1 }}>
                        Наименее прибыльный актив:
                      </Typography>
                      <Chip 
                        label={data.trends.leastProfitableAsset}
                        sx={{ 
                          backgroundColor: '#f44336',
                          color: '#ffffff',
                          fontWeight: 'bold'
                        }}
                      />
                    </Box>
                  </Box>
                </Grid>
              </CardContent>
            </Card>
          </motion.div>
        </Box>

        {/* Рыночные инсайты */}
        <Box sx={{ width: '100%' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Card sx={{ 
              background: 'rgba(0, 0, 0, 0.8)', 
              border: '1px solid rgba(139, 0, 0, 0.3)',
              backdropFilter: 'blur(10px)'
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <ShowChart sx={{ color: '#8B0000', mr: 2, fontSize: 30 }} />
                  <Typography variant="h6" sx={{ color: '#ffffff' }}>
                    Рыночные инсайты
                  </Typography>
                </Box>

                <Grid container spacing={3}>
                  <Box sx={{ width: '100%', md: '33.33%' }}>
                    <Box sx={{ textAlign: 'center', mb: 2 }}>
                      <Typography variant="h4" sx={{ color: '#ff9800', fontWeight: 'bold' }}>
                        {data.marketInsights.volatility}%
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#cccccc' }}>
                        Волатильность рынка
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ width: '100%', md: '33.33%' }}>
                    <Box sx={{ textAlign: 'center', mb: 2 }}>
                      <Typography variant="h4" sx={{ color: '#2196f3', fontWeight: 'bold' }}>
                        {data.marketInsights.trendStrength}%
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#cccccc' }}>
                        Сила тренда
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ width: '100%', md: '33.33%' }}>
                    <Box sx={{ textAlign: 'center', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                        {getSentimentIcon(data.marketInsights.marketSentiment)}
                      </Box>
                      <Chip 
                        label={data.marketInsights.marketSentiment === 'bullish' ? 'Бычий рынок' : 'Медвежий рынок'}
                        sx={{ 
                          backgroundColor: getSentimentColor(data.marketInsights.marketSentiment),
                          color: '#ffffff',
                          fontWeight: 'bold'
                        }}
                      />
                    </Box>
                  </Box>
                  
                  <Box sx={{ width: '100%' }}>
                    <Box>
                      <Typography variant="body2" sx={{ color: '#cccccc', mb: 2 }}>
                        Топ-3 прибыльных актива:
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {data.marketInsights.topPerformingAssets.map((asset, index) => (
                          <Chip 
                            key={asset}
                            label={asset}
                            sx={{ 
                              backgroundColor: `hsl(${120 + index * 30}, 70%, 50%)`,
                              color: '#ffffff',
                              fontWeight: 'bold'
                            }}
                          />
                        ))}
                      </Box>
                    </Box>
                  </Box>
                </Grid>
              </CardContent>
            </Card>
          </motion.div>
        </Box>
      </Grid>
    </Box>
  );
};

export default AnalyticsChart; 