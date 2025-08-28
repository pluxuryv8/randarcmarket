import crypto from 'crypto';
export function etagOf(obj:any) {
  const str = JSON.stringify(obj);
  return 'W/"' + crypto.createHash('sha1').update(str).digest('hex') + '"';
}
export function notModified(req: any, etag: string, lastMod?: string) {
  const inm = req.headers['if-none-match'];
  const ims = req.headers['if-modified-since'];
  if (inm && inm === etag) return true;
  if (ims && lastMod && new Date(ims).getTime() >= new Date(lastMod).getTime()) return true;
  return false;
}
