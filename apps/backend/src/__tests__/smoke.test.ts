import request from 'supertest';
import { app } from '../index';

describe('Smoke Tests', () => {
  describe('Health Check', () => {
    it('should return 200 for health endpoint', async () => {
      const response = await request(app)
        .get('/health');

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('ok');
    });
  });

  describe('NFT Endpoints', () => {
    it('should return collections array', async () => {
      const response = await request(app)
        .get('/api/nft/collections');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should return items for a collection', async () => {
      const response = await request(app)
        .get('/api/nft/collections/test-collection/items');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should return item details', async () => {
      const response = await request(app)
        .get('/api/nft/items/test-item-address');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('address');
      expect(response.body.data).toHaveProperty('name');
    });
  });

  describe('Drops Endpoints', () => {
    it('should return drops array', async () => {
      const response = await request(app)
        .get('/api/drops');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should return specific drop details', async () => {
      const response = await request(app)
        .get('/api/drops/test-drop-id');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data).toHaveProperty('name');
    });
  });

  describe('Radar Endpoints', () => {
    it('should return 401 for radar endpoints without auth', async () => {
      const response = await request(app)
        .get('/api/radar/watchlist');

      expect(response.status).toBe(401);
    });

    it('should return 401 for radar notifications without auth', async () => {
      const response = await request(app)
        .get('/api/radar/notifications');

      expect(response.status).toBe(401);
    });
  });
});
