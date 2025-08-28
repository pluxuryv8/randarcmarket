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

// Radar metrics
export const radarRoundsTotal = new client.Counter({
  name: 'radar_rounds_total',
  help: 'Total number of radar rounds',
  labelNames: ['status'] as const,
});

export const radarRoundCloseDuration = new client.Histogram({
  name: 'radar_round_close_duration_ms',
  help: 'Radar round close duration in milliseconds',
  labelNames: ['status'] as const,
  buckets: [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000],
});

export const radarEntriesTotal = new client.Counter({
  name: 'radar_entries_total',
  help: 'Total number of radar entries',
  labelNames: ['tier'] as const,
});

export const radarCommitRevealFailures = new client.Counter({
  name: 'radar_commit_reveal_failures_total',
  help: 'Total number of commit-reveal verification failures',
});

export const radarActiveRounds = new client.Gauge({
  name: 'radar_active_rounds',
  help: 'Number of currently active radar rounds',
});

// Radar reservation metrics
export const radarReservationsTotal = new client.Counter({
  name: 'radar_reservations_total',
  help: 'Total number of radar reservations',
  labelNames: ['status'] as const,
});

export const radarReservationsActive = new client.Gauge({
  name: 'radar_reservations_active',
  help: 'Number of currently active radar reservations',
});

// Radar order metrics
export const radarOrdersTotal = new client.Counter({
  name: 'radar_orders_total',
  help: 'Total number of radar orders',
  labelNames: ['status'] as const,
});

export const radarExecutionDurationMs = new client.Histogram({
  name: 'radar_execution_duration_ms',
  help: 'Radar order execution duration in milliseconds',
  buckets: [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1200, 1500],
});

export const radarDeliveryTotal = new client.Counter({
  name: 'radar_delivery_total',
  help: 'Total number of radar deliveries',
  labelNames: ['status'] as const,
});

register.registerMetric(httpRequestsTotal);
register.registerMetric(httpRequestDuration);
register.registerMetric(providerSuccess);
register.registerMetric(providerFailure);
register.registerMetric(radarRoundsTotal);
register.registerMetric(radarRoundCloseDuration);
register.registerMetric(radarEntriesTotal);
register.registerMetric(radarCommitRevealFailures);
register.registerMetric(radarActiveRounds);
register.registerMetric(radarReservationsTotal);
register.registerMetric(radarReservationsActive);
register.registerMetric(radarOrdersTotal);
register.registerMetric(radarExecutionDurationMs);
register.registerMetric(radarDeliveryTotal);

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
