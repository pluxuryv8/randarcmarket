import express from 'express';
import fs from 'fs';
import path from 'path';

const router = express.Router();

// Загрузка данных скинов
const loadSkinsData = () => {
  try {
    const skinsPath = path.join(__dirname, '../../skins.json');
    const skinsData = fs.readFileSync(skinsPath, 'utf8');
    return JSON.parse(skinsData);
  } catch (error) {
    console.error('Ошибка загрузки данных скинов:', error);
    return [];
  }
};

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
  const sources = ['steam', 'telegram', 'nft'];
  return sources[Math.floor(Math.random() * sources.length)];
};

// Генерация редкости
const generateRarity = () => {
  const rarities = ['Consumer Grade', 'Industrial Grade', 'Mil-Spec Grade', 'Restricted', 'Classified', 'Covert', 'Contraband'];
  return rarities[Math.floor(Math.random() * rarities.length)];
};

// Генерация float
const generateFloat = () => {
  return Math.random();
};

// Получение случайного скина
const getRandomSkin = (skins: any[]) => {
  return skins[Math.floor(Math.random() * skins.length)];
};

// Генерация сигналов радара
const generateRadarSignals = (count: number = 10) => {
  const skins = loadSkinsData();
  const signals = [];

  for (let i = 0; i < count; i++) {
    const skin = getRandomSkin(skins);
    const price = generateRandomPrice(100, 2000);
    const change = generatePriceChange();
    const volume = generateVolume();
    const confidence = generateConfidence();
    const type = generateSignalType();
    const source = generateSource();
    const rarity = generateRarity();
    const float = generateFloat();

    signals.push({
      id: `signal_${Date.now()}_${i}`,
      type,
      asset: skin.name || `Skin ${i + 1}`,
      price: Math.round(price * 100) / 100,
      change: Math.round(change * 100) / 100,
      volume: Math.round(volume),
      confidence: Math.round(confidence * 10) / 10,
      timestamp: new Date(Date.now() - Math.random() * 3600000).toISOString(),
      status: 'active',
      source,
      rarity,
      float: Math.round(float * 1000) / 1000
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
const generateMarketData = () => {
  const popularSkins = [
    'AK-47 | Redline',
    'AWP | Dragon Lore',
    'M4A4 | Howl',
    'Karambit | Fade',
    'Butterfly Knife | Crimson Web'
  ];

  return popularSkins.map((skin, index) => ({
    symbol: skin,
    currentPrice: Math.round((Math.random() * 1000 + 100) * 100) / 100,
    change24h: Math.round((Math.random() - 0.5) * 20 * 100) / 100,
    volume24h: Math.round(Math.random() * 1000000 + 100000),
    marketCap: Math.round(Math.random() * 10000000 + 1000000),
    trend: Math.random() > 0.5 ? 'up' : 'down'
  }));
};

// Генерация уведомлений
const generateNotifications = () => {
  const notifications = [
    'Радар нашел выгодное предложение: AK-47 | Redline за 1500₽',
    'Авто-продажа выполнена: +250₽ прибыли',
    'Депозит пополнен на 500₽',
    'Новый скин добавлен в инвентарь',
    'Сбор за хранение: -5₽'
  ];

  return notifications.slice(0, 3).map((message, index) => ({
    id: index + 1,
    message,
    timestamp: new Date(Date.now() - Math.random() * 3600000).toISOString(),
    type: 'info'
  }));
};

// Генерация аналитики
const generateAnalytics = () => {
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
      mostProfitableAsset: 'AK-47 | Redline',
      leastProfitableAsset: 'M4A4 | Desert Storm'
    },
    marketInsights: {
      volatility: Math.round((Math.random() * 30 + 20) * 10) / 10,
      trendStrength: Math.round((Math.random() * 40 + 60) * 10) / 10,
      marketSentiment: Math.random() > 0.5 ? 'bullish' : 'bearish',
      topPerformingAssets: ['AK-47 | Redline', 'AWP | Dragon Lore', 'M4A4 | Howl']
    }
  };
};

// Основной эндпоинт радара
router.get('/', (req, res) => {
  const signals = generateRadarSignals(15);
  const stats = generateRadarStats();
  
  res.json({
    signals,
    ...stats
  });
});

// Рыночные данные
router.get('/market-data', (req, res) => {
  const marketData = generateMarketData();
  res.json(marketData);
});

// Уведомления
router.get('/notifications', (req, res) => {
  const notifications = generateNotifications();
  res.json(notifications);
});

// Статистика
router.get('/stats', (req, res) => {
  const stats = generateRadarStats();
  res.json(stats);
});

// История сигналов
router.get('/history', (req, res) => {
  const signals = generateRadarSignals(50).map(signal => ({
    ...signal,
    profit: Math.round((Math.random() - 0.5) * 500 * 100) / 100,
    loss: Math.round(Math.random() * 200 * 100) / 100
  }));
  
  res.json({ signals });
});

// Аналитика
router.get('/analytics', (req, res) => {
  const analytics = generateAnalytics();
  res.json(analytics);
});

// Фильтры
router.get('/filters', (req, res) => {
  res.json({
    categories: ['skins', 'telegram', 'nft'],
    priceRanges: [
      { label: 'До 500₽', value: [0, 500] },
      { label: '500-1000₽', value: [500, 1000] },
      { label: '1000-2000₽', value: [1000, 2000] },
      { label: 'Более 2000₽', value: [2000, 10000] }
    ],
    rarities: ['Consumer Grade', 'Industrial Grade', 'Mil-Spec Grade', 'Restricted', 'Classified', 'Covert', 'Contraband'],
    sources: ['steam', 'telegram', 'nft']
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
  console.log(`Покупка предмета ${signalId} за ${price}₽`);
  
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
