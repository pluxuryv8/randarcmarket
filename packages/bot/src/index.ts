import { Bot, webhookCallback } from 'grammy';
import { BotError } from 'grammy';
import axios from 'axios';
import { User, Subscription } from '@randar-market/shared';

// Environment variables
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const WEBHOOK_SECRET = process.env.TELEGRAM_WEBHOOK_SECRET!;
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8080';

// Create bot instance
const bot = new Bot(BOT_TOKEN);

// Error handling
bot.catch((err) => {
  const ctx = err.ctx;
  console.error(`Error while handling update ${ctx.update.update_id}:`);
  const e = err.error;
  if (e instanceof BotError) {
    console.error("Known bot error occurred:", e.message);
  } else if (e instanceof Error) {
    console.error("Unknown error occurred:", e);
  }
});

// Start command
bot.command("start", async (ctx) => {
  const welcomeMessage = `
🚀 Добро пожаловать в Randar Market!

Я помогу вам отслеживать NFT рынок TON и получать уведомления о выгодных сделках.

📋 Доступные команды:
/start - показать это сообщение
/link - связать аккаунт с веб-сайтом
/status - проверить статус подписки
/stop - отписаться от уведомлений

💡 Для начала работы свяжите ваш Telegram аккаунт с веб-сайтом командой /link
  `;
  
  await ctx.reply(welcomeMessage);
});

// Link command - generate linking code
bot.command("link", async (ctx) => {
  const userId = ctx.from?.id.toString();
  if (!userId) {
    await ctx.reply("❌ Ошибка: не удалось получить ID пользователя");
    return;
  }

  try {
    // Generate linking code (in real implementation, this would be stored in DB)
    const linkingCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    const message = `
🔗 Связывание аккаунта

Ваш код для связывания: **${linkingCode}**

1. Перейдите на сайт: https://randar-market.com
2. Войдите через Telegram
3. Введите этот код в настройках профиля

⚠️ Код действителен 10 минут
    `;
    
    await ctx.reply(message, { parse_mode: "Markdown" });
  } catch (error) {
    console.error("Error generating linking code:", error);
    await ctx.reply("❌ Ошибка при генерации кода связывания");
  }
});

// Status command - check subscription
bot.command("status", async (ctx) => {
  const userId = ctx.from?.id.toString();
  if (!userId) {
    await ctx.reply("❌ Ошибка: не удалось получить ID пользователя");
    return;
  }

  try {
    // In real implementation, this would call backend API
    const response = await axios.get(`${BACKEND_URL}/api/auth/me`, {
      headers: {
        'Authorization': `Bearer ${userId}` // Simplified for MVP
      }
    });

    if (response.data.success) {
      const user = response.data.data as User;
      const subscription = user.subscription as Subscription | null;
      
      if (subscription && subscription.status === 'active') {
        const endDate = new Date(subscription.end_date).toLocaleDateString('ru-RU');
        await ctx.reply(`
✅ Подписка активна

📅 Действует до: ${endDate}
💰 Стоимость: ${subscription.price_ton} TON
        `);
      } else {
        await ctx.reply(`
❌ Подписка неактивна

💡 Для активации Radar функций оформите подписку на сайте:
https://randar-market.com/pricing
        `);
      }
    } else {
      await ctx.reply("❌ Пользователь не найден. Сначала свяжите аккаунт командой /link");
    }
  } catch (error) {
    console.error("Error checking subscription:", error);
    await ctx.reply("❌ Ошибка при проверке подписки");
  }
});

// Stop command - unsubscribe from notifications
bot.command("stop", async (ctx) => {
  const userId = ctx.from?.id.toString();
  if (!userId) {
    await ctx.reply("❌ Ошибка: не удалось получить ID пользователя");
    return;
  }

  try {
    // In real implementation, this would call backend API to stop notifications
    await ctx.reply(`
🔕 Уведомления отключены

Вы больше не будете получать уведомления от Radar.

💡 Для возобновления уведомлений используйте команду /start
    `);
  } catch (error) {
    console.error("Error stopping notifications:", error);
    await ctx.reply("❌ Ошибка при отключении уведомлений");
  }
});

// Function to send radar alerts
export async function sendRadarAlert(tgId: string, message: string): Promise<boolean> {
  try {
    await bot.api.sendMessage(tgId, message, { parse_mode: "Markdown" });
    return true;
  } catch (error) {
    console.error(`Error sending radar alert to ${tgId}:`, error);
    return false;
  }
}

// Webhook handler
export const webhookHandler = webhookCallback(bot, "express");

// Start bot (for development)
if (process.env.NODE_ENV === 'development') {
  bot.start();
  console.log("Bot started in development mode");
}

export default bot;
