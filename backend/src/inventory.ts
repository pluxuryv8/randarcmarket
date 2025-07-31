// backend/src/inventory.ts

import { Router } from 'express';
import { getIconUrl } from './steamSchema';

interface InventoryItem {
  name: string;
  float: number;
  quantity: number;
}

const router = Router();

router.get('/', (_req, res) => {
  // TODO: В реальности здесь данные из БД
  const userItems: InventoryItem[] = [
    { name: 'AWP | Asiimov',       float: 0.12, quantity: 1 },
    { name: 'AK-47 | Redline',     float: 0.22, quantity: 2 },
    { name: 'Desert Eagle | Blaze', float: 0.05, quantity: 1 },
  ];

  const enriched = userItems.map(item => ({
    ...item,
    // Пробуем получить иконку из Steam CDN
    imageUrl: getIconUrl(item.name) ?? '/skins/default.png'
  }));

  res.json(enriched);
});

export default router;