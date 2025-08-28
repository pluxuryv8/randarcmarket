import request from 'supertest';
import { app } from '../index';
import { authHeader } from '../test-utils/testAuth';
import { prisma } from '../db/client';

describe('Radar Reservation Routes E2E', () => {
  let testUser: { id: string; tier: 'pro' };

  beforeAll(async () => {
    testUser = { id: 'e2e-reservation-user', tier: 'pro' };
  });

  beforeEach(async () => {
    // Clean up test data
    await prisma.radarReservation.deleteMany({
      where: { userId: testUser.id }
    });
    await prisma.radarEntry.deleteMany({
      where: { userId: testUser.id }
    });
    await prisma.radarRound.deleteMany({
      where: { itemAddress: 'test-item-reservation' }
    });
  });

  describe('POST /api/radar/reserve', () => {
    it('should create reservation for winner', async () => {
      // Step 1: Join a round
      const joinResponse = await request(app)
        .post('/api/radar/join')
        .set(authHeader(testUser))
        .send({ itemAddress: 'test-item-reservation', tier: 'pro' });

      expect(joinResponse.status).toBe(200);
      expect(joinResponse.body.success).toBe(true);
      expect(joinResponse.body.roundId).toBeDefined();

      const roundId = joinResponse.body.roundId;

      // Step 2: Wait for round to close and get result
      await new Promise(resolve => setTimeout(resolve, 800));

      const resultResponse = await request(app)
        .get(`/api/radar/result/${roundId}`)
        .set(authHeader(testUser));

      expect(resultResponse.status).toBe(200);
      expect(resultResponse.body.success).toBe(true);
      expect(resultResponse.body.caught).toBeDefined();

      // Step 3: If caught, create reservation
      if (resultResponse.body.caught) {
        const reserveResponse = await request(app)
          .post('/api/radar/reserve')
          .set(authHeader(testUser))
          .send({ roundId });

        expect(reserveResponse.status).toBe(200);
        expect(reserveResponse.body.success).toBe(true);
        expect(reserveResponse.body.reservation).toBeDefined();
        expect(reserveResponse.body.reservation.id).toBeDefined();
        expect(reserveResponse.body.reservation.reserveToken).toBeDefined();
        expect(reserveResponse.body.reservation.expiresAt).toBeDefined();
        expect(reserveResponse.body.meta.source).toBe('radar');

        // Verify reservation was created in database
        const reservation = await prisma.radarReservation.findFirst({
          where: { id: reserveResponse.body.reservation.id }
        });
        expect(reservation).toBeDefined();
        expect(reservation?.status).toBe('pending');
        expect(reservation?.userId).toBe(testUser.id);
        expect(reservation?.roundId).toBe(roundId);
      }
    });

    it('should return 403 for non-winner', async () => {
      // Create a round with a different winner
      const round = await prisma.radarRound.create({
        data: {
          itemAddress: 'test-item-reservation-2',
          startsAt: new Date(),
          endsAt: new Date(Date.now() - 1000), // Already ended
          seedHash: 'test-hash',
          status: 'revealed',
          winnersJson: JSON.stringify([
            { userId: 'other-user', weight: 1.0, itemAddress: 'test-item-reservation-2', priceTon: 10.5, source: 'randar' }
          ])
        }
      });

      const response = await request(app)
        .post('/api/radar/reserve')
        .set(authHeader(testUser))
        .send({ roundId: round.id });

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('not_winner');
    });

    it('should return 404 for non-existent round', async () => {
      const response = await request(app)
        .post('/api/radar/reserve')
        .set(authHeader(testUser))
        .send({ roundId: 'non-existent-round' });

      expect(response.status).toBe(404);
    });

    it('should return 409 for round not closed', async () => {
      // Create an open round
      const round = await prisma.radarRound.create({
        data: {
          itemAddress: 'test-item-reservation-3',
          startsAt: new Date(),
          endsAt: new Date(Date.now() + 5000), // Not ended yet
          seedHash: 'test-hash',
          status: 'open'
        }
      });

      const response = await request(app)
        .post('/api/radar/reserve')
        .set(authHeader(testUser))
        .send({ roundId: round.id });

      expect(response.status).toBe(409);
      expect(response.body.error).toBe('round_not_closed');
    });

    it('should handle idempotency', async () => {
      // Create a round with current user as winner
      const round = await prisma.radarRound.create({
        data: {
          itemAddress: 'test-item-reservation-4',
          startsAt: new Date(),
          endsAt: new Date(Date.now() - 1000),
          seedHash: 'test-hash',
          status: 'revealed',
          winnersJson: JSON.stringify([
            { userId: testUser.id, weight: 1.0, itemAddress: 'test-item-reservation-4', priceTon: 10.5, source: 'randar' }
          ])
        }
      });

      const idempotencyKey = 'test-key-123';

      // First request
      const response1 = await request(app)
        .post('/api/radar/reserve')
        .set(authHeader(testUser))
        .set('Idempotency-Key', idempotencyKey)
        .send({ roundId: round.id });

      expect(response1.status).toBe(200);
      const reservationId1 = response1.body.reservation.id;

      // Second request with same idempotency key
      const response2 = await request(app)
        .post('/api/radar/reserve')
        .set(authHeader(testUser))
        .set('Idempotency-Key', idempotencyKey)
        .send({ roundId: round.id });

      expect(response2.status).toBe(200);
      expect(response2.body.reservation.id).toBe(reservationId1);
    });

    it('should reject invalid request data', async () => {
      const response = await request(app)
        .post('/api/radar/reserve')
        .set(authHeader(testUser))
        .send({});

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/radar/reservations/my', () => {
    it('should return user reservations', async () => {
      // Create test reservations
      const reservations = await Promise.all([
        prisma.radarReservation.create({
          data: {
            roundId: 'round-1',
            itemAddress: 'item-1',
            source: 'randar',
            userId: testUser.id,
            priceTon: 10.5,
            status: 'pending',
            reserveToken: 'token-1',
            expiresAt: new Date(Date.now() + 5000)
          }
        }),
        prisma.radarReservation.create({
          data: {
            roundId: 'round-2',
            itemAddress: 'item-2',
            source: 'randar',
            userId: testUser.id,
            priceTon: 15.0,
            status: 'expired',
            reserveToken: 'token-2',
            expiresAt: new Date(Date.now() - 1000)
          }
        })
      ]);

      const response = await request(app)
        .get('/api/radar/reservations/my?limit=10')
        .set(authHeader(testUser));

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.reservations).toHaveLength(2);
      expect(response.body.reservations[0].id).toBeDefined();
      expect(response.body.reservations[0].status).toBeDefined();
      expect(response.body.reservations[0].itemAddress).toBeDefined();
      expect(response.body.reservations[0].priceTon).toBeDefined();
      expect(response.body.meta.source).toBe('radar');
    });

    it('should use default limit of 20', async () => {
      const response = await request(app)
        .get('/api/radar/reservations/my')
        .set(authHeader(testUser));

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('should reject invalid limit', async () => {
      const response = await request(app)
        .get('/api/radar/reservations/my?limit=101')
        .set(authHeader(testUser));

      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/radar/reservations/expire-now', () => {
    it('should expire stale reservations in dev mode', async () => {
      // Create a stale reservation
      await prisma.radarReservation.create({
        data: {
          roundId: 'round-1',
          itemAddress: 'item-1',
          source: 'randar',
          userId: testUser.id,
          priceTon: 10.5,
          status: 'pending',
          reserveToken: 'token-1',
          expiresAt: new Date(Date.now() - 1000) // Already expired
        }
      });

      const response = await request(app)
        .post('/api/radar/reservations/expire-now')
        .set(authHeader(testUser));

      expect(response.status).toBe(200);
      expect(response.body.expired).toBeGreaterThan(0);

      // Verify reservation was expired
      const reservation = await prisma.radarReservation.findFirst({
        where: { userId: testUser.id }
      });
      expect(reservation?.status).toBe('expired');
    });
  });

  describe('Reservation expiration flow', () => {
    it('should expire reservations after TTL', async () => {
      // Create a round with current user as winner
      const round = await prisma.radarRound.create({
        data: {
          itemAddress: 'test-item-reservation-5',
          startsAt: new Date(),
          endsAt: new Date(Date.now() - 1000),
          seedHash: 'test-hash',
          status: 'revealed',
          winnersJson: JSON.stringify([
            { userId: testUser.id, weight: 1.0, itemAddress: 'test-item-reservation-5', priceTon: 10.5, source: 'randar' }
          ])
        }
      });

      // Create reservation
      const reserveResponse = await request(app)
        .post('/api/radar/reserve')
        .set(authHeader(testUser))
        .send({ roundId: round.id });

      expect(reserveResponse.status).toBe(200);
      const reservationId = reserveResponse.body.reservation.id;

      // Verify reservation is pending
      let reservation = await prisma.radarReservation.findUnique({
        where: { id: reservationId }
      });
      expect(reservation?.status).toBe('pending');

      // Manually set reservation to expired by updating expiresAt
      await prisma.radarReservation.update({
        where: { id: reservationId },
        data: { expiresAt: new Date(Date.now() - 1000) } // Set to past
      });

      // Manually expire reservations
      const expireResponse = await request(app)
        .post('/api/radar/reservations/expire-now')
        .set(authHeader(testUser));

      expect(expireResponse.status).toBe(200);

      // Verify reservation was expired
      reservation = await prisma.radarReservation.findUnique({
        where: { id: reservationId }
      });
      expect(reservation?.status).toBe('expired');
    });
  });
});
