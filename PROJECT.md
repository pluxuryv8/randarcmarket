# RandArc Market

Современная платформа для торговли NFT подарками в сети TON с интеграцией различных провайдеров данных.

## 🚀 Возможности

- **Мультипровайдерная архитектура**: Поддержка TonAPI и NFTScan
- **Современный UI**: React + TypeScript + Tailwind CSS
- **Масштабируемый бэкенд**: Node.js + Express + Prisma
- **Реальное время**: WebSocket интеграция для live обновлений
- **Аутентификация**: Steam OAuth интеграция
- **Административная панель**: Управление пользователями и настройками

## 🏗️ Архитектура

```
randarcmarket/
├── apps/
│   ├── backend/          # Node.js API сервер
│   └── frontend/         # React приложение
├── packages/
│   ├── shared/           # Общие типы и утилиты
│   └── bot/              # Telegram бот
└── infra/                # Docker и конфигурация
```

## 🛠️ Технологии

### Backend
- **Node.js** + **TypeScript**
- **Express.js** - веб-фреймворк
- **Prisma** - ORM для работы с БД
- **Passport.js** - аутентификация
- **WebSocket** - real-time обновления

### Frontend
- **React 18** + **TypeScript**
- **Vite** - сборщик
- **Tailwind CSS** - стилизация
- **React Router** - маршрутизация
- **Axios** - HTTP клиент

### Инфраструктура
- **Docker** - контейнеризация
- **GitHub Actions** - CI/CD
- **Nginx** - reverse proxy
- **PostgreSQL** - база данных

## 📦 Установка

1. **Клонирование репозитория**
```bash
git clone https://github.com/pluxuryv8/randarcmarket.git
cd randarcmarket
```

2. **Установка зависимостей**
```bash
pnpm install
```

3. **Настройка окружения**
```bash
cp env.example .env
# Отредактируйте .env файл
```

4. **Запуск в режиме разработки**
```bash
pnpm dev
```

## 🔧 Конфигурация

### Переменные окружения

```env
# База данных
DATABASE_URL="postgresql://user:password@localhost:5432/randarcmarket"

# TON API
TON_API_KEY="your_ton_api_key"
TON_API_URL="https://toncenter.com/api/v2"

# NFTScan API
NFTSCAN_API_KEY="your_nftscan_api_key"

# Steam OAuth
STEAM_API_KEY="your_steam_api_key"
STEAM_RETURN_URL="http://localhost:3000/auth/steam/return"

# JWT
JWT_SECRET="your_jwt_secret"

# Сервер
PORT=3001
NODE_ENV=development
```

## 🚀 Деплой

### Docker Compose

```bash
docker-compose up -d
```

### Ручной деплой

1. **Сборка**
```bash
pnpm build
```

2. **Запуск**
```bash
# Backend
cd apps/backend && pnpm start

# Frontend
cd apps/frontend && pnpm preview
```

## 📊 API Endpoints

### Аутентификация
- `GET /auth/steam` - Steam OAuth
- `GET /auth/steam/return` - OAuth callback
- `POST /auth/logout` - Выход

### Коллекции
- `GET /api/collections` - Список коллекций
- `GET /api/collections/:id` - Детали коллекции
- `GET /api/collections/:id/traits` - Трейты коллекции

### Предметы
- `GET /api/items` - Список предметов
- `GET /api/items/:address` - Детали предмета
- `GET /api/items/search` - Поиск предметов

### Статистика
- `GET /api/stats` - Общая статистика
- `GET /api/activity` - Активность

## 🤝 Вклад в проект

1. Форкните репозиторий
2. Создайте ветку для новой функции
3. Внесите изменения
4. Создайте Pull Request

## 📄 Лицензия

Этот проект является приватным и не предназначен для публичного использования.

## 📞 Поддержка

По вопросам обращайтесь к разработчику проекта.

---

**Версия**: 1.0.0  
**Последнее обновление**: 2024
