import { Router } from 'express';
import { Gifts } from '../providers/gifts';
import { memo, setCacheHeaders } from '../util/cache';

const r = Router();

r.get('/collections', async (req,res)=>{
  const data = await memo('collections:gifts', 10*60*1000, async ()=>{
    const collections = await Gifts.listCollections();
    const totalItems = collections.reduce((s,c)=> s+(c.supply||0), 0);
    return { totalCollections: collections.length, totalItems, collections };
  });
  setCacheHeaders(res, 600); 
  res.json(data);
});

r.get('/items', async (req,res)=>{
  const params = {
    collectionId: req.query.collectionId as string | undefined,
    forSale: req.query.forSale === 'true',
    minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
    maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
    search: (req.query.search as string) || undefined,
    sort: (req.query.sort as any) || 'listed_at',
    order: (req.query.order as any) || 'desc',
    limit: req.query.limit ? Number(req.query.limit) : 36,
    cursor: (req.query.cursor as string) || null,
  };
  const key = `items:${JSON.stringify(params)}`;
  const page = await memo(key, 60*1000, () => Gifts.listItems(params));
  setCacheHeaders(res, 60); 
  res.json(page);
});

r.get('/items/:address', async (req,res)=>{
  const item = await memo(`item:${req.params.address}`, 60*1000, () => Gifts.getItem(req.params.address));
  if (!item) return res.status(404).json({ error:'not_found' });
  setCacheHeaders(res, 60); 
  res.json(item);
});

export default r;
