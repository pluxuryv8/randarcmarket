import { execSync } from 'child_process';
import { config } from 'dotenv';
import fs from 'fs';
import path from 'path';

// Set test environment
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = 'file:./test.db';

// Load environment variables
config({ path: '.env' });

async function globalSetup() {
  console.log('🔧 Setting up test environment...');
  
  try {
    // Remove existing test database
    const testDbPath = path.join(__dirname, 'test.db');
    if (fs.existsSync(testDbPath)) {
      console.log('🗑️ Removing existing test database...');
      fs.unlinkSync(testDbPath);
    }
    
    // Generate Prisma client
    console.log('📦 Generating Prisma client...');
    execSync('npx prisma generate', { stdio: 'inherit' });
    
    // Apply migrations
    console.log('🗄️ Applying database migrations...');
    execSync('npx prisma migrate deploy', { stdio: 'inherit' });
    
    console.log('✅ Test environment setup completed');
  } catch (error) {
    console.error('❌ Failed to setup test environment:', error);
    throw error;
  }
}

export default globalSetup;
