import { LRUCache } from 'lru-cache';
import Redis from 'ioredis';

const ttl = Number(process.env.CACHE_DEFAULT_TTL || 60);
const redisUrl = process.env.REDIS_URL;
let redis: Redis | null = null;

if (redisUrl) {
  try { redis = new Redis(redisUrl); } catch { redis = null; }
}

const lru = new LRUCache<string, string>({ 
  max: 500, 
  ttl: ttl * 1000 
});

export async function cacheGet(key: string): Promise<string | null> {
  const v = lru.get(key);
  if (v) return v;
  if (redis) {
    const rv = await redis.get(key);
    if (rv) { lru.set(key, rv, { ttl: ttl * 1000 }); return rv; }
  }
  return null;
}

export async function cacheSet(key: string, value: string, seconds=ttl) {
  lru.set(key, value, { ttl: seconds * 1000 });
  if (redis) await redis.setex(key, seconds, value);
}
