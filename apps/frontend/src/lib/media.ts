const GATEWAYS = [
  'https://cloudflare-ipfs.com/ipfs/',
  'https://ipfs.io/ipfs/',
  'https://gateway.pinata.cloud/ipfs/'
];

export function toHttp(url?: string | null): string | undefined {
  if (!url) return undefined;
  const u = url.trim();
  if (u.startsWith('ipfs://')) {
    const cid = u.replace('ipfs://', '').replace(/^ipfs\//, '');
    return GATEWAYS[0] + cid;
  }
  if (u.startsWith('ipfs/')) return GATEWAYS[0] + u.replace(/^ipfs\//, '');
  if (u.startsWith('//')) return 'https:' + u;           // протокол-agnostic → https
  if (u.startsWith('data:')) return u;                   // base64
  return u;                                             // уже http(s)
}

export function pickMedia(srcs: Array<string | undefined | null>): string | undefined {
  for (const s of srcs) {
    const h = toHttp(s || undefined);
    if (h) return h;
  }
  return undefined;
}
