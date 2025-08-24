import { Router, Request, Response } from 'express';
import { TonGiftsProvider } from '../../providers/ton';
import { ApiResponse } from '../../types';

export const nftRouter = Router();
const giftsProvider = new TonGiftsProvider();

// GET /api/nft/collections
nftRouter.get('/collections', async (req: Request, res: Response) => {
  try {
    const collections = await giftsProvider.getCollections(req.query);
    const headers = giftsProvider.getResponseHeaders();
    
    Object.entries(headers).forEach(([key, value]) => {
      res.setHeader(key, value);
    });
    
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

// GET /api/nft/collections/:id
nftRouter.get('/collections/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const collection = await giftsProvider.getCollectionById(id);
    const headers = giftsProvider.getResponseHeaders();
    
    Object.entries(headers).forEach(([key, value]) => {
      res.setHeader(key, value);
    });
    
    res.json({
      success: true,
      data: collection
    } as ApiResponse);
  } catch (error) {
    console.error('Error in collection details endpoint:', error);
    res.status(404).json({
      success: false,
      error: 'Collection not found'
    } as ApiResponse);
  }
});

// GET /api/nft/collections/:id/traits
nftRouter.get('/collections/:id/traits', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const traits = await giftsProvider.getTraits(id);
    const headers = giftsProvider.getResponseHeaders();
    
    Object.entries(headers).forEach(([key, value]) => {
      res.setHeader(key, value);
    });
    
    res.json({
      success: true,
      data: traits
    } as ApiResponse);
  } catch (error) {
    console.error('Error in collection traits endpoint:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch collection traits'
    } as ApiResponse);
  }
});

// GET /api/nft/items
nftRouter.get('/items', async (req: Request, res: Response) => {
  try {
    const items = await giftsProvider.getItems(req.query);
    const headers = giftsProvider.getResponseHeaders();
    
    Object.entries(headers).forEach(([key, value]) => {
      res.setHeader(key, value);
    });
    
    res.json({
      success: true,
      data: items
    } as ApiResponse);
  } catch (error) {
    console.error('Error in items endpoint:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch items'
    } as ApiResponse);
  }
});

// GET /api/nft/items/:address
nftRouter.get('/items/:address', async (req: Request, res: Response) => {
  try {
    const { address } = req.params;
    const items = await giftsProvider.getItems({ address });
    
    if (!items.items.length) {
      return res.status(404).json({
        success: false,
        error: 'Item not found'
      } as ApiResponse);
    }
    
    const headers = giftsProvider.getResponseHeaders();
    Object.entries(headers).forEach(([key, value]) => {
      res.setHeader(key, value);
    });
    
    res.json({
      success: true,
      data: items.items[0]
    } as ApiResponse);
  } catch (error) {
    console.error('Error in item details endpoint:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch item details'
    } as ApiResponse);
  }
});

// GET /api/nft/search
nftRouter.get('/search', async (req: Request, res: Response) => {
  try {
    const { q } = req.query;
    if (!q || typeof q !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Query parameter required'
      } as ApiResponse);
    }
    
    const results = await giftsProvider.search(q);
    const headers = giftsProvider.getResponseHeaders();
    
    Object.entries(headers).forEach(([key, value]) => {
      res.setHeader(key, value);
    });
    
    res.json({
      success: true,
      data: results
    } as ApiResponse);
  } catch (error) {
    console.error('Error in search endpoint:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to search items'
    } as ApiResponse);
  }
});

// GET /api/nft/activity
nftRouter.get('/activity', async (req: Request, res: Response) => {
  try {
    const limit = Number(req.query.limit) || 50;
    const activity = await giftsProvider.getItems({ limit });
    const headers = giftsProvider.getResponseHeaders();
    
    Object.entries(headers).forEach(([key, value]) => {
      res.setHeader(key, value);
    });
    
    res.json({
      success: true,
      data: activity.items
    } as ApiResponse);
  } catch (error) {
    console.error('Error in activity endpoint:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch activity'
    } as ApiResponse);
  }
});
