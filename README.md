# RandarNFT Marketplace

Современный NFT маркетплейс в экосистеме TON с новым дизайном в стиле getgems.

## 🚀 Быстрый старт

### Предварительные требования
- Node.js 18+ 
- npm или yarn

### Установка и запуск

1. **Клонируйте репозиторий**
```bash
git clone <your-repo-url>
cd randarcmarket
```

2. **Установите зависимости**
```bash
# Установка зависимостей для всех проектов
npm install
cd digital-market && npm install
cd frontend && npm install
cd ../backend && npm install
```

3. **Запустите проект**
```bash
# Из корневой директории
cd digital-market
npm run dev
```

Или запустите отдельно:
```bash
# Backend (порт 4001)
cd digital-market/backend
npm run dev

# Frontend (порт 3000) 
cd digital-market/frontend
npm start
```

## 📁 Структура проекта

```
randarcmarket/
├── digital-market/          # Основной проект
│   ├── frontend/           # React приложение
│   │   ├── src/
│   │   │   ├── components/ # UI компоненты
│   │   │   ├── pages/      # Страницы
│   │   │   ├── services/   # API сервисы
│   │   │   └── types/      # TypeScript типы
│   │   └── public/
│   └── backend/            # Express.js сервер
│       └── src/
├── frontend/               # Старый frontend (не используется)
└── backend/                # Старый backend (не используется)
```

## 🎨 Новый дизайн

Проект включает новый интерфейс со следующими особенностями:

- **Темная тема** с красными акцентами
- **Sticky header** с поиском и навигацией
- **Hero секция** с каруселью
- **Секции**: Trending Collections, Favorites, Drops, Activity
- **Skeleton loaders** для лучшего UX
- **Адаптивный дизайн**

## 🔧 Технологии

### Frontend
- React 18
- TypeScript
- Material-UI (MUI)
- Framer Motion
- React Router v6
- TonConnect UI

### Backend  
- Node.js
- Express.js
- TypeScript
- CORS

## 🐛 Известные проблемы

1. **Запускается старый интерфейс вместо нового**
   - Проблема: При запуске `npm run dev` из корня запускается старый frontend
   - Решение: Запускайте из `digital-market/frontend` напрямую

2. **Конфликт портов**
   - Убедитесь, что порты 3000 и 4001 свободны

## 📝 TODO

- [ ] Исправить запуск нового интерфейса
- [ ] Подключить реальный backend API
- [ ] Добавить аутентификацию
- [ ] Реализовать поиск
- [ ] Добавить фильтры и сортировку

## 🤝 Вклад в проект

1. Fork репозитория
2. Создайте feature branch (`git checkout -b feature/amazing-feature`)
3. Commit изменения (`git commit -m 'Add amazing feature'`)
4. Push в branch (`git push origin feature/amazing-feature`)
5. Откройте Pull Request

## 📄 Лицензия

MIT License
