import {
  RadarSession,
  RadarSettings,
  RadarApiResponse,
  StartRadarRequest,
  DepositRequest,
  WithdrawRequest,
  RadarDecision,
  RadarStats,
  RadarAlert,
  TradeRecord,
  RadarEvent,
  RADAR_CONSTANTS
} from '../types/radar';

class RadarService {
  private baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:4001/api';
  private wsConnection: WebSocket | null = null;
  private eventListeners: Map<string, ((event: RadarEvent) => void)[]> = new Map();

  // === ОСНОВНЫЕ МЕТОДЫ РАДАРА ===

  /**
   * Создать новую сессию радара
   */
  async createSession(request: StartRadarRequest): Promise<RadarApiResponse<RadarSession>> {
    try {
      const response = await fetch(`${this.baseUrl}/radar/session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getToken()}`
        },
        body: JSON.stringify(request)
      });

      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Ошибка создания сессии'
      };
    }
  }

  /**
   * Получить текущую активную сессию
   */
  async getCurrentSession(): Promise<RadarApiResponse<RadarSession | null>> {
    try {
      const response = await fetch(`${this.baseUrl}/radar/session/current`, {
        headers: {
          'Authorization': `Bearer ${this.getToken()}`
        }
      });

      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Ошибка получения сессии'
      };
    }
  }

  /**
   * Запустить сканирование
   */
  async startScanning(sessionId: string): Promise<RadarApiResponse<boolean>> {
    try {
      const response = await fetch(`${this.baseUrl}/radar/session/${sessionId}/start`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.getToken()}`
        }
      });

      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Ошибка запуска сканирования'
      };
    }
  }

  /**
   * Остановить сканирование
   */
  async stopScanning(sessionId: string): Promise<RadarApiResponse<boolean>> {
    try {
      const response = await fetch(`${this.baseUrl}/radar/session/${sessionId}/stop`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.getToken()}`
        }
      });

      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Ошибка остановки сканирования'
      };
    }
  }

  /**
   * Принять решение по купленному предмету
   */
  async makeDecision(decision: RadarDecision): Promise<RadarApiResponse<RadarSession>> {
    try {
      const response = await fetch(`${this.baseUrl}/radar/session/${decision.sessionId}/decision`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getToken()}`
        },
        body: JSON.stringify(decision)
      });

      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Ошибка принятия решения'
      };
    }
  }

  // === УПРАВЛЕНИЕ БАЛАНСОМ ===

  /**
   * Пополнить депозит радара
   */
  async deposit(request: DepositRequest): Promise<RadarApiResponse<{ newBalance: number }>> {
    try {
      const response = await fetch(`${this.baseUrl}/radar/balance/deposit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getToken()}`
        },
        body: JSON.stringify(request)
      });

      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Ошибка пополнения'
      };
    }
  }

  /**
   * Вывести средства
   */
  async withdraw(request: WithdrawRequest): Promise<RadarApiResponse<{ newBalance: number }>> {
    try {
      const response = await fetch(`${this.baseUrl}/radar/balance/withdraw`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getToken()}`
        },
        body: JSON.stringify(request)
      });

      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Ошибка вывода'
      };
    }
  }

  /**
   * Получить баланс пользователя
   */
  async getBalance(): Promise<RadarApiResponse<{ balance: number; frozen: number }>> {
    try {
      const response = await fetch(`${this.baseUrl}/radar/balance`, {
        headers: {
          'Authorization': `Bearer ${this.getToken()}`
        }
      });

      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Ошибка получения баланса'
      };
    }
  }

  // === СТАТИСТИКА И ИСТОРИЯ ===

  /**
   * Получить статистику радара
   */
  async getStats(): Promise<RadarApiResponse<RadarStats>> {
    try {
      const response = await fetch(`${this.baseUrl}/radar/stats`, {
        headers: {
          'Authorization': `Bearer ${this.getToken()}`
        }
      });

      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Ошибка получения статистики'
      };
    }
  }

  /**
   * Получить историю сделок
   */
  async getTradeHistory(limit = 50, offset = 0): Promise<RadarApiResponse<TradeRecord[]>> {
    try {
      const response = await fetch(`${this.baseUrl}/radar/history?limit=${limit}&offset=${offset}`, {
        headers: {
          'Authorization': `Bearer ${this.getToken()}`
        }
      });

      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Ошибка получения истории'
      };
    }
  }

  /**
   * Получить уведомления
   */
  async getAlerts(unreadOnly = false): Promise<RadarApiResponse<RadarAlert[]>> {
    try {
      const response = await fetch(`${this.baseUrl}/radar/alerts?unreadOnly=${unreadOnly}`, {
        headers: {
          'Authorization': `Bearer ${this.getToken()}`
        }
      });

      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Ошибка получения уведомлений'
      };
    }
  }

  /**
   * Отметить уведомление как прочитанное
   */
  async markAlertAsRead(alertId: string): Promise<RadarApiResponse<boolean>> {
    try {
      const response = await fetch(`${this.baseUrl}/radar/alerts/${alertId}/read`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.getToken()}`
        }
      });

      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Ошибка отметки уведомления'
      };
    }
  }

  // === REAL-TIME ПОДКЛЮЧЕНИЕ ===

  /**
   * Подключиться к WebSocket для получения событий в реальном времени
   */
  connectToEvents(sessionId?: string): void {
    const wsUrl = `${this.baseUrl.replace('http', 'ws')}/radar/events${sessionId ? `?sessionId=${sessionId}` : ''}`;
    
    this.wsConnection = new WebSocket(wsUrl);

    this.wsConnection.onopen = () => {
      console.log('Radar WebSocket connected');
    };

    this.wsConnection.onmessage = (event) => {
      try {
        const radarEvent: RadarEvent = JSON.parse(event.data);
        this.emitEvent(radarEvent);
      } catch (error) {
        console.error('Error parsing radar event:', error);
      }
    };

    this.wsConnection.onclose = () => {
      console.log('Radar WebSocket disconnected');
      // Попытка переподключения через 3 секунды
      setTimeout(() => {
        if (this.wsConnection?.readyState === WebSocket.CLOSED) {
          this.connectToEvents(sessionId);
        }
      }, 3000);
    };

    this.wsConnection.onerror = (error) => {
      console.error('Radar WebSocket error:', error);
    };
  }

  /**
   * Отключиться от WebSocket
   */
  disconnectFromEvents(): void {
    if (this.wsConnection) {
      this.wsConnection.close();
      this.wsConnection = null;
    }
  }

  /**
   * Подписаться на события определенного типа
   */
  addEventListener(eventType: string, callback: (event: RadarEvent) => void): void {
    if (!this.eventListeners.has(eventType)) {
      this.eventListeners.set(eventType, []);
    }
    this.eventListeners.get(eventType)!.push(callback);
  }

  /**
   * Отписаться от событий
   */
  removeEventListener(eventType: string, callback: (event: RadarEvent) => void): void {
    const listeners = this.eventListeners.get(eventType);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  /**
   * Эмитировать событие всем подписчикам
   */
  private emitEvent(event: RadarEvent): void {
    const listeners = this.eventListeners.get(event.type);
    if (listeners) {
      listeners.forEach(callback => callback(event));
    }

    // Также эмитируем для общих слушателей
    const allListeners = this.eventListeners.get('all');
    if (allListeners) {
      allListeners.forEach(callback => callback(event));
    }
  }

  // === УТИЛИТАРНЫЕ МЕТОДЫ ===

  /**
   * Валидация настроек радара
   */
  validateSettings(settings: RadarSettings): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (settings.scanInterval < RADAR_CONSTANTS.MIN_SCAN_INTERVAL) {
      errors.push(`Интервал сканирования не может быть меньше ${RADAR_CONSTANTS.MIN_SCAN_INTERVAL} секунд`);
    }

    if (settings.scanInterval > RADAR_CONSTANTS.MAX_SCAN_INTERVAL) {
      errors.push(`Интервал сканирования не может быть больше ${RADAR_CONSTANTS.MAX_SCAN_INTERVAL} секунд`);
    }

    if (settings.maxHoldTime > RADAR_CONSTANTS.MAX_HOLD_TIME) {
      errors.push(`Максимальное время удержания не может превышать ${RADAR_CONSTANTS.MAX_HOLD_TIME} часов`);
    }

    if (settings.targetProfitPercent <= 0 || settings.targetProfitPercent > 1000) {
      errors.push('Целевой процент прибыли должен быть от 0.1% до 1000%');
    }

    if (settings.stopLossPercent <= 0 || settings.stopLossPercent > 100) {
      errors.push('Процент стоп-лосса должен быть от 0.1% до 100%');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Получить рекомендуемые настройки по уровню риска
   */
  getRecommendedSettings(riskLevel: 'low' | 'medium' | 'high'): Partial<RadarSettings> {
    const baseSettings = {
      notifications: {
        push: true,
        email: true,
        telegram: false
      },
      categories: ['weapon', 'knife', 'gloves']
    };

    switch (riskLevel) {
      case 'low':
        return {
          ...baseSettings,
          scanInterval: 30,
          maxHoldTime: 24,
          targetProfitPercent: 10,
          stopLossPercent: 5,
          autoSell: false,
          riskLevel: 'low'
        };

      case 'medium':
        return {
          ...baseSettings,
          scanInterval: 15,
          maxHoldTime: 12,
          targetProfitPercent: 20,
          stopLossPercent: 10,
          autoSell: true,
          riskLevel: 'medium'
        };

      case 'high':
        return {
          ...baseSettings,
          scanInterval: 5,
          maxHoldTime: 6,
          targetProfitPercent: 30,
          stopLossPercent: 15,
          autoSell: true,
          riskLevel: 'high'
        };

      default:
        return baseSettings;
    }
  }

  /**
   * Рассчитать потенциальную прибыль
   */
  calculatePotentialProfit(
    purchasePrice: number,
    currentPrice: number,
    holdHours: number,
    holdFeeRate: number = RADAR_CONSTANTS.DEFAULT_HOLD_FEE_RATE
  ) {
    const holdFee = purchasePrice * holdFeeRate * holdHours;
    const grossProfit = currentPrice - purchasePrice;
    const netProfit = grossProfit - holdFee;
    const profitPercent = (netProfit / purchasePrice) * 100;

    return {
      grossProfit,
      holdFee,
      netProfit,
      profitPercent,
      shouldSell: netProfit > 0 && profitPercent > 5 // рекомендация продажи при 5%+ прибыли
    };
  }

  /**
   * Получить токен авторизации
   */
  private getToken(): string {
    return localStorage.getItem('authToken') || '';
  }

  /**
   * Очистить все подключения и слушатели
   */
  cleanup(): void {
    this.disconnectFromEvents();
    this.eventListeners.clear();
  }
}

// Создаем синглтон сервиса
const radarService = new RadarService();

export default radarService;