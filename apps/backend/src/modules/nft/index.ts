import { Router, Request, Response } from 'express';
import { getCollections, getCollectionItems, getItemDetails, getActivity } from './indexer';
import { ApiResponse } from '../../types';

export const nftRouter = Router();

// GET /api/nft/collections
nftRouter.get('/collections', async (req: Request, res: Response) => {
  try {
    const collections = await getCollections();
    res.json({
      success: true,
      data: collections
    } as ApiResponse);
  } catch (error) {
    console.error('Error in collections endpoint:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch collections'
    } as ApiResponse);
  }
});

// GET /api/nft/collections/:id/items
nftRouter.get('/collections/:id/items', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const items = await getCollectionItems(id);
    res.json({
      success: true,
      data: items
    } as ApiResponse);
  } catch (error) {
    console.error('Error in collection items endpoint:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch collection items'
    } as ApiResponse);
  }
});

// GET /api/nft/items/:address
nftRouter.get('/items/:address', async (req: Request, res: Response) => {
  try {
    const { address } = req.params;
    const item = await getItemDetails(address);
    
    if (!item) {
      return res.status(404).json({
        success: false,
        error: 'Item not found'
      } as ApiResponse);
    }
    
    res.json({
      success: true,
      data: item
    } as ApiResponse);
  } catch (error) {
    console.error('Error in item details endpoint:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch item details'
    } as ApiResponse);
  }
});

// GET /api/nft/activity
nftRouter.get('/activity', async (req: Request, res: Response) => {
  try {
    const limit = Number(req.query.limit) || 50;
    const activity = await getActivity(limit);
    res.json({
      success: true,
      data: activity
    } as ApiResponse);
  } catch (error) {
    console.error('Error in activity endpoint:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch activity'
    } as ApiResponse);
  }
});
