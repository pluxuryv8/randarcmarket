import axios from 'axios';
import { GiftsProvider, Collection, Item, ItemPage, TraitBucket, Stats } from './TonApiProvider';

export class NftscanProvider implements GiftsProvider {
  private apiKey: string;
  private baseUrl = 'https://tonapi.nftscan.com/api/v1';

  constructor(apiKey?: string) {
    this.apiKey = apiKey || '';
  }

  private async request(endpoint: string, params: any = {}) {
    const headers: Record<string, string> = {};
    if (this.apiKey) {
      headers['X-API-KEY'] = this.apiKey;
    }

    const response = await axios.get(`${this.baseUrl}/${endpoint}`, {
      headers,
      params
    });

    return response.data;
  }

  async getCollections(params: any): Promise<Collection[]> {
    try {
      const data = await this.request('collections', {
        ...params,
        type: 'gifts'
      });

      return data.result?.map((item: any) => ({
        id: item.contract_address,
        title: item.name,
        image: item.logo_url,
        floor: item.floor_price || 0,
        volume24h: item.volume_24h || 0,
        supply: item.items_count || 0,
        owners: item.owners_count || 0,
        description: item.description
      })) || [];
    } catch (error) {
      console.error('NFTScan getCollections error:', error);
      return [];
    }
  }

  async getItems(params: any): Promise<ItemPage> {
    try {
      const data = await this.request('items', {
        ...params,
        type: 'gifts'
      });

      return {
        items: data.result?.map((item: any) => ({
          address: item.token_address,
          title: item.name,
          image: item.image_url,
          price: item.price,
          isForSale: item.is_for_sale || false,
          traits: item.attributes || {},
          collectionId: item.contract_address,
          rarity: item.rarity_score,
          lastSale: item.last_sale_price,
          owner: item.owner_address
        })) || [],
        total: data.total || 0,
        cursor: data.cursor
      };
    } catch (error) {
      console.error('NFTScan getItems error:', error);
      return { items: [], total: 0 };
    }
  }

  async getCollectionById(id: string): Promise<Collection> {
    try {
      const data = await this.request(`collections/${id}`);
      const item = data.result;

      return {
        id: item.contract_address,
        title: item.name,
        image: item.logo_url,
        floor: item.floor_price || 0,
        volume24h: item.volume_24h || 0,
        supply: item.items_count || 0,
        owners: item.owners_count || 0,
        description: item.description
      };
    } catch (error) {
      console.error('NFTScan getCollectionById error:', error);
      throw new Error('Collection not found');
    }
  }

  async getTraits(collectionId: string): Promise<TraitBucket[]> {
    try {
      const data = await this.request(`collections/${collectionId}/traits`);
      
      const buckets: TraitBucket[] = [];
      for (const [trait, values] of Object.entries(data.result || {})) {
        for (const [value, count] of Object.entries(values as any)) {
          buckets.push({
            trait,
            value,
            count: count as number
          });
        }
      }
      
      return buckets;
    } catch (error) {
      console.error('NFTScan getTraits error:', error);
      return [];
    }
  }

  async getStats(params: any): Promise<Stats> {
    try {
      const data = await this.request('stats', params);
      
      return {
        floor: data.result?.floor || 0,
        volume24h: data.result?.volume_24h || 0,
        volume7d: data.result?.volume_7d || 0,
        supply: data.result?.supply || 0,
        owners: data.result?.owners || 0
      };
    } catch (error) {
      console.error('NFTScan getStats error:', error);
      return {
        floor: 0,
        volume24h: 0,
        volume7d: 0,
        supply: 0,
        owners: 0
      };
    }
  }

  async search(query: string): Promise<ItemPage> {
    try {
      const data = await this.request('search', {
        q: query,
        type: 'gifts'
      });

      return {
        items: data.result?.map((item: any) => ({
          address: item.token_address,
          title: item.name,
          image: item.image_url,
          price: item.price,
          isForSale: item.is_for_sale || false,
          traits: item.attributes || {},
          collectionId: item.contract_address,
          rarity: item.rarity_score,
          lastSale: item.last_sale_price,
          owner: item.owner_address
        })) || [],
        total: data.total || 0
      };
    } catch (error) {
      console.error('NFTScan search error:', error);
      return { items: [], total: 0 };
    }
  }
}
