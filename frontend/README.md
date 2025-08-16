# RandarNFT — фронтенд

React + TypeScript приложение в стиле Getgems для Telegram/TON NFT.

## Запуск

```bash
npm install
npm start
```

Откройте http://localhost:3000

## Основное
- Маркет `/market`: поиск, сортировка, verified, боковая панель, виртуализация и infinite scroll
- Коллекции `/collections`: поиск/сорт/verified
- Коллекция `/collection/:id`, NFT `/item/:id`
- Дропы `/drops`
- Активность `/activity`
- Логин `/login` (виджет Telegram)

## Интеграции
- TonConnect UI (`TonConnectUIProvider` в `src/index.tsx`)
- Телеграм‑виджет (`components/auth/TelegramLoginButton.tsx`)

## Переменные окружения
Создайте `.env` при необходимости:
```
REACT_APP_BACKEND_URL=http://localhost:4001
```
