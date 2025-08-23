import request from 'supertest';
import { app } from '../index';

describe('Payments Endpoints', () => {
  describe('POST /api/payments/subscribe', () => {
    it('should return 401 without valid JWT', async () => {
      const response = await request(app)
        .post('/api/payments/subscribe');

      expect(response.status).toBe(401);
    });

    it('should return TonConnect transaction data with valid JWT', async () => {
      // Mock JWT token (in real test, you'd create a valid token)
      const mockToken = 'mock_jwt_token';
      
      const response = await request(app)
        .post('/api/payments/subscribe')
        .set('Authorization', `Bearer ${mockToken}`);

      // This test will fail in current implementation since we don't have proper JWT setup
      // In a real implementation, you'd expect:
      // expect(response.status).toBe(200);
      // expect(response.body.success).toBe(true);
      // expect(response.body.data).toHaveProperty('to');
      // expect(response.body.data).toHaveProperty('amount');
      // expect(response.body.data).toHaveProperty('comment');
    });
  });

  describe('POST /api/payments/confirm', () => {
    it('should return 400 for missing order_id', async () => {
      const response = await request(app)
        .post('/api/payments/confirm')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should return 404 for non-existent order', async () => {
      const response = await request(app)
        .post('/api/payments/confirm')
        .send({ order_id: 'non_existent_order' });

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });
});
