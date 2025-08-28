import { config } from 'dotenv';
import { prisma } from '../src/db/client';

// Load environment variables
config({ path: '../.env' });

async function topupBalance() {
  const userId = 'e2e';
  const amount = 100.0;

  try {
    const balance = await prisma.walletBalance.upsert({
      where: { userId },
      update: {
        ton: { increment: amount }
      },
      create: {
        userId,
        ton: amount
      }
    });

    console.log(`✅ Balance topped up for user ${userId}: ${balance.ton} TON`);
  } catch (error) {
    console.error('❌ Failed to topup balance:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

topupBalance();
