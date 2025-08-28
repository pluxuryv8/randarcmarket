import { URL } from 'url';

type CheckResult = { name: string; ok: boolean; info?: string };
type ReadyStatus = {
  status: 'ok'|'degraded'|'fail';
  time: string;
  checks: CheckResult[];
};

async function timeout<T>(p: Promise<T>, ms = 3000): Promise<T> {
  return await Promise.race([
    p,
    new Promise<T>((_, rej) => setTimeout(() => rej(new Error('timeout')), ms)),
  ]);
}

async function pingJson(url: string, headers: Record<string,string> = {}): Promise<boolean> {
  try {
    const res = await timeout(fetch(url, { headers }), 3000);
    return res.ok;
  } catch { return false; }
}

export async function readiness(): Promise<ReadyStatus> {
  const checks: CheckResult[] = [];
  const tonKey = process.env.TONAPI_KEY;
  const nftscanKey = process.env.NFTSCAN_TON_API_KEY;

  // TonAPI
  if (tonKey) {
    const ok = await pingJson('https://tonapi.io/v2/nfts/collections?limit=1', { Authorization: `Bearer ${tonKey}` });
    checks.push({ name: 'tonapi', ok, info: ok ? 'ok' : 'unreachable' });
  } else {
    checks.push({ name: 'tonapi', ok: false, info: 'no key' });
  }

  // NFTScan
  if (nftscanKey) {
    const ok = await pingJson('https://api.nftscan.com/v1/collections?chain=ton&limit=1', { 'X-API-KEY': nftscanKey });
    checks.push({ name: 'nftscan', ok, info: ok ? 'ok' : 'unreachable' });
  } else {
    checks.push({ name: 'nftscan', ok: false, info: 'no key' });
  }

  // Доп. проверки (подключи позже при наличии)
  // Redis / DB / MQ — пример:
  // checks.push({ name: 'redis', ok: true, info: 'skipped' });

  const okCount = checks.filter(c => c.ok).length;
  const status: ReadyStatus['status'] =
    okCount === checks.length ? 'ok' : okCount > 0 ? 'degraded' : 'fail';

  return { status, time: new Date().toISOString(), checks };
}
