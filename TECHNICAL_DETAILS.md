# 🔧 Технические детали Randar Market

## Проблемы и решения

### 1. PostCSS конфигурация
**Проблема**: `SyntaxError: Unexpected token 'export'`  
**Файл**: `apps/frontend/postcss.config.js`  
**Решение**: Перевести с ES модулей на CommonJS
```js
// Было:
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}

// Должно быть:
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

### 2. API провайдеры
**TonAPI**: ✅ Работает, получает 100+ коллекций  
**NFTScan**: ❌ DNS блокировка (`ENOTFOUND api.nftscan.com`)  
**Fallback**: ✅ Локальные смоки с качественными изображениями

### 3. Структура API
```
GET /api/nft/collections    # 100+ коллекций из TonAPI
GET /api/nft/items         # 6 смоков (fallback)
GET /health                # Health check
```

## Ключевые компоненты

### Backend API провайдеры
```typescript
// apps/backend/src/providers/gifts/index.ts
export async function tryProviders() {
  try {
    // 1. Пробуем TonAPI
    const tonapiItems = await tonapiProvider.listItems(params);
    if (tonapiItems.length > 0) return tonapiItems;
    
    // 2. Пробуем NFTScan
    const nftscanItems = await nftscanProvider.listItems(params);
    if (nftscanItems.length > 0) return nftscanItems;
    
    // 3. Fallback на локальные смоки
    return localProvider.listItems(params);
  } catch (error) {
    return localProvider.listItems(params);
  }
}
```

### Frontend API клиент
```typescript
// apps/frontend/src/services/market.ts
const API = import.meta.env.VITE_API_BASE || '/api';

export const marketApi = {
  getCollections: async () => (await fetch(`${API}/nft/collections`)).json(),
  getItems: async (params) => {
    const q = new URLSearchParams();
    Object.entries(params).forEach(([k,v]) => v!=null && q.set(k,String(v)));
    return (await fetch(`${API}/nft/items?${q.toString()}`)).json();
  },
};
```

## Переменные окружения
```env
# API ключи
TONAPI_KEY=AG65O7HHMCPI3BAAAAAAIPOH5ERE7K67I54MOD3FOZ6SI337BYMARIGDYTIEMZGYTWU6D2I
NFTSCAN_TON_API_KEY=bV8tYagbGFZuVbfE90uXP2an

# Telegram
TELEGRAM_BOT_TOKEN=8358691306:AAGI4CpSFPhXVNarFkB54hnzct8urh0hG6w
TELEGRAM_BOT_NAME=randarnftbot

# TON
TON_PAY_RECEIVER=UQBsNoVo7kmldV3hWUIXfrmzY2vt48Igb_byxajmceXBBoOg

# Подписка
SUBSCRIPTION_PRICE_TON=10
SUBSCRIPTION_PERIOD_DAYS=30
```

## Логи и отладка
```bash
# Проверка API
curl http://localhost:8080/api/nft/collections?limit=3
curl http://localhost:8080/api/nft/items?limit=3

# Логи backend
pnpm dev  # Смотрим логи в терминале

# Проверка портов
lsof -i :5173,8080
```

## Следующие шаги
1. **Исправить PostCSS** - основная проблема
2. **Добавить тесты** - Jest + Testing Library
3. **Завершить Radar** - основная монетизация
4. **Улучшить UX** - анимации, мобильная версия
5. **Добавить мониторинг** - Prometheus + Grafana

---
**Готов к технической консультации!** ⚙️
