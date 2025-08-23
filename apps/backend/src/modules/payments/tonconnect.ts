import { Request, Response } from 'express';
import crypto from 'crypto';
import { AuthenticatedRequest } from '../auth/jwt';
import { OrderPayload, TonConnectTransaction, ApiResponse } from '../../types';

const RECEIVER = process.env.TON_PAY_RECEIVER!;
const PRICE_TON = Number(process.env.SUBSCRIPTION_PRICE_TON || '25');
const PERIOD_DAYS = Number(process.env.SUBSCRIPTION_PERIOD_DAYS || '30');

// In-memory storage for MVP (replace with database in production)
const orders = new Map<string, OrderPayload>();

export async function createSubscription(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?.user_id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized'
      } as ApiResponse);
    }

    const orderId = crypto.randomUUID();
    const amountNano = BigInt(Math.floor(PRICE_TON * 1e9)).toString();

    const comment = `SUB:${orderId};UID:${userId}`;
    const payload = ''; // Optional base64 payload

    // Store order
    const order: OrderPayload = {
      order_id: orderId,
      user_id: userId,
      amount_ton: PRICE_TON,
      receiver: RECEIVER,
      comment,
      created_at: new Date()
    };
    
    orders.set(orderId, order);

    const transaction: TonConnectTransaction = {
      to: RECEIVER,
      amount: amountNano,
      payload,
      comment
    };

    res.json({
      success: true,
      data: {
        transaction,
        order_id: orderId,
        amount_ton: PRICE_TON,
        period_days: PERIOD_DAYS
      }
    } as ApiResponse);

  } catch (error) {
    console.error('Create subscription error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
  }
}

export async function confirmPayment(req: Request, res: Response) {
  try {
    const { order_id } = req.body;

    if (!order_id) {
      return res.status(400).json({
        success: false,
        error: 'Order ID required'
      } as ApiResponse);
    }

    const order = orders.get(order_id);
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      } as ApiResponse);
    }

    // TODO: Verify payment on blockchain
    // For MVP, we'll simulate successful payment
    const paymentVerified = true; // Replace with actual blockchain verification

    if (paymentVerified) {
      // TODO: Create/update subscription in database
      // For MVP, we'll just return success
      
      res.json({
        success: true,
        data: {
          order_id,
          status: 'confirmed',
          subscription_end: new Date(Date.now() + PERIOD_DAYS * 24 * 60 * 60 * 1000)
        }
      } as ApiResponse);
    } else {
      res.status(400).json({
        success: false,
        error: 'Payment verification failed'
      } as ApiResponse);
    }

  } catch (error) {
    console.error('Confirm payment error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
  }
}

export function getOrderById(orderId: string): OrderPayload | undefined {
  return orders.get(orderId);
}
