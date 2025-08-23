import request from 'supertest';
import { app } from '../index';
import jwt from 'jsonwebtoken';

describe('Payments', () => {
  const JWT_SECRET = 'test_jwt_secret_123';
  const TEST_USER_ID = 'test_user_123';

  beforeAll(() => {
    process.env.JWT_SECRET = JWT_SECRET;
    process.env.TON_PAY_RECEIVER = 'EQD...test_wallet_address';
    process.env.SUBSCRIPTION_PRICE_TON = '25';
    process.env.SUBSCRIPTION_PERIOD_DAYS = '30';
  });

  describe('POST /api/payments/subscribe', () => {
    it('should return 401 without valid JWT', async () => {
      const response = await request(app)
        .post('/api/payments/subscribe');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Authorization header required');
    });

    it('should return 401 with invalid JWT', async () => {
      const response = await request(app)
        .post('/api/payments/subscribe')
        .set('Authorization', 'Bearer invalid_token');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Invalid token');
    });

    it('should return 200 with valid JWT and create subscription', async () => {
      // Create valid JWT token
      const token = jwt.sign({ sub: TEST_USER_ID }, JWT_SECRET, { expiresIn: '7d' });

      const response = await request(app)
        .post('/api/payments/subscribe')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.transaction).toBeDefined();
      expect(response.body.data.transaction.to).toBe('EQD...test_wallet_address');
      expect(response.body.data.transaction.amount).toBe('25000000000'); // 25 TON in nano
      expect(response.body.data.transaction.comment).toMatch(/^SUB:.*;UID:test_user_123$/);
      expect(response.body.data.order_id).toBeDefined();
      expect(response.body.data.amount_ton).toBe(25);
      expect(response.body.data.period_days).toBe(30);
    });
  });

  describe('POST /api/payments/confirm', () => {
    it('should return 400 for missing order_id', async () => {
      const response = await request(app)
        .post('/api/payments/confirm')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Order ID required');
    });

    it('should return 404 for non-existent order', async () => {
      const response = await request(app)
        .post('/api/payments/confirm')
        .send({ order_id: 'non_existent_order' });

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Order not found');
    });

    it('should return 200 for valid order confirmation', async () => {
      // First create an order
      const token = jwt.sign({ sub: TEST_USER_ID }, JWT_SECRET, { expiresIn: '7d' });
      
      const subscribeResponse = await request(app)
        .post('/api/payments/subscribe')
        .set('Authorization', `Bearer ${token}`);

      const orderId = subscribeResponse.body.data.order_id;

      // Then confirm it
      const response = await request(app)
        .post('/api/payments/confirm')
        .send({ order_id: orderId });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.order_id).toBe(orderId);
      expect(response.body.data.status).toBe('confirmed');
      expect(response.body.data.subscription_end).toBeDefined();
    });
  });
});
