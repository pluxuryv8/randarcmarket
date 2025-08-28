import { createOrJoinRound, getResult, getRoundStats } from '../services/radarService';
import { prisma } from '../db/client';

// Mock Prisma
jest.mock('../db/client', () => ({
  prisma: {
    radarRound: {
      findFirst: jest.fn(),
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    radarEntry: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    item: {
      findUnique: jest.fn(),
    },
  },
}));

const mockPrisma = prisma as jest.Mocked<typeof prisma>;

describe('Radar Service - Simple Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create new round successfully', async () => {
    const itemAddress = 'EQDtest123456789';
    const userId = 'user-123';
    const tier = 'free' as const;

    mockPrisma.radarRound.findFirst.mockResolvedValue(null);
    mockPrisma.radarRound.create.mockResolvedValue({
      id: 'round-123',
      itemAddress,
      startsAt: new Date(),
      endsAt: new Date(Date.now() + 500),
      seedHash: 'test-hash',
      serverSeed: 'test-seed',
      status: 'open',
      createdAt: new Date(),
      publicSalt: null,
      rand: null,
      winnersJson: null,
    } as any);

    mockPrisma.radarEntry.findUnique.mockResolvedValue(null);
    mockPrisma.radarEntry.create.mockResolvedValue({
      id: 'entry-123',
      roundId: 'round-123',
      userId,
      tier,
      weight: 1.0,
      createdAt: new Date(),
    } as any);

    const result = await createOrJoinRound(itemAddress, userId, tier);

    expect(result.roundId).toBe('round-123');
    expect(result.seedHash).toBe('test-hash');
    expect(result.roundEndsAt).toBeInstanceOf(Date);
  });

  it('should handle pro tier with higher weight', async () => {
    const itemAddress = 'EQDtest123456789';
    const userId = 'user-123';
    const tier = 'pro' as const;

    mockPrisma.radarRound.findFirst.mockResolvedValue({
      id: 'existing-round-123',
      itemAddress,
      startsAt: new Date(),
      endsAt: new Date(Date.now() + 500),
      seedHash: 'existing-hash',
      serverSeed: 'existing-seed',
      status: 'open',
      createdAt: new Date(),
      publicSalt: null,
      rand: null,
      winnersJson: null,
    } as any);

    mockPrisma.radarEntry.findUnique.mockResolvedValue(null);
    mockPrisma.radarEntry.create.mockResolvedValue({
      id: 'entry-123',
      roundId: 'existing-round-123',
      userId,
      tier,
      weight: 1.25,
      createdAt: new Date(),
    } as any);

    const result = await createOrJoinRound(itemAddress, userId, tier);

    expect(result.roundId).toBe('existing-round-123');
    expect(mockPrisma.radarEntry.create).toHaveBeenCalledWith({
      data: {
        roundId: 'existing-round-123',
        userId,
        tier,
        weight: 1.25, // Pro tier weight
      },
    });
  });

  it('should return correct result for winner', async () => {
    const roundId = 'round-123';
    const userId = 'user-123';

    mockPrisma.radarRound.findUnique.mockResolvedValue({
      id: roundId,
      itemAddress: 'test-nft',
      startsAt: new Date(),
      endsAt: new Date(Date.now() - 1000),
      seedHash: 'test-hash',
      serverSeed: 'test-seed',
      publicSalt: 'test-salt',
      rand: 'test-rand',
      status: 'revealed',
      createdAt: new Date(),
      winnersJson: JSON.stringify([{ userId, weight: 1.0 }]),
      entries: [
        {
          id: 'entry-123',
          roundId,
          userId,
          tier: 'free',
          weight: 1.0,
          createdAt: new Date(),
        },
      ],
    } as any);

    const result = await getResult(roundId, userId);

    expect(result.caught).toBe(true);
    expect(result.itemAddress).toBe('test-nft');
    expect(result.reveal.serverSeed).toBe('test-seed');
    expect(result.reveal.publicSalt).toBe('test-salt');
    expect(result.reveal.rand).toBe('test-rand');
  });

  it('should return correct result for non-winner', async () => {
    const roundId = 'round-123';
    const userId = 'user-123';

    mockPrisma.radarRound.findUnique.mockResolvedValue({
      id: roundId,
      itemAddress: 'test-nft',
      startsAt: new Date(),
      endsAt: new Date(Date.now() - 1000),
      seedHash: 'test-hash',
      serverSeed: 'test-seed',
      publicSalt: 'test-salt',
      rand: 'test-rand',
      status: 'revealed',
      createdAt: new Date(),
      winnersJson: JSON.stringify([{ userId: 'other-user', weight: 1.0 }]),
      entries: [
        {
          id: 'entry-123',
          roundId,
          userId,
          tier: 'free',
          weight: 1.0,
          createdAt: new Date(),
        },
      ],
    } as any);

    const result = await getResult(roundId, userId);

    expect(result.caught).toBe(false);
  });

  it('should return correct statistics', async () => {
    const roundId = 'round-123';

    mockPrisma.radarRound.findUnique.mockResolvedValue({
      id: roundId,
      itemAddress: 'test-nft',
      startsAt: new Date('2024-01-01'),
      endsAt: new Date('2024-01-01T00:00:00.500Z'),
      seedHash: 'test-hash',
      serverSeed: 'test-seed',
      status: 'revealed',
      createdAt: new Date(),
      publicSalt: 'test-salt',
      rand: 'test-rand',
      winnersJson: JSON.stringify([]),
      entries: [
        { userId: 'user1', tier: 'free', weight: 1.0 },
        { userId: 'user2', tier: 'pro', weight: 1.25 },
        { userId: 'user3', tier: 'free', weight: 1.0 },
      ],
    } as any);

    const stats = await getRoundStats(roundId);

    expect(stats.roundId).toBe(roundId);
    expect(stats.itemAddress).toBe('test-nft');
    expect(stats.status).toBe('revealed');
    expect(stats.totalEntries).toBe(3);
    expect(stats.freeEntries).toBe(2);
    expect(stats.proEntries).toBe(1);
    expect(stats.totalWeight).toBe(3.25);
  });
});
