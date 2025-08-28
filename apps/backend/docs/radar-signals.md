# Radar Signals - Документация для разработчиков

## Обзор

Radar Signals - это система быстрых сигналов для NFT, реализованная как commit-reveal рандомизация с взвешенными шансами. Для пользователей это выглядит как "поймал/не поймал" сигнал, но внутри это полноценная система микробатчей.

## Архитектура

### Commit-Reveal Механика

Система использует commit-reveal схему для обеспечения честности:

1. **Commit фаза**: Сервер генерирует `serverSeed` и публикует его SHA256 хеш (`seedHash`)
2. **Reveal фаза**: После закрытия раунда сервер публикует `serverSeed` и `publicSalt`
3. **Верификация**: Финальный `rand` = HMAC-SHA256(`serverSeed`, `publicSalt`)

### Взвешенные шансы

- **Free tier**: вес 1.0
- **Pro tier**: вес 1.25 (25% преимущество)

### Жизненный цикл раунда

1. **Создание**: Пользователь присоединяется к NFT → создается раунд (500ms)
2. **Участие**: Другие пользователи могут присоединиться к тому же раунду
3. **Закрытие**: Через 500ms раунд автоматически закрывается
4. **Reveal**: Определяются победители на основе взвешенной рулетки
5. **Результат**: Пользователи получают результат "поймал/не поймал"

## API Endpoints

### POST /api/radar/join

Присоединиться к раунду для конкретного NFT.

**Request:**
```json
{
  "itemAddress": "EQD...",
  "tier": "free" // или "pro"
}
```

**Response:**
```json
{
  "success": true,
  "roundId": "clx...",
  "roundEndsAt": "2024-01-01T12:00:00.500Z",
  "seedHash": "a1b2c3...",
  "meta": { "source": "radar" }
}
```

### GET /api/radar/result/:roundId

Получить результат раунда.

**Response:**
```json
{
  "success": true,
  "caught": true,
  "itemAddress": "EQD...",
  "item": {
    "address": "EQD...",
    "title": "NFT Name",
    "image": "https://..."
  },
  "reveal": {
    "serverSeed": "original-seed...",
    "publicSalt": "1704110400000",
    "rand": "final-hmac..."
  },
  "meta": { "source": "radar" }
}
```

### GET /api/radar/stats/:roundId

Статистика раунда (для отладки).

**Response:**
```json
{
  "success": true,
  "stats": {
    "roundId": "clx...",
    "itemAddress": "EQD...",
    "status": "revealed",
    "totalEntries": 5,
    "freeEntries": 3,
    "proEntries": 2,
    "totalWeight": 5.5,
    "startsAt": "2024-01-01T12:00:00.000Z",
    "endsAt": "2024-01-01T12:00:00.500Z"
  },
  "meta": { "source": "radar" }
}
```

## База данных

### RadarRound

```sql
model RadarRound {
  id           String   @id @default(cuid())
  itemAddress  String   // Адрес NFT
  startsAt     DateTime // Время начала
  endsAt       DateTime // Время окончания (500ms)
  seedHash     String   // SHA256 от serverSeed (commit)
  serverSeed   String?  // Оригинальный seed (reveal)
  publicSalt   String?  // Публичная соль (timestamp)
  rand         String?  // Финальный HMAC
  winnersJson  Json?    // Победители [{userId, weight}]
  status       String   // 'open' | 'closed' | 'revealed' | 'executed'
  createdAt    DateTime @default(now())
  
  entries      RadarEntry[]
  
  @@index([itemAddress, status])
}
```

### RadarEntry

```sql
model RadarEntry {
  id           String   @id @default(cuid())
  roundId      String
  userId       String
  tier         String   // 'free' | 'pro'
  weight       Float    // 1.0 для free, 1.25 для pro
  createdAt    DateTime @default(now())
  
  round        RadarRound @relation(fields: [roundId], references: [id], onDelete: Cascade)
  
  @@unique([roundId, userId])
  @@index([userId, createdAt])
}
```

## Утилиты

### commitReveal.ts

- `generateSeed()`: Генерирует 32-байтовый случайный seed
- `hashSeed(seed)`: Создает SHA256 хеш для commit
- `makeRand(serverSeed, publicSalt)`: Создает HMAC для reveal
- `verifyCommitReveal(seedHash, serverSeed)`: Проверяет честность
- `randToFloat(rand)`: Конвертирует rand в число [0, 1)

## Безопасность

### Commit-Reveal Гарантии

1. **Непредсказуемость**: `serverSeed` генерируется криптографически случайно
2. **Честность**: `seedHash` публикуется до начала раунда
3. **Верифицируемость**: Финальный `rand` можно проверить по формуле
4. **Прозрачность**: Все данные доступны для аудита

### Rate Limiting

- `/api/radar/join`: 10 запросов в 15 минут
- `/api/radar/result`: 10 запросов в 15 минут

## Тестирование

### Unit Tests

```bash
# Тесты commit-reveal утилит
npm test -- src/util/commitReveal.test.ts

# Тесты сервиса радара
npm test -- src/services/radarService.test.ts
```

### E2E Smoke Test

```bash
# 1. Присоединиться к раунду
curl -X POST /api/radar/join \
  -H "Authorization: Bearer test-user" \
  -d '{"itemAddress": "EQD...", "tier": "free"}'

# 2. Получить результат
curl -X GET /api/radar/result/{roundId} \
  -H "Authorization: Bearer test-user"
```

## Интеграция с фронтом

### UI Flow

1. **Сигнал приходит** → Показываем кнопку "Поймать"
2. **Пользователь жмет** → POST /api/radar/join
3. **Ожидание** → Показываем "Ждем результат..." (500ms)
4. **Результат** → GET /api/radar/result → "Поймал" / "Не поймал"

### Важные моменты

- **НЕ используем слово "лотерея"** в UI
- Используем термины: "сигнал", "поймать", "поймал/не поймал"
- Показываем `seedHash` для прозрачности
- В `reveal` содержится вся информация для верификации

## Мониторинг

### Метрики

- Количество раундов в день
- Среднее количество участников на раунд
- Распределение free/pro участников
- Время отклика API

### Логи

- Создание раундов
- Присоединение участников
- Закрытие раундов
- Ошибки в commit-reveal

## Будущие улучшения

1. **TON Block Hash**: Использовать реальный TON block hash как `publicSalt`
2. **Множественные победители**: Поддержка нескольких победителей в раунде
3. **Динамические веса**: Веса на основе активности пользователя
4. **Аудит**: Веб-интерфейс для проверки честности раундов
