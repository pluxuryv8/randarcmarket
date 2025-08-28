import { prisma } from '../db/client';
import {
  payReservationWithBalance,
  getTonConnectPaymentLink,
  confirmTonConnectPayment,
  enqueueExecution,
  executeOrder,
  deliverOrder,
  getOrder
} from '../services/radarBuyService';

// Mock the queue module
jest.mock('../workers/queue', () => ({
  pushTask: jest.fn()
}));

describe('Radar Buy Service', () => {
  const testUserId = 'test-user-123';
  const testReservationId = 'test-reservation-123';
  const testOrderId = 'test-order-123';

  beforeEach(async () => {
    // Clean up test data
    await prisma.radarOrder.deleteMany({
      where: { userId: testUserId }
    });
    await prisma.radarReservation.deleteMany({
      where: { userId: testUserId }
    });
    await prisma.walletBalance.deleteMany({
      where: { userId: testUserId }
    });
  });

  describe('payReservationWithBalance', () => {
    it('should pay reservation with sufficient balance', async () => {
      // Create test reservation
      const reservation = await prisma.radarReservation.create({
        data: {
          id: testReservationId,
          roundId: 'test-round',
          itemAddress: 'test-item',
          source: 'randar',
          userId: testUserId,
          priceTon: 10.5,
          status: 'pending',
          reserveToken: 'test-token',
          expiresAt: new Date(Date.now() + 10000)
        }
      });

      // Create balance for user
      await prisma.walletBalance.create({
        data: {
          userId: testUserId,
          ton: 20.0
        }
      });

      // Pay reservation
      const result = await payReservationWithBalance(testReservationId, testUserId);

      expect(result.orderId).toBeDefined();

      // Check that order was created
      const order = await prisma.radarOrder.findUnique({
        where: { id: result.orderId }
      });
      expect(order).toBeDefined();
      expect(order?.status).toBe('created');
      expect(order?.priceTon).toBe(10.5);

      // Check that balance was deducted
      const balance = await prisma.walletBalance.findUnique({
        where: { userId: testUserId }
      });
      expect(balance?.ton).toBe(9.5); // 20.0 - 10.5

      // Check that reservation was cancelled
      const updatedReservation = await prisma.radarReservation.findUnique({
        where: { id: testReservationId }
      });
      expect(updatedReservation?.status).toBe('cancelled');
    });

    it('should throw error for insufficient balance', async () => {
      // Create test reservation
      await prisma.radarReservation.create({
        data: {
          id: testReservationId,
          roundId: 'test-round',
          itemAddress: 'test-item',
          source: 'randar',
          userId: testUserId,
          priceTon: 10.5,
          status: 'pending',
          reserveToken: 'test-token',
          expiresAt: new Date(Date.now() + 10000)
        }
      });

      // Create insufficient balance
      await prisma.walletBalance.create({
        data: {
          userId: testUserId,
          ton: 5.0
        }
      });

      // Should throw error
      await expect(payReservationWithBalance(testReservationId, testUserId))
        .rejects.toThrow('Insufficient balance');
    });

    it('should throw error for non-existent reservation', async () => {
      await expect(payReservationWithBalance('non-existent', testUserId))
        .rejects.toThrow('Reservation not found or expired');
    });
  });

  describe('getTonConnectPaymentLink', () => {
    it('should return payment link for valid reservation', async () => {
      // Create test reservation
      await prisma.radarReservation.create({
        data: {
          id: testReservationId,
          roundId: 'test-round',
          itemAddress: 'test-item',
          source: 'randar',
          userId: testUserId,
          priceTon: 10.5,
          status: 'pending',
          reserveToken: 'test-token',
          expiresAt: new Date(Date.now() + 10000)
        }
      });

      const payment = await getTonConnectPaymentLink(testReservationId, testUserId);

      expect(payment.amountTon).toBe(10.5);
      expect(payment.comment).toContain('test-item');
      expect(payment.returnUrl).toContain('/radar/payment/success');
      expect(payment.payload).toBeDefined();
    });
  });

  describe('confirmTonConnectPayment', () => {
    it('should confirm payment and create order', async () => {
      // Create test reservation
      await prisma.radarReservation.create({
        data: {
          id: testReservationId,
          roundId: 'test-round',
          itemAddress: 'test-item',
          source: 'randar',
          userId: testUserId,
          priceTon: 10.5,
          status: 'pending',
          reserveToken: 'test-token',
          expiresAt: new Date(Date.now() + 10000)
        }
      });

      const result = await confirmTonConnectPayment(testReservationId, testUserId, { proof: 'test' });

      expect(result.orderId).toBeDefined();

      // Check that order was created
      const order = await prisma.radarOrder.findUnique({
        where: { id: result.orderId }
      });
      expect(order).toBeDefined();
      expect(order?.status).toBe('created');

      // Check that reservation was cancelled
      const reservation = await prisma.radarReservation.findUnique({
        where: { id: testReservationId }
      });
      expect(reservation?.status).toBe('cancelled');
    });
  });

  describe('enqueueExecution', () => {
    it('should update order status to queued', async () => {
      // Create test order
      const order = await prisma.radarOrder.create({
        data: {
          id: testOrderId,
          reservationId: testReservationId,
          userId: testUserId,
          itemAddress: 'test-item',
          source: 'randar',
          priceTon: 10.5,
          status: 'created'
        }
      });

      await enqueueExecution(testOrderId);

      // Check that order status was updated
      const updatedOrder = await prisma.radarOrder.findUnique({
        where: { id: testOrderId }
      });
      expect(updatedOrder?.status).toBe('queued');
    });
  });

  describe('executeOrder', () => {
    it('should execute order and set final status', async () => {
      // Create test order
      await prisma.radarOrder.create({
        data: {
          id: testOrderId,
          reservationId: testReservationId,
          userId: testUserId,
          itemAddress: 'test-item',
          source: 'randar',
          priceTon: 10.5,
          status: 'onchain_pending'
        }
      });

      await executeOrder(testOrderId);

      // Check that order has final status
      const order = await prisma.radarOrder.findUnique({
        where: { id: testOrderId }
      });
      expect(order?.status).toMatch(/onchain_(ok|fail)/);
      
      if (order?.status === 'onchain_ok') {
        expect(order.txHash).toBeDefined();
      }
    }, 10000); // Increase timeout for execution
  });

  describe('deliverOrder', () => {
    it('should deliver successfully executed order', async () => {
      // Create test order with onchain_ok status
      await prisma.radarOrder.create({
        data: {
          id: testOrderId,
          reservationId: testReservationId,
          userId: testUserId,
          itemAddress: 'test-item',
          source: 'randar',
          priceTon: 10.5,
          status: 'onchain_ok',
          txHash: '0x123456789'
        }
      });

      await deliverOrder(testOrderId);

      // Check that order was delivered
      const order = await prisma.radarOrder.findUnique({
        where: { id: testOrderId }
      });
      expect(order?.status).toBe('delivered');
    });

    it('should throw error for non-executed order', async () => {
      // Create test order with created status
      await prisma.radarOrder.create({
        data: {
          id: testOrderId,
          reservationId: testReservationId,
          userId: testUserId,
          itemAddress: 'test-item',
          source: 'randar',
          priceTon: 10.5,
          status: 'created'
        }
      });

      await expect(deliverOrder(testOrderId))
        .rejects.toThrow('Order not ready for delivery');
    });
  });

  describe('getOrder', () => {
    it('should return order info', async () => {
      // Create test order
      await prisma.radarOrder.create({
        data: {
          id: testOrderId,
          reservationId: testReservationId,
          userId: testUserId,
          itemAddress: 'test-item',
          source: 'randar',
          priceTon: 10.5,
          status: 'onchain_ok',
          txHash: '0x123456789'
        }
      });

      const orderInfo = await getOrder(testOrderId, testUserId);

      expect(orderInfo.status).toBe('onchain_ok');
      expect(orderInfo.txHash).toBe('0x123456789');
    });

    it('should throw error for non-existent order', async () => {
      await expect(getOrder('non-existent', testUserId))
        .rejects.toThrow('Order not found');
    });
  });
});
