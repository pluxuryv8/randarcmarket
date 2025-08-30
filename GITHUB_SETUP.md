# Настройка GitHub Secrets для CI/CD

Для корректной работы GitHub Actions необходимо настроить следующие секреты в репозитории.

## 🔐 Необходимые Secrets

### 1. DOCKER_USERNAME и DOCKER_PASSWORD
Для публикации Docker образов в Docker Hub.

**Как получить:**
1. Зарегистрируйтесь на [Docker Hub](https://hub.docker.com)
2. Создайте репозиторий для вашего проекта
3. Получите username и password

**Настройка в GitHub:**
1. Перейдите в Settings → Secrets and variables → Actions
2. Добавьте:
   - `DOCKER_USERNAME` = ваш Docker Hub username
   - `DOCKER_PASSWORD` = ваш Docker Hub password

### 2. SERVER_SSH_KEY
Для деплоя на сервер через SSH.

**Как получить:**
```bash
# Генерация SSH ключа
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"

# Добавление публичного ключа на сервер
ssh-copy-id user@your-server.com
```

**Настройка в GitHub:**
1. Добавьте приватный ключ как `SERVER_SSH_KEY`
2. Добавьте `SERVER_HOST` = IP или домен вашего сервера
3. Добавьте `SERVER_USER` = username для SSH

### 3. DATABASE_URL
Строка подключения к базе данных.

**Формат:**
```
postgresql://username:password@host:port/database
```

### 4. API Keys
Для интеграции с внешними сервисами:

- `TON_API_KEY` - ключ для TonAPI
- `NFTSCAN_API_KEY` - ключ для NFTScan
- `STEAM_API_KEY` - ключ для Steam OAuth
- `TELEGRAM_BOT_TOKEN` - токен Telegram бота

## 🚀 Настройка в GitHub

### Шаг 1: Перейдите в настройки репозитория
1. Откройте ваш репозиторий на GitHub
2. Перейдите в **Settings** → **Secrets and variables** → **Actions**

### Шаг 2: Добавьте секреты
Нажмите **New repository secret** и добавьте каждый секрет:

```
DOCKER_USERNAME=your_docker_username
DOCKER_PASSWORD=your_docker_password
SERVER_SSH_KEY=-----BEGIN OPENSSH PRIVATE KEY-----
...
-----END OPENSSH PRIVATE KEY-----
SERVER_HOST=your-server.com
SERVER_USER=your_username
DATABASE_URL=postgresql://user:pass@host:5432/db
TON_API_KEY=your_ton_api_key
NFTSCAN_API_KEY=your_nftscan_api_key
STEAM_API_KEY=your_steam_api_key
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
JWT_SECRET=your_jwt_secret
```

### Шаг 3: Проверьте workflows
После добавления секретов:
1. Перейдите в **Actions** вкладку
2. Убедитесь, что workflows запускаются корректно
3. Проверьте логи на наличие ошибок

## 🔧 Дополнительная настройка

### Настройка веток
По умолчанию workflows запускаются на ветке `main`. Если используете другую ветку:

1. Отредактируйте файлы в `.github/workflows/`
2. Измените `branches: [ main ]` на вашу ветку

### Настройка окружения
Для разных окружений (dev, staging, prod):

1. Создайте Environment в GitHub
2. Добавьте специфичные секреты для каждого окружения
3. Обновите workflows для использования разных окружений

## 📋 Чек-лист

- [ ] Docker Hub аккаунт создан
- [ ] SSH ключи настроены
- [ ] Все API ключи получены
- [ ] Секреты добавлены в GitHub
- [ ] Workflows запускаются без ошибок
- [ ] Деплой работает корректно

## 🆘 Устранение проблем

### Ошибка "Secret not found"
- Проверьте правильность названия секрета
- Убедитесь, что секрет добавлен в правильный репозиторий

### Ошибка SSH подключения
- Проверьте формат SSH ключа
- Убедитесь, что публичный ключ добавлен на сервер
- Проверьте права доступа к серверу

### Ошибка Docker push
- Проверьте Docker Hub credentials
- Убедитесь, что репозиторий существует в Docker Hub
- Проверьте права на запись в репозиторий

---

**Примечание:** Никогда не коммитьте секреты в код! Всегда используйте GitHub Secrets для хранения конфиденциальной информации.
