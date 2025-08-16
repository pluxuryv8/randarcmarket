# RandarNFT — Telegram/TON NFT маркетплейс

Современная платформа в стиле Getgems: маркет, коллекции, дропы и активность в экосистеме TON. Фокус на Telegram‑аутентификацию, TonConnect, производительность (виртуализация списков) и аккуратный тёмный UI с тонкими красными акцентами.

## Содержание
- О проекте
- Архитектура и структура каталогов
- Технологии
- Быстрый старт
- Запуск фронтенда и бэкенда
- Переменные окружения
- Интеграции (Telegram, TON Wallet)
- Скрипты и полезные команды
- Качество и производительность
- Дизайн‑гайд (брендинг, цвета)
- Roadmap (дальнейшие действия)
- Известные проблемы

---

## О проекте
RandarNFT — переосмысленная версия «digital‑market»: отказаться от CS:GO контента и перейти к Telegram/TON NFT. Главная, Маркет, Коллекции, Дропы и Активность повторяют логику и визуальные паттерны Getgems.

Ключевые цели:
- Чистая, современная и быстрая UI/UX
- Авторизация через Telegram + привязка TON кошелька
- Реал‑тайм активность и удобные фильтры

## Архитектура и структура каталогов
Монорепо с двумя подпроектами.
```
.digital-market/
  backend/                 # Express + TypeScript (заготовка под NFT API)
  frontend/                # React + TS, MUI, Framer Motion, TonConnect
  docs/                    # Документация (api-spec, architecture)
  scripts/                 # Скрипты миграций/утилит
  tests/                   # Заготовки под тесты
  README.md                # Этот файл
```

Frontend ключевые директории:
```
frontend/src/
  pages/                   # Маршруты: Home, Market, Collections, Collection, Item, Drops, Activity, Login
  components/              # Header, UI-киты (NFTCard, FilterBar, SideFilterPanel, VirtualGrid), auth/
  services/                # Моки данных (nft.ts), Ton/прочее
  context/                 # AuthContext (Telegram mock)
  types/                   # Типы NFT, декларации react-window/auto-sizer
  theme.ts                 # Тема MUI (тёмная, красные тонкие акценты)
```

## Технологии
- Frontend: React 18, TypeScript, MUI, Framer Motion, Vanta.js (фон), react-window (виртуализация), TonConnect UI
- Backend: Node.js, Express, TypeScript (подготовлен к замене моков реальными эндпоинтами)

## Быстрый старт
Требования: Node.js 18+, npm; порты 3000 и 4001 должны быть свободны.

1) Установка
```bash
cd backend && npm install
cd ../frontend && npm install
cd ..
```
2) Запуск дев-серверов из корня `digital-market`:
```bash
npm run dev
```
- Frontend: http://localhost:3000
- Backend:  http://localhost:4001

Если порт занят:
```bash
# macOS/Linux
lsof -ti tcp:3000,4001 | xargs -r kill -9
```

## Запуск по подпроектам
- Frontend: `cd frontend && npm start`
- Backend:  `cd backend && npm run dev`

## Переменные окружения
Frontend (`frontend/.env`):
```
REACT_APP_BACKEND_URL=http://localhost:4001
```
Backend (`backend/.env` — опционально, под будущие ключи/URI):
```
PORT=4001
CORS_ORIGIN=http://localhost:3000
```

## Интеграции
### Telegram Login
- На `/login` встраивается виджет Telegram (`components/auth/TelegramLoginButton.tsx`).
- Сейчас действует mock‑логика: при onAuth вызывается `loginWithTelegram()` из `AuthContext`.
- Для продакшена: подключить своего бота, проверку подписи на бэкенде, сессии/JWT.

### TON Wallet (TonConnect)
- Провайдер: `TonConnectUIProvider` в `frontend/src/index.tsx`.
- Манифест: `frontend/public/tonconnect-manifest.json`.
- Кнопка: `TonConnectButton` в `Header`.

## Скрипты и полезные команды
Корень:
- `npm run dev` — параллельный запуск фронта и бэка (concurrently)

Frontend:
- `npm start` — React dev server
- `npm test`, `npm run build` — стандартные CRA скрипты

Backend:
- `npm run dev` — ts-node-dev

## Качество и производительность
- Виртуализация: `react-window` (компонент `VirtualGrid`) для маркет/коллекций.
- Автоподгрузка: IntersectionObserver (‘Показать ещё’ + авто‑триггер).
- Скелетоны: MUI `Skeleton` на списках.
- Типы: строгий TypeScript, разделение интерфейсов (`types/`).

## Дизайн‑гайд (брендинг)
- Тёмная тема, минимализм, читаемая типографика.
- Красные акценты: тонкие бордеры/свет, без больших заливок.
- Карточки с мягкими тенями и лёгкими hover‑анимациями.

## Roadmap (дальнейшие действия)
1. Telegram авторизация (прод):
   - Бэкенд‑верификация данных Telegram, подпись, сессии (JWT/Redis).
   - Статус в `Header`/`Profile`, настройка уведомлений.
2. TON:
   - Подтверждение транзакций (TonConnect), отображение баланса/адреса.
3. Маркет:
   - Больше фильтров (цена TON/₮, атрибуты), сохранение состояния в URL.
   - Постраничная/бесконечная загрузка из реального API.
4. Коллекции/Активность:
   - Фильтры как на Getgems (типы событий, периоды, verified, сортировки).
   - Веб‑сокеты для live‑обновления.
5. Производительность:
   - Оптимизация изображений, lazy‑loading, мемоизация вычислений.
6. UI/UX:
   - Бейджи verified, skeleton‑таблицы, единая сетка/отступы.
7. Тестирование/CI:
   - Е2Е (Playwright/Cypress), линтеры и проверки в CI.
8. Документация:
   - OpenAPI/Swagger для бэкенда, схемы запросов/ответов.

## Известные проблемы
- CRA предупреждения `source-map-loader` для зависимостей TonConnect (безвредно в dev).
- Конфликты портов 3000/4001 — решается остановкой процессов (`lsof | kill`).
- Моки данных: пока нет реального NFT API — подключить позже.

---

Если нужны инструкции по деплою (Docker/VPS/CI/CD) — добавлю соответствующий раздел и конфиги (docker‑compose, GH Actions) в рамках следующих задач.
