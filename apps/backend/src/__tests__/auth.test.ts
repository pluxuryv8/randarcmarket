import request from 'supertest';
import { app } from '../index';

describe('Auth Endpoints', () => {
  describe('POST /api/auth/telegram/verify', () => {
    it('should return 400 for invalid initData', async () => {
      const response = await request(app)
        .post('/api/auth/telegram/verify')
        .send({ initData: 'invalid_data' });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('invalid_signature');
    });

    it('should return 400 for missing initData', async () => {
      const response = await request(app)
        .post('/api/auth/telegram/verify')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should return 400 for expired auth data', async () => {
      // Mock expired auth data (older than 24 hours)
      const expiredAuthData = {
        id: '123456789',
        first_name: 'Test',
        last_name: 'User',
        username: 'testuser',
        auth_date: Math.floor((Date.now() - 25 * 60 * 60 * 1000) / 1000).toString(),
        hash: 'expired_hash'
      };

      const response = await request(app)
        .post('/api/auth/telegram/verify')
        .send({ initData: JSON.stringify(expiredAuthData) });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('expired');
    });
  });

  describe('GET /api/auth/me', () => {
    it('should return 401 without valid JWT', async () => {
      const response = await request(app)
        .get('/api/auth/me');

      expect(response.status).toBe(401);
    });

    it('should return 401 with invalid JWT', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid_token');

      expect(response.status).toBe(401);
    });
  });
});
