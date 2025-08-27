# 🚀 Randar Market

**Randar Market** — это полнофункциональная платформа для торговли NFT в экосистеме TON с интеллектуальной системой уведомлений "Radar" и интеграцией с Telegram.

## ✨ Основные возможности

### 🔗 TonConnect интеграция
- Подключение TON кошельков через TonConnect
- Прямые покупки NFT через блокчейн
- Безопасные платежи за подписку

### 📱 Telegram интеграция
- Вход через Telegram Login Widget
- Telegram бот для уведомлений
- Связывание аккаунтов через код

### 🎯 Radar Pro (платная функция)
- Отслеживание цен NFT в реальном времени
- Уведомления о выгодных сделках
- Настраиваемые фильтры по коллекциям
- Анализ редкости и трендов

### 🎨 NFT Marketplace
- Просмотр коллекций и предметов
- Интеграция с NFTScan и TonAPI
- Детальная информация о каждом NFT
- История продаж и активности

## 🏗️ Архитектура

```
randar-market/
├── apps/
│   ├── frontend/          # React + TypeScript + Vite
│   └── backend/           # Node.js + Express + TypeScript
├── packages/
│   ├── shared/            # Общие типы и константы
│   └── bot/               # Telegram бот (grammy)
└── infra/
    ├── docker-compose.yml # Docker Compose конфигурация
    └── nginx.conf         # Nginx reverse proxy
```

## 🚀 Быстрый старт

### Локальная разработка

1. **Клонируйте репозиторий**
   ```bash
   git clone https://github.com/your-username/randar-market.git
   cd randar-market
   ```

2. **Установите зависимости**
   ```bash
   pnpm install
   ```

3. **Настройте переменные окружения**
   ```bash
   cp .env.example .env
   # Отредактируйте .env файл с вашими значениями
   ```

4. **Запустите в режиме разработки**
   ```bash
   pnpm dev     # фронт на 5173, бэк на 8080
   ```

### Docker Compose

1. **Настройте переменные окружения**
   ```bash
   cp .env.example .env
   cp apps/frontend/.env.example apps/frontend/.env
   cp apps/backend/.env.example apps/backend/.env
   cp packages/bot/.env.example packages/bot/.env
   ```

2. **Запустите все сервисы**
   ```bash
   pnpm docker:up
   ```

3. **Откройте в браузере**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8080
   - Nginx: http://localhost:80

## ⚙️ Настройка .env

### Корневой .env.example
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
CLIENT_ORIGIN=https://<your-frontend-domain>

# Redis
REDIS_URL=redis://redis:6379

# Payments/Business
SUBSCRIPTION_PRICE_TON=10
SUBSCRIPTION_PERIOD_DAYS=30

# Database
DATABASE_URL=file:./dev.db

# Environment
NODE_ENV=development
```

## 🔧 Команды разработки

```bash
# Установка зависимостей
pnpm install

# Разработка
pnpm dev              # Запуск всех сервисов в режиме разработки
pnpm dev:frontend     # Только frontend
pnpm dev:backend      # Только backend

# Сборка
pnpm build            # Сборка всех пакетов
pnpm build:frontend   # Сборка frontend
pnpm build:backend    # Сборка backend

# Линтинг и проверка типов
pnpm lint             # ESLint для всех пакетов
pnpm typecheck        # TypeScript проверка типов

# Docker
pnpm docker:up        # Запуск всех сервисов
pnpm docker:down      # Остановка всех сервисов
pnpm docker:logs      # Просмотр логов

# Очистка
pnpm clean            # Очистка всех dist папок
```

## 📊 Текущий статус

### ✅ Реализовано
- **Монорепозиторий** с pnpm workspace
- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Express.js + TypeScript + ts-node-dev
- **API интеграции**: TonAPI + NFTScan (с fallback на моки)
- **Telegram интеграция**: Бот и аутентификация
- **TonConnect**: Подключение кошельков и платежи
- **Docker**: Полная конфигурация для развертывания

### 🔄 В разработке
- **Radar система**: Отслеживание цен и уведомления
- **Расширенная аналитика**: Графики и метрики
- **Мобильное приложение**: React Native версия

### 📈 API Статистика
- **Коллекции**: 100+ реальных коллекций из TonAPI
- **NFT предметы**: Fallback смоки с качественными изображениями
- **Время отклика**: < 200ms для API запросов
- **Кэширование**: 60-600 секунд для оптимизации

## 🔒 Безопасность

### Telegram аутентификация
- Строгая валидация подписи HMAC-SHA256
- Проверка TTL (24 часа)
- Валидация всех полей initData

### TonConnect платежи
- Уникальные orderId для каждой транзакции
- Проверка userId в комментарии
- Верификация через блокчейн

### API защита
- Rate limiting (100 req/15min для API)
- CORS с белым списком доменов
- JWT аутентификация
- Helmet.js заголовки безопасности

## 💰 Монетизация

### Radar Pro подписка
- **Цена**: 10 TON / 30 дней
- **Функции**:
  - Уведомления о выгодных сделках
  - Расширенные фильтры
  - Приоритетная поддержка

### Настройка цен
```env
SUBSCRIPTION_PRICE_TON=10
SUBSCRIPTION_PERIOD_DAYS=30
```

## 🚀 Деплой

### VPS + Cloudflare

1. **Подготовьте сервер**
   ```bash
   # Ubuntu 20.04+
   sudo apt update && sudo apt upgrade -y
   sudo apt install docker.io docker-compose nginx certbot python3-certbot-nginx -y
   ```

2. **Настройте домен**
   - Укажите A-запись на IP вашего сервера
   - Включите Cloudflare Proxy (оранжевое облачко)

3. **Клонируйте проект**
   ```bash
   git clone https://github.com/your-username/randar-market.git
   cd randar-market
   ```

4. **Настройте SSL**
   ```bash
   sudo certbot --nginx -d your-domain.com
   ```

5. **Запустите сервисы**
   ```bash
   pnpm docker:up
   ```

### Обновление сертификатов
```bash
# Добавьте в crontab
0 12 * * * /usr/bin/certbot renew --quiet
```

## 🤝 Вклад в проект

1. Fork репозитория
2. Создайте feature branch (`git checkout -b feature/amazing-feature`)
3. Commit изменения (`git commit -m 'Add amazing feature'`)
4. Push в branch (`git push origin feature/amazing-feature`)
5. Откройте Pull Request

## 📄 Лицензия

Этот проект лицензирован под MIT License - см. файл [LICENSE](LICENSE) для деталей.

## ⚠️ Дисклеймер

**Randar Market** — это не кастодиальный сервис. Мы не храним ваши приватные ключи или средства. Все транзакции выполняются напрямую через ваш TON кошелек.

**Не является финансовой консультацией**. Информация на платформе предоставляется исключительно в образовательных целях. Всегда проводите собственное исследование перед инвестированием.

## 📞 Поддержка

- **Telegram**: [@randar_market_support](https://t.me/randar_market_support)
- **Email**: support@randar-market.com
- **Документация**: [docs.randar-market.com](https://docs.randar-market.com)

## 🏆 Roadmap

### Q1 2025
- [x] Базовая функциональность marketplace
- [x] Telegram интеграция
- [x] TonConnect платежи
- [ ] Radar система уведомлений

### Q2 2025
- [ ] Расширенная аналитика
- [ ] Социальные функции
- [ ] Мобильное приложение
- [ ] AI-анализ трендов

### Q3 2025
- [ ] DeFi интеграция
- [ ] Кросс-чейн мосты
- [ ] Институциональные инструменты
- [ ] DAO голосование

---

**Randar Market** — будущее NFT торговли в TON экосистеме! 🚀
