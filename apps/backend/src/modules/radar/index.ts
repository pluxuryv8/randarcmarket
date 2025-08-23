import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import { AuthenticatedRequest } from '../auth/jwt';
import { 
  addWatchlistFilter, 
  removeWatchlistFilter, 
  getUserWatchlist, 
  getUserSignals,
  startRadarWorker 
} from './worker';
import { WatchlistFilter, ApiResponse } from '../../types';

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
