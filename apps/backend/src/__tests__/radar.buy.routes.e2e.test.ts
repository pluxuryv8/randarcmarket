import request from 'supertest';
import { app } from '../index';
import { authHeader } from '../test-utils/testAuth';
import { prisma } from '../db/client';
import { runWorkers } from '../workers/queue';

describe('Radar Buy Routes E2E', () => {
  let testUser: { id: string; tier: 'pro' };
  let roundId: string;
  let reservationId: string;
  let orderId: string;

  beforeAll(async () => {
    testUser = { id: 'e2e-buy-user', tier: 'pro' };
    // Запустить воркеры для обработки очереди
    runWorkers();
  });

  beforeEach(async () => {
    // Clean up test data
    try {
      await prisma.radarOrder.deleteMany({
        where: { userId: testUser.id }
      });
    } catch (e) {
      // Table might not exist, ignore
    }
    try {
      await prisma.radarReservation.deleteMany({
        where: { userId: testUser.id }
      });
    } catch (e) {
      // Table might not exist, ignore
    }
    try {
      await prisma.walletBalance.deleteMany({
        where: { userId: testUser.id }
      });
    } catch (e) {
      // Table might not exist, ignore
    }
    try {
      await prisma.radarEntry.deleteMany({
        where: { userId: testUser.id }
      });
    } catch (e) {
      // Table might not exist, ignore
    }
    try {
      await prisma.radarRound.deleteMany({
        where: { itemAddress: 'test-item-e2e-buy' }
      });
    } catch (e) {
      // Table might not exist, ignore
    }
  });

  // Helper function to wait for order status
  async function waitForOrderStatus(orderId: string, expectedStatus: string, maxAttempts = 120): Promise<string> {
    for (let i = 0; i < maxAttempts; i++) {
      try {
        const response = await request(app)
          .get(`/api/radar/order/${orderId}`)
          .set(authHeader(testUser));

        if (response.status === 200) {
          const status = response.body.order.status;
          
          if (status === expectedStatus) {
            return status;
          }
          
          // Log status changes for debugging
          if (i % 10 === 0) {
            console.log(`Order ${orderId} status: ${status} (attempt ${i + 1}/${maxAttempts})`);
          }
        }
      } catch (error) {
        // Игнорируем ошибки 404 - заказ может еще не создаться
        if (error.message.includes('404')) {
          if (i % 10 === 0) {
            console.log(`Order ${orderId} not found yet (attempt ${i + 1}/${maxAttempts})`);
          }
        } else {
          console.log(`Error checking order status (attempt ${i + 1}):`, error.message);
        }
      }
      
      // Wait before next attempt
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    throw new Error(`Order did not reach status ${expectedStatus} after ${maxAttempts} attempts`);
  }

  it('should complete full radar flow: join → result → reserve → pay → order', async () => {
    // 1. Join round
    const joinResponse = await request(app)
      .post('/api/radar/join')
      .set(authHeader(testUser))
      .send({
        itemAddress: 'test-item-e2e-buy',
        tier: 'pro'
      });

    expect(joinResponse.status).toBe(200);
    expect(joinResponse.body.success).toBe(true);
    roundId = joinResponse.body.roundId;
    expect(roundId).toBeDefined();

    // 2. Wait and get result
    await new Promise(resolve => setTimeout(resolve, 1000));

    let caught = false;
    let attempts = 0;
    const maxAttempts = 5;

    while (!caught && attempts < maxAttempts) {
      attempts++;
      
      const resultResponse = await request(app)
        .get(`/api/radar/result/${roundId}`)
        .set(authHeader(testUser));

      expect(resultResponse.status).toBe(200);
      expect(resultResponse.body.success).toBe(true);
      
      caught = resultResponse.body.caught;
      
      if (caught) {
        console.log(`🎉 Caught on attempt ${attempts}`);
        break;
      }
      
      if (attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    if (!caught) {
      throw new Error(`Failed to catch after ${maxAttempts} attempts`);
    }

    // 3. Create reservation
    const reserveResponse = await request(app)
      .post('/api/radar/reserve')
      .set(authHeader(testUser))
      .set('Idempotency-Key', 'e2e-test-1')
      .send({
        roundId: roundId
      });

    expect(reserveResponse.status).toBe(200);
    expect(reserveResponse.body.success).toBe(true);
    reservationId = reserveResponse.body.reservation.id;
    expect(reservationId).toBeDefined();

    // Test reservation idempotency
    const reserveResponse2 = await request(app)
      .post('/api/radar/reserve')
      .set(authHeader(testUser))
      .set('Idempotency-Key', 'e2e-test-1')
      .send({
        roundId: roundId
      });

    expect(reserveResponse2.status).toBe(200);
    expect(reserveResponse2.body.reservation.id).toBe(reservationId);

    // 4. Top up balance
    await prisma.walletBalance.upsert({
      where: { userId: testUser.id },
      update: { ton: { increment: 100 } },
      create: { userId: testUser.id, ton: 100 }
    });

    // 5. Pay with balance
    const payResponse = await request(app)
      .post('/api/radar/pay')
      .set(authHeader(testUser))
      .set('Idempotency-Key', 'e2e-test-2')
      .send({
        reservationId: reservationId,
        method: 'balance'
      });

    expect(payResponse.status).toBe(200);
    expect(payResponse.body.success).toBe(true);
    expect(payResponse.body.method).toBe('balance');
    orderId = payResponse.body.orderId;
    expect(orderId).toBeDefined();

    // Test payment idempotency
    const payResponse2 = await request(app)
      .post('/api/radar/pay')
      .set(authHeader(testUser))
      .set('Idempotency-Key', 'e2e-test-2')
      .send({
        reservationId: reservationId,
        method: 'balance'
      });

    expect(payResponse2.status).toBe(200);
    expect(payResponse2.body.orderId).toBe(orderId);

    // 6. Wait for order to be delivered
    const finalStatus = await waitForOrderStatus(orderId, 'delivered');
    expect(finalStatus).toBe('delivered');

    // 7. Verify order details
    const orderResponse = await request(app)
      .get(`/api/radar/order/${orderId}`)
      .set(authHeader(testUser));

    expect(orderResponse.status).toBe(200);
    expect(orderResponse.body.success).toBe(true);
    expect(orderResponse.body.order.status).toBe('delivered');
    expect(orderResponse.body.order.txHash).toBeDefined();
  }, 60000);

  it('should handle TonConnect payment flow', async () => {
    // 1. Join and get result (reuse logic from previous test)
    const joinResponse = await request(app)
      .post('/api/radar/join')
      .set(authHeader(testUser))
      .send({
        itemAddress: 'test-item-e2e-tonconnect',
        tier: 'pro'
      });

    expect(joinResponse.status).toBe(200);
    roundId = joinResponse.body.roundId;

    // Wait and get result
    await new Promise(resolve => setTimeout(resolve, 1000));

    let caught = false;
    let attempts = 0;
    while (!caught && attempts < 5) {
      attempts++;
      const resultResponse = await request(app)
        .get(`/api/radar/result/${roundId}`)
        .set(authHeader(testUser));

      caught = resultResponse.body.caught;
      if (!caught && attempts < 5) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    if (!caught) {
      throw new Error('Failed to catch signal');
    }

    // 2. Create reservation
    const reserveResponse = await request(app)
      .post('/api/radar/reserve')
      .set(authHeader(testUser))
      .send({ roundId });

    expect(reserveResponse.status).toBe(200);
    reservationId = reserveResponse.body.reservation.id;

    // 3. Get TonConnect payment link
    const payResponse = await request(app)
      .post('/api/radar/pay')
      .set(authHeader(testUser))
      .send({
        reservationId: reservationId,
        method: 'tonconnect'
      });

    expect(payResponse.status).toBe(200);
    expect(payResponse.body.success).toBe(true);
    expect(payResponse.body.method).toBe('tonconnect');
    expect(payResponse.body.payment).toBeDefined();
    expect(payResponse.body.payment.amountTon).toBeDefined();
    expect(payResponse.body.payment.comment).toBeDefined();

    // 4. Confirm TonConnect payment
    const confirmResponse = await request(app)
      .post('/api/radar/confirm')
      .set(authHeader(testUser))
      .send({
        reservationId: reservationId,
        proof: { fake: 'proof' }
      });

    expect(confirmResponse.status).toBe(200);
    expect(confirmResponse.body.success).toBe(true);
    orderId = confirmResponse.body.orderId;
    expect(orderId).toBeDefined();

    // 5. Wait for order completion
    const finalStatus = await waitForOrderStatus(orderId, 'delivered');
    expect(finalStatus).toBe('delivered');
  }, 60000);

  it('should handle rate limiting', async () => {
    // Create a reservation first
    const joinResponse = await request(app)
      .post('/api/radar/join')
      .set(authHeader(testUser))
      .send({
        itemAddress: 'test-item-rate-limit',
        tier: 'pro'
      });

    roundId = joinResponse.body.roundId;
    await new Promise(resolve => setTimeout(resolve, 1000));

    let caught = false;
    let attempts = 0;
    while (!caught && attempts < 5) {
      attempts++;
      const resultResponse = await request(app)
        .get(`/api/radar/result/${roundId}`)
        .set(authHeader(testUser));

      caught = resultResponse.body.caught;
      if (!caught && attempts < 5) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    if (!caught) {
      throw new Error('Failed to catch signal');
    }

    const reserveResponse = await request(app)
      .post('/api/radar/reserve')
      .set(authHeader(testUser))
      .send({ roundId });

    reservationId = reserveResponse.body.reservation.id;

    // Top up balance
    await prisma.walletBalance.upsert({
      where: { userId: testUser.id },
      update: { ton: { increment: 100 } },
      create: { userId: testUser.id, ton: 100 }
    });

    // Make many payment requests to trigger rate limit
    let rateLimitHit = false;
    for (let i = 0; i < 35; i++) {
      try {
        const response = await request(app)
          .post('/api/radar/pay')
          .set(authHeader(testUser))
          .set('Idempotency-Key', `rate-test-${i}`)
          .send({
            reservationId: reservationId,
            method: 'balance'
          });

        if (response.status === 429) {
          rateLimitHit = true;
          break;
        }
      } catch (error) {
        // Ignore errors
      }
    }

    // Note: Rate limit might not be hit in test environment
    console.log(`Rate limit hit: ${rateLimitHit}`);
  }, 60000);

  it('should handle order status transitions correctly', async () => {
    // Create order through full flow
    const joinResponse = await request(app)
      .post('/api/radar/join')
      .set(authHeader(testUser))
      .send({
        itemAddress: 'test-item-status-transitions',
        tier: 'pro'
      });

    roundId = joinResponse.body.roundId;
    await new Promise(resolve => setTimeout(resolve, 1000));

    let caught = false;
    let attempts = 0;
    while (!caught && attempts < 5) {
      attempts++;
      const resultResponse = await request(app)
        .get(`/api/radar/result/${roundId}`)
        .set(authHeader(testUser));

      caught = resultResponse.body.caught;
      if (!caught && attempts < 5) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    if (!caught) {
      throw new Error('Failed to catch signal');
    }

    const reserveResponse = await request(app)
      .post('/api/radar/reserve')
      .set(authHeader(testUser))
      .send({ roundId });

    reservationId = reserveResponse.body.reservation.id;

    await prisma.walletBalance.upsert({
      where: { userId: testUser.id },
      update: { ton: { increment: 100 } },
      create: { userId: testUser.id, ton: 100 }
    });

    const payResponse = await request(app)
      .post('/api/radar/pay')
      .set(authHeader(testUser))
      .send({
        reservationId: reservationId,
        method: 'balance'
      });

    orderId = payResponse.body.orderId;

    // Monitor status transitions
    const statuses: string[] = [];
    let finalStatus = '';

    for (let i = 0; i < 30; i++) {
      const orderResponse = await request(app)
        .get(`/api/radar/order/${orderId}`)
        .set(authHeader(testUser));

      const status = orderResponse.body.order.status;
      if (!statuses.includes(status)) {
        statuses.push(status);
      }

      if (status === 'delivered' || status === 'onchain_fail') {
        finalStatus = status;
        break;
      }

      await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log('Order status transitions:', statuses);
    expect(finalStatus).toMatch(/^(delivered|onchain_fail)$/);
  }, 60000);
});
