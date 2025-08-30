# Руководство по деплою RandArc Market

Подробные инструкции по развертыванию проекта на различных платформах.

## 🚀 Быстрый деплой

### 1. Docker Compose (Рекомендуется)

```bash
# Клонирование
git clone https://github.com/pluxuryv8/randarcmarket.git
cd randarcmarket

# Настройка окружения
cp env.example .env
# Отредактируйте .env файл

# Запуск
docker-compose up -d
```

### 2. GitHub Actions (Автоматический)

1. Настройте GitHub Secrets (см. `GITHUB_SETUP.md`)
2. Сделайте push в ветку `main`
3. Workflow автоматически соберет и задеплоит приложение

## 🐳 Docker деплой

### Сборка образов

```bash
# Backend
docker build -t randarcmarket-backend:latest ./apps/backend

# Frontend
docker build -t randarcmarket-frontend:latest ./apps/frontend

# Bot
docker build -t randarcmarket-bot:latest ./packages/bot
```

### Запуск с Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: randarcmarket
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  backend:
    build: ./apps/backend
    environment:
      DATABASE_URL: postgresql://user:password@postgres:5432/randarcmarket
      NODE_ENV: production
    ports:
      - "3001:3001"
    depends_on:
      - postgres

  frontend:
    build: ./apps/frontend
    ports:
      - "3000:80"
    depends_on:
      - backend

  bot:
    build: ./packages/bot
    environment:
      TELEGRAM_BOT_TOKEN: ${TELEGRAM_BOT_TOKEN}
    depends_on:
      - backend

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./infra/nginx.conf:/etc/nginx/nginx.conf
    depends_on:
      - frontend
      - backend

volumes:
  postgres_data:
```

## ☁️ Облачные платформы

### Vercel (Frontend)

1. Подключите GitHub репозиторий к Vercel
2. Настройте переменные окружения
3. Деплой произойдет автоматически

### Railway (Backend)

1. Создайте проект в Railway
2. Подключите GitHub репозиторий
3. Настройте переменные окружения
4. Railway автоматически задеплоит backend

### DigitalOcean App Platform

```yaml
# .do/app.yaml
name: randarcmarket
services:
  - name: backend
    source_dir: /apps/backend
    github:
      repo: pluxuryv8/randarcmarket
      branch: main
    environment_slug: node-js
    instance_count: 1
    instance_size_slug: basic-xxs
    envs:
      - key: DATABASE_URL
        value: ${DATABASE_URL}
      - key: NODE_ENV
        value: production

  - name: frontend
    source_dir: /apps/frontend
    github:
      repo: pluxuryv8/randarcmarket
      branch: main
    environment_slug: static-site
    instance_count: 1
    instance_size_slug: basic-xxs
```

## 🖥️ VPS деплой

### Подготовка сервера

```bash
# Обновление системы
sudo apt update && sudo apt upgrade -y

# Установка Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Установка Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Установка Nginx
sudo apt install nginx -y
```

### Настройка домена

```bash
# Создание SSL сертификата
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d your-domain.com

# Настройка Nginx
sudo nano /etc/nginx/sites-available/randarcmarket
```

```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /api {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### Деплой приложения

```bash
# Клонирование
git clone https://github.com/pluxuryv8/randarcmarket.git
cd randarcmarket

# Настройка
cp env.example .env
nano .env

# Запуск
docker-compose up -d

# Проверка статуса
docker-compose ps
```

## 🔧 Настройка окружения

### Переменные окружения

```env
# База данных
DATABASE_URL=postgresql://user:password@localhost:5432/randarcmarket

# API ключи
TON_API_KEY=your_ton_api_key
NFTSCAN_API_KEY=your_nftscan_api_key
STEAM_API_KEY=your_steam_api_key
TELEGRAM_BOT_TOKEN=your_telegram_bot_token

# JWT
JWT_SECRET=your_jwt_secret

# Сервер
PORT=3001
NODE_ENV=production
HOST=0.0.0.0

# Redis (для кэширования)
REDIS_URL=redis://localhost:6379

# Логирование
LOG_LEVEL=info
```

### Миграции базы данных

```bash
# Локально
cd apps/backend
npx prisma migrate deploy

# В Docker
docker-compose exec backend npx prisma migrate deploy
```

## 📊 Мониторинг

### Логи

```bash
# Просмотр логов
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f bot

# Логи Nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Метрики

```bash
# Статус контейнеров
docker-compose ps

# Использование ресурсов
docker stats

# Проверка здоровья API
curl http://localhost:3001/health
```

## 🔄 Обновление

### Автоматическое обновление

```bash
# Pull изменений
git pull origin main

# Пересборка и перезапуск
docker-compose down
docker-compose up -d --build
```

### Ручное обновление

```bash
# Остановка сервисов
docker-compose down

# Удаление старых образов
docker system prune -f

# Пересборка
docker-compose build --no-cache

# Запуск
docker-compose up -d
```

## 🆘 Устранение проблем

### Проблемы с базой данных

```bash
# Проверка подключения
docker-compose exec backend npx prisma db push

# Сброс базы данных
docker-compose exec backend npx prisma migrate reset
```

### Проблемы с SSL

```bash
# Обновление сертификатов
sudo certbot renew

# Проверка конфигурации Nginx
sudo nginx -t
sudo systemctl reload nginx
```

### Проблемы с Docker

```bash
# Очистка Docker
docker system prune -a

# Перезапуск Docker
sudo systemctl restart docker
```

## 📋 Чек-лист деплоя

- [ ] Сервер подготовлен (Docker, Nginx)
- [ ] Домен настроен и SSL сертификат получен
- [ ] Переменные окружения настроены
- [ ] База данных создана и миграции применены
- [ ] Приложение запущено и работает
- [ ] Мониторинг настроен
- [ ] Бэкапы настроены
- [ ] Документация обновлена

---

**Примечание:** Всегда тестируйте деплой на staging окружении перед продакшеном!
