import { verifyTelegramAuth } from '../telegram';

describe('verifyTelegramAuth', () => {
  const OLD_JWT = process.env.JWT_SECRET;
  const OLD_TG = process.env.TELEGRAM_BOT_TOKEN;
  
  beforeAll(()=> { 
    process.env.JWT_SECRET = 'super_secret_jwt_key_for_testing_32_chars_minimum';
    process.env.TELEGRAM_BOT_TOKEN = '123:ABC'; 
  });
  
  afterAll(()=> { 
    process.env.JWT_SECRET = OLD_JWT;
    process.env.TELEGRAM_BOT_TOKEN = OLD_TG; 
  });

  it('invalid when no hash', () => {
    expect(verifyTelegramAuth({ id: '1', auth_date: '' } as any)).toBe(false);
  });
});
