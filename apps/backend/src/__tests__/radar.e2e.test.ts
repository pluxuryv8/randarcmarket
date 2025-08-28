import request from 'supertest';
import { app } from '../index';
import { authHeader, createTestUsers } from '../test-utils/testAuth';

describe('Radar E2E Tests with Authentication', () => {
  describe('Complete radar flow', () => {
    it('should complete full radar flow: join -> wait -> result', async () => {
      const testUser = { id: 'e2e-user-1', tier: 'pro' as const };
      const itemAddress = 'EQDtest123456789';

      // Step 1: Join round
      const joinResponse = await request(app)
        .post('/api/radar/join')
        .set(authHeader(testUser))
        .send({
          itemAddress,
          tier: testUser.tier
        });

      expect(joinResponse.status).toBe(200);
      expect(joinResponse.body.success).toBe(true);
      expect(joinResponse.body.roundId).toBeDefined();
      expect(joinResponse.body.roundEndsAt).toBeDefined();
      expect(joinResponse.body.seedHash).toBeDefined();
      expect(joinResponse.body.meta.source).toBe('radar');

      const roundId = joinResponse.body.roundId;
      const seedHash = joinResponse.body.seedHash;

      // Step 2: Wait for round to end (700-900ms)
      await new Promise(resolve => setTimeout(resolve, 800));

      // Step 3: Get result
      const resultResponse = await request(app)
        .get(`/api/radar/result/${roundId}`)
        .set(authHeader(testUser));

      expect(resultResponse.status).toBe(200);
      expect(resultResponse.body.success).toBe(true);
      expect(resultResponse.body.caught).toBeDefined(); // true or false
      expect(resultResponse.body.itemAddress).toBe(itemAddress);
      expect(resultResponse.body.reveal).toBeDefined();
      expect(resultResponse.body.meta.source).toBe('radar');

      // Step 4: Verify commit-reveal integrity
      const reveal = resultResponse.body.reveal;
      expect(reveal.serverSeed).toBeDefined();
      expect(reveal.publicSalt).toBeDefined();
      expect(reveal.rand).toBeDefined();

      // Verify that seedHash matches the commit
      const { hashSeed, verifyCommitReveal } = require('../util/commitReveal');
      expect(verifyCommitReveal(seedHash, reveal.serverSeed)).toBe(true);
    }, 15000); // Increase timeout for this test

    it('should handle multiple users joining the same round', async () => {
      const testUsers = createTestUsers(3);
      const itemAddress = 'EQDtest123456789';

      // All users join the same round (sequentially to ensure same round)
      const joinResponses = [];
      for (const user of testUsers) {
        const response = await request(app)
          .post('/api/radar/join')
          .set(authHeader(user))
          .send({
            itemAddress,
            tier: user.tier
          });
        joinResponses.push(response);
      }

      // All should get the same roundId
      joinResponses.forEach(response => {
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
      });

      const roundId = joinResponses[0].body.roundId;
      const seedHash = joinResponses[0].body.seedHash;

      // All should have the same roundId (since they joined the same round)
      joinResponses.forEach(response => {
        expect(response.body.roundId).toBe(roundId);
        expect(response.body.seedHash).toBe(seedHash);
      });

      // Wait for round to end
      await new Promise(resolve => setTimeout(resolve, 800));

      // Get results for all users
      const resultPromises = testUsers.map(user =>
        request(app)
          .get(`/api/radar/result/${roundId}`)
          .set(authHeader(user))
      );

      const resultResponses = await Promise.all(resultPromises);

      // All should get results
      resultResponses.forEach(response => {
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.caught).toBeDefined();
        expect(response.body.itemAddress).toBe(itemAddress);
        expect(response.body.reveal).toBeDefined();
      });

      // All should have the same reveal data
      const firstReveal = resultResponses[0].body.reveal;
      resultResponses.forEach(response => {
        expect(response.body.reveal.serverSeed).toBe(firstReveal.serverSeed);
        expect(response.body.reveal.publicSalt).toBe(firstReveal.publicSalt);
        expect(response.body.reveal.rand).toBe(firstReveal.rand);
      });

      // Verify commit-reveal integrity
      const { verifyCommitReveal } = require('../util/commitReveal');
      expect(verifyCommitReveal(seedHash, firstReveal.serverSeed)).toBe(true);
    }, 15000);

    it('should reject duplicate join attempts', async () => {
      const testUser = { id: 'e2e-user-duplicate', tier: 'free' as const };
      const itemAddress = 'EQDtest123456789';

      // First join
      const firstJoin = await request(app)
        .post('/api/radar/join')
        .set(authHeader(testUser))
        .send({
          itemAddress,
          tier: testUser.tier
        });

      expect(firstJoin.status).toBe(200);
      expect(firstJoin.body.success).toBe(true);

      // Second join (should fail)
      const secondJoin = await request(app)
        .post('/api/radar/join')
        .set(authHeader(testUser))
        .send({
          itemAddress,
          tier: testUser.tier
        });

      expect(secondJoin.status).toBe(409);
      expect(secondJoin.body.success).toBe(false);
      expect(secondJoin.body.error).toContain('already joined');
    });

    it('should reject unauthorized requests', async () => {
      const itemAddress = 'EQDtest123456789';

      // Join without auth
      const joinResponse = await request(app)
        .post('/api/radar/join')
        .send({
          itemAddress,
          tier: 'free'
        });

      expect(joinResponse.status).toBe(401);
      expect(joinResponse.body.success).toBe(false);

      // Result without auth
      const resultResponse = await request(app)
        .get('/api/radar/result/test-round-id');

      expect(resultResponse.status).toBe(401);
      expect(resultResponse.body.success).toBe(false);
    });

    it('should reject invalid request data', async () => {
      const testUser = { id: 'e2e-user-invalid', tier: 'free' as const };

      // Invalid item address
      const invalidAddressResponse = await request(app)
        .post('/api/radar/join')
        .set(authHeader(testUser))
        .send({
          itemAddress: '', // Empty address
          tier: 'free'
        });

      expect(invalidAddressResponse.status).toBe(400);
      expect(invalidAddressResponse.body.success).toBe(false);

      // Invalid tier
      const invalidTierResponse = await request(app)
        .post('/api/radar/join')
        .set(authHeader(testUser))
        .send({
          itemAddress: 'EQDtest123456789',
          tier: 'invalid-tier' // Invalid tier
        });

      expect(invalidTierResponse.status).toBe(400);
      expect(invalidTierResponse.body.success).toBe(false);
    });
  });
});
