import axios from 'axios';

export interface Collection {
  id: string;
  title: string;
  image: string;
  floor: number;
  volume24h: number;
  supply: number;
  owners: number;
  description?: string;
}

export interface Item {
  address: string;
  title: string;
  image: string;
  price?: number;
  isForSale: boolean;
  traits: Record<string, string>;
  collectionId: string;
  rarity?: number;
  lastSale?: number;
  owner?: string;
}

export interface ItemPage {
  items: Item[];
  total: number;
  cursor?: string;
}

export interface TraitBucket {
  trait: string;
  value: string;
  count: number;
}

export interface Stats {
  floor: number;
  volume24h: number;
  volume7d: number;
  supply: number;
  owners: number;
}

export interface GiftsProvider {
  getCollections(params: any): Promise<Collection[]>;
  getItems(params: any): Promise<ItemPage>;
  getCollectionById(id: string): Promise<Collection>;
  getItem(address: string): Promise<Item>;
  getTraits(collectionId: string): Promise<TraitBucket[]>;
  getStats(params: any): Promise<Stats>;
  getActivity(params: any): Promise<ItemPage>;
  search(query: string): Promise<ItemPage>;
}

export class TonApiProvider implements GiftsProvider {
  private apiKey: string;
  private baseUrl = 'https://toncenter.com/api/v2';

  constructor(apiKey?: string) {
    this.apiKey = apiKey || '';
  }

  private async request(endpoint: string, params: any = {}) {
    const headers: Record<string, string> = {};
    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`;
    }

    const response = await axios.get(`${this.baseUrl}/${endpoint}`, {
      headers,
      params
    });

    return response.data;
  }

  async getCollections(params: any): Promise<Collection[]> {
    try {
      // Используем правильный эндпоинт для коллекций
      const data = await this.request('nft/collections', {
        ...params,
        limit: params.limit || 24
      });

      return data.result?.collections?.map((item: any) => ({
        id: item.address,
        title: item.name,
        image: item.image,
        floor: item.floor_price || 0,
        volume24h: item.volume_24h || 0,
        supply: item.items_count || 0,
        owners: item.owners_count || 0,
        description: item.description
      })) || [];
    } catch (error) {
      console.error('TonAPI getCollections error:', error);
      return [];
    }
  }

  async getItems(params: any): Promise<ItemPage> {
    try {
      // Используем правильный эндпоинт для NFT
      const data = await this.request('nft/items', {
        ...params,
        limit: params.limit || 24
      });

      return {
        items: data.result?.items?.map((item: any) => ({
          address: item.address,
          title: item.name || item.metadata?.name || 'Unknown',
          image: item.metadata?.image || item.image || '',
          price: item.price,
          isForSale: item.is_for_sale || false,
          traits: item.metadata?.attributes || {},
          collectionId: item.collection_address,
          rarity: item.rarity_score,
          lastSale: item.last_sale_price,
          owner: item.owner_address
        })) || [],
        total: data.result?.total || 0,
        cursor: data.result?.cursor
      };
    } catch (error) {
      console.error('TonAPI getItems error:', error);
      return { items: [], total: 0 };
    }
  }

  async getCollectionById(id: string): Promise<Collection> {
    try {
      const data = await this.request(`nft/collections/${id}`);
      const item = data.result;

      return {
        id: item.address,
        title: item.name,
        image: item.image,
        floor: item.floor_price || 0,
        volume24h: item.volume_24h || 0,
        supply: item.items_count || 0,
        owners: item.owners_count || 0,
        description: item.description
      };
    } catch (error) {
      console.error('TonAPI getCollectionById error:', error);
      throw new Error('Collection not found');
    }
  }

  async getItem(address: string): Promise<Item> {
    try {
      const data = await this.request(`nft/items/${address}`);
      const item = data.result;

      return {
        address: item.address,
        title: item.name || item.metadata?.name || 'Unknown',
        image: item.metadata?.image || item.image || '',
        price: item.price,
        isForSale: item.is_for_sale || false,
        traits: item.metadata?.attributes || {},
        collectionId: item.collection_address,
        rarity: item.rarity_score,
        lastSale: item.last_sale_price,
        owner: item.owner_address
      };
    } catch (error) {
      console.error('TonAPI getItem error:', error);
      throw new Error('Item not found');
    }
  }

  async getTraits(collectionId: string): Promise<TraitBucket[]> {
    try {
      const data = await this.request(`nft/collections/${collectionId}/traits`);
      
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
      console.error('TonAPI getTraits error:', error);
      return [];
    }
  }

  async getStats(params: any): Promise<Stats> {
    try {
      const data = await this.request('nft/stats', params);
      
      return {
        floor: data.result?.floor || 0,
        volume24h: data.result?.volume_24h || 0,
        volume7d: data.result?.volume_7d || 0,
        supply: data.result?.supply || 0,
        owners: data.result?.owners || 0
      };
    } catch (error) {
      console.error('TonAPI getStats error:', error);
      return {
        floor: 0,
        volume24h: 0,
        volume7d: 0,
        supply: 0,
        owners: 0
      };
    }
  }

  async getActivity(params: any): Promise<ItemPage> {
    try {
      const data = await this.request('nft/activity', params);
      return {
        items: data.result?.items?.map((item: any) => ({
          address: item.address,
          title: item.name || item.metadata?.name || 'Unknown',
          image: item.metadata?.image || item.image || '',
          price: item.price,
          isForSale: item.is_for_sale || false,
          traits: item.metadata?.attributes || {},
          collectionId: item.collection_address,
          rarity: item.rarity_score,
          lastSale: item.last_sale_price,
          owner: item.owner_address
        })) || [],
        total: data.result?.total || 0,
        cursor: data.result?.cursor
      };
    } catch (error) {
      console.error('TonAPI getActivity error:', error);
      return { items: [], total: 0 };
    }
  }

  async search(query: string): Promise<ItemPage> {
    try {
      const data = await this.request('nft/search', {
        q: query,
        limit: 24
      });

      return {
        items: data.result?.items?.map((item: any) => ({
          address: item.address,
          title: item.name || item.metadata?.name || 'Unknown',
          image: item.metadata?.image || item.image || '',
          price: item.price,
          isForSale: item.is_for_sale || false,
          traits: item.metadata?.attributes || {},
          collectionId: item.collection_address,
          rarity: item.rarity_score,
          lastSale: item.last_sale_price,
          owner: item.owner_address
        })) || [],
        total: data.result?.total || 0
      };
    } catch (error) {
      console.error('TonAPI search error:', error);
      return { items: [], total: 0 };
    }
  }
}
