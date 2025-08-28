import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import { z } from 'zod';
import { AuthenticatedRequest } from '../auth/jwt';
import { 
  addWatchlistFilter, 
  removeWatchlistFilter, 
  getUserWatchlist, 
  getUserSignals,
  startRadarWorker 
} from './worker';
import { WatchlistFilter, ApiResponse } from '../../types';
import { createOrJoinRound, getResult, getRoundStats } from '../../services/radarService';
import { prisma } from '../../db/client';

export const radarRouter = Router();

// Start radar worker when module is loaded
// startRadarWorker(); // Temporarily disabled for debugging

// GET /api/radar/watchlist
radarRouter.get('/watchlist', (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.sub;
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized'
      } as ApiResponse);
    }
    
    const watchlist = getUserWatchlist(userId);
    res.json({
      success: true,
      data: watchlist
    } as ApiResponse);
  } catch (error) {
    console.error('Error getting watchlist:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get watchlist'
    } as ApiResponse);
  }
});

// POST /api/radar/watchlist
radarRouter.post('/watchlist', (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.sub;
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized'
      } as ApiResponse);
    }
    
    const filterData = req.body;
    const filter: WatchlistFilter = {
      id: crypto.randomUUID(),
      user_id: userId,
      collection_address: filterData.collection_address,
      min_price: filterData.min_price,
      max_price: filterData.max_price,
      rarity_filter: filterData.rarity_filter,
      below_floor_percent: filterData.below_floor_percent,
      created_at: new Date()
    };
    
    addWatchlistFilter(userId, filter);
    
    res.json({
      success: true,
      data: filter
    } as ApiResponse);
  } catch (error) {
    console.error('Error creating watchlist filter:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create watchlist filter'
    } as ApiResponse);
  }
});

// DELETE /api/radar/watchlist/:id
radarRouter.delete('/watchlist/:id', (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.sub;
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized'
      } as ApiResponse);
    }
    
    const { id } = req.params;
    const removed = removeWatchlistFilter(userId, id);
    
    if (!removed) {
      return res.status(404).json({
        success: false,
        error: 'Filter not found'
      } as ApiResponse);
    }
    
    res.json({
      success: true,
      message: 'Filter removed successfully'
    } as ApiResponse);
  } catch (error) {
    console.error('Error removing watchlist filter:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to remove watchlist filter'
    } as ApiResponse);
  }
});

// GET /api/radar/notifications
radarRouter.get('/notifications', (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.sub;
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized'
      } as ApiResponse);
    }
    
    const since = req.query.since ? new Date(req.query.since as string) : undefined;
    const signals = getUserSignals(userId, since);
    
    res.json({
      success: true,
      data: signals
    } as ApiResponse);
  } catch (error) {
    console.error('Error getting notifications:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get notifications'
    } as ApiResponse);
  }
});

// Zod schemas для валидации
const joinRequestSchema = z.object({
  itemAddress: z.string().min(1),
  tier: z.enum(['free', 'pro']).default('free')
});

const resultParamsSchema = z.object({
  roundId: z.string().min(1)
});

// POST /api/radar/join - Присоединиться к раунду
radarRouter.post('/join', (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.sub;
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized'
      } as ApiResponse);
    }
    
    const body = joinRequestSchema.parse(req.body);
    
    createOrJoinRound(body.itemAddress, userId, body.tier)
      .then(result => {
        res.json({
          success: true,
          roundId: result.roundId,
          roundEndsAt: result.roundEndsAt,
          seedHash: result.seedHash,
          meta: { source: 'radar' }
        } as ApiResponse);
      })
      .catch(error => {
        console.error('Join radar error:', error);
        
        if (error instanceof z.ZodError) {
          return res.status(400).json({
            success: false,
            error: 'Invalid request data',
            details: error.errors
          } as ApiResponse);
        }
        
        if (error instanceof Error && error.message.includes('already joined')) {
          return res.status(409).json({
            success: false,
            error: 'User already joined this round'
          } as ApiResponse);
        }
        
        res.status(500).json({
          success: false,
          error: 'Failed to join radar round'
        } as ApiResponse);
      });
  } catch (error) {
    console.error('Join radar error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to join radar round'
    } as ApiResponse);
  }
});

// GET /api/radar/result/:roundId - Получить результат раунда
radarRouter.get('/result/:roundId', (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.sub;
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized'
      } as ApiResponse);
    }
    
    const params = resultParamsSchema.parse(req.params);
    
    getResult(params.roundId, userId)
      .then(async result => {
        // Получаем информацию о NFT для фронта
        const item = await prisma.item.findUnique({
          where: { address: result.itemAddress },
          select: { address: true, title: true, image: true }
        });

        res.json({
          success: true,
          caught: result.caught,
          itemAddress: result.itemAddress,
          item: item,
          reveal: result.reveal,
          meta: { source: 'radar' }
        } as ApiResponse);
      })
      .catch(error => {
        console.error('Get result error:', error);
        
        if (error instanceof z.ZodError) {
          return res.status(400).json({
            success: false,
            error: 'Invalid round ID'
          } as ApiResponse);
        }
        
        if (error instanceof Error) {
          if (error.message.includes('not found')) {
            return res.status(404).json({
              success: false,
              error: 'Round not found'
            } as ApiResponse);
          }
          
          if (error.message.includes('did not participate')) {
            return res.status(403).json({
              success: false,
              error: 'User did not participate in this round'
            } as ApiResponse);
          }
          
          if (error.message.includes('not yet revealed')) {
            return res.status(202).json({
              success: false,
              error: 'Round not yet revealed',
              status: 'waiting'
            } as ApiResponse);
          }
        }
        
        res.status(500).json({
          success: false,
          error: 'Failed to get radar result'
        } as ApiResponse);
      });
  } catch (error) {
    console.error('Get result error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get radar result'
    } as ApiResponse);
  }
});

// GET /api/radar/stats/:roundId - Статистика раунда (для отладки)
radarRouter.get('/stats/:roundId', (req: AuthenticatedRequest, res: Response) => {
  try {
    const params = resultParamsSchema.parse(req.params);
    
    getRoundStats(params.roundId)
      .then(stats => {
        res.json({
          success: true,
          stats,
          meta: { source: 'radar' }
        } as ApiResponse);
      })
      .catch(error => {
        console.error('Get stats error:', error);
        
        if (error instanceof Error && error.message.includes('not found')) {
          return res.status(404).json({
            success: false,
            error: 'Round not found'
          } as ApiResponse);
        }
        
        res.status(500).json({
          success: false,
          error: 'Failed to get round stats'
        } as ApiResponse);
      });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get round stats'
    } as ApiResponse);
  }
});
