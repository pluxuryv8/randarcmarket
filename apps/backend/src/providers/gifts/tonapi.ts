import type { GiftsProvider, Collection, Item, ItemPage } from './types';
import { toHttp } from '../../util/media';

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

    const response = await fetch(url.toString(), { headers });
    if (!response.ok) {
      throw new Error(`TonAPI error: ${response.status} ${response.statusText}`);
    }
    return response.json();
  }

  async listCollections(params: { limit?: number; offset?: number } = {}): Promise<Collection[]> {
    try {
      const { limit = 100, offset = 0 } = params;
      
      const data = await this.request('/nfts/collections', {
        limit,
        offset,
        include_on_sale: true
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
    limit?: number; 
    offset?: number; 
    collectionId?: string; 
    forSale?: boolean;
    minPrice?: number;
    maxPrice?: number;
  } = {}): Promise<Item[]> {
    try {
      const { limit = 20, offset = 0, collectionId, forSale } = params;
      
      const requestParams: any = {
        limit,
        offset,
        include_on_sale: forSale || false
      };

      if (collectionId) {
        requestParams.collection = collectionId;
      }

      const data = await this.request('/nfts/items', requestParams);

      return data.nft_items?.map((item: any) => ({
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
    } catch (error) {
      console.error('TonAPI items error:', error);
      return [];
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
}

export default new TonAPIProvider();
