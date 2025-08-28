import request from 'supertest';
import { app } from '../index';
import { authHeader } from '../test-utils/testAuth';
import { prisma } from '../db/client';

describe('Radar Basic Functionality', () => {
  let testUser: { id: string; tier: 'pro' };

  beforeAll(async () => {
    testUser = { id: 'basic-test-user', tier: 'pro' };
  });

  beforeEach(async () => {
    // Clean up test data
    try {
      await prisma.radarOrder.deleteMany({
        where: { userId: testUser.id }
      });
    } catch (e) {
      // Ignore if table doesn't exist
    }
    try {
      await prisma.radarReservation.deleteMany({
        where: { userId: testUser.id }
      });
    } catch (e) {
      // Ignore if table doesn't exist
    }
    try {
      await prisma.walletBalance.deleteMany({
        where: { userId: testUser.id }
      });
    } catch (e) {
      // Ignore if table doesn't exist
    }
  });

  it('should create and retrieve wallet balance', async () => {
    // Create balance
    await prisma.walletBalance.create({
      data: {
        userId: testUser.id,
        ton: 100.0
      }
    });

    // Retrieve balance
    const balance = await prisma.walletBalance.findUnique({
      where: { userId: testUser.id }
    });

    expect(balance).toBeDefined();
    expect(balance?.ton).toBe(100.0);
  });

  it('should create a radar round', async () => {
    const round = await prisma.radarRound.create({
      data: {
        itemAddress: 'test-item-basic',
        startsAt: new Date(),
        endsAt: new Date(Date.now() + 60000),
        seedHash: 'test-seed-hash',
        status: 'open'
      }
    });

    expect(round).toBeDefined();
    expect(round.itemAddress).toBe('test-item-basic');
    expect(round.status).toBe('open');
  });

  it('should create a radar entry', async () => {
    // Create round first
    const round = await prisma.radarRound.create({
      data: {
        itemAddress: 'test-item-entry',
        startsAt: new Date(),
        endsAt: new Date(Date.now() + 60000),
        seedHash: 'test-seed-hash',
        status: 'open'
      }
    });

    // Create entry
    const entry = await prisma.radarEntry.create({
      data: {
        roundId: round.id,
        userId: testUser.id,
        tier: 'pro',
        weight: 1.0
      }
    });

    expect(entry).toBeDefined();
    expect(entry.roundId).toBe(round.id);
    expect(entry.userId).toBe(testUser.id);
  });

  it('should create a reservation', async () => {
    // Create round first
    const round = await prisma.radarRound.create({
      data: {
        itemAddress: 'test-item-reservation',
        startsAt: new Date(),
        endsAt: new Date(Date.now() + 60000),
        seedHash: 'test-seed-hash',
        status: 'revealed'
      }
    });

    // Create reservation
    const reservation = await prisma.radarReservation.create({
      data: {
        roundId: round.id,
        itemAddress: 'test-item-reservation',
        source: 'randar',
        userId: testUser.id,
        priceTon: 10.5,
        status: 'pending',
        reserveToken: 'test-token',
        expiresAt: new Date(Date.now() + 8000)
      }
    });

    expect(reservation).toBeDefined();
    expect(reservation.roundId).toBe(round.id);
    expect(reservation.userId).toBe(testUser.id);
    expect(reservation.status).toBe('pending');
  });

  it('should create an order', async () => {
    // Create order
    const order = await prisma.radarOrder.create({
      data: {
        reservationId: 'test-reservation-id',
        userId: testUser.id,
        itemAddress: 'test-item-order',
        source: 'randar',
        priceTon: 10.5,
        status: 'created'
      }
    });

    expect(order).toBeDefined();
    expect(order.userId).toBe(testUser.id);
    expect(order.status).toBe('created');
    expect(order.priceTon).toBe(10.5);
  });

  it('should update order status', async () => {
    // Create order
    const order = await prisma.radarOrder.create({
      data: {
        reservationId: 'test-reservation-id-2',
        userId: testUser.id,
        itemAddress: 'test-item-order-2',
        source: 'randar',
        priceTon: 10.5,
        status: 'created'
      }
    });

    // Update status
    const updatedOrder = await prisma.radarOrder.update({
      where: { id: order.id },
      data: { status: 'queued' }
    });

    expect(updatedOrder.status).toBe('queued');
  });
});
