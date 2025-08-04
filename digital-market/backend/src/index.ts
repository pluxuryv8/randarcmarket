import express from 'express';
import cors from 'cors';
import steamSchemaRouter from './steamSchema';
import path from 'path';

const app = express();
app.use(cors());
app.use(express.json());

// Маршрут схемы Steam
app.use('/steam/schema', steamSchemaRouter);

// Простой маршрут /inventory, отдаёт JSON инвентаря
app.get('/inventory', (req, res) => {
  const demo = [
    { id: 1, name: 'AK-47 | Redline', imageUrl: '/images/ak_redline.png', float: 0.12, priceSteam: 15.5, priceMarket: 12.3 },
    { id: 2, name: 'AWP | Dragon Lore', imageUrl: '/images/awp_dragonlore.png', float: 0.01, priceSteam: 1800, priceMarket: 1700 },
    // … ваши данные
  ];
  res.json(demo);
});

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
  console.log(`🚀 Server listening at http://localhost:${PORT}`);
});
