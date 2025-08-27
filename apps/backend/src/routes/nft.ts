import express from 'express';
import { memo } from '../util/cache';
import { tryProviders, getCollections as getCollectionsFromProviders, getItem as getItemFromProviders } from '../providers/gifts';

const router = express.Router();

// GET /api/nft/collections
router.get('/collections', async (req, res) => {
  try {
    const { limit = 100, offset = 0 } = req.query;
    const collections = await memo(
      `collections:${limit}:${offset}`,
      async () => {
        return await getCollectionsFromProviders({ limit: Number(limit), offset: Number(offset) });
      },
      600 // сек
    );

    const totalItems = collections.reduce((s, c) => s + (c.supply || 0), 0);

    res.json({
      success: true,
      collections,
      meta: {
        totalCollections: collections.length,
        totalItems
      },
      pagination: {
        limit: Number(limit),
        offset: Number(offset)
      }
    });
  } catch (error) {
    console.error('Collections error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch collections' });
  }
});

// GET /api/nft/items
router.get('/items', async (req, res) => {
  try {
    const { limit = 20, offset = 0, collectionId, forSale, minPrice, maxPrice } = req.query;

    const params = {
      limit: Number(limit),
      offset: Number(offset),
      collectionId: collectionId as string | undefined,
      forSale: forSale === 'true',
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined
    };

    const items = await memo(
      `items:${JSON.stringify(params)}`,
      async () => await tryProviders(params),
      60 // сек
    );

    res.json({
      success: true,
      items,
      pagination: {
        limit: Number(limit),
        offset: Number(offset),
        total: items.length
      }
    });
  } catch (error) {
    console.error('Items error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch items' });
  }
});

// GET /api/nft/items/:address
router.get('/items/:address', async (req, res) => {
  try {
    const { address } = req.params;

    const item = await memo(
      `item:${address}`,
      async () => await getItemFromProviders(address),
      300 // сек
    );

    if (!item) return res.status(404).json({ success: false, error: 'Item not found' });

    res.json({ success: true, item });
  } catch (error) {
    console.error('Item error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch item' });
  }
});

export default router;
