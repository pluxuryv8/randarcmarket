import express from 'express';
import { TonGiftsProvider } from '../../providers/ton';

const router = express.Router();
const giftsProvider = new TonGiftsProvider();

// Генерация случайной цены
const generateRandomPrice = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
};

// Генерация изменения цены
const generatePriceChange = () => {
  return (Math.random() - 0.5) * 20; // -10% до +10%
};

// Генерация объема
const generateVolume = () => {
  return Math.random() * 1000000 + 10000;
};

// Генерация уверенности
const generateConfidence = () => {
  return Math.random() * 40 + 60; // 60-100%
};

// Генерация типа сигнала
const generateSignalType = () => {
  const types = ['buy', 'sell', 'alert'];
  return types[Math.floor(Math.random() * types.length)];
};

// Генерация источника
const generateSource = () => {
  const sources = ['telegram', 'nft'];
  return sources[Math.floor(Math.random() * sources.length)];
};

// Генерация редкости
const generateRarity = () => {
  const rarities = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'];
  return rarities[Math.floor(Math.random() * rarities.length)];
};

// Получение случайного gift
const getRandomGift = async () => {
  try {
    const items = await giftsProvider.getItems({ limit: 100 });
    if (items.items.length > 0) {
      return items.items[Math.floor(Math.random() * items.items.length)];
    }
    return null;
  } catch (error) {
    console.error('Error getting random gift:', error);
    return null;
  }
};

// Генерация сигналов радара
const generateRadarSignals = async (count: number = 10) => {
  const signals = [];

  for (let i = 0; i < count; i++) {
    const gift = await getRandomGift();
    const price = generateRandomPrice(1, 100); // TON цены
    const change = generatePriceChange();
    const volume = generateVolume();
    const confidence = generateConfidence();
    const type = generateSignalType();
    const source = generateSource();
    const rarity = generateRarity();

    signals.push({
      id: `signal_${Date.now()}_${i}`,
      type,
      asset: gift?.title || `Gift ${i + 1}`,
      price: Math.round(price * 100) / 100,
      change: Math.round(change * 100) / 100,
      volume: Math.round(volume),
      confidence: Math.round(confidence * 10) / 10,
      timestamp: new Date(Date.now() - Math.random() * 3600000).toISOString(),
      status: 'active',
      source,
      rarity,
      address: gift?.address
    });
  }

  return signals;
};

// Генерация статистики радара
const generateRadarStats = () => {
  return {
    totalSignals: Math.floor(Math.random() * 100) + 50,
    activeSignals: Math.floor(Math.random() * 20) + 10,
    successfulTrades: Math.floor(Math.random() * 30) + 20,
    accuracy: Math.round((Math.random() * 20 + 80) * 10) / 10,
    profit: Math.round((Math.random() * 1000 + 500) * 100) / 100,
    deposit: 1000,
    autoSellEnabled: Math.random() > 0.5,
    holdFee: 0.05
  };
};

// Генерация рыночных данных
const generateMarketData = async () => {
  try {
    const collections = await giftsProvider.getCollections({ limit: 5 });
    return collections.map((collection) => ({
      symbol: collection.title,
      currentPrice: collection.floor,
      change24h: Math.round((Math.random() - 0.5) * 20 * 100) / 100,
      volume24h: collection.volume24h,
      marketCap: collection.supply * collection.floor,
      trend: Math.random() > 0.5 ? 'up' : 'down'
    }));
  } catch (error) {
    console.error('Error generating market data:', error);
    return [];
  }
};

// Генерация уведомлений
const generateNotifications = async () => {
  try {
    const items = await giftsProvider.getItems({ limit: 3 });
    const notifications = items.items.map((item, index) => ({
      id: index + 1,
      message: `Радар нашел выгодное предложение: ${item.title} за ${item.price} TON`,
      timestamp: new Date(Date.now() - Math.random() * 3600000).toISOString(),
      type: 'info'
    }));
    return notifications;
  } catch (error) {
    console.error('Error generating notifications:', error);
    return [];
  }
};

// Генерация аналитики
const generateAnalytics = async () => {
  try {
    const collections = await giftsProvider.getCollections({ limit: 3 });
    const topAssets = collections.map(c => c.title);
    
    return {
      performance: {
        totalSignals: Math.floor(Math.random() * 100) + 50,
        successfulTrades: Math.floor(Math.random() * 30) + 20,
        failedTrades: Math.floor(Math.random() * 10) + 5,
        accuracy: Math.round((Math.random() * 20 + 80) * 10) / 10,
        totalProfit: Math.round((Math.random() * 2000 + 1000) * 100) / 100,
        averageProfit: Math.round((Math.random() * 200 + 100) * 100) / 100
      },
      trends: {
        buySignals: Math.floor(Math.random() * 40) + 20,
        sellSignals: Math.floor(Math.random() * 30) + 15,
        alertSignals: Math.floor(Math.random() * 20) + 10,
        mostProfitableAsset: topAssets[0] || 'Unknown Gift',
        leastProfitableAsset: topAssets[topAssets.length - 1] || 'Unknown Gift'
      },
      marketInsights: {
        volatility: Math.round((Math.random() * 30 + 20) * 10) / 10,
        trendStrength: Math.round((Math.random() * 40 + 60) * 10) / 10,
        marketSentiment: Math.random() > 0.5 ? 'bullish' : 'bearish',
        topPerformingAssets: topAssets
      }
    };
  } catch (error) {
    console.error('Error generating analytics:', error);
    return {
      performance: { totalSignals: 0, successfulTrades: 0, failedTrades: 0, accuracy: 0, totalProfit: 0, averageProfit: 0 },
      trends: { buySignals: 0, sellSignals: 0, alertSignals: 0, mostProfitableAsset: 'Unknown', leastProfitableAsset: 'Unknown' },
      marketInsights: { volatility: 0, trendStrength: 0, marketSentiment: 'neutral', topPerformingAssets: [] }
    };
  }
};

// Основной эндпоинт радара
router.get('/', async (req, res) => {
  try {
    const signals = await generateRadarSignals(15);
    const stats = generateRadarStats();
    
    res.json({
      signals,
      ...stats
    });
  } catch (error) {
    console.error('Error in radar endpoint:', error);
    res.status(500).json({ error: 'Failed to generate radar data' });
  }
});

// Рыночные данные
router.get('/market-data', async (req, res) => {
  try {
    const marketData = await generateMarketData();
    res.json(marketData);
  } catch (error) {
    console.error('Error in market-data endpoint:', error);
    res.status(500).json({ error: 'Failed to generate market data' });
  }
});

// Уведомления
router.get('/notifications', async (req, res) => {
  try {
    const notifications = await generateNotifications();
    res.json(notifications);
  } catch (error) {
    console.error('Error in notifications endpoint:', error);
    res.status(500).json({ error: 'Failed to generate notifications' });
  }
});

// Статистика
router.get('/stats', (req, res) => {
  const stats = generateRadarStats();
  res.json(stats);
});

// История сигналов
router.get('/history', async (req, res) => {
  const signals = await generateRadarSignals(50);
  const signalsWithStats = signals.map(signal => ({
    ...signal,
    profit: Math.round((Math.random() - 0.5) * 500 * 100) / 100,
    loss: Math.round(Math.random() * 200 * 100) / 100
  }));
  
  res.json({ signals: signalsWithStats });
});

// Аналитика
router.get('/analytics', (req, res) => {
  const analytics = generateAnalytics();
  res.json(analytics);
});

// Фильтры
router.get('/filters', (req, res) => {
  res.json({
    categories: ['telegram', 'nft'],
    priceRanges: [
      { label: 'До 5 TON', value: [0, 5] },
      { label: '5-10 TON', value: [5, 10] },
      { label: '10-50 TON', value: [10, 50] },
      { label: 'Более 50 TON', value: [50, 1000] }
    ],
    rarities: ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'],
    sources: ['telegram', 'nft']
  });
});

// Запуск радара
router.post('/start', (req, res) => {
  const settings = req.body;
  console.log('Запуск радара с настройками:', settings);
  
  res.json({
    success: true,
    message: 'Радар успешно запущен',
    settings
  });
});

// Остановка радара
router.post('/stop', (req, res) => {
  console.log('Остановка радара');
  
  res.json({
    success: true,
    message: 'Радар остановлен'
  });
});

// Покупка предмета
router.post('/buy', (req, res) => {
  const { signalId, price } = req.body;
  console.log(`Покупка предмета ${signalId} за ${price} TON`);
  
  res.json({
    success: true,
    message: 'Покупка выполнена успешно',
    transaction: {
      id: `tx_${Date.now()}`,
      signalId,
      price,
      timestamp: new Date().toISOString()
    }
  });
});

export default router;
