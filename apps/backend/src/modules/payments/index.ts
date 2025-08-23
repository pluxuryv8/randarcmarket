import { Router } from 'express';
import { createSubscription, confirmPayment } from './tonconnect';
import { authenticateJWT } from '../auth/jwt';

export const paymentsRouter = Router();

// POST /api/payments/subscribe
paymentsRouter.post('/subscribe', authenticateJWT, createSubscription);

// POST /api/payments/confirm
paymentsRouter.post('/confirm', confirmPayment);

export { getOrderById } from './tonconnect';
