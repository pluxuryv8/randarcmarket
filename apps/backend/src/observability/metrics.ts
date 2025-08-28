import client from 'prom-client';
import type { Request, Response, NextFunction } from 'express';

export const register = new client.Registry();
client.collectDefaultMetrics({ register });

export const httpRequestsTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status'] as const,
});

export const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'HTTP request duration in seconds',
  labelNames: ['method', 'route', 'status'] as const,
  buckets: [0.05, 0.1, 0.2, 0.5, 1, 2, 5],
});

export const providerSuccess = new client.Counter({
  name: 'provider_success_total',
  help: 'Successful provider fetches',
  labelNames: ['provider', 'endpoint'] as const,
});

export const providerFailure = new client.Counter({
  name: 'provider_failure_total',
  help: 'Failed provider fetches',
  labelNames: ['provider', 'endpoint'] as const,
});

register.registerMetric(httpRequestsTotal);
register.registerMetric(httpRequestDuration);
register.registerMetric(providerSuccess);
register.registerMetric(providerFailure);

export function metricsMiddleware(req: Request, res: Response, next: NextFunction) {
  const start = process.hrtime.bigint();
  res.on('finish', () => {
    const diff = Number(process.hrtime.bigint() - start) / 1e9;
    const route = (req.route?.path || req.path || 'unknown').toString();
    const status = res.statusCode.toString();
    httpRequestsTotal.inc({ method: req.method, route, status });
    httpRequestDuration.observe({ method: req.method, route, status }, diff);
  });
  next();
}
