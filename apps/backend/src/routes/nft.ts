import express from 'express';
import { z } from 'zod';
import { memo } from '../util/cache';
import { tryProviders, getCollections as getCollectionsFromProviders, getItem as getItemFromProviders } from '../providers/gifts';
import { prisma } from '../db/client';
import { etagOf, notModified } from '../util/httpCache';

const router = express.Router();

// Zod schemas for validation
const collectionsQuery = z.object({
  limit: z.coerce.number().min(1).max(100).default(100),
  offset: z.coerce.number().min(0).max(10000).default(0),
});

const itemsQuery = z.object({
  limit: z.coerce.number().min(1).max(100).default(20),
  offset: z.coerce.number().min(0).max(10000).default(0),
  collectionId: z.string().min(1).optional(),
  forSale: z.enum(['true','false']).optional(),
  minPrice: z.coerce.number().nonnegative().optional(),
  maxPrice: z.coerce.number().nonnegative().optional(),
  source: z.enum(['tonapi','nftscan']).optional()
});

// GET /api/nft/collections
router.get('/collections', async (req, res) => {
  try {
    const q = collectionsQuery.parse(req.query);
    const limit = Math.min(Number(req.query.limit||100), 200);
    const offset = Math.max(Number(req.query.offset||0), 0);

    const rows = await prisma.collection.findMany({
      orderBy: { volume24hTon: 'desc' },
      skip: offset,
      take: limit
    });

    let payload: any = { success:true, collections: rows, meta:{ source: 'db', count: rows.length }};
    let lastMod = new Date().toUTCString();

    const etag = etagOf(payload);
    if (notModified(req, etag, lastMod)) return res.status(304).end();
    res.setHeader('ETag', etag);
    res.setHeader('Last-Modified', lastMod);
    res.setHeader('Cache-Control', 'public, max-age=30');
    return res.json(payload);
  } catch (error) {
    console.error('Collections error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch collections' });
  }
});

// GET /api/nft/items
router.get('/items', async (req, res) => {
  try {
    const q = itemsQuery.parse(req.query);
    const limit = Math.min(Number(req.query.limit||20), 100);
    const offset = Math.max(Number(req.query.offset||0), 0);
    const collectionId = req.query.collectionId as string | undefined;
    const forSale = req.query.forSale === 'true';

    const where:any = {};
    if (collectionId) where.collectionId = collectionId;
    if (forSale) where.forSale = true;

    const rows = await prisma.item.findMany({
      where, orderBy: [{ priceTon: 'asc' }, { updatedAt: 'desc' }],
      skip: offset, take: limit
    });

    let payload:any = { success:true, items: rows, meta:{ source:'db', count: rows.length } };
    const etag = etagOf(payload);
    if (notModified(req, etag)) return res.status(304).end();
    res.setHeader('ETag', etag);
    res.setHeader('Cache-Control','public, max-age=30');
    return res.json(payload);
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

    res.json({ 
      success: true, 
      item, 
      meta: { 
        source: 'auto', 
        count: 1 
      } 
    });
  } catch (error) {
    console.error('Item error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch item' });
  }
});

export default router;
