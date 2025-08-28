import { prisma } from '../db/client';
import {
  isUserWinnerOfRound,
  createReservation,
  expireStaleReservations,
  cancelReservation,
  getUserReservations
} from '../services/radarReservationService';

// Mock Prisma
jest.mock('../db/client', () => ({
  prisma: {
    radarRound: {
      findUnique: jest.fn(),
    },
    radarReservation: {
      findFirst: jest.fn(),
      create: jest.fn(),
      updateMany: jest.fn(),
      findMany: jest.fn(),
    },
  },
}));

const mockPrisma = prisma as jest.Mocked<typeof prisma>;

describe('Radar Reservation Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('isUserWinnerOfRound', () => {
    it('should return true for winner user', async () => {
      const mockRound = {
        itemAddress: 'item-1',
        status: 'revealed',
        winnersJson: JSON.stringify([
          { userId: 'user-1', weight: 1.0, itemAddress: 'item-1', priceTon: 10.5, source: 'randar' }
        ])
      };

      mockPrisma.radarRound.findUnique.mockResolvedValue(mockRound as any);

      const result = await isUserWinnerOfRound('round-1', 'user-1');

      expect(result).toEqual({
        ok: true,
        itemAddress: 'item-1',
        priceTon: 10.5,
        source: 'randar'
      });
    });

    it('should return false for non-winner user', async () => {
      const mockRound = {
        itemAddress: 'item-1',
        status: 'revealed',
        winnersJson: JSON.stringify([
          { userId: 'user-1', weight: 1.0, itemAddress: 'item-1', priceTon: 10.5, source: 'randar' }
        ])
      };

      mockPrisma.radarRound.findUnique.mockResolvedValue(mockRound as any);

      const result = await isUserWinnerOfRound('round-1', 'user-2');

      expect(result).toEqual({ ok: false });
    });

    it('should return false for non-existent round', async () => {
      mockPrisma.radarRound.findUnique.mockResolvedValue(null);

      const result = await isUserWinnerOfRound('round-1', 'user-1');

      expect(result).toEqual({ ok: false });
    });
  });

  describe('createReservation', () => {
    it('should create a new reservation', async () => {
      const mockReservation = {
        id: 'reservation-1',
        reserveToken: 'token123',
        expiresAt: new Date('2024-01-01T00:00:08.000Z')
      };

      // Mock winner check
      mockPrisma.radarRound.findUnique.mockResolvedValue({
        itemAddress: 'item-1',
        status: 'revealed',
        winnersJson: JSON.stringify([
          { userId: 'user-1', weight: 1.0, itemAddress: 'item-1', priceTon: 10.5, source: 'randar' }
        ])
      } as any);

      mockPrisma.radarReservation.findFirst.mockResolvedValue(null);
      mockPrisma.radarReservation.create.mockResolvedValue(mockReservation as any);

      const result = await createReservation({
        roundId: 'round-1',
        userId: 'user-1',
        itemAddress: 'item-1',
        priceTon: 10.5,
        source: 'randar'
      });

      expect(result).toEqual({
        id: 'reservation-1',
        reserveToken: 'token123',
        expiresAt: new Date('2024-01-01T00:00:08.000Z')
      });

      expect(mockPrisma.radarReservation.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          roundId: 'round-1',
          userId: 'user-1',
          itemAddress: 'item-1',
          priceTon: 10.5,
          source: 'randar',
          status: 'pending'
        })
      });
    });

    it('should return existing reservation if already exists', async () => {
      const existingReservation = {
        id: 'reservation-1',
        reserveToken: 'token123',
        expiresAt: new Date('2024-01-01T00:00:08.000Z')
      };

      // Mock winner check
      mockPrisma.radarRound.findUnique.mockResolvedValue({
        itemAddress: 'item-1',
        status: 'revealed',
        winnersJson: JSON.stringify([
          { userId: 'user-1', weight: 1.0, itemAddress: 'item-1', priceTon: 10.5, source: 'randar' }
        ])
      } as any);

      mockPrisma.radarReservation.findFirst.mockResolvedValue(existingReservation as any);

      const result = await createReservation({
        roundId: 'round-1',
        userId: 'user-1',
        itemAddress: 'item-1',
        priceTon: 10.5,
        source: 'randar'
      });

      expect(result).toEqual({
        id: 'reservation-1',
        reserveToken: 'token123',
        expiresAt: new Date('2024-01-01T00:00:08.000Z')
      });

      expect(mockPrisma.radarReservation.create).not.toHaveBeenCalled();
    });
  });

  describe('expireStaleReservations', () => {
    it('should expire stale reservations', async () => {
      mockPrisma.radarReservation.updateMany.mockResolvedValue({ count: 3 } as any);

      const result = await expireStaleReservations();

      expect(result).toBe(3);
      expect(mockPrisma.radarReservation.updateMany).toHaveBeenCalledWith({
        where: {
          status: 'pending',
          expiresAt: {
            lt: expect.any(Date)
          }
        },
        data: {
          status: 'expired'
        }
      });
    });

    it('should return 0 when no stale reservations', async () => {
      mockPrisma.radarReservation.updateMany.mockResolvedValue({ count: 0 } as any);

      const result = await expireStaleReservations();

      expect(result).toBe(0);
    });
  });

  describe('cancelReservation', () => {
    it('should cancel reservation successfully', async () => {
      mockPrisma.radarReservation.updateMany.mockResolvedValue({ count: 1 } as any);

      const result = await cancelReservation('reservation-1', 'user-1');

      expect(result).toBe(true);
      expect(mockPrisma.radarReservation.updateMany).toHaveBeenCalledWith({
        where: {
          id: 'reservation-1',
          userId: 'user-1',
          status: 'pending'
        },
        data: {
          status: 'cancelled'
        }
      });
    });

    it('should return false when reservation not found', async () => {
      mockPrisma.radarReservation.updateMany.mockResolvedValue({ count: 0 } as any);

      const result = await cancelReservation('reservation-1', 'user-1');

      expect(result).toBe(false);
    });
  });

  describe('getUserReservations', () => {
    it('should return user reservations', async () => {
      const mockReservations = [
        {
          id: 'reservation-1',
          status: 'pending',
          itemAddress: 'item-1',
          priceTon: 10.5,
          expiresAt: new Date('2024-01-01T00:00:08.000Z'),
          roundId: 'round-1',
          createdAt: new Date('2024-01-01T00:00:00.000Z'),
          source: 'randar'
        }
      ];

      mockPrisma.radarReservation.findMany.mockResolvedValue(mockReservations as any);

      const result = await getUserReservations('user-1', 10);

      expect(result).toEqual(mockReservations);
      expect(mockPrisma.radarReservation.findMany).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
        orderBy: { createdAt: 'desc' },
        take: 10,
        select: {
          id: true,
          status: true,
          itemAddress: true,
          priceTon: true,
          expiresAt: true,
          roundId: true,
          createdAt: true,
          source: true
        }
      });
    });

    it('should use default limit of 20', async () => {
      mockPrisma.radarReservation.findMany.mockResolvedValue([] as any);

      await getUserReservations('user-1');

      expect(mockPrisma.radarReservation.findMany).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
        orderBy: { createdAt: 'desc' },
        take: 20,
        select: expect.any(Object)
      });
    });
  });
});
