import type { GiftsProvider, Collection, Item, ItemPage } from './types';
import { toHttp } from '../../util/media';
import { httpGetJson } from '../../util/http';
import { providerSuccess, providerFailure } from '../../observability/metrics';

const TONAPI_BASE = 'https://tonapi.io/v2';
const TONAPI_KEY = process.env.TONAPI_KEY;

class TonAPIProvider implements GiftsProvider {
  private async request(endpoint: string, params: Record<string, any> = {}) {
    const url = new URL(`${TONAPI_BASE}${endpoint}`);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value));
      }
    });

    const headers: Record<string, string> = {};
    if (TONAPI_KEY) headers['Authorization'] = `Bearer ${TONAPI_KEY}`;

    try {
      const json = await httpGetJson(url.toString(), { headers, provider: 'tonapi', endpoint });
      providerSuccess.inc({ provider: 'tonapi', endpoint });
      return json;
    } catch (e) {
      providerFailure.inc({ provider: 'tonapi', endpoint });
      throw e;
    }
  }

  async listCollections(params: { search?: string } = {}): Promise<Collection[]> {
    try {
      const { search } = params;
      
      const data = await this.request('/nfts/collections', {
        limit: 100,
        offset: 0,
        include_on_sale: true,
        ...(search && { name: search })
      });

      return data.nft_collections?.map((collection: any) => ({
        id: collection.address,
        address: collection.address,
        title: collection.name || 'Unknown Collection',
        cover: toHttp(collection.metadata?.image || collection.metadata?.cover_image) || undefined,
        supply: collection.nft_count || 0,
        owners: collection.owner_count || 0,
        floorTon: collection.floor_price?.ton || 0,
        volume24hTon: collection.volume_24h?.ton || 0
      })) || [];
    } catch (error) {
      console.error('TonAPI collections error:', error);
      return [];
    }
  }

  async listItems(params: {
    collectionId?: string; forSale?: boolean; minPrice?: number; maxPrice?: number;
    traits?: Record<string,string[]>; search?: string; sort?: 'price'|'listed_at'|'sold_at'|'volume_24h';
    order?: 'asc'|'desc'; limit?: number; cursor?: string|null;
  } = {}): Promise<ItemPage> {
    try {
      const { limit = 20, collectionId, forSale, search } = params;
      
      const requestParams: any = {
        limit,
        offset: 0,
        include_on_sale: forSale || false
      };

      if (collectionId) {
        requestParams.collection = collectionId;
      }

      if (search) {
        requestParams.name = search;
      }

      const data = await this.request('/nfts/items', requestParams);

      const items = data.nft_items?.map((item: any) => ({
        id: item.address,
        address: item.address,
        title: item.metadata?.name || `NFT #${item.index}`,
        image: toHttp(item.metadata?.image) || undefined,
        animationUrl: toHttp(item.metadata?.animation_url) || undefined,
        priceTon: item.sale?.price?.ton || 0,
        forSale: !!item.sale,
        lastSaleTon: item.last_sale?.price?.ton || 0,
        collectionId: item.collection?.address,
        traits: item.metadata?.attributes?.map((attr: any) => ({
          name: attr.trait_type,
          value: attr.value
        })) || [],
        updatedAt: item.last_activity_time || new Date().toISOString()
      })) || [];

      return { items, nextCursor: null };
    } catch (error) {
      console.error('TonAPI items error:', error);
      return { items: [], nextCursor: null };
    }
  }

  async getItem(address: string): Promise<Item | null> {
    try {
      const data = await this.request(`/nfts/items/${address}`);
      
      if (!data.nft_item) return null;

      const item = data.nft_item;
      
      return {
        id: item.address,
        address: item.address,
        title: item.metadata?.name || `NFT #${item.index}`,
        image: toHttp(item.metadata?.image) || undefined,
        animationUrl: toHttp(item.metadata?.animation_url) || undefined,
        priceTon: item.sale?.price?.ton || 0,
        forSale: !!item.sale,
        lastSaleTon: item.last_sale?.price?.ton || 0,
        collectionId: item.collection?.address,
        traits: item.metadata?.attributes?.map((attr: any) => ({
          name: attr.trait_type,
          value: attr.value
        })) || [],
        updatedAt: item.last_activity_time || new Date().toISOString()
      };
    } catch (error) {
      console.error('TonAPI item error:', error);
      return null;
    }
  }

  async getCollectionById(id: string): Promise<Collection | null> {
    try {
      const data = await this.request(`/nfts/collections/${id}`);
      
      if (!data.nft_collection) return null;

      const collection = data.nft_collection;
      
      return {
        id: collection.address,
        address: collection.address,
        title: collection.name || 'Unknown Collection',
        cover: toHttp(collection.metadata?.image || collection.metadata?.cover_image) || undefined,
        supply: collection.nft_count || 0,
        owners: collection.owner_count || 0,
        floorTon: collection.floor_price?.ton || 0,
        volume24hTon: collection.volume_24h?.ton || 0
      };
    } catch (error) {
      console.error('TonAPI collection error:', error);
      return null;
    }
  }

  async getTraits(collectionId: string): Promise<any[]> {
    // TODO: Implement traits fetching
    return [];
  }

  async listActivity(params: { collectionId?: string; since?: string }): Promise<any[]> {
    // TODO: Implement activity fetching
    return [];
  }
}

export default new TonAPIProvider();
