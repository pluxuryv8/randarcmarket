import express from 'express';

const router = express.Router();

// Демо данные пользователя
const userProfile = {
  id: 1,
  username: 'randar_user',
  steamId: '7656119xxxxxxx',
  balance: 1543.75,
  avatar: 'https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/avatars/cc/cc3d9dffb0cc1453d2b5d400f3b3e91be8b81f55_full.jpg',
  level: 42,
  reputation: 95,
  joinDate: '2023-01-15',
  totalTrades: 156,
  successfulTrades: 148,
  itemsSold: 89,
  itemsBought: 67,
  email: 'user@example.com',
  phone: '+7 (999) 123-45-67',
  country: 'Россия',
  timezone: 'Europe/Moscow',
  twoFactorEnabled: true,
  lastLogin: '2024-08-05T14:30:00Z',
  lastLoginIp: '192.168.1.100'
};

// GET /api/profile - получить профиль пользователя
router.get('/profile', (req, res) => {
  try {
    res.json(userProfile);
  } catch (error) {
    console.error('Ошибка получения профиля:', error);
    res.status(500).json({ error: 'Ошибка загрузки профиля' });
  }
});

// GET /api/profile/activity - получить активность пользователя
router.get('/profile/activity', (req, res) => {
  try {
    const activity = [
      { 
        id: 1,
        action: 'Продал AK-47 | Asiimov', 
        amount: '+$45.20', 
        time: '2024-08-05T12:30:00Z', 
        type: 'sell',
        itemId: 'skin-123',
        itemName: 'AK-47 | Asiimov'
      },
      { 
        id: 2,
        action: 'Купил M4A4 | Howl', 
        amount: '-$120.50', 
        time: '2024-08-04T15:20:00Z', 
        type: 'buy',
        itemId: 'skin-456',
        itemName: 'M4A4 | Howl'
      },
      { 
        id: 3,
        action: 'Обмен AWP | Dragon Lore', 
        amount: 'Обмен', 
        time: '2024-08-02T10:15:00Z', 
        type: 'trade',
        itemId: 'skin-789',
        itemName: 'AWP | Dragon Lore'
      },
      { 
        id: 4,
        action: 'Пополнение баланса', 
        amount: '+$200.00', 
        time: '2024-07-29T16:45:00Z', 
        type: 'deposit',
        itemId: null,
        itemName: null
      },
      { 
        id: 5,
        action: 'Продал AWP | Lightning Strike', 
        amount: '+$78.90', 
        time: '2024-07-28T09:30:00Z', 
        type: 'sell',
        itemId: 'skin-101',
        itemName: 'AWP | Lightning Strike'
      }
    ];
    
    res.json(activity);
  } catch (error) {
    console.error('Ошибка получения активности:', error);
    res.status(500).json({ error: 'Ошибка загрузки активности' });
  }
});

// GET /api/profile/stats - получить статистику пользователя
router.get('/profile/stats', (req, res) => {
  try {
    const stats = {
      totalTrades: userProfile.totalTrades,
      successfulTrades: userProfile.successfulTrades,
      itemsSold: userProfile.itemsSold,
      itemsBought: userProfile.itemsBought,
      successRate: Math.round((userProfile.successfulTrades / userProfile.totalTrades) * 100),
      totalValue: 15430.75,
      monthlyEarnings: 2340.50,
      favoriteWeapon: 'AK-47',
      mostTradedSkin: 'AK-47 | Redline'
    };
    
    res.json(stats);
  } catch (error) {
    console.error('Ошибка получения статистики:', error);
    res.status(500).json({ error: 'Ошибка загрузки статистики' });
  }
});

// PUT /api/profile - обновить профиль пользователя
router.put('/profile', (req, res) => {
  try {
    const { username, email, phone, country } = req.body;
    
    // В реальном приложении здесь была бы валидация и сохранение в БД
    console.log('Обновление профиля:', { username, email, phone, country });
    
    res.json({ 
      message: 'Профиль успешно обновлен',
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Ошибка обновления профиля:', error);
    res.status(500).json({ error: 'Ошибка обновления профиля' });
  }
});

// POST /api/profile/balance/deposit - пополнение баланса
router.post('/profile/balance/deposit', (req, res) => {
  try {
    const { amount, method } = req.body;
    
    // В реальном приложении здесь была бы интеграция с платежной системой
    console.log('Пополнение баланса:', { amount, method });
    
    const newBalance = userProfile.balance + parseFloat(amount);
    
    res.json({ 
      message: 'Баланс успешно пополнен',
      newBalance: newBalance,
      transactionId: `TXN-${Date.now()}`,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Ошибка пополнения баланса:', error);
    res.status(500).json({ error: 'Ошибка пополнения баланса' });
  }
});

// GET /api/profile/security - получить информацию о безопасности
router.get('/profile/security', (req, res) => {
  try {
    const security = {
      twoFactorEnabled: userProfile.twoFactorEnabled,
      lastLogin: userProfile.lastLogin,
      lastLoginIp: userProfile.lastLoginIp,
      loginHistory: [
        { date: '2024-08-05T14:30:00Z', ip: '192.168.1.100', location: 'Москва, Россия' },
        { date: '2024-08-04T09:15:00Z', ip: '192.168.1.100', location: 'Москва, Россия' },
        { date: '2024-08-03T16:45:00Z', ip: '192.168.1.100', location: 'Москва, Россия' }
      ],
      activeSessions: 1,
      passwordLastChanged: '2024-01-15T10:00:00Z'
    };
    
    res.json(security);
  } catch (error) {
    console.error('Ошибка получения информации о безопасности:', error);
    res.status(500).json({ error: 'Ошибка загрузки информации о безопасности' });
  }
});

export default router; 