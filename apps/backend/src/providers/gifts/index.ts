// apps/backend/src/providers/gifts/index.ts
import type { Collection, Item, ItemPage } from './types';
import tonapiProvider from './tonapi';
import nftscanProvider from './nftscan';

/**
 * Получаем список айтемов (TonAPI → NFTScan)
 */
export async function tryProviders(params: any): Promise<Item[]> {
  try {
    const a = await tonapiProvider.listItems(params);
    if (a.items.length) return a.items;
  } catch {}
  try {
    const b = await nftscanProvider.listItems(params);
    if (b.items.length) return b.items;
  } catch {}
  return [];
}

/**
 * Коллекции (TonAPI, без локальных фолбэков)
 */
export async function getCollections(params: any): Promise<Collection[]> {
  try { return await tonapiProvider.listCollections(params); }
  catch { return []; }
}

/**
 * Один NFT
 */
export async function getItem(address: string): Promise<Item | null> {
  try { const a = await tonapiProvider.getItem(address); if (a) return a; } catch {}
  try { const b = await nftscanProvider.getItem(address); if (b) return b; } catch {}
  return null;
}
