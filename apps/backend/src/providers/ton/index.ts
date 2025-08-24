import { TonApiProvider } from './TonApiProvider';
import { NftscanProvider } from './NftscanProvider';
import { GiftsProvider } from './TonApiProvider';

export class TonGiftsProvider implements GiftsProvider {
  private tonApi: TonApiProvider;
  private nftscan: NftscanProvider;
  private lastSource: 'tonapi' | 'nftscan' = 'tonapi';

  constructor() {
    this.tonApi = new TonApiProvider(process.env.TONAPI_KEY);
    this.nftscan = new NftscanProvider(process.env.NFTSCAN_TON_API_KEY);
  }

  getResponseHeaders() {
    return {
      'X-Source': this.lastSource,
      'Cache-Control': 'public, max-age=30'
    };
  }

  async getCollections(params: any) {
    try {
      this.lastSource = 'tonapi';
      const result = await this.tonApi.getCollections(params);
      return result;
    } catch (error) {
      console.warn('TonAPI failed, falling back to NFTScan');
      try {
        this.lastSource = 'nftscan';
        const result = await this.nftscan.getCollections(params);
        return result;
      } catch (fallbackError) {
        console.error('Both providers failed:', fallbackError);
        return [];
      }
    }
  }

  async getItems(params: any) {
    try {
      this.lastSource = 'tonapi';
      const result = await this.tonApi.getItems(params);
      return result;
    } catch (error) {
      console.warn('TonAPI failed, falling back to NFTScan');
      try {
        this.lastSource = 'nftscan';
        const result = await this.nftscan.getItems(params);
        return result;
      } catch (fallbackError) {
        console.error('Both providers failed:', fallbackError);
        return { items: [], total: 0 };
      }
    }
  }

  async getCollectionById(id: string) {
    try {
      this.lastSource = 'tonapi';
      const result = await this.tonApi.getCollectionById(id);
      return result;
    } catch (error) {
      console.warn('TonAPI failed, falling back to NFTScan');
      try {
        this.lastSource = 'nftscan';
        const result = await this.nftscan.getCollectionById(id);
        return result;
      } catch (fallbackError) {
        console.error('Both providers failed:', fallbackError);
        throw new Error('Collection not found');
      }
    }
  }

  async getTraits(collectionId: string) {
    try {
      this.lastSource = 'tonapi';
      const result = await this.tonApi.getTraits(collectionId);
      return result;
    } catch (error) {
      console.warn('TonAPI failed, falling back to NFTScan');
      try {
        this.lastSource = 'nftscan';
        const result = await this.nftscan.getTraits(collectionId);
        return result;
      } catch (fallbackError) {
        console.error('Both providers failed:', fallbackError);
        return [];
      }
    }
  }

  async getStats(params: any) {
    try {
      this.lastSource = 'tonapi';
      const result = await this.tonApi.getStats(params);
      return result;
    } catch (error) {
      console.warn('TonAPI failed, falling back to NFTScan');
      try {
        this.lastSource = 'nftscan';
        const result = await this.nftscan.getStats(params);
        return result;
      } catch (fallbackError) {
        console.error('Both providers failed:', fallbackError);
        return {
          floor: 0,
          volume24h: 0,
          volume7d: 0,
          supply: 0,
          owners: 0
        };
      }
    }
  }

  async search(query: string) {
    try {
      this.lastSource = 'tonapi';
      const result = await this.tonApi.search(query);
      return result;
    } catch (error) {
      console.warn('TonAPI failed, falling back to NFTScan');
      try {
        this.lastSource = 'nftscan';
        const result = await this.nftscan.search(query);
        return result;
      } catch (fallbackError) {
        console.error('Both providers failed:', fallbackError);
        return { items: [], total: 0 };
      }
    }
  }

  getResponseHeaders() {
    return {
      'X-Source': this.lastSource,
      'Cache-Control': 'public, max-age=30'
    };
  }
}

export * from './TonApiProvider';
export * from './NftscanProvider';
