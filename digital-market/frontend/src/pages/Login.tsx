import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { 
  Telegram, 
  SportsEsports as SteamIcon,
  Security as SecurityIcon,
  LocalFireDepartment as FireIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import './Login.css';

const BACKEND = process.env.REACT_APP_BACKEND_URL;

export default function Login() {
  const [steamId, setSteamId] = useState<string | null>(null);
  const [tgId, setTgId] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has('steam')) {
      setSteamId(params.get('steam')!);
      window.history.replaceState({}, '', '/login');
    }
    if (params.has('tg_user')) {
      setTgId(params.get('tg_user')!);
      window.history.replaceState({}, '', '/login');
    }
  }, []);

  const steamLogin = () => {
    window.location.href = `${BACKEND}/auth/steam`;
  };

  const telegramLogin = () => {
    window.location.href = `${BACKEND}/auth/telegram`;
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
                RANDAR MARKET
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
          {!steamId && !tgId && (
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
                startIcon={<SteamIcon />}
                onClick={steamLogin}
                className="redline-auth-button steam-btn"
              >
                <Box className="button-content">
                  <Typography className="button-title">
                    STEAM AUTHENTICATION
                  </Typography>
                  <Typography className="button-subtitle">
                    Connect via Steam account
                  </Typography>
                </Box>
                <SecurityIcon className="security-icon" />
              </Button>

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
            </motion.div>
          )}

          {/* Success Message */}
          {(steamId || tgId) && (
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
              <Typography className="success-user">
                {steamId ? `Steam ID: ${steamId}` : `Telegram ID: ${tgId}`}
              </Typography>
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