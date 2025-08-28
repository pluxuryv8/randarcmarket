import type { GiftsProvider, Collection, Item, ItemPage, TraitBucket } from './types';
import { toHttp, pickMedia } from '../../util/media';

const BASE = process.env.TONAPI_BASE || 'https://tonapi.io';
const KEY  = process.env.TONAPI_KEY || '';
const H = KEY ? { Authorization: `Bearer ${KEY}` } : {};

function mapCollection(r:any): Collection {
  return {
    id: r.metadata?.slug || r.address || r.name,
    address: r.address,
    title: r.name || r.metadata?.name || r.address,
    cover: toHttp(r.image || r.metadata?.image || r.preview),
    supply: r.items_count ?? r.total_items ?? r.supply,
    owners: r.owners_count ?? r.owners,
    floorTon: r.floor_price_ton ?? r.floor_price ?? r.stats?.floor_price,
    volume24hTon: r.volume_24h_ton ?? r.stats?.volume_24h,
  };
}

function mapItem(r:any): Item {
  const image = pickMedia(r.image, r.metadata?.image, r.preview, r.previews?.[0], r.content?.image, r.metadata?.animation_url);
  return {
    id: r.id || r.address,
    address: r.address,
    title: r.name || r.metadata?.name || r.address,
    image,
    animationUrl: toHttp(r.metadata?.animation_url),
    priceTon: r.sale?.price_ton ?? r.listing?.price_ton ?? r.price_ton,
    forSale: !!(r.sale || r.listing),
    lastSaleTon: r.last_sale_price_ton ?? r.last_sale?.price_ton,
    collectionId: r.collection?.address || r.collection?.id || r.collection_id,
    traits: (r.metadata?.attributes || r.attributes || []).map((t:any)=>({ name: t.trait_type||t.name, value: String(t.value) })),
    updatedAt: r.updated_at || r.time || new Date().toISOString(),
  };
}

export const TonApiProvider: GiftsProvider = {
  async listCollections() {
    // Не завязываемся на один конкретный путь — пробуем несколько известных, берём первый успешный.
    const urls = [
      `${BASE}/v2/nfts/collections?limit=100`,
      `${BASE}/v1/nft/collections?limit=100`,
    ];
    let data:any = null;
    for (const u of urls) {
      try {
        const res = await fetch(u, { headers: H });
        if (res.ok) { data = await res.json(); break; }
      } catch (e) {
        console.warn(`TonAPI collections failed for ${u}:`, e);
      }
    }
    if (!data) {
      console.warn('TonAPI collections failed, returning empty array');
      return [];
    }
    const arr = data.collections || data.nft_collections || data;
    return (arr||[]).map(mapCollection);
  },

  async getCollectionById(id) {
    const urls = [
      `${BASE}/v2/nfts/collections/${id}`,
      `${BASE}/v1/nft/collections/${id}`,
    ];
    for (const u of urls) { 
      try {
        const r = await fetch(u,{headers:H}); 
        if (r.ok) return mapCollection(await r.json()); 
      } catch (e) {
        console.warn(`TonAPI collection ${id} failed for ${u}:`, e);
      }
    }
    return null;
  },

  async getTraits() { return []; }, // добавим позже (кэш/подсчёт)

  async listItems(params) {
    const q = new URLSearchParams();
    if (params.collectionId) q.set('collection', params.collectionId);
    if (params.forSale) q.set('on_sale', 'true');
    if (params.limit) q.set('limit', String(params.limit));
    if (params.cursor) q.set('cursor', String(params.cursor));
    // sort/order/minPrice/maxPrice/traits — добросить по фактической схеме TonAPI
    const urls = [
      `${BASE}/v2/nfts/items?${q.toString()}`,
      `${BASE}/v1/nft/items?${q.toString()}`,
    ];
    for (const u of urls) {
      try {
        const res = await fetch(u, { headers: H });
        if (res.ok) {
          const json = await res.json() as any;
          const list = json.nft_items || json.items || [];
          return { items: list.map(mapItem), nextCursor: json.next || json.cursor || null } as ItemPage;
        }
      } catch (e) {
        console.warn(`TonAPI items failed for ${u}:`, e);
      }
    }
    console.warn('TonAPI items failed, returning empty array');
    return { items: [], nextCursor: null };
  },

  async getItem(address) {
    const urls = [
      `${BASE}/v2/nfts/${address}`,
      `${BASE}/v1/nft/items/${address}`,
    ];
    for (const u of urls) { 
      try {
        const r = await fetch(u,{headers:H}); 
        if (r.ok) return mapItem(await r.json()); 
      } catch (e) {
        console.warn(`TonAPI item ${address} failed for ${u}:`, e);
      }
    }
    return null;
  },

  async listActivity() { return []; }
};
