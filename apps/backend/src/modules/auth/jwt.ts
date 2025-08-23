import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { getUserById } from './telegram';

const JWT_SECRET = process.env.JWT_SECRET!;

export interface AuthenticatedRequest extends Request {
  user?: {
    sub: string;
    user_id: string;
    username?: string;
  };
}

export function authenticateJWT(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({
      success: false,
      error: 'Authorization header required'
    });
  }
  
  const token = authHeader.split(' ')[1]; // Bearer TOKEN
  
  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Token required'
    });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    
    // Verify user still exists
    const user = getUserById(decoded.sub);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'User not found'
      });
    }
    
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Invalid token'
    });
  }
}

export function requireSubscription(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  // TODO: Check if user has active subscription
  // For MVP, we'll allow all authenticated users
  next();
}
