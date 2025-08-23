import axios from 'axios';
import { NFTCollection, NFTItem, ApiResponse } from '../../types';

const NFTSCAN_API_KEY = process.env.NFTSCAN_TON_API_KEY;
const TONAPI_KEY = process.env.TONAPI_KEY;

// Cache for 30 seconds
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 30 * 1000; // 30 seconds

async function getCachedData(key: string, fetcher: () => Promise<any>) {
  const cached = cache.get(key);
  const now = Date.now();
  
  if (cached && (now - cached.timestamp) < CACHE_TTL) {
    return cached.data;
  }
  
  const data = await fetcher();
  cache.set(key, { data, timestamp: now });
  return data;
}

async function fetchFromNFTScan(endpoint: string) {
  if (!NFTSCAN_API_KEY) {
    throw new Error('NFTScan API key not configured');
  }
  
  const response = await axios.get(`https://tonapi.nftscan.com/api/v1/${endpoint}`, {
    headers: {
      'X-API-KEY': NFTSCAN_API_KEY
    }
  });
  
  return response.data;
}

async function fetchFromTonAPI(endpoint: string) {
  const headers: Record<string, string> = {};
  if (TONAPI_KEY) {
    headers['Authorization'] = `Bearer ${TONAPI_KEY}`;
  }
  
  const response = await axios.get(`https://toncenter.com/api/v2/${endpoint}`, {
    headers
  });
  
  return response.data;
}

export async function getCollections(): Promise<NFTCollection[]> {
  try {
    return await getCachedData('collections', async () => {
      try {
        // Try NFTScan first
        const data = await fetchFromNFTScan('collections');
        return data.result?.map((item: any) => ({
          address: item.contract_address,
          name: item.name,
          description: item.description,
          image_url: item.logo_url,
          floor_price: item.floor_price,
          volume_24h: item.volume_24h,
          items_count: item.items_count,
          owners_count: item.owners_count
        })) || [];
      } catch (error) {
        console.warn('NFTScan failed, falling back to TonAPI');
        
        // Fallback to TonAPI
        const data = await fetchFromTonAPI('collections');
        return data.result?.map((item: any) => ({
          address: item.address,
          name: item.name,
          description: item.description,
          image_url: item.image,
          floor_price: item.floor_price,
          volume_24h: item.volume_24h,
          items_count: item.items_count,
          owners_count: item.owners_count
        })) || [];
      }
    });
  } catch (error) {
    console.error('Error fetching collections:', error);
    return [];
  }
}

export async function getCollectionItems(collectionAddress: string): Promise<NFTItem[]> {
  try {
    return await getCachedData(`collection_${collectionAddress}`, async () => {
      try {
        // Try NFTScan first
        const data = await fetchFromNFTScan(`collections/${collectionAddress}/items`);
        return data.result?.map((item: any) => ({
          address: item.token_address,
          collection_address: collectionAddress,
          name: item.name,
          description: item.description,
          image_url: item.image_url,
          attributes: item.attributes,
          price: item.price,
          owner: item.owner,
          last_sale: item.last_sale_price,
          rarity_score: item.rarity_score
        })) || [];
      } catch (error) {
        console.warn('NFTScan failed, falling back to TonAPI');
        
        // Fallback to TonAPI
        const data = await fetchFromTonAPI(`collections/${collectionAddress}/items`);
        return data.result?.map((item: any) => ({
          address: item.address,
          collection_address: collectionAddress,
          name: item.name,
          description: item.description,
          image_url: item.image,
          attributes: item.attributes,
          price: item.price,
          owner: item.owner,
          last_sale: item.last_sale,
          rarity_score: item.rarity_score
        })) || [];
      }
    });
  } catch (error) {
    console.error('Error fetching collection items:', error);
    return [];
  }
}

export async function getItemDetails(itemAddress: string): Promise<NFTItem | null> {
  try {
    return await getCachedData(`item_${itemAddress}`, async () => {
      try {
        // Try NFTScan first
        const data = await fetchFromNFTScan(`items/${itemAddress}`);
        const item = data.result;
        
        if (!item) return null;
        
        return {
          address: item.token_address,
          collection_address: item.collection_address,
          name: item.name,
          description: item.description,
          image_url: item.image_url,
          attributes: item.attributes,
          price: item.price,
          owner: item.owner,
          last_sale: item.last_sale_price,
          rarity_score: item.rarity_score
        };
      } catch (error) {
        console.warn('NFTScan failed, falling back to TonAPI');
        
        // Fallback to TonAPI
        const data = await fetchFromTonAPI(`items/${itemAddress}`);
        const item = data.result;
        
        if (!item) return null;
        
        return {
          address: item.address,
          collection_address: item.collection_address,
          name: item.name,
          description: item.description,
          image_url: item.image,
          attributes: item.attributes,
          price: item.price,
          owner: item.owner,
          last_sale: item.last_sale,
          rarity_score: item.rarity_score
        };
      }
    });
  } catch (error) {
    console.error('Error fetching item details:', error);
    return null;
  }
}

export async function getActivity(limit = 50): Promise<any[]> {
  try {
    return await getCachedData(`activity_${limit}`, async () => {
      try {
        // Try NFTScan first
        const data = await fetchFromNFTScan(`events?limit=${limit}`);
        return data.result || [];
      } catch (error) {
        console.warn('NFTScan failed, falling back to TonAPI');
        
        // Fallback to TonAPI
        const data = await fetchFromTonAPI(`events?limit=${limit}`);
        return data.result || [];
      }
    });
  } catch (error) {
    console.error('Error fetching activity:', error);
    return [];
  }
}
