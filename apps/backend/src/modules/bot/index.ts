import { Router } from 'express';
// import { webhookHandler } from '@randar-market/bot';

export const botRouter = Router();

// Webhook endpoint for Telegram bot
// botRouter.post(`/webhook/${process.env.TELEGRAM_WEBHOOK_SECRET}`, webhookHandler);

// Health check for bot
botRouter.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'telegram-bot',
    timestamp: new Date().toISOString()
  });
});
