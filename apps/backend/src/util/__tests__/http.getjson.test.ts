import { httpGetJson } from '../http';

const g: any = global;

describe('httpGetJson', () => {
  beforeEach(()=> { g.fetch = undefined; });

  it('ok json', async () => {
    g.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ ok:1 }) });
    const r = await httpGetJson('https://api.example.com/x');
    expect(r.ok).toBe(1);
  });

  it('retry then ok', async () => {
    g.fetch = jest.fn()
      .mockResolvedValueOnce({ ok: false, status: 500 })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ ok:2 }) });
    const r = await httpGetJson('https://api.example.com/x', { retries: 2, backoffMs: 10 });
    expect(r.ok).toBe(2);
  });

  it('timeout', async () => {
    g.fetch = jest.fn().mockImplementation(() => new Promise(()=>{}));
    await expect(httpGetJson('https://api.example.com/x', { timeoutMs: 10, retries: 0 }))
      .rejects.toBeTruthy();
  });
});
