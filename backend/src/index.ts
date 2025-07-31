// backend/src/index.ts

import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { configureAuth } from './auth';
import radarRouter from './radar';
import inventoryRouter from './inventory';
import { loadSteamSchema } from './steamSchema';

dotenv.config();
const app = express();

// 1. Настраиваем CORS и JSON-парсер
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// 2. Подключаем авторизацию
configureAuth(app);

// 3. Загружаем схему из Steam, а потом регистрируем роуты и запускаем сервер
async function start() {
  try {
    await loadSteamSchema();
    console.log('✅ Steam schema загружена');
  } catch (err) {
    console.error('❌ Ошибка загрузки Steam schema:', err);
  }

  // 4. Регистрируем маршруты
  app.use('/radar', radarRouter);
  app.use('/inventory', inventoryRouter);

  // 5. Простая проверка здоровья
  app.get('/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok' });
  });

  // 6. Запускаем сервер
  const port = process.env.PORT ? Number(process.env.PORT) : 4001;
  app.listen(port, () =>
    console.log(`🚀 Backend running on http://localhost:${port}`)
  );
}

start();