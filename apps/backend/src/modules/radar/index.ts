import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import { z } from 'zod';
import { AuthenticatedRequest } from '../auth/jwt';
import { 
  addWatchlistFilter, 
  removeWatchlistFilter, 
  getUserWatchlist, 
  getUserSignals,
  startRadarWorker 
} from './worker';
import { WatchlistFilter, ApiResponse } from '../../types';
import { createOrJoinRound, getResult, getRoundStats } from '../../services/radarService';
import { 
  createReservation, 
  isUserWinnerOfRound, 
  expireStaleReservations, 
  getUserReservations 
} from '../../services/radarReservationService';
import {
  payReservationWithBalance,
  getTonConnectPaymentLink,
  confirmTonConnectPayment,
  enqueueExecution,
  getOrder
} from '../../services/radarBuyService';
import { prisma } from '../../db/client';

export const radarRouter = Router();

// In-memory storage for idempotency keys (в продакшене использовать Redis)
const idempotencyStore = new Map<string, { response: any; timestamp: number }>();

// Zod schemas for validation
const joinRequestSchema = z.object({
  itemAddress: z.string().min(1),
  tier: z.enum(['free', 'pro'])
});

const resultParamsSchema = z.object({
  roundId: z.string().min(1)
});

const reserveRequestSchema = z.object({
  roundId: z.string().min(1)
});

const reservationsQuerySchema = z.object({
  limit: z.coerce.number().min(1).max(100).default(20)
});

const payRequestSchema = z.object({
  reservationId: z.string().min(1),
  method: z.enum(['balance', 'tonconnect'])
});

const confirmRequestSchema = z.object({
  reservationId: z.string().min(1),
  proof: z.any()
});

// Start radar worker when module is loaded
// startRadarWorker(); // Temporarily disabled for debugging

// GET /api/radar/watchlist
radarRouter.get('/watchlist', (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.sub;
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized'
      } as ApiResponse);
    }
    
    const watchlist = getUserWatchlist(userId);
    res.json({
      success: true,
      data: watchlist
    } as ApiResponse);
  } catch (error) {
    console.error('Error getting watchlist:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get watchlist'
    } as ApiResponse);
  }
});

// POST /api/radar/watchlist
radarRouter.post('/watchlist', (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.sub;
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized'
      } as ApiResponse);
    }
    
    const filterData = req.body;
    const filter: WatchlistFilter = {
      id: crypto.randomUUID(),
      user_id: userId,
      collection_address: filterData.collection_address,
      min_price: filterData.min_price,
      max_price: filterData.max_price,
      rarity_filter: filterData.rarity_filter,
      below_floor_percent: filterData.below_floor_percent,
      created_at: new Date()
    };
    
    addWatchlistFilter(userId, filter);
    
    res.json({
      success: true,
      data: filter
    } as ApiResponse);
  } catch (error) {
    console.error('Error creating watchlist filter:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create watchlist filter'
    } as ApiResponse);
  }
});

// DELETE /api/radar/watchlist/:id
radarRouter.delete('/watchlist/:id', (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.sub;
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized'
      } as ApiResponse);
    }
    
    const { id } = req.params;
    const removed = removeWatchlistFilter(userId, id);
    
    if (!removed) {
      return res.status(404).json({
        success: false,
        error: 'Filter not found'
      } as ApiResponse);
    }
    
    res.json({
      success: true,
      message: 'Filter removed successfully'
    } as ApiResponse);
  } catch (error) {
    console.error('Error removing watchlist filter:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to remove watchlist filter'
    } as ApiResponse);
  }
});

// GET /api/radar/notifications
radarRouter.get('/notifications', (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.sub;
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized'
      } as ApiResponse);
    }
    
    const since = req.query.since ? new Date(req.query.since as string) : undefined;
    const signals = getUserSignals(userId, since);
    
    res.json({
      success: true,
      data: signals
    } as ApiResponse);
  } catch (error) {
    console.error('Error getting notifications:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get notifications'
    } as ApiResponse);
  }
});



// POST /api/radar/join - Присоединиться к раунду
radarRouter.post('/join', (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.sub;
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized'
      } as ApiResponse);
    }
    
    let body;
    try {
      body = joinRequestSchema.parse(req.body);
    } catch (parseError) {
      if (parseError instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: 'Invalid request data',
          details: parseError.errors
        } as ApiResponse);
      }
      throw parseError;
    }
    
    createOrJoinRound(body.itemAddress, userId, body.tier)
      .then(result => {
        res.json({
          success: true,
          roundId: result.roundId,
          roundEndsAt: result.roundEndsAt,
          seedHash: result.seedHash,
          meta: { source: 'radar' }
        } as ApiResponse);
      })
      .catch(error => {
        console.error('Join radar error:', error);
        
        if (error instanceof Error && error.message.includes('already joined')) {
          return res.status(409).json({
            success: false,
            error: 'User already joined this round'
          } as ApiResponse);
        }
        
        res.status(500).json({
          success: false,
          error: 'Failed to join radar round'
        } as ApiResponse);
      });
  } catch (error) {
    console.error('Join radar error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to join radar round'
    } as ApiResponse);
  }
});

// GET /api/radar/result/:roundId - Получить результат раунда
radarRouter.get('/result/:roundId', (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.sub;
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized'
      } as ApiResponse);
    }
    
    let params;
    try {
      params = resultParamsSchema.parse(req.params);
    } catch (parseError) {
      if (parseError instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: 'Invalid round ID'
        } as ApiResponse);
      }
      throw parseError;
    }
    
    getResult(params.roundId, userId)
      .then(async result => {
        // Получаем информацию о NFT для фронта
        const item = await prisma.item.findUnique({
          where: { address: result.itemAddress },
          select: { address: true, title: true, image: true }
        });

        res.json({
          success: true,
          caught: result.caught,
          itemAddress: result.itemAddress,
          item: item,
          reveal: result.reveal,
          meta: { source: 'radar' }
        } as ApiResponse);
      })
      .catch(error => {
        console.error('Get result error:', error);
        
        if (error instanceof Error) {
          if (error.message.includes('not found')) {
            return res.status(404).json({
              success: false,
              error: 'Round not found'
            } as ApiResponse);
          }
          
          if (error.message.includes('did not participate')) {
            return res.status(403).json({
              success: false,
              error: 'User did not participate in this round'
            } as ApiResponse);
          }
          
          if (error.message.includes('not yet revealed')) {
            return res.status(202).json({
              success: false,
              error: 'Round not yet revealed',
              status: 'waiting'
            } as ApiResponse);
          }
        }
        
        res.status(500).json({
          success: false,
          error: 'Failed to get radar result'
        } as ApiResponse);
      });
  } catch (error) {
    console.error('Get result error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get radar result'
    } as ApiResponse);
  }
});

// GET /api/radar/stats/:roundId - Статистика раунда (для отладки)
radarRouter.get('/stats/:roundId', (req: AuthenticatedRequest, res: Response) => {
  try {
    const params = resultParamsSchema.parse(req.params);
    
    getRoundStats(params.roundId)
      .then(stats => {
        res.json({
          success: true,
          stats,
          meta: { source: 'radar' }
        } as ApiResponse);
      })
      .catch(error => {
        console.error('Get stats error:', error);
        
        if (error instanceof Error && error.message.includes('not found')) {
          return res.status(404).json({
            success: false,
            error: 'Round not found'
          } as ApiResponse);
        }
        
        res.status(500).json({
          success: false,
          error: 'Failed to get round stats'
        } as ApiResponse);
      });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get round stats'
    } as ApiResponse);
  }
});

// POST /api/radar/reserve - Создать резервацию для победителя
radarRouter.post('/reserve', (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.sub;
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized'
      } as ApiResponse);
    }

    // Проверяем идемпотентность
    const idempotencyKey = req.headers['idempotency-key'] as string;
    if (idempotencyKey) {
      const existing = idempotencyStore.get(idempotencyKey);
      if (existing && Date.now() - existing.timestamp < 60000) {
        return res.json(existing.response);
      }
    }

    let body;
    try {
      body = reserveRequestSchema.parse(req.body);
    } catch (parseError) {
      if (parseError instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: 'Invalid request data',
          details: parseError.errors
        } as ApiResponse);
      }
      throw parseError;
    }

        // Сначала проверяем существование раунда и его статус
    prisma.radarRound.findUnique({
      where: { id: body.roundId },
      select: { status: true }
    })
    .then(async (round) => {
      if (!round) {
        res.status(404).json({
          success: false,
          error: 'Round not found'
        } as ApiResponse);
        return null;
      }

      if (round.status !== 'revealed') {
        res.status(409).json({
          success: false,
          error: 'round_not_closed'
        } as ApiResponse);
        return null;
      }

      // Теперь проверяем, является ли пользователь победителем
      return isUserWinnerOfRound(body.roundId, userId);
    })
    .then(async (winnerCheck) => {
      if (!winnerCheck) {
        return; // Ответ уже отправлен
      }

      if (!winnerCheck.ok) {
        res.status(403).json({
          success: false,
          error: 'not_winner'
        } as ApiResponse);
        return;
      }

      // Создаем резервацию
      const reservation = await createReservation({
        roundId: body.roundId,
        userId,
        itemAddress: winnerCheck.itemAddress!,
        priceTon: winnerCheck.priceTon!,
        source: winnerCheck.source!
      });

      const response = {
        success: true,
        reservation: {
          id: reservation.id,
          reserveToken: reservation.reserveToken,
          expiresAt: reservation.expiresAt.toISOString()
        },
        meta: { source: 'radar' }
      } as ApiResponse;

      // Сохраняем для идемпотентности
      if (idempotencyKey) {
        idempotencyStore.set(idempotencyKey, {
          response,
          timestamp: Date.now()
        });
      }

      res.json(response);
    })
    .catch(error => {
      console.error('Reserve error:', error);
      
      if (error instanceof Error && error.message.includes('not a winner')) {
        res.status(403).json({
          success: false,
          error: 'not_winner'
        } as ApiResponse);
        return;
      }

      res.status(500).json({
        success: false,
        error: 'Failed to create reservation'
      } as ApiResponse);
    });
  } catch (error) {
    console.error('Reserve error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create reservation'
    } as ApiResponse);
  }
});

// GET /api/radar/reservations/my - Получить резервации пользователя
radarRouter.get('/reservations/my', (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.sub;
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized'
      } as ApiResponse);
    }

    let query;
    try {
      query = reservationsQuerySchema.parse(req.query);
    } catch (parseError) {
      if (parseError instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: 'Invalid query parameters',
          details: parseError.errors
        } as ApiResponse);
      }
      throw parseError;
    }

    getUserReservations(userId, query.limit)
      .then(reservations => {
        res.json({
          success: true,
          reservations,
          meta: { source: 'radar' }
        } as ApiResponse);
      })
      .catch(error => {
        console.error('Get reservations error:', error);
        res.status(500).json({
          success: false,
          error: 'Failed to get reservations'
        } as ApiResponse);
      });
  } catch (error) {
    console.error('Get reservations error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get reservations'
    } as ApiResponse);
  }
});

// POST /api/radar/reservations/expire-now - Принудительно истечь резервации (только в dev)
radarRouter.post('/reservations/expire-now', (req: AuthenticatedRequest, res: Response) => {
  try {
    // Только в development
    if (process.env.NODE_ENV === 'production') {
      return res.status(404).json({
        success: false,
        error: 'Not found'
      } as ApiResponse);
    }

    expireStaleReservations()
      .then(expiredCount => {
        res.json({
          success: true,
          expired: expiredCount,
          meta: { source: 'radar' }
        } as ApiResponse);
      })
      .catch(error => {
        console.error('Expire reservations error:', error);
        res.status(500).json({
          success: false,
          error: 'Failed to expire reservations'
        } as ApiResponse);
      });
  } catch (error) {
    console.error('Expire reservations error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to expire reservations'
    } as ApiResponse);
  }
});

// POST /api/radar/pay - Оплата резервации
radarRouter.post('/pay', (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.sub;
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized'
      } as ApiResponse);
    }

    // Проверяем идемпотентность
    const idempotencyKey = req.headers['idempotency-key'] as string;
    if (idempotencyKey) {
      const existing = idempotencyStore.get(idempotencyKey);
      if (existing && Date.now() - existing.timestamp < 60000) {
        return res.json(existing.response);
      }
    }

    let body;
    try {
      body = payRequestSchema.parse(req.body);
    } catch (parseError) {
      if (parseError instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: 'Invalid request data',
          details: parseError.errors
        } as ApiResponse);
      }
      throw parseError;
    }

    if (body.method === 'balance') {
      // Оплата с баланса
      payReservationWithBalance(body.reservationId, userId)
        .then(async (result) => {
          // Поставить в очередь исполнения
          await enqueueExecution(result.orderId);

          const response = {
            success: true,
            method: 'balance',
            orderId: result.orderId,
            meta: { source: 'radar' }
          } as ApiResponse;

          // Сохраняем для идемпотентности
          if (idempotencyKey) {
            idempotencyStore.set(idempotencyKey, {
              response,
              timestamp: Date.now()
            });
          }

          res.json(response);
        })
        .catch(error => {
          console.error('Pay with balance error:', error);
          
          if (error instanceof Error && error.message.includes('not found')) {
            return res.status(404).json({
              success: false,
              error: 'Reservation not found'
            } as ApiResponse);
          }

          if (error instanceof Error && error.message.includes('Insufficient')) {
            return res.status(402).json({
              success: false,
              error: 'insufficient_balance'
            } as ApiResponse);
          }

          res.status(500).json({
            success: false,
            error: 'Failed to process payment'
          } as ApiResponse);
        });
    } else {
      // TonConnect оплата
      getTonConnectPaymentLink(body.reservationId, userId)
        .then(payment => {
          const response = {
            success: true,
            method: 'tonconnect',
            payment,
            meta: { source: 'radar' }
          } as ApiResponse;

          // Сохраняем для идемпотентности
          if (idempotencyKey) {
            idempotencyStore.set(idempotencyKey, {
              response,
              timestamp: Date.now()
            });
          }

          res.json(response);
        })
        .catch(error => {
          console.error('Get TonConnect payment error:', error);
          
          if (error instanceof Error && error.message.includes('not found')) {
            return res.status(404).json({
              success: false,
              error: 'Reservation not found'
            } as ApiResponse);
          }

          res.status(500).json({
            success: false,
            error: 'Failed to get payment link'
          } as ApiResponse);
        });
    }
  } catch (error) {
    console.error('Pay error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process payment'
    } as ApiResponse);
  }
});

// POST /api/radar/confirm - Подтверждение TonConnect оплаты
radarRouter.post('/confirm', (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.sub;
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized'
      } as ApiResponse);
    }

    let body;
    try {
      body = confirmRequestSchema.parse(req.body);
    } catch (parseError) {
      if (parseError instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: 'Invalid request data',
          details: parseError.errors
        } as ApiResponse);
      }
      throw parseError;
    }

    confirmTonConnectPayment(body.reservationId, userId, body.proof)
      .then(async (result) => {
        // Поставить в очередь исполнения
        await enqueueExecution(result.orderId);

        res.json({
          success: true,
          orderId: result.orderId,
          meta: { source: 'radar' }
        } as ApiResponse);
      })
      .catch(error => {
        console.error('Confirm payment error:', error);
        
        if (error instanceof Error && error.message.includes('not found')) {
          return res.status(404).json({
            success: false,
            error: 'Reservation not found'
          } as ApiResponse);
        }

        res.status(500).json({
          success: false,
          error: 'Failed to confirm payment'
        } as ApiResponse);
      });
  } catch (error) {
    console.error('Confirm error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to confirm payment'
    } as ApiResponse);
  }
});

// GET /api/radar/order/:id - Получить информацию о заказе
radarRouter.get('/order/:id', (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.sub;
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized'
      } as ApiResponse);
    }

    const { id } = req.params;

    getOrder(id, userId)
      .then(order => {
        res.json({
          success: true,
          order,
          meta: { source: 'radar' }
        } as ApiResponse);
      })
      .catch(error => {
        console.error('Get order error:', error);
        
        if (error instanceof Error && error.message.includes('not found')) {
          return res.status(404).json({
            success: false,
            error: 'Order not found'
          } as ApiResponse);
        }

        res.status(500).json({
          success: false,
          error: 'Failed to get order'
        } as ApiResponse);
      });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get order'
    } as ApiResponse);
  }
});
