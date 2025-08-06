import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Button,
  Alert,
  LinearProgress,
  TextField,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Badge,
  Fab
} from '@mui/material';
import {
  TrendingUp,
  PlayArrow,
  Stop,
  Settings,
  Radar as RadarIcon,
  Security as SecurityIcon,
  MonetizationOn as MoneyIcon,
  Timeline as TimelineIcon,
  Notifications as NotificationsIcon,
  History as HistoryIcon,
  AccountBalance as BalanceIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  CheckCircle as CheckIcon,
  Assessment as AssessmentIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import radarService from '../services/radarService';
import {
  RadarSession,
  RadarSettings,
  RadarStats,
  RadarAlert,
  TradeRecord,
  RadarEvent,
  RadarDecision,
  RADAR_CONSTANTS
} from '../types/radar';
import './Radar.css';

const Radar: React.FC = () => {
  // Основные состояния
  const [session, setSession] = useState<RadarSession | null>(null);
  const [balance, setBalance] = useState<{ balance: number; frozen: number }>({ balance: 50000, frozen: 0 });
  const [stats, setStats] = useState<RadarStats | null>(null);
  const [alerts, setAlerts] = useState<RadarAlert[]>([]);
  
  // UI состояния
  const [loading, setLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showDeposit, setShowDeposit] = useState(false);
  const [showDecisionModal, setShowDecisionModal] = useState(false);
  
  // Формы
  const [depositAmount, setDepositAmount] = useState('');
  const [radarBudget, setRadarBudget] = useState('');
  
  // Настройки радара
  const [settings, setSettings] = useState<RadarSettings>({
    scanInterval: 15,
    maxHoldTime: 24,
    targetProfitPercent: 15,
    maxBudgetPerItem: 5000,
    categories: ['weapon', 'knife', 'gloves'],
    autoSell: true,
    notifications: {
      push: true,
      email: true,
      telegram: false
    },
    riskLevel: 'medium',
    stopLossPercent: 10
  });

  // Загрузка данных при монтировании
  useEffect(() => {
    loadInitialData();
    setupRealtimeEvents();

    return () => {
      radarService.cleanup();
    };
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      // Загружаем текущую сессию
      const sessionResponse = await radarService.getCurrentSession();
      if (sessionResponse.success && sessionResponse.data) {
        setSession(sessionResponse.data);
      }

      // Загружаем статистику
      const statsResponse = await radarService.getStats();
      if (statsResponse.success && statsResponse.data) {
        setStats(statsResponse.data);
      }

      // Загружаем уведомления
      const alertsResponse = await radarService.getAlerts(true);
      if (alertsResponse.success && alertsResponse.data) {
        setAlerts(alertsResponse.data);
      }
    } catch (error) {
      console.error('Error loading radar data:', error);
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeEvents = () => {
    radarService.connectToEvents(session?.id);

    // Подписываемся на события
    radarService.addEventListener('purchase_completed', handlePurchaseEvent);
    radarService.addEventListener('decision_required', handleDecisionRequired);
    radarService.addEventListener('session_ended', handleSessionEnded);
  };

  const handlePurchaseEvent = (event: RadarEvent) => {
    loadInitialData();
    console.log('Item purchased:', event.data);
  };

  const handleDecisionRequired = (event: RadarEvent) => {
    setShowDecisionModal(true);
    loadInitialData();
  };

  const handleSessionEnded = (event: RadarEvent) => {
    setSession(null);
    loadInitialData();
  };

  // === ОСНОВНЫЕ ДЕЙСТВИЯ ===

  const handleStartRadar = async () => {
    if (!radarBudget || Number(radarBudget) < RADAR_CONSTANTS.MIN_BUDGET) {
      alert(`Минимальный бюджет: ${RADAR_CONSTANTS.MIN_BUDGET} ₽`);
      return;
    }

    setLoading(true);
    try {
      const response = await radarService.createSession({
        budget: Number(radarBudget),
        settings
      });

      if (response.success && response.data) {
        setSession(response.data);
        setRadarBudget('');
        
        // Сразу запускаем сканирование
        await radarService.startScanning(response.data.id);
      } else {
        alert(response.error || 'Ошибка создания сессии');
      }
    } catch (error) {
      console.error('Error starting radar:', error);
      alert('Ошибка запуска радара');
    } finally {
      setLoading(false);
    }
  };

  const handleStopRadar = async () => {
    if (!session) return;

    setLoading(true);
    try {
      const response = await radarService.stopScanning(session.id);
      if (response.success) {
        setSession(null);
      }
    } catch (error) {
      console.error('Error stopping radar:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeposit = async () => {
    if (!depositAmount) return;

    setLoading(true);
    try {
      const response = await radarService.deposit({
        amount: Number(depositAmount),
        paymentMethod: 'balance'
      });

      if (response.success && response.data) {
        setBalance({ ...balance, balance: response.data.newBalance });
        setDepositAmount('');
        setShowDeposit(false);
      } else {
        alert(response.error || 'Ошибка пополнения');
      }
    } catch (error) {
      console.error('Error depositing:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDecision = async (action: 'continue' | 'withdraw') => {
    if (!session) return;

    setLoading(true);
    try {
      const decision: RadarDecision = {
        sessionId: session.id,
        action,
        reinvestAmount: action === 'continue' ? session.currentBudget + (session.totalProfit || 0) : undefined
      };

      const response = await radarService.makeDecision(decision);
      if (response.success && response.data) {
        setSession(response.data);
        setShowDecisionModal(false);
      }
    } catch (error) {
      console.error('Error making decision:', error);
    } finally {
      setLoading(false);
    }
  };

  // === РЕНДЕР КОМПОНЕНТОВ ===

  const renderSessionStatus = () => {
    if (!session) {
      return (
        <Card className="redline-session-card">
          <CardContent>
            <Typography className="session-title">РАДАР НЕ АКТИВЕН</Typography>
            <Typography className="session-subtitle">
              Введите бюджет для запуска автоматического сканирования рынка
            </Typography>
            
            <Box className="budget-input-section">
              <TextField
                label="Бюджет для радара (₽)"
                type="number"
                value={radarBudget}
                onChange={(e) => setRadarBudget(e.target.value)}
                className="redline-field"
                fullWidth
                inputProps={{ 
                  min: RADAR_CONSTANTS.MIN_BUDGET,
                  max: Math.min(balance.balance, RADAR_CONSTANTS.MAX_BUDGET)
                }}
              />
              <Button
                variant="contained"
                startIcon={<PlayArrow />}
                onClick={handleStartRadar}
                disabled={loading || !radarBudget}
                className="redline-button start-btn"
                size="large"
              >
                ЗАПУСТИТЬ РАДАР
              </Button>
            </Box>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card className="redline-session-card active">
        <CardContent>
          <Box className="session-header">
            <Box className="session-status">
              <RadarIcon className={`radar-icon ${session.state}`} />
              <Box>
                <Typography className="session-title">
                  РАДАР АКТИВЕН
                </Typography>
                <Chip 
                  label={getStateLabel(session.state)} 
                  className={`state-chip ${session.state}`}
                />
              </Box>
            </Box>
            
            <Box className="session-controls">
              {session.state === 'scanning' ? (
                <Button
                  startIcon={<Stop />}
                  onClick={handleStopRadar}
                  className="redline-button stop-btn"
                >
                  ОСТАНОВИТЬ
                </Button>
              ) : (
                <Button
                  startIcon={<PlayArrow />}
                  onClick={() => radarService.startScanning(session.id)}
                  className="redline-button start-btn"
                >
                  ПРОДОЛЖИТЬ
                </Button>
              )}
            </Box>
          </Box>

          <Divider className="redline-divider" />

          <Box className="session-metrics">
            <Box className="metric">
              <Typography className="metric-label">БЮДЖЕТ</Typography>
              <Typography className="metric-value">
                {session.currentBudget.toLocaleString()} ₽
              </Typography>
            </Box>
            <Box className="metric">
              <Typography className="metric-label">ПРИБЫЛЬ</Typography>
              <Typography className={`metric-value ${session.totalProfit >= 0 ? 'positive' : 'negative'}`}>
                {session.totalProfit >= 0 ? '+' : ''}{session.totalProfit.toLocaleString()} ₽
              </Typography>
            </Box>
            <Box className="metric">
              <Typography className="metric-label">СДЕЛОК</Typography>
              <Typography className="metric-value">
                {session.successfulTrades} / {session.scanCount}
              </Typography>
            </Box>
            <Box className="metric">
              <Typography className="metric-label">ВРЕМЯ</Typography>
              <Typography className="metric-value">
                {getSessionDuration(session)}
              </Typography>
            </Box>
          </Box>

          {session.activeItem && (
            <Box className="active-item-section">
              <Divider className="redline-divider" />
              <Typography className="section-title">АКТИВНЫЙ ПРЕДМЕТ</Typography>
              <Box className="active-item">
                <img 
                  src={session.activeItem.imageUrl} 
                  alt={session.activeItem.name}
                  className="item-image"
                />
                <Box className="item-details">
                  <Typography className="item-name">{session.activeItem.name}</Typography>
                  <Box className="item-prices">
                    <Typography className="purchase-price">
                      Куплено: {session.activeItem.purchasePrice.toLocaleString()} ₽
                    </Typography>
                    <Typography className="current-price">
                      Текущая цена: {session.activeItem.currentMarketPrice.toLocaleString()} ₽
                    </Typography>
                  </Box>
                  <Box className="item-profit">
                    <Typography className={`profit-value ${getProfitValue(session.activeItem) >= 0 ? 'positive' : 'negative'}`}>
                      Прибыль: {getProfitValue(session.activeItem) >= 0 ? '+' : ''}{getProfitValue(session.activeItem).toLocaleString()} ₽
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderQuickActions = () => (
    <Box className="quick-actions">
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={() => setShowDeposit(true)}
        className="redline-button quick-action-btn"
      >
        ПОПОЛНИТЬ
      </Button>
      <Button
        variant="contained"
        startIcon={<Settings />}
        onClick={() => setShowSettings(true)}
        className="redline-button quick-action-btn"
      >
        НАСТРОЙКИ
      </Button>
      <Button
        variant="contained"
        startIcon={<HistoryIcon />}
        onClick={() => {}}
        className="redline-button quick-action-btn"
      >
        ИСТОРИЯ
      </Button>
    </Box>
  );

  const getStateLabel = (state: string) => {
    switch (state) {
      case 'idle': return 'ОЖИДАНИЕ';
      case 'scanning': return 'СКАНИРОВАНИЕ';
      case 'awaitingDecision': return 'ОЖИДАЕТ РЕШЕНИЯ';
      case 'completed': return 'ЗАВЕРШЕНО';
      case 'paused': return 'ПАУЗА';
      default: return state.toUpperCase();
    }
  };

  const getSessionDuration = (session: RadarSession) => {
    const start = new Date(session.createdAt);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60));
    const diffMinutes = Math.floor(((now.getTime() - start.getTime()) % (1000 * 60 * 60)) / (1000 * 60));
    return `${diffHours}ч ${diffMinutes}м`;
  };

  const getProfitValue = (item: { purchasePrice: number; currentMarketPrice: number }) => {
    return item.currentMarketPrice - item.purchasePrice;
  };

  return (
    <Box className="redline-radar-page">
      {/* Background Effects */}
      <Box className="radar-background-effects">
        <Box className="radar-scan-lines" />
        <Box className="radar-grid" />
        <Box className="radar-pulse" />
      </Box>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="radar-header"
      >
        <Card className="redline-radar-card">
          <CardContent className="radar-header-content">
            <Box className="radar-title-section">
              <Box className="radar-icon-container">
                <RadarIcon className="radar-main-icon" />
                <Box className={`radar-status-indicator ${session?.state === 'scanning' ? 'active' : 'inactive'}`} />
              </Box>
              <Box>
                <Typography className="radar-title">
                  RANDAR SCANNER
                </Typography>
                <Typography className="radar-subtitle">
                  Автоматическая торговая система
                </Typography>
              </Box>
            </Box>

            <Box className="balance-section">
              <Box className="balance-item">
                <BalanceIcon className="balance-icon" />
                <Box>
                  <Typography className="balance-label">БАЛАНС</Typography>
                  <Typography className="balance-value">
                    {balance.balance.toLocaleString()} ₽
                  </Typography>
                </Box>
              </Box>
              {balance.frozen > 0 && (
                <Box className="balance-item frozen">
                  <SecurityIcon className="balance-icon" />
                  <Box>
                    <Typography className="balance-label">ЗАМОРОЖЕНО</Typography>
                    <Typography className="balance-value">
                      {balance.frozen.toLocaleString()} ₽
                    </Typography>
                  </Box>
                </Box>
              )}
            </Box>
          </CardContent>
        </Card>
      </motion.div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        {renderSessionStatus()}
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {renderQuickActions()}
      </motion.div>

      {/* Stats Section */}
      {stats && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="stats-section"
        >
          <Card className="redline-stats-card">
            <CardContent>
              <Typography className="section-title">СТАТИСТИКА</Typography>
              <Divider className="redline-divider" />
              
              <Box className="stats-grid">
                <Box className="stat-item">
                  <AssessmentIcon className="stat-icon" />
                  <Box>
                    <Typography className="stat-value">{stats.totalSessions}</Typography>
                    <Typography className="stat-label">Всего сессий</Typography>
                  </Box>
                </Box>
                
                <Box className="stat-item">
                  <MoneyIcon className="stat-icon" />
                  <Box>
                    <Typography className="stat-value">
                      {stats.totalProfit >= 0 ? '+' : ''}{stats.totalProfit.toLocaleString()} ₽
                    </Typography>
                    <Typography className="stat-label">Общая прибыль</Typography>
                  </Box>
                </Box>
                
                <Box className="stat-item">
                  <TrendingUp className="stat-icon" />
                  <Box>
                    <Typography className="stat-value">{stats.successRate.toFixed(1)}%</Typography>
                    <Typography className="stat-label">Успешность</Typography>
                  </Box>
                </Box>
                
                <Box className="stat-item">
                  <TimelineIcon className="stat-icon" />
                  <Box>
                    <Typography className="stat-value">{stats.averageHoldTime.toFixed(1)}ч</Typography>
                    <Typography className="stat-label">Среднее время</Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Decision Modal */}
      <Dialog 
        open={showDecisionModal} 
        onClose={() => setShowDecisionModal(false)}
        maxWidth="md"
        fullWidth
        className="decision-modal"
      >
        <DialogTitle className="modal-title">
          🎯 РАДАР КУПИЛ ПРЕДМЕТ
        </DialogTitle>
        <DialogContent>
          {session?.activeItem && (
            <Box className="decision-content">
              <Box className="item-showcase">
                <img 
                  src={session.activeItem.imageUrl} 
                  alt={session.activeItem.name}
                  className="showcase-image"
                />
                <Box className="showcase-details">
                  <Typography className="showcase-name">
                    {session.activeItem.name}
                  </Typography>
                  <Typography className="showcase-price">
                    Куплено за {session.activeItem.purchasePrice.toLocaleString()} ₽
                  </Typography>
                  <Typography className="showcase-current">
                    Текущая цена: {session.activeItem.currentMarketPrice.toLocaleString()} ₽
                  </Typography>
                </Box>
              </Box>
              
              <Box className="decision-metrics">
                <Box className="metric-row">
                  <Typography>Остаток бюджета:</Typography>
                  <Typography className="metric-value">
                    {session.currentBudget.toLocaleString()} ₽
                  </Typography>
                </Box>
                <Box className="metric-row">
                  <Typography>Общая прибыль:</Typography>
                  <Typography className={`metric-value ${session.totalProfit >= 0 ? 'positive' : 'negative'}`}>
                    {session.totalProfit >= 0 ? '+' : ''}{session.totalProfit.toLocaleString()} ₽
                  </Typography>
                </Box>
                <Box className="metric-row">
                  <Typography>Доступно для реинвестиций:</Typography>
                  <Typography className="metric-value highlight">
                    {(session.currentBudget + session.totalProfit).toLocaleString()} ₽
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions className="decision-actions">
          <Button
            onClick={() => handleDecision('continue')}
            className="redline-button continue-btn"
            startIcon={<CheckIcon />}
            size="large"
          >
            ПРОДОЛЖИТЬ ({session ? (session.currentBudget + session.totalProfit).toLocaleString() : 0} ₽)
          </Button>
          <Button
            onClick={() => handleDecision('withdraw')}
            className="redline-button withdraw-btn"
            startIcon={<MoneyIcon />}
            size="large"
          >
            ВЫВЕСТИ ПРИБЫЛЬ
          </Button>
        </DialogActions>
      </Dialog>

      {/* Deposit Modal */}
      <Dialog 
        open={showDeposit} 
        onClose={() => setShowDeposit(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle className="modal-title">
          💰 ПОПОЛНИТЬ БАЛАНС
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Сумма пополнения (₽)"
            type="number"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
            className="redline-field"
            fullWidth
            margin="normal"
            inputProps={{ min: 100 }}
          />
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setShowDeposit(false)}
            className="redline-button cancel-btn"
          >
            ОТМЕНА
          </Button>
          <Button
            onClick={handleDeposit}
            className="redline-button continue-btn"
            disabled={!depositAmount}
          >
            ПОПОЛНИТЬ
          </Button>
        </DialogActions>
      </Dialog>

      {/* Loading Overlay */}
      {loading && (
        <Box className="loading-overlay">
          <LinearProgress className="redline-progress" />
          <Typography className="loading-text">
            ОБРАБОТКА ЗАПРОСА...
          </Typography>
        </Box>
      )}

      {/* Notifications FAB */}
      {alerts.length > 0 && (
        <Fab
          className="notifications-fab"
          onClick={() => {}}
        >
          <Badge badgeContent={alerts.length} color="error">
            <NotificationsIcon />
          </Badge>
        </Fab>
      )}
    </Box>
  );
};

export default Radar;