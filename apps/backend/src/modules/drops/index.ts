import { Router, Request, Response } from 'express';
import { v4 as uuid } from 'uuid';
import { AuthenticatedRequest } from '../auth/jwt';
import { Drop, ApiResponse } from '../../types';

export const dropsRouter = Router();

// Mock drops data for MVP
const drops: Drop[] = [
  {
    id: '1',
    name: 'Randar Genesis Collection',
    description: 'Exclusive collection of rare TON NFTs with unique attributes',
    image_url: 'https://example.com/genesis.jpg',
    price_ton: 10,
    max_participants: 1000,
    start_date: new Date('2025-01-01'),
    end_date: new Date('2025-12-31'),
    status: 'active',
    participants_count: 250
  },
  {
    id: '2',
    name: 'Gaming Legends Drop',
    description: 'Collectible gaming-themed NFTs with special utilities',
    image_url: 'https://example.com/gaming.jpg',
    price_ton: 5,
    max_participants: 500,
    start_date: new Date('2025-02-01'),
    end_date: new Date('2025-06-30'),
    status: 'upcoming',
    participants_count: 0
  }
];

// In-memory storage for participants
const participants = new Map<string, Set<string>>();

// GET /api/drops
dropsRouter.get('/', (req: Request, res: Response) => {
  try {
    res.json({
      success: true,
      data: drops
    } as ApiResponse);
  } catch (error) {
    console.error('Error getting drops:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get drops'
    } as ApiResponse);
  }
});

// GET /api/drops/:id
dropsRouter.get('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const drop = drops.find(d => d.id === id);
    
    if (!drop) {
      return res.status(404).json({
        success: false,
        error: 'Drop not found'
      } as ApiResponse);
    }
    
    res.json({
      success: true,
      data: drop
    } as ApiResponse);
  } catch (error) {
    console.error('Error getting drop:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get drop'
    } as ApiResponse);
  }
});

// POST /api/drops/:id/participate
dropsRouter.post('/:id/participate', (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.user_id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized'
      } as ApiResponse);
    }
    
    const { id } = req.params;
    const drop = drops.find(d => d.id === id);
    
    if (!drop) {
      return res.status(404).json({
        success: false,
        error: 'Drop not found'
      } as ApiResponse);
    }
    
    if (drop.status !== 'active') {
      return res.status(400).json({
        success: false,
        error: 'Drop is not active'
      } as ApiResponse);
    }
    
    // Check if user already participated
    const dropParticipants = participants.get(id) || new Set();
    if (dropParticipants.has(userId)) {
      return res.status(400).json({
        success: false,
        error: 'Already participated in this drop'
      } as ApiResponse);
    }
    
    // Check if drop is full
    if (drop.max_participants && drop.participants_count >= drop.max_participants) {
      return res.status(400).json({
        success: false,
        error: 'Drop is full'
      } as ApiResponse);
    }
    
    // Add participant
    dropParticipants.add(userId);
    participants.set(id, dropParticipants);
    drop.participants_count++;
    
    res.json({
      success: true,
      data: {
        drop_id: id,
        user_id: userId,
        message: 'Successfully joined the drop'
      }
    } as ApiResponse);
  } catch (error) {
    console.error('Error participating in drop:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to participate in drop'
    } as ApiResponse);
  }
});
