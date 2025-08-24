type Entry<T> = { exp:number; val:T }; 
const mem = new Map<string,Entry<any>>();

export async function memo<T>(key:string, ttlMs:number, fn:()=>Promise<T>): Promise<T> {
  const now = Date.now(), e = mem.get(key);
  if (e && e.exp > now) return e.val;
  const v = await fn(); 
  mem.set(key, { exp: now + ttlMs, val: v }); 
  return v;
}

export function setCacheHeaders(res:any, seconds:number) {
  res.setHeader('Cache-Control', `public, max-age=${seconds}`);
  res.setHeader('Vary', 'Origin');
}
