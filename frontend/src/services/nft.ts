import { NFTCollection, NFTItem, NFTDrop } from '../types/nft';

export type MarketSort = 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc';
export interface MarketQuery {
  q?: string;
  collectionId?: string;
  verifiedOnly?: boolean;
  minPriceTon?: number;
  maxPriceTon?: number;
  page?: number;
  pageSize?: number;
  sort?: MarketSort;
}

// Простые моки, чтобы UI был живым. Позже заменим на реальный API/TON SDK

export async function fetchCollections(): Promise<NFTCollection[]> {
  return new Promise((resolve) => setTimeout(() => resolve([
    {
      id: 'col_1',
      name: 'RandArc Genesis',
      verified: true,
      bannerUrl: 'https://picsum.photos/seed/randarc_col1_banner/1200/400',
      avatarUrl: 'https://picsum.photos/seed/randarc_col1_avatar/200/200',
      floorPriceTon: 12.3,
      volumeTon: 12345,
      items: 1500,
      owners: 890
    },
    {
      id: 'col_2',
      name: 'TON Artifacts',
      verified: true,
      bannerUrl: 'https://picsum.photos/seed/randarc_col2_banner/1200/400',
      avatarUrl: 'https://picsum.photos/seed/randarc_col2_avatar/200/200',
      floorPriceTon: 7.1,
      volumeTon: 8420,
      items: 980,
      owners: 620
    }
  ]), 300));
}

export async function fetchMarketItems(params?: MarketQuery): Promise<NFTItem[]> {
  const {
    q,
    collectionId,
    verifiedOnly,
    minPriceTon,
    maxPriceTon,
    page = 1,
    pageSize = 24,
    sort = 'price_desc'
  } = params || {};

  const all = Array.from({ length: 240 }).map((_, i) => ({
    id: `nft_${i + 1}`,
    name: `RandArc #${i + 1}`,
    imageUrl: `https://picsum.photos/seed/randar_${i}/600/600`,
    collectionId: i % 2 === 0 ? 'col_1' : 'col_2',
    collectionName: i % 2 === 0 ? 'RandArc Genesis' : 'TON Artifacts',
    verified: i % 3 === 0,
    priceTon: Number(((i % 50) + 1 + (i % 7) * 0.13).toFixed(2)),
    priceUsd: undefined,
    traits: [
      { key: 'Rarity', value: ['Common', 'Uncommon', 'Rare', 'Epic'][i % 4] },
      { key: 'Power', value: (i * 3) % 100 }
    ]
  } as NFTItem));

  let filtered = all;
  if (q) filtered = filtered.filter(i => i.name.toLowerCase().includes(q.toLowerCase()));
  if (collectionId) filtered = filtered.filter(i => i.collectionId === collectionId);
  if (verifiedOnly) filtered = filtered.filter(i => i.verified);
  if (minPriceTon !== undefined) filtered = filtered.filter(i => (i.priceTon ?? 0) >= minPriceTon);
  if (maxPriceTon !== undefined) filtered = filtered.filter(i => (i.priceTon ?? 0) <= maxPriceTon);

  filtered = [...filtered].sort((a, b) => {
    switch (sort) {
      case 'price_asc': return (a.priceTon ?? 0) - (b.priceTon ?? 0);
      case 'price_desc': return (b.priceTon ?? 0) - (a.priceTon ?? 0);
      case 'name_desc': return b.name.localeCompare(a.name);
      case 'name_asc':
      default: return a.name.localeCompare(b.name);
    }
  });

  const start = (page - 1) * pageSize;
  const slice = filtered.slice(start, start + pageSize);
  return new Promise((resolve) => setTimeout(() => resolve(slice), 250));
}

export async function fetchDrops(): Promise<NFTDrop[]> {
  const now = Date.now();
  return new Promise((resolve) => setTimeout(() => resolve([
    { id: 'drop_1', title: 'RandArc Mint', imageUrl: 'https://picsum.photos/seed/drop1/800/400', startAt: now + 3600_000, endAt: now + 48 * 3600_000, supply: 5000, minted: 1200 },
    { id: 'drop_2', title: 'TON Relics', imageUrl: 'https://picsum.photos/seed/drop2/800/400', startAt: now - 3600_000, endAt: now + 24 * 3600_000, supply: 3000, minted: 820 },
  ]), 300));
}


