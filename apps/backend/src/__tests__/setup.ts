// Test setup file
import dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: '.env.test' });

// Set test environment
process.env.NODE_ENV = 'test';

// Mock environment variables for testing
process.env.TELEGRAM_BOT_TOKEN = 'test_bot_token';
process.env.JWT_SECRET = 'test_jwt_secret_32_chars_long_for_testing';
process.env.TON_PAY_RECEIVER = 'test_wallet_address';
process.env.CLIENT_ORIGIN = 'http://localhost:5173';
process.env.PORT = '3000';
process.env.DATABASE_URL = 'file:./test.db';
process.env.NODE_ENV = 'test';
