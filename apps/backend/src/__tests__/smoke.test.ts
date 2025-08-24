import request from 'supertest';
import { app } from '../index';

describe('Smoke Tests', () => {
  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app).get('/health');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
    });
  });

  describe('GET /api/nft/collections', () => {
    it('should return collections with correct structure', async () => {
      const response = await request(app)
        .get('/api/nft/collections')
        .query({ type: 'gifts', limit: 12 });
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
      
      // Проверяем структуру первой коллекции
      if (response.body.data.length > 0) {
        const collection = response.body.data[0];
        expect(collection).toHaveProperty('id');
        expect(collection).toHaveProperty('title');
        expect(collection).toHaveProperty('image');
        expect(collection).toHaveProperty('floor');
        expect(collection).toHaveProperty('volume24h');
      }
      
      // Проверяем заголовки
      expect(response.headers).toHaveProperty('x-source');
      expect(response.headers).toHaveProperty('cache-control');
    });
  });

  describe('GET /api/nft/collections/:id/traits', () => {
    it('should return traits buckets for collection', async () => {
      // Сначала получаем список коллекций
      const collectionsResponse = await request(app)
        .get('/api/nft/collections')
        .query({ limit: 1 });
      
      if (collectionsResponse.body.data.length === 0) {
        console.log('No collections available for traits test');
        return;
      }
      
      const collectionId = collectionsResponse.body.data[0].id;
      
      const response = await request(app)
        .get(`/api/nft/collections/${collectionId}/traits`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
      
      // Проверяем структуру трейтов
      if (response.body.data.length > 0) {
        const trait = response.body.data[0];
        expect(trait).toHaveProperty('trait');
        expect(trait).toHaveProperty('value');
        expect(trait).toHaveProperty('count');
      }
    });
  });

  describe('GET /api/nft/items', () => {
    it('should return items with correct structure', async () => {
      const response = await request(app)
        .get('/api/nft/items')
        .query({ forSale: true, limit: 24 });
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('items');
      expect(response.body.data).toHaveProperty('total');
      expect(Array.isArray(response.body.data.items)).toBe(true);
      
      // Проверяем структуру первого предмета
      if (response.body.data.items.length > 0) {
        const item = response.body.data.items[0];
        expect(item).toHaveProperty('address');
        expect(item).toHaveProperty('title');
        expect(item).toHaveProperty('image');
        expect(item).toHaveProperty('isForSale');
        expect(item).toHaveProperty('traits');
        expect(item).toHaveProperty('collectionId');
      }
    });
  });

  describe('GET /api/nft/items/:address', () => {
    it('should return item details', async () => {
      // Сначала получаем список предметов
      const itemsResponse = await request(app)
        .get('/api/nft/items')
        .query({ limit: 1 });
      
      if (itemsResponse.body.data.items.length === 0) {
        console.log('No items available for item details test');
        return;
      }
      
      const itemAddress = itemsResponse.body.data.items[0].address;
      
      const response = await request(app)
        .get(`/api/nft/items/${itemAddress}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      
      const item = response.body.data;
      expect(item).toHaveProperty('address');
      expect(item).toHaveProperty('title');
      expect(item).toHaveProperty('image');
      expect(item).toHaveProperty('isForSale');
      expect(item).toHaveProperty('traits');
      expect(item).toHaveProperty('collectionId');
    });
  });

  describe('GET /api/nft/search', () => {
    it('should return search results', async () => {
      const response = await request(app)
        .get('/api/nft/search')
        .query({ q: 'gift' });
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('items');
      expect(response.body.data).toHaveProperty('total');
      expect(Array.isArray(response.body.data.items)).toBe(true);
    });
  });

  describe('GET /api/nft/activity', () => {
    it('should return activity data', async () => {
      const response = await request(app)
        .get('/api/nft/activity')
        .query({ limit: 10 });
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('items');
      expect(response.body.data).toHaveProperty('total');
      expect(Array.isArray(response.body.data.items)).toBe(true);
    });
  });
});
