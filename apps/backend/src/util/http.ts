import { setTimeout as delay } from 'timers/promises';

type Opts = {
  headers?: Record<string,string>;
  timeoutMs?: number;
  retries?: number;
  backoffMs?: number;
  provider?: 'tonapi'|'nftscan'|'unknown';
  endpoint?: string;
};

type Circuit = { failures: number; openedAt: number; cooldownMs: number };
const circuits = new Map<string, Circuit>();

function keyFrom(url: string) {
  try { const u = new URL(url); return u.origin; } catch { return 'unknown'; }
}

function isOpen(origin: string) {
  const c = circuits.get(origin);
  if (!c) return false;
  if (Date.now() - c.openedAt < c.cooldownMs) return true;
  // half-open
  circuits.delete(origin);
  return false;
}

function markFailure(origin: string) {
  const c = circuits.get(origin) || { failures: 0, openedAt: 0, cooldownMs: 5000 };
  c.failures += 1;
  if (c.failures >= 3) { c.openedAt = Date.now(); c.cooldownMs = Math.min(c.cooldownMs * 2, 60000); c.failures = 0; }
  circuits.set(origin, c);
}

function markSuccess(origin: string) {
  circuits.delete(origin);
}

export async function httpGetJson<T=any>(url: string, opts: Opts = {}): Promise<T> {
  const { headers = {}, timeoutMs = 4000, retries = 2, backoffMs = 250 } = opts;
  const origin = keyFrom(url);

  if (isOpen(origin)) throw new Error(`circuit_open:${origin}`);

  let attempt = 0;
  while (true) {
    try {
      const res = await Promise.race([
        fetch(url, { headers }),
        new Promise<Response>((_, rej)=> setTimeout(()=> rej(new Error('timeout')), timeoutMs)),
      ]);
      if (!('ok' in res)) throw res; // таймаут
      if (!res.ok) throw new Error(`http_${res.status}`);
      const json = await (res as Response).json();
      markSuccess(origin);
      return json as T;
    } catch (e) {
      attempt++;
      if (attempt > retries) { markFailure(origin); throw e; }
      await delay(backoffMs * attempt);
    }
  }
}
