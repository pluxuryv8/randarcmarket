import request from 'supertest';
import app from '../index';

describe('smoke', () => {
  it('/health 200', async () => {
    const r = await request(app).get('/health');
    expect(r.status).toBe(200);
    expect(r.body.status).toBe('ok');
  });

  it('/metrics 200', async () => {
    const r = await request(app).get('/metrics');
    expect(r.status).toBe(200);
    expect(r.text).toMatch(/http_requests_total/);
  });
});
