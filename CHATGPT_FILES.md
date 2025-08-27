# 📁 Файлы проекта Randar Market для ChatGPT

## 🔑 Минимум файлов (без них я не смогу оценить)

### 1. apps/backend/src/index.ts
```typescript
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'combined';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

import { authRouter } from './modules/auth';
import nftRoutes from './routes/nft';
import { paymentsRouter } from './modules/payments';
import { radarRouter } from './modules/radar';
import { dropsRouter } from './modules/drops';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: CLIENT_ORIGIN,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Logging
app.use(morgan('combined'));

// Compression
app.use(compression());

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API routes
app.use('/api/auth', authRouter);
app.use('/api/nft', nftRoutes);  // ← NFT маршруты подключены
app.use('/api/payments', paymentsRouter);
app.use('/api/radar', radarRouter);
app.use('/api/drops', dropsRouter);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    error: 'Route not found' 
  });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  
  res.status(err.status || 500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Randar Market Backend running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;
```

### 2. apps/backend/src/routes/nft.ts
```typescript
import express from 'express';
import { tryProviders } from '../providers/gifts';
import { memo } from '../util/cache';

const router = express.Router();

// GET /api/nft/collections
router.get('/collections', async (req, res) => {
  try {
    const { limit = 100, offset = 0 } = req.query;
    
    const collections = await memo(
      `collections:${limit}:${offset}`,
      async () => {
        // Пока используем только TonAPI для коллекций
        const tonapiProvider = (await import('../providers/gifts/tonapi')).default;
        return await tonapiProvider.listCollections({ limit: Number(limit), offset: Number(offset) });
      },
      600 // 10 минут кэш
    );

    res.json({
      success: true,
      collections,
      pagination: {
        limit: Number(limit),
        offset: Number(offset),
        total: collections.length
      }
    });
  } catch (error) {
    console.error('Collections error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch collections' });
  }
});

// GET /api/nft/items
router.get('/items', async (req, res) => {
  try {
    const { 
      limit = 20, 
      offset = 0, 
      collectionId, 
      forSale, 
      minPrice, 
      maxPrice 
    } = req.query;

    const params = {
      limit: Number(limit),
      offset: Number(offset),
      collectionId: collectionId as string,
      forSale: forSale === 'true',
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined
    };

    const items = await memo(
      `items:${JSON.stringify(params)}`,
      async () => {
        return await tryProviders(params);
      },
      60 // 1 минута кэш
    );

    res.json({
      success: true,
      items,
      pagination: {
        limit: Number(limit),
        offset: Number(offset),
        total: items.length
      }
    });
  } catch (error) {
    console.error('Items error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch items' });
  }
});

// GET /api/nft/items/:address
router.get('/items/:address', async (req, res) => {
  try {
    const { address } = req.params;
    
    const item = await memo(
      `item:${address}`,
      async () => {
        return await tryProviders({ address });
      },
      300 // 5 минут кэш
    );

    if (!item) {
      return res.status(404).json({ success: false, error: 'Item not found' });
    }

    res.json({ success: true, item });
  } catch (error) {
    console.error('Item error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch item' });
  }
});

export default router;
```

### 3. apps/backend/src/util/media.ts
```typescript
/**
 * Нормализация IPFS URL в HTTPS
 */
export function toHttp(url?: string): string | undefined {
  if (!url) return undefined;
  
  // IPFS gateway
  if (url.startsWith('ipfs://')) {
    return url.replace('ipfs://', 'https://cloudflare-ipfs.com/ipfs/');
  }
  
  // Протокол-относительные URL
  if (url.startsWith('//')) {
    return `https:${url}`;
  }
  
  // Уже HTTPS
  if (url.startsWith('https://')) {
    return url;
  }
  
  // HTTP → HTTPS
  if (url.startsWith('http://')) {
    return url.replace('http://', 'https://');
  }
  
  // Относительные URL
  if (url.startsWith('/')) {
    return `https://example.com${url}`;
  }
  
  // Fallback
  return `https://${url}`;
}

/**
 * Проверка валидности URL
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
```

### 4. apps/backend/src/providers/gifts/tonapi.ts
```typescript
import type { GiftsProvider, Collection, Item, ItemPage } from './types';
import { toHttp } from '../../util/media';

const TONAPI_BASE = 'https://tonapi.io/v2';
const TONAPI_KEY = process.env.TONAPI_KEY;

class TonAPIProvider implements GiftsProvider {
  private async request(endpoint: string, params: Record<string, any> = {}) {
    const url = new URL(`${TONAPI_BASE}${endpoint}`);
    
    if (TONAPI_KEY) {
      url.searchParams.set('api_key', TONAPI_KEY);
    }
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value));
      }
    });

    const response = await fetch(url.toString());
    
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
        cover: toHttp(collection.metadata?.image || collection.metadata?.cover_image),
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
        image: toHttp(item.metadata?.image),
        animationUrl: toHttp(item.metadata?.animation_url),
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
        image: toHttp(item.metadata?.image),
        animationUrl: toHttp(item.metadata?.animation_url),
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
```

### 5. apps/backend/src/providers/gifts/nftscan.ts
```typescript
import type { GiftsProvider, Collection, Item, ItemPage } from './types';
import { toHttp } from '../../util/media';

const NFTSCAN_BASE = 'https://api.nftscan.com';
const NFTSCAN_KEY = process.env.NFTSCAN_TON_API_KEY;

class NFTScanProvider implements GiftsProvider {
  private async request(endpoint: string, params: Record<string, any> = {}) {
    const url = new URL(`${NFTSCAN_BASE}${endpoint}`);
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value));
      }
    });

    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    if (NFTSCAN_KEY) {
      headers['X-API-KEY'] = NFTSCAN_KEY;
    }

    const response = await fetch(url.toString(), { headers });
    
    if (!response.ok) {
      throw new Error(`NFTScan error: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
  }

  async listCollections(params: { limit?: number; offset?: number } = {}): Promise<Collection[]> {
    try {
      const { limit = 100, offset = 0 } = params;
      
      const data = await this.request('/v1/collections', {
        chain: 'ton',
        limit,
        offset
      });

      return data.data?.map((collection: any) => ({
        id: collection.contract_address,
        address: collection.contract_address,
        title: collection.name || 'Unknown Collection',
        cover: toHttp(collection.logo_url || collection.banner_url),
        supply: collection.items_total || 0,
        owners: collection.owners_total || 0,
        floorTon: collection.floor_price || 0,
        volume24hTon: collection.volume_24h || 0
      })) || [];
    } catch (error) {
      console.error('NFTScan collections error:', error);
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
        chain: 'ton',
        limit,
        offset
      };

      if (collectionId) {
        requestParams.contract_address = collectionId;
      }

      if (forSale) {
        requestParams.is_listed = true;
      }

      // Пробуем v1 API
      let data;
      try {
        data = await this.request('/v1/assets', requestParams);
      } catch {
        // Fallback на v2 API
        data = await this.request('/v2/assets', requestParams);
      }

      return data.data?.map((item: any) => ({
        id: item.contract_address + '_' + item.token_id,
        address: item.contract_address + '_' + item.token_id,
        title: item.name || `NFT #${item.token_id}`,
        image: toHttp(item.image_uri || item.image_url),
        animationUrl: toHttp(item.animation_uri),
        priceTon: item.listing_price || 0,
        forSale: !!item.listing_price,
        lastSaleTon: item.last_sale_price || 0,
        collectionId: item.contract_address,
        traits: item.attributes?.map((attr: any) => ({
          name: attr.trait_type,
          value: attr.value
        })) || [],
        updatedAt: item.last_updated || new Date().toISOString()
      })) || [];
    } catch (error) {
      console.error('NFTScan items error:', error);
      return [];
    }
  }

  async getItem(address: string): Promise<Item | null> {
    try {
      const [contractAddress, tokenId] = address.split('_');
      
      const data = await this.request(`/v1/assets/${contractAddress}/${tokenId}`, {
        chain: 'ton'
      });
      
      if (!data.data) return null;

      const item = data.data;
      
      return {
        id: item.contract_address + '_' + item.token_id,
        address: item.contract_address + '_' + item.token_id,
        title: item.name || `NFT #${item.token_id}`,
        image: toHttp(item.image_uri || item.image_url),
        animationUrl: toHttp(item.animation_uri),
        priceTon: item.listing_price || 0,
        forSale: !!item.listing_price,
        lastSaleTon: item.last_sale_price || 0,
        collectionId: item.contract_address,
        traits: item.attributes?.map((attr: any) => ({
          name: attr.trait_type,
          value: attr.value
        })) || [],
        updatedAt: item.last_updated || new Date().toISOString()
      };
    } catch (error) {
      console.error('NFTScan item error:', error);
      return null;
    }
  }
}

export default new NFTScanProvider();
```

### 6. apps/backend/src/providers/gifts/index.ts
```typescript
import type { GiftsProvider, Collection, Item, ItemPage } from './types';
import tonapiProvider from './tonapi';
import nftscanProvider from './nftscan';
import localProvider from './local';

/**
 * Пробуем провайдеры по порядку: TonAPI → NFTScan → Local Fallback
 */
export async function tryProviders(params: any): Promise<Item[]> {
  try {
    // 1. Пробуем TonAPI
    const tonapiItems = await tonapiProvider.listItems(params);
    if (tonapiItems.length > 0) {
      console.log(`TonAPI returned ${tonapiItems.length} items`);
      return tonapiItems;
    }
    console.log('TonAPI items failed, returning empty array');
  } catch (error) {
    console.log('TonAPI failed, trying NFTScan:', error.message);
  }

  try {
    // 2. Пробуем NFTScan
    const nftscanItems = await nftscanProvider.listItems(params);
    if (nftscanItems.length > 0) {
      console.log(`NFTScan returned ${nftscanItems.length} items`);
      return nftscanItems;
    }
    console.log('NFTScan items failed, returning empty array');
  } catch (error) {
    console.log('NFTScan failed, using local fallback:', error.message);
  }

  // 3. Fallback на локальные смоки
  console.log('Using local fallback provider');
  return localProvider.listItems(params);
}

/**
 * Получаем коллекции (только из TonAPI)
 */
export async function getCollections(params: any): Promise<Collection[]> {
  try {
    return await tonapiProvider.listCollections(params);
  } catch (error) {
    console.error('Collections error, using local fallback:', error);
    return localProvider.listCollections(params);
  }
}

/**
 * Получаем конкретный NFT
 */
export async function getItem(address: string): Promise<Item | null> {
  try {
    // Пробуем TonAPI
    const tonapiItem = await tonapiProvider.getItem(address);
    if (tonapiItem) return tonapiItem;
  } catch (error) {
    console.log('TonAPI item failed, trying NFTScan:', error.message);
  }

  try {
    // Пробуем NFTScan
    const nftscanItem = await nftscanProvider.getItem(address);
    if (nftscanItem) return nftscanItem;
  } catch (error) {
    console.log('NFTScan item failed, using local fallback:', error.message);
  }

  // Fallback на локальные смоки
  return localProvider.getItem(address);
}
```

### 7. apps/frontend/src/services/market.ts
```typescript
const API = import.meta.env.VITE_API_BASE || '/api';

export const marketApi = {
  getCollections: async (params?: Record<string, any>) => {
    const q = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([k,v]) => v!=null && q.set(k,String(v)));
    }
    const response = await fetch(`${API}/nft/collections?${q.toString()}`);
    return response.json();
  },

  getItems: async (params: Record<string, any> = {}) => {
    const q = new URLSearchParams();
    Object.entries(params).forEach(([k,v]) => v!=null && q.set(k,String(v)));
    const response = await fetch(`${API}/nft/items?${q.toString()}`);
    return response.json();
  },

  getItem: async (address: string) => {
    const response = await fetch(`${API}/nft/items/${address}`);
    return response.json();
  },
};
```

## 🔑 Полезно ещё (но не обязательно)

### apps/backend/.env.example
```env
# Telegram
TELEGRAM_BOT_TOKEN=<your_tg_bot_token>
TELEGRAM_BOT_NAME=<your_bot_username_without_at>
TELEGRAM_WEBHOOK_SECRET=<random_strong_secret>

# Auth
JWT_SECRET=<random_long_secret>

# TON / TonConnect
TONCONNECT_MANIFEST_URL=https://<your-domain>/tonconnect-manifest.json
TON_PAY_RECEIVER=<your_wallet_address_for_payments>

# Indexers / APIs
NFTSCAN_TON_API_KEY=<nftscan_key_optional>
TONAPI_KEY=<tonapi_key_optional>

# Backend
PORT=8080
CLIENT_ORIGIN=http://localhost:5173

# Redis (для очередей Radar)
REDIS_URL=redis://redis:6379

# Payments/Business
SUBSCRIPTION_PRICE_TON=10
SUBSCRIPTION_PERIOD_DAYS=30

# Database
DATABASE_URL=file:./dev.db

# Environment
NODE_ENV=development
```

### apps/frontend/src/pages/Market.tsx
```typescript
import React, { useState, useEffect } from 'react';
import { marketApi } from '../services/market';

interface Collection {
  id: string;
  title: string;
  cover: string;
  supply: number;
  owners: number;
  floorTon: number;
  volume24hTon: number;
}

interface Item {
  id: string;
  title: string;
  image: string;
  priceTon: number;
  forSale: boolean;
  collectionId: string;
}

export default function Market() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Загружаем коллекции
      const collectionsResult = await marketApi.getCollections({ limit: 10 });
      if (collectionsResult.success) {
        setCollections(collectionsResult.collections);
      }

      // Загружаем NFT предметы
      const itemsResult = await marketApi.getItems({ limit: 20, forSale: true });
      if (itemsResult.success) {
        setItems(itemsResult.items);
      }
    } catch (error) {
      console.error('Failed to load market data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="market-page">
      <h1>NFT Marketplace</h1>
      
      <section className="collections">
        <h2>Collections ({collections.length})</h2>
        <div className="collections-grid">
          {collections.map(collection => (
            <div key={collection.id} className="collection-card">
              <img 
                src={collection.cover} 
                alt={collection.title}
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/300x200?text=No+Image';
                }}
              />
              <h3>{collection.title}</h3>
              <p>Supply: {collection.supply}</p>
              <p>Floor: {collection.floorTon} TON</p>
            </div>
          ))}
        </div>
      </section>

      <section className="items">
        <h2>NFT Items ({items.length})</h2>
        <div className="items-grid">
          {items.map(item => (
            <div key={item.id} className="item-card">
              <img 
                src={item.image} 
                alt={item.title}
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/300x300?text=No+Image';
                }}
              />
              <h3>{item.title}</h3>
              {item.forSale && (
                <p className="price">{item.priceTon} TON</p>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
```

---

## 📋 Резюме от Cursor

### 🚀 Доступные эндпоинты в бэкенде:
- `GET /health` - Health check
- `GET /api/nft/collections` - Список коллекций (100+ из TonAPI)
- `GET /api/nft/items` - Список NFT предметов (fallback смоки)
- `GET /api/nft/items/:address` - Конкретный NFT
- `GET /api/auth/*` - Telegram аутентификация
- `GET /api/payments/*` - TonConnect платежи
- `GET /api/radar/*` - Radar система (в разработке)

### 🔗 Как фронт обращается к бэкенду:
- **API клиент**: `apps/frontend/src/services/market.ts`
- **Базовый URL**: `import.meta.env.VITE_API_BASE || '/api'`
- **Методы**: `getCollections()`, `getItems()`, `getItem()`
- **Параметры**: Query string через URLSearchParams
- **Обработка ошибок**: try/catch с fallback изображениями

### ✅ Проверка cover и image:
- **Нормализация**: `toHttp()` функция в `apps/backend/src/util/media.ts`
- **IPFS → HTTPS**: `ipfs://` → `https://cloudflare-ipfs.com/ipfs/`
- **Протокол-относительные**: `//example.com` → `https://example.com`
- **HTTP → HTTPS**: Автоматическое обновление
- **Fallback**: На placeholder изображения при ошибках

### 🐛 Текущие проблемы:
1. **Frontend PostCSS** - ES модули не работают
2. **NFTScan недоступен** - DNS блокировка
3. **TonAPI NFT** - возвращает пустые данные (нет NFT для продажи)

### 🎯 Рекомендации:
1. Исправить PostCSS конфигурацию
2. Добавить больше fallback изображений
3. Улучшить обработку ошибок на фронте
4. Добавить кэширование на клиенте

---
**Файлы готовы для анализа ChatGPT!** 🤖✨
