// src/index.ts
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { loadSteamSchema } from './steamSchema';

async function start() {
  try {
    await loadSteamSchema();
  } catch (err) {
    console.error('❌ Ошибка загрузки Steam schema:', err);
  }

  const app = express();

  // Пример простого роута
  app.get('/', (req, res) => {
    res.send('API работает!');
  });

  const port = process.env.PORT || 4001;
  app.listen(port, () => {
    console.log(`🚀 Backend running on http://localhost:${port}`);
  });
}

start();
