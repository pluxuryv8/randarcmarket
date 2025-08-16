import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { 
  Telegram, 
  Security as SecurityIcon,
  LocalFireDepartment as FireIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import './Login.css';
import TelegramLoginButton, { TelegramAuthData } from '../components/auth/TelegramLoginButton';
import { useAuth } from '../context/AuthContext';

const BACKEND = process.env.REACT_APP_BACKEND_URL;

export default function Login() {
  const [tgId, setTgId] = useState<string | null>(null);
  const { loginWithTelegram } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has('tg_user')) {
      setTgId(params.get('tg_user')!);
      window.history.replaceState({}, '', '/login');
    }
  }, []);

  const telegramLogin = () => {
    window.location.href = `${BACKEND}/auth/telegram`;
  };

  const handleTgAuth = (data: TelegramAuthData) => {
    // пока используем существующую mock-авторизацию через контекст
    loginWithTelegram();
    setTgId(String(data.id));
  };

  return (
    <Box className="redline-login-page">
      {/* Background Effects */}
      <Box className="login-background-effects">
        <Box className="login-grid" />
        <Box className="login-scanlines" />
        <Box className="login-pulse" />
      </Box>

      {/* Main Login Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="login-container"
      >
        <Paper className="redline-login-card">
          {/* Header Section */}
          <Box className="login-header">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="logo-section"
            >
              <Box className="logo-container">
                <FireIcon className="logo-icon" />
                <Box className="logo-glow" />
              </Box>
              <Typography className="brand-title">
                RANDARNFT
              </Typography>
              <Typography className="brand-subtitle">
                TACTICAL TRADING PLATFORM
              </Typography>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Typography className="login-title">
                AUTHORIZATION REQUIRED
              </Typography>
              <Typography className="login-subtitle">
                Select your preferred authentication method
              </Typography>
            </motion.div>
          </Box>

          {/* Authentication Buttons */}
          {!tgId && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="auth-buttons"
            >
              <Button
                variant="contained"
                fullWidth
                size="large"
                startIcon={<Telegram />}
                onClick={telegramLogin}
                className="redline-auth-button telegram-btn"
              >
                <Box className="button-content">
                  <Typography className="button-title">
                    TELEGRAM AUTHENTICATION
                  </Typography>
                  <Typography className="button-subtitle">
                    Connect via Telegram bot
                  </Typography>
                </Box>
                <SecurityIcon className="security-icon" />
              </Button>

              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <TelegramLoginButton botName="RandarNFTAuthBot" onAuth={handleTgAuth} size="large" />
              </Box>
            </motion.div>
          )}

          {/* Success Message */}
          {tgId && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="success-section"
            >
              <Box className="success-icon-container">
                <SecurityIcon className="success-icon" />
                <Box className="success-glow" />
              </Box>
              <Typography className="success-title">
                AUTHENTICATION SUCCESSFUL
              </Typography>
              <Typography className="success-subtitle">
                You are now authorized to access the platform
              </Typography>
              <Box className="success-divider" />
              <Typography className="success-user">Telegram ID: {tgId}</Typography>
            </motion.div>
          )}

          {/* Footer */}
          <Box className="login-footer">
            <Box className="security-badges">
              <Box className="security-badge">
                <SecurityIcon className="badge-icon" />
                <Typography className="badge-text">256-BIT SSL</Typography>
              </Box>
              <Box className="security-badge">
                <FireIcon className="badge-icon" />
                <Typography className="badge-text">SECURE</Typography>
              </Box>
            </Box>
            <Typography className="footer-text">
              Your data is protected by military-grade encryption
            </Typography>
          </Box>
        </Paper>
      </motion.div>

      {/* Floating Elements */}
      <Box className="floating-elements">
        <Box className="floating-element element-1" />
        <Box className="floating-element element-2" />
        <Box className="floating-element element-3" />
      </Box>
    </Box>
  );
}