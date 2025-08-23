import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { TelegramAuthData, User, ApiResponse } from '../../types';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const JWT_SECRET = process.env.JWT_SECRET!;

// In-memory storage for MVP (replace with database in production)
const users = new Map<string, User>();

function checkTelegramAuth(initData: Record<string, string>): boolean {
  try {
    const { hash, ...data } = initData;
    
    // Create data-check-string
    const dataCheck = Object.keys(data)
      .sort()
      .map((k) => `${k}=${data[k]}`)
      .join('\n');
    
    // Create secret key
    const secretKey = crypto
      .createHmac('sha256', 'WebAppData')
      .update(BOT_TOKEN)
      .digest();
    
    // Calculate HMAC
    const hmac = crypto
      .createHmac('sha256', secretKey)
      .update(dataCheck)
      .digest('hex');
    
    return hmac === hash;
  } catch (error) {
    console.error('Telegram auth check error:', error);
    return false;
  }
}

function findOrCreateUser(authData: TelegramAuthData): User {
  const existingUser = users.get(authData.id);
  
  if (existingUser) {
    // Update user data
    existingUser.username = authData.username;
    existingUser.first_name = authData.first_name;
    existingUser.last_name = authData.last_name;
    existingUser.photo_url = authData.photo_url;
    existingUser.updated_at = new Date();
    return existingUser;
  }
  
  // Create new user
  const newUser: User = {
    id: crypto.randomUUID(),
    tg_id: authData.id,
    username: authData.username,
    first_name: authData.first_name,
    last_name: authData.last_name,
    photo_url: authData.photo_url,
    created_at: new Date(),
    updated_at: new Date()
  };
  
  users.set(authData.id, newUser);
  return newUser;
}

export async function verifyTelegram(req: Request, res: Response) {
  try {
    const initData = req.body as Record<string, string>;
    
    // Validate required fields
    if (!initData.id || !initData.auth_date || !initData.hash) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      } as ApiResponse);
    }
    
    // Check signature
    if (!checkTelegramAuth(initData)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid signature'
      } as ApiResponse);
    }
    
    // Check TTL (24 hours)
    const authDate = Number(initData.auth_date) * 1000;
    const now = Date.now();
    const ttl = 24 * 60 * 60 * 1000; // 24 hours
    
    if (now - authDate > ttl) {
      return res.status(400).json({
        success: false,
        error: 'Authentication expired'
      } as ApiResponse);
    }
    
    // Find or create user
    const user = findOrCreateUser(initData as unknown as TelegramAuthData);
    
    // Generate JWT
    const token = jwt.sign(
      { 
        sub: user.tg_id,
        user_id: user.id,
        username: user.username 
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          tg_id: user.tg_id,
          username: user.username,
          first_name: user.first_name,
          last_name: user.last_name,
          photo_url: user.photo_url,
          wallet_address: user.wallet_address
        }
      }
    } as ApiResponse);
    
  } catch (error) {
    console.error('Telegram verify error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
  }
}

export function getUserById(tgId: string): User | undefined {
  return users.get(tgId);
}

export function updateUserWallet(tgId: string, walletAddress: string): boolean {
  const user = users.get(tgId);
  if (user) {
    user.wallet_address = walletAddress;
    user.updated_at = new Date();
    return true;
  }
  return false;
}
