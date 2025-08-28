import pinoHttp from 'pino-http';
import { randomUUID } from 'crypto';

export const logger = pinoHttp({
  genReqId: (req) => (req.headers['x-request-id'] as string) || randomUUID(),
  serializers: {
    req(req) { return { id: req.id, method: req.method, url: req.url }; },
    res(res) { return { statusCode: res.statusCode }; },
  },
  customLogLevel: (res, err) => {
    if (res.statusCode >= 500 || err) return 'error';
    if (res.statusCode >= 400) return 'warn';
    return 'info';
  },
});
