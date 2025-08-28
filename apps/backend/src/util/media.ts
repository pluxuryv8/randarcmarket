/**
 * Нормализация IPFS/URL → HTTPS
 */
export function toHttp(url?: string): string | undefined {
  if (!url) return;
  const u = url.trim();

  // ipfs://<cid>[/path]
  if (u.startsWith('ipfs://')) {
    const cid = u.replace('ipfs://', '').replace(/^ipfs\//, '');
    return `https://cloudflare-ipfs.com/ipfs/${cid}`;
  }
  // ipfs/<cid>[/path]
  if (u.startsWith('ipfs/')) {
    return `https://cloudflare-ipfs.com/ipfs/${u.slice(5)}`;
  }
  // Protocol-relative //host/...
  if (u.startsWith('//')) return `https:${u}`;
  // http → https
  if (u.startsWith('http://')) return `https://${u.slice(7)}`;
  // https ок
  if (u.startsWith('https://')) return u;

  // Относительные пути или что-то иное не трогаем (лучше вернуть undefined, чем фейковый домен)
  return undefined;
}

export function isValidUrl(url: string): boolean {
  try { new URL(url); return true; } catch { return false; }
}

export function pickMedia(...urls: (string | undefined)[]): string | undefined {
  for (const url of urls) {
    const httpUrl = toHttp(url);
    if (httpUrl) return httpUrl;
  }
  return undefined;
}
