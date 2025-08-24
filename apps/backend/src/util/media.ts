const GATEWAYS = [
  'https://cloudflare-ipfs.com/ipfs/',
  'https://ipfs.io/ipfs/',
  'https://gateway.pinata.cloud/ipfs/',
];

export function toHttp(url?: string | null): string | undefined {
  if (!url) return;
  const u = url.trim();
  if (u.startsWith('ipfs://')) {
    const cid = u.replace('ipfs://', '').replace(/^ipfs\//, '');
    return GATEWAYS[0] + cid;
  }
  if (u.startsWith('ipfs/')) return GATEWAYS[0] + u.replace(/^ipfs\//, '');
  if (u.startsWith('//')) return 'https:' + u;
  return u;
}

export function pickMedia(...srcs:(string|undefined|null)[]) {
  for (const s of srcs) {
    const h = toHttp(s);
    if (h) return h;
  }
}
