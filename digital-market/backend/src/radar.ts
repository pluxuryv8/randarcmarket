import { Router, Request, Response } from 'express';
const router = Router();

// GET /radar — пока что отдаём статичную заглушку
router.get('/', (_req: Request, res: Response) => {
  res.json({
    item: 'AWP | Asiimov',
    buyPrice: 700,
    potentialProfit: 120
  });
});

export default router;
