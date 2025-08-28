import { Router } from 'express';
import { register } from '../observability/metrics';

export const adminRouter = Router();

/**
 * Возвращает агрегированные метрики и состояние процесса:
 * - uptime, memory
 * - http_requests_total по route/status
 * - provider_success_total / provider_failure_total
 */
adminRouter.get('/stats', async (_req, res) => {
  const metrics = await register.getMetricsAsJSON().catch(()=>[]);
  const mem = process.memoryUsage();
  const data = {
    success: true,
    process: {
      pid: process.pid,
      uptime: process.uptime(),
      memory: {
        rss: mem.rss, heapTotal: mem.heapTotal, heapUsed: mem.heapUsed, external: mem.external
      }
    },
    metrics
  };
  res.json(data);
});
