import type { GiftsProvider, Collection, Item, ItemPage, TraitBucket } from './types';
import { toHttp, pickMedia } from '../../util/media';
import { httpGetJson } from '../../util/http';
import { providerSuccess, providerFailure } from '../../observability/metrics';

const BASE = process.env.NFTSCAN_BASE || 'https://api.nftscan.com';
const KEY  = process.env.NFTSCAN_TON_API_KEY || '';

function mapCollection(r:any): Collection {
  return {
    id: r.contract_address || r.address || r.name,
    address: r.contract_address || r.address,
    title: r.name || r.collection_name || r.address,
    cover: toHttp(r.logo_url || r.image_url || r.banner_url),
    supply: r.items_total ?? r.total_supply ?? r.supply,
    owners: r.owners_total ?? r.unique_owners ?? r.owners,
    floorTon: r.floor_price ?? r.floor_price_ton ?? r.stats?.floor_price,
    volume24hTon: r.volume_24h ?? r.volume_24h_ton ?? r.stats?.volume_24h,
  };
}

function mapItem(r:any): Item {
  const image = pickMedia(r.image_url, r.metadata?.image, r.logo_url, r.previews?.[0], r.content?.image, r.metadata?.animation_url);
  return {
    id: r.token_id || r.address,
    address: r.contract_address || r.address,
    title: r.name || r.metadata?.name || r.token_id || r.address,
    image,
    animationUrl: toHttp(r.metadata?.animation_url),
    priceTon: r.listing_price ?? r.price ?? r.price_ton,
    forSale: !!(r.listing_price || r.price || r.is_listed),
    lastSaleTon: r.last_sale_price ?? r.last_sale_price_ton,
    collectionId: r.contract_address || r.collection_address || r.collection_id,
    traits: (r.metadata?.attributes || r.attributes || []).map((t:any)=>({ name: t.trait_type||t.name, value: String(t.value) })),
    updatedAt: r.updated_at || r.last_updated || new Date().toISOString(),
  };
}

export const NftscanProvider: GiftsProvider = {
  async listCollections() {
    const urls = [
      `${BASE}/v1/collections?chain=ton&limit=100`,
      `${BASE}/v2/collections?chain=ton&limit=100`,
    ];
    let data:any = null;
    for (const u of urls) {
      try {
        const headers: Record<string,string> = { 'Accept':'application/json', 'Content-Type':'application/json' };
        if (KEY) headers['X-API-KEY'] = KEY;
        
        const json = await httpGetJson(u, { headers, provider: 'nftscan', endpoint: '/collections' });
        providerSuccess.inc({ provider: 'nftscan', endpoint: '/collections' });
        data = json;
        break;
      } catch (e) {
        providerFailure.inc({ provider: 'nftscan', endpoint: '/collections' });
        console.warn(`NFTScan collections failed for ${u}:`, e);
      }
    }
    if (!data) {
      console.warn('NFTScan collections failed, returning empty array');
      return [];
    }
    const arr = data.data || data.collections || data;
    return (arr||[]).map(mapCollection);
  },

  async getCollectionById(id) {
    const urls = [
      `${BASE}/v1/collections/${id}?chain=ton`,
      `${BASE}/v2/collections/${id}?chain=ton`,
    ];
    for (const u of urls) { 
      try {
        const headers: Record<string,string> = { 'Accept':'application/json', 'Content-Type':'application/json' };
        if (KEY) headers['X-API-KEY'] = KEY;
        
        const data = await httpGetJson(u, { headers, provider: 'nftscan', endpoint: `/collections/${id}` });
        providerSuccess.inc({ provider: 'nftscan', endpoint: `/collections/${id}` });
        return mapCollection(data.data || data); 
      } catch (e) {
        providerFailure.inc({ provider: 'nftscan', endpoint: `/collections/${id}` });
        console.warn(`NFTScan collection ${id} failed for ${u}:`, e);
      }
    }
    return null;
  },

  async getTraits() { return []; }, // добавим позже (кэш/подсчёт)

  async listItems(params) {
    const q = new URLSearchParams();
    q.set('chain', 'ton');
    if (params.collectionId) q.set('contract_address', params.collectionId);
    if (params.forSale) q.set('is_listed', 'true');
    if (params.limit) q.set('limit', String(params.limit));
    if (params.cursor) q.set('cursor', String(params.cursor));
    
    const urls = [
      `${BASE}/v1/assets?${q.toString()}`,
      `${BASE}/v2/assets?${q.toString()}`,
    ];
    for (const u of urls) {
      try {
        const headers: Record<string,string> = { 'Accept':'application/json', 'Content-Type':'application/json' };
        if (KEY) headers['X-API-KEY'] = KEY;
        
        const json = await httpGetJson(u, { headers, provider: 'nftscan', endpoint: '/assets' });
        providerSuccess.inc({ provider: 'nftscan', endpoint: '/assets' });
        const list = json.data || json.assets || [];
        return { items: list.map(mapItem), nextCursor: json.next_cursor || json.cursor || null } as ItemPage;
      } catch (e) {
        providerFailure.inc({ provider: 'nftscan', endpoint: '/assets' });
        console.warn(`NFTScan items failed for ${u}:`, e);
      }
    }
    console.warn('NFTScan items failed, returning empty array');
    return { items: [], nextCursor: null };
  },

  async getItem(address) {
    const urls = [
      `${BASE}/v1/assets/${address}?chain=ton`,
      `${BASE}/v2/assets/${address}?chain=ton`,
    ];
    for (const u of urls) { 
      try {
        const headers: Record<string,string> = { 'Accept':'application/json', 'Content-Type':'application/json' };
        if (KEY) headers['X-API-KEY'] = KEY;
        
        const data = await httpGetJson(u, { headers, provider: 'nftscan', endpoint: `/assets/${address}` });
        providerSuccess.inc({ provider: 'nftscan', endpoint: `/assets/${address}` });
        return mapItem(data.data || data); 
      } catch (e) {
        providerFailure.inc({ provider: 'nftscan', endpoint: `/assets/${address}` });
        console.warn(`NFTScan item ${address} failed for ${u}:`, e);
      }
    }
    return null;
  },

  async listActivity() { return []; }
};

export default NftscanProvider;
