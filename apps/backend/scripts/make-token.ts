import { config } from 'dotenv';
import { signAccess } from '../src/modules/auth/jwt';

// Load environment variables
config({ path: '../.env' });

const testUser = { id: 'e2e', tier: 'pro' };
const token = signAccess(testUser);

console.log('Test token for user e2e:');
console.log(token);
