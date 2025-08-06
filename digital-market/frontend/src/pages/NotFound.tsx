import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  Home as HomeIcon,
  Search as SearchIcon,
  Warning as WarningIcon,
  LocalFireDepartment as FireIcon,
  Radar as RadarIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import './NotFound.css';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <Box className="redline-notfound-page">
      {/* Background Effects */}
      <Box className="notfound-background-effects">
        <Box className="error-grid" />
        <Box className="error-scanlines" />
        <Box className="error-static" />
      </Box>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="notfound-container"
      >
        {/* Warning Icon */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="warning-section"
        >
          <Box className="warning-icon-container">
            <WarningIcon className="warning-icon" />
            <Box className="warning-pulse" />
            <FireIcon className="fire-icon fire-1" />
            <FireIcon className="fire-icon fire-2" />
          </Box>
        </motion.div>

        {/* Error Code */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="error-code-section"
        >
          <Typography className="error-code">
            4
            <Box component="span" className="error-digit-middle">
              0
            </Box>
            4
          </Typography>
          <Box className="error-line" />
        </motion.div>

        {/* Error Message */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="error-message-section"
        >
          <Typography className="error-title">
            TARGET NOT FOUND
          </Typography>
          <Typography className="error-subtitle">
            The requested resource has been eliminated from the battlefield
          </Typography>
          <Typography className="error-description">
            Your tactical scanner failed to locate the specified coordinates.
            <br />
            The target may have been moved or destroyed during combat operations.
          </Typography>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="action-buttons"
        >
          <Button
            variant="contained"
            startIcon={<HomeIcon />}
            onClick={() => navigate('/')}
            className="redline-action-button primary-btn"
          >
            <Box className="button-content">
              <Typography className="button-text">
                RETURN TO BASE
              </Typography>
              <Typography className="button-subtext">
                Main Command Center
              </Typography>
            </Box>
          </Button>

          <Button
            variant="contained"
            startIcon={<SearchIcon />}
            onClick={() => navigate('/marketplace')}
            className="redline-action-button secondary-btn"
          >
            <Box className="button-content">
              <Typography className="button-text">
                SCAN MARKET
              </Typography>
              <Typography className="button-subtext">
                Weapon Marketplace
              </Typography>
            </Box>
          </Button>

          <Button
            variant="contained"
            startIcon={<RadarIcon />}
            onClick={() => navigate('/radar')}
            className="redline-action-button tertiary-btn"
          >
            <Box className="button-content">
              <Typography className="button-text">
                RADAR SWEEP
              </Typography>
              <Typography className="button-subtext">
                Tactical Scanner
              </Typography>
            </Box>
          </Button>
        </motion.div>

        {/* Error Details */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="error-details"
        >
          <Box className="detail-item">
            <Typography className="detail-label">ERROR CODE:</Typography>
            <Typography className="detail-value">404_TARGET_NOT_FOUND</Typography>
          </Box>
          <Box className="detail-item">
            <Typography className="detail-label">TIMESTAMP:</Typography>
            <Typography className="detail-value">
              {new Date().toLocaleString('ru-RU')}
            </Typography>
          </Box>
          <Box className="detail-item">
            <Typography className="detail-label">LOCATION:</Typography>
            <Typography className="detail-value">{window.location.pathname}</Typography>
          </Box>
        </motion.div>
      </motion.div>

      {/* Floating Debris */}
      <Box className="floating-debris">
        <Box className="debris debris-1" />
        <Box className="debris debris-2" />
        <Box className="debris debris-3" />
        <Box className="debris debris-4" />
        <Box className="debris debris-5" />
      </Box>

      {/* Glitch Effects */}
      <Box className="glitch-overlay">
        <Box className="glitch-line glitch-1" />
        <Box className="glitch-line glitch-2" />
        <Box className="glitch-line glitch-3" />
      </Box>
    </Box>
  );
}