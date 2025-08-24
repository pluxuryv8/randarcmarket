import type { GiftsProvider } from './types';
import { TonApiProvider } from './tonapi';
import { NftscanProvider } from './nftscan';
import { LocalProvider } from './local';

async function tryProviders<T>(fn: (p:GiftsProvider)=>Promise<T>): Promise<T> {
  try { 
    const result = await fn(TonApiProvider);
    // Проверяем, что результат не пустой
    if (Array.isArray(result) && result.length === 0) {
      throw new Error('TonAPI returned empty array');
    }
    if (result && typeof result === 'object' && 'items' in result && Array.isArray(result.items) && result.items.length === 0) {
      throw new Error('TonAPI returned empty items');
    }
    return result;
  } catch (e) {
    console.warn('TonAPI failed, trying NFTScan:', e);
    try {
      const result = await fn(NftscanProvider);
      // Проверяем, что результат не пустой
      if (Array.isArray(result) && result.length === 0) {
        throw new Error('NFTScan returned empty array');
      }
      if (result && typeof result === 'object' && 'items' in result && Array.isArray(result.items) && result.items.length === 0) {
        throw new Error('NFTScan returned empty items');
      }
      return result;
    } catch (e2) {
      console.warn('NFTScan failed, using local fallback:', e2);
      return await fn(LocalProvider);
    }
  }
}

export const Gifts: GiftsProvider = {
  listCollections: () => tryProviders(p=>p.listCollections()),
  getCollectionById: (id) => tryProviders(p=>p.getCollectionById(id)),
  getTraits: (id) => tryProviders(p=>p.getTraits(id)),
  listItems: (params) => tryProviders(p=>p.listItems(params)),
  getItem: (addr) => tryProviders(p=>p.getItem(addr)),
  listActivity: (params) => tryProviders(p=>p.listActivity(params)),
};
