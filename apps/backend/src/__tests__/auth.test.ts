import request from 'supertest';
import { app } from '../index';
import crypto from 'crypto';

describe('Telegram Authentication', () => {
  const BOT_TOKEN = 'test_bot_token_123';
  const JWT_SECRET = 'test_jwt_secret_123';

  beforeAll(() => {
    process.env.TELEGRAM_BOT_TOKEN = BOT_TOKEN;
    process.env.JWT_SECRET = JWT_SECRET;
  });

  describe('POST /api/auth/telegram/verify', () => {
    it('should return 400 for missing required fields', async () => {
      const response = await request(app)
        .post('/api/auth/telegram/verify')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Missing required fields');
    });

    it('should return 400 for invalid signature', async () => {
      const invalidData = {
        id: '123456789',
        auth_date: Math.floor(Date.now() / 1000).toString(),
        hash: 'invalid_hash'
      };

      const response = await request(app)
        .post('/api/auth/telegram/verify')
        .send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Invalid signature');
    });

    it('should return 400 for expired auth data', async () => {
      const expiredData = {
        id: '123456789',
        auth_date: Math.floor((Date.now() - 25 * 60 * 60 * 1000) / 1000).toString(), // 25 hours ago
        hash: 'expired_hash'
      };

      const response = await request(app)
        .post('/api/auth/telegram/verify')
        .send(expiredData);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Authentication expired');
    });

    it('should return 200 for valid auth data', async () => {
      // Create valid Telegram auth data
      const authData = {
        id: '123456789',
        auth_date: Math.floor(Date.now() / 1000).toString(),
        first_name: 'Test',
        last_name: 'User',
        username: 'testuser',
        photo_url: 'https://example.com/photo.jpg'
      };

      // Generate valid hash
      const dataCheck = Object.keys(authData)
        .sort()
        .map((k) => `${k}=${authData[k]}`)
        .join('\n');
      
      const secretKey = crypto
        .createHmac('sha256', 'WebAppData')
        .update(BOT_TOKEN)
        .digest();
      
      const hash = crypto
        .createHmac('sha256', secretKey)
        .update(dataCheck)
        .digest('hex');

      const validData = { ...authData, hash };

      const response = await request(app)
        .post('/api/auth/telegram/verify')
        .send(validData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.token).toBeDefined();
      expect(response.body.data.user).toBeDefined();
      expect(response.body.data.user.tg_id).toBe('123456789');
    });
  });
});
