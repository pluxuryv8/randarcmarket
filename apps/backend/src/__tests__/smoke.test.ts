import request from 'supertest';
import { app } from '../index';

describe('Smoke Tests', () => {
  describe('GET /health', () => {
    it('should return 200 and health status', async () => {
      const response = await request(app)
        .get('/health');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
    });
  });

  describe('GET /api/nft/collections', () => {
    it('should return 200 and array of collections', async () => {
      const response = await request(app)
        .get('/api/nft/collections');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      
      // Check if collections have required fields
      if (response.body.data.length > 0) {
        const collection = response.body.data[0];
        expect(collection).toHaveProperty('id');
        expect(collection).toHaveProperty('name');
        expect(collection).toHaveProperty('description');
      }
    });
  });

  describe('GET /api/drops', () => {
    it('should return 200 and array of drops', async () => {
      const response = await request(app)
        .get('/api/drops');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      
      // Check if drops have required fields
      if (response.body.data.length > 0) {
        const drop = response.body.data[0];
        expect(drop).toHaveProperty('id');
        expect(drop).toHaveProperty('name');
        expect(drop).toHaveProperty('description');
        expect(drop).toHaveProperty('price_ton');
      }
    });
  });

  describe('GET /bot/health', () => {
    it('should return 200 and bot health status', async () => {
      const response = await request(app)
        .get('/bot/health');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('service', 'telegram-bot');
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('404 handler', () => {
    it('should return 404 for non-existent routes', async () => {
      const response = await request(app)
        .get('/api/non-existent-route');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Route not found');
    });
  });
});
