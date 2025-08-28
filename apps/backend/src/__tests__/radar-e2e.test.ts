import request from 'supertest';
import { app } from '../index';

describe('Radar E2E Tests', () => {
  describe('POST /api/radar/join', () => {
    it('should join radar round successfully', async () => {
      const response = await request(app)
        .post('/api/radar/join')
        .set('Authorization', 'Bearer test-user')
        .send({
          itemAddress: 'EQDtest123456789',
          tier: 'free'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.roundId).toBeDefined();
      expect(response.body.roundEndsAt).toBeDefined();
      expect(response.body.seedHash).toBeDefined();
      expect(response.body.meta.source).toBe('radar');
    });

    it('should reject request without authorization', async () => {
      const response = await request(app)
        .post('/api/radar/join')
        .send({
          itemAddress: 'EQDtest123456789',
          tier: 'free'
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('should reject invalid request data', async () => {
      const response = await request(app)
        .post('/api/radar/join')
        .set('Authorization', 'Bearer test-user')
        .send({
          itemAddress: '', // Invalid empty address
          tier: 'invalid-tier' // Invalid tier
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/radar/result/:roundId', () => {
    it('should return waiting status for unrevealed round', async () => {
      // First join a round
      const joinResponse = await request(app)
        .post('/api/radar/join')
        .set('Authorization', 'Bearer test-user')
        .send({
          itemAddress: 'EQDtest123456789',
          tier: 'free'
        });

      expect(joinResponse.status).toBe(200);
      const roundId = joinResponse.body.roundId;

      // Try to get result immediately (should be waiting)
      const resultResponse = await request(app)
        .get(`/api/radar/result/${roundId}`)
        .set('Authorization', 'Bearer test-user');

      expect(resultResponse.status).toBe(202);
      expect(resultResponse.body.success).toBe(false);
      expect(resultResponse.body.status).toBe('waiting');
    });

    it('should reject request for non-existent round', async () => {
      const response = await request(app)
        .get('/api/radar/result/non-existent-round')
        .set('Authorization', 'Bearer test-user');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });

    it('should reject request without authorization', async () => {
      const response = await request(app)
        .get('/api/radar/result/test-round');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/radar/stats/:roundId', () => {
    it('should return round statistics', async () => {
      // First join a round
      const joinResponse = await request(app)
        .post('/api/radar/join')
        .set('Authorization', 'Bearer test-user')
        .send({
          itemAddress: 'EQDtest123456789',
          tier: 'pro'
        });

      expect(joinResponse.status).toBe(200);
      const roundId = joinResponse.body.roundId;

      // Get stats
      const statsResponse = await request(app)
        .get(`/api/radar/stats/${roundId}`)
        .set('Authorization', 'Bearer test-user');

      expect(statsResponse.status).toBe(200);
      expect(statsResponse.body.success).toBe(true);
      expect(statsResponse.body.stats.roundId).toBe(roundId);
      expect(statsResponse.body.stats.itemAddress).toBe('EQDtest123456789');
      expect(statsResponse.body.stats.status).toBe('open');
      expect(statsResponse.body.stats.totalEntries).toBe(1);
      expect(statsResponse.body.stats.proEntries).toBe(1);
      expect(statsResponse.body.stats.totalWeight).toBe(1.25);
    });
  });

  describe('Complete radar flow', () => {
    it('should complete full radar flow: join -> wait -> result', async () => {
      // Step 1: Join round
      const joinResponse = await request(app)
        .post('/api/radar/join')
        .set('Authorization', 'Bearer test-user')
        .send({
          itemAddress: 'EQDtest123456789',
          tier: 'free'
        });

      expect(joinResponse.status).toBe(200);
      const roundId = joinResponse.body.roundId;

      // Step 2: Wait for round to end (simulate by waiting)
      await new Promise(resolve => setTimeout(resolve, 600)); // Wait 600ms

      // Step 3: Get result
      const resultResponse = await request(app)
        .get(`/api/radar/result/${roundId}`)
        .set('Authorization', 'Bearer test-user');

      expect(resultResponse.status).toBe(200);
      expect(resultResponse.body.success).toBe(true);
      expect(resultResponse.body.caught).toBeDefined(); // true or false
      expect(resultResponse.body.itemAddress).toBe('EQDtest123456789');
      expect(resultResponse.body.reveal).toBeDefined();
      expect(resultResponse.body.reveal.serverSeed).toBeDefined();
      expect(resultResponse.body.reveal.publicSalt).toBeDefined();
      expect(resultResponse.body.reveal.rand).toBeDefined();
      expect(resultResponse.body.meta.source).toBe('radar');
    }, 10000); // Increase timeout for this test
  });
});
