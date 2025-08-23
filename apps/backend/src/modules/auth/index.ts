import { Router } from 'express';
import { verifyTelegram } from './telegram';
import { authenticateJWT } from './jwt';

export const authRouter = Router();

// POST /api/auth/telegram/verify
authRouter.post('/telegram/verify', verifyTelegram);

// GET /api/auth/me (get current user)
authRouter.get('/me', authenticateJWT, (req: any, res) => {
  res.json({
    success: true,
    data: {
      user: req.user
    }
  });
});

export { authenticateJWT, requireSubscription } from './jwt';
export { getUserById, updateUserWallet } from './telegram';
