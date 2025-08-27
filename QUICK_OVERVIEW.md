# 🚀 Randar Market - Быстрый обзор для ChatGPT

## Что это?
NFT маркетплейс в экосистеме TON с Telegram интеграцией и системой уведомлений "Radar".

## Архитектура
- **Монорепозиторий** с pnpm workspace
- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Express.js + TypeScript + Prisma
- **API**: TonAPI (работает) + NFTScan (блокировка) + Fallback смоки

## Текущий статус
✅ **Работает**: Backend (8080), API коллекций (100+), TonConnect, Telegram  
❌ **Проблемы**: Frontend PostCSS, NFTScan недоступен, нет тестов  
🔄 **В разработке**: Radar система уведомлений

## Ключевые файлы
```
apps/backend/src/routes/nft.ts          # NFT API
apps/backend/src/providers/gifts/       # API провайдеры
apps/frontend/src/pages/Marketplace.tsx # Главная страница
apps/frontend/src/services/market.ts    # API клиент
```

## Команды
```bash
pnpm install && pnpm dev  # Запуск
```

## Что нужно сделать?
1. Исправить PostCSS (ES модули → CommonJS)
2. Завершить Radar систему
3. Добавить тесты
4. Улучшить UX/UI

## Монетизация
Radar Pro подписка: 10 TON / 30 дней

---
**Проект готов к консультации!** 🎯
