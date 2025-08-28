import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

import { authRouter } from './modules/auth';
import nftRoutes from './routes/nft';
import { paymentsRouter } from './modules/payments';
import { radarRouter } from './modules/radar';
import { dropsRouter } from './modules/drops';
import { logger } from './observability/logger';
import { metricsMiddleware, register } from './observability/metrics';
import { readiness } from './observability/health';
import { getEnv } from './config/env';
import { verifyTelegramWebhook } from './middleware/telegramWebhook';
import { authGuard } from './middleware/auth';
import { isAdmin } from './middleware/isAdmin';
import { adminRouter } from './routes/admin';
import imgRouter from './routes/img';
// import { botRouter } from './modules/bot';

dotenv.config();

const app = express();
const env = getEnv();
const PORT = env.PORT;
const CLIENT_ORIGIN = env.CLIENT_ORIGIN;

// Security middleware
app.use(helmet());

// Enhanced security headers for production
const isProd = env.NODE_ENV === 'production';
if (isProd) {
  app.use(helmet.hsts({ maxAge: 31536000 }));
  // CSP осторожно, чтобы не сломать TonConnect UI/скрипты — оставим базовый вариант
  app.use(helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      "script-src": ["'self'", "'unsafe-inline'"],
      "img-src": ["'self'", "data:", "https:", "blob:"],
      "connect-src": ["'self'", "https:", "wss:"],
    }
  }));
}

// CORS configuration with whitelist
const origins = CLIENT_ORIGIN.split(',').map(s => s.trim());
app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);
    if (origins.includes(origin)) return cb(null, true);
    return cb(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization']
}));

// Observability middleware
app.use(logger);
app.use(metricsMiddleware);

// Rate limiting with user-based keys
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    const user = (req as any).user;
    if (user?.id) return `uid:${user.id}`;
    if (user?.wallet) return `wal:${user.wallet}`;
    return req.ip || 'ip:unknown';
  },
  message: 'Too many requests from this identity, please try again later.'
});
app.use('/api/', limiter);

// Stricter rate limiting for sensitive endpoints
const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Too many requests to sensitive endpoint'
});
app.use('/api/radar/', strictLimiter);
app.use('/api/payments/', strictLimiter);

// Logging
app.use(morgan('combined'));

// Compression
app.use(compression());

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Ready check
app.get('/ready', async (_req, res) => {
  const r = await readiness();
  const code = r.status === 'ok' ? 200 : r.status === 'degraded' ? 200 : 503;
  res.status(code).json(r);
});

// Metrics
app.get('/metrics', async (_req, res) => {
  res.setHeader('Content-Type', register.contentType);
  res.end(await register.metrics());
});

// API routes
app.use('/api/auth', authRouter);
app.use('/api/nft', nftRoutes);
app.use('/api/payments', paymentsRouter);
app.use('/api/radar', radarRouter);
app.use('/api/drops', dropsRouter);
app.use('/api/img', imgRouter);

// Admin routes (protected)
app.use('/api/admin', authGuard, isAdmin, adminRouter);

// Telegram webhook with HMAC verification
app.post('/api/telegram/webhook', verifyTelegramWebhook, (req, res) => {
  // TODO: Add bot webhook handler
  res.json({ success: true, message: 'Webhook received' });
});

// app.use('/bot', botRouter);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    error: 'Route not found' 
  });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  
  res.status(err.status || 500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message
  });
});

// Export app for testing
export { app };

// Only start server if not in test environment
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 Randar Market Backend running on http://localhost:${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
    console.log(`🔍 Ready check: http://localhost:${PORT}/ready`);
    console.log(`📈 Metrics: http://localhost:${PORT}/metrics`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  });
  
  // Start indexer loop
  import('./indexer').then(({ startIndexerLoop }) => {
    startIndexerLoop();
    console.log('📦 Indexer started');
  }).catch(err => {
    console.warn('⚠️ Indexer failed to start:', err.message);
  });
}

export default app;
