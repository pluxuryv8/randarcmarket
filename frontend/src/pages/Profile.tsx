import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Chip,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  LinearProgress,
  Divider
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  TrendingUp as TrendingUpIcon,
  AttachMoney as MoneyIcon,
  Inventory as InventoryIcon,
  Timeline as TimelineIcon,
  LocalFireDepartment as FireIcon,
  Verified as VerifiedIcon,
  Star as StarIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import './Profile.css';

interface UserProfile {
  id: string;
  username: string;
  email: string;
  phone: string;
  location: string;
  avatar: string;
  level: number;
  experience: number;
  balance: number;
  totalTrades: number;
  successRate: number;
  joinDate: string;
  isVerified: boolean;
  notifications: {
    email: boolean;
    push: boolean;
    telegram: boolean;
  };
  preferences: {
    language: string;
    currency: string;
    theme: string;
  };
}

const Profile: React.FC = () => {
  const [profile] = useState<UserProfile>({
    id: '1',
    username: 'RedlineTrader',
    email: 'redline@randar.market',
    phone: '+7 (999) 123-45-67',
    location: 'Москва, Россия',
    avatar: '',
    level: 47,
    experience: 4750,
    balance: 125000,
    totalTrades: 347,
    successRate: 94.2,
    joinDate: '2023-01-15',
    isVerified: true,
    notifications: {
      email: true,
      push: true,
      telegram: false
    },
    preferences: {
      language: 'ru',
      currency: 'RUB',
      theme: 'redline'
    }
  });

  const [editing, setEditing] = useState(false);

  const handleSave = () => {
    setEditing(false);
    // Логика сохранения
  };

  const handleCancel = () => {
    setEditing(false);
    // Логика отмены изменений
  };

  const getExperienceProgress = () => {
    const nextLevelExp = (profile.level + 1) * 100;
    const currentLevelExp = profile.level * 100;
    const progress = ((profile.experience - currentLevelExp) / (nextLevelExp - currentLevelExp)) * 100;
    return Math.min(progress, 100);
  };

  const getRankName = (level: number) => {
    if (level >= 50) return 'GLOBAL ELITE';
    if (level >= 40) return 'SUPREME';
    if (level >= 30) return 'LEGENDARY EAGLE';
    if (level >= 20) return 'DISTINGUISHED';
    if (level >= 10) return 'GUARDIAN';
    return 'SILVER';
  };

  return (
    <Box className="redline-profile-page">
      {/* Background Effects */}
      <Box className="redline-background-effects">
        <Box className="redline-grid" />
        <Box className="redline-glow" />
      </Box>

      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="profile-header"
      >
        <Card className="redline-header-card">
          <CardContent className="header-content">
            <Box className="profile-main-info">
              <Box className="avatar-section">
                <Avatar
                  src={profile.avatar || 'https://avatars.akamai.steamstatic.com/b5bd56c1aa4644a474a2e4972be27ef9e82e517e_full.jpg'}
                  className="redline-avatar"
                  sx={{ width: 120, height: 120 }}
                />
                <Box className="avatar-overlay">
                  <Chip
                    icon={<VerifiedIcon />}
                    label="VERIFIED"
                    className="verified-chip"
                  />
                </Box>
              </Box>

              <Box className="user-details">
                <Box className="username-section">
                  <Typography className="username">
                    {profile.username}
                  </Typography>
                  <Chip
                    icon={<StarIcon />}
                    label={getRankName(profile.level)}
                    className="rank-chip"
                  />
                </Box>

                <Box className="level-section">
                  <Typography className="level-text">
                    LEVEL {profile.level}
                  </Typography>
                  <Box className="experience-bar">
                    <LinearProgress
                      variant="determinate"
                      value={getExperienceProgress()}
                      className="redline-progress"
                    />
                    <Typography className="exp-text">
                      {profile.experience} / {(profile.level + 1) * 100} EXP
                    </Typography>
                  </Box>
                </Box>

                <Typography className="join-date">
                  MEMBER SINCE {new Date(profile.joinDate).toLocaleDateString('ru-RU')}
                </Typography>
              </Box>

              <Box className="edit-button-section">
                {!editing ? (
                  <Button
                    startIcon={<EditIcon />}
                    onClick={() => setEditing(true)}
                    className="redline-button edit-btn"
                  >
                    EDIT PROFILE
                  </Button>
                ) : (
                  <Box className="edit-actions">
                    <Button
                      startIcon={<SaveIcon />}
                      onClick={handleSave}
                      className="redline-button save-btn"
                    >
                      SAVE
                    </Button>
                    <Button
                      startIcon={<CancelIcon />}
                      onClick={handleCancel}
                      className="redline-button cancel-btn"
                    >
                      CANCEL
                    </Button>
                  </Box>
                )}
              </Box>
            </Box>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="stats-section"
      >
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 3 }}>
          <Box>
            <Card className="redline-stat-card">
              <CardContent className="stat-content">
                <MoneyIcon className="stat-icon money" />
                <Box className="stat-info">
                  <Typography className="stat-value">
                    {profile.balance.toLocaleString()} ₽
                  </Typography>
                  <Typography className="stat-label">
                    BALANCE
                  </Typography>
                </Box>
                <FireIcon className="stat-accent" />
              </CardContent>
            </Card>
          </Box>

          <Box>
            <Card className="redline-stat-card">
              <CardContent className="stat-content">
                <InventoryIcon className="stat-icon inventory" />
                <Box className="stat-info">
                  <Typography className="stat-value">
                    {profile.totalTrades}
                  </Typography>
                  <Typography className="stat-label">
                    TOTAL TRADES
                  </Typography>
                </Box>
                <FireIcon className="stat-accent" />
              </CardContent>
            </Card>
          </Box>

          <Box>
            <Card className="redline-stat-card">
              <CardContent className="stat-content">
                <TrendingUpIcon className="stat-icon success" />
                <Box className="stat-info">
                  <Typography className="stat-value">
                    {profile.successRate}%
                  </Typography>
                  <Typography className="stat-label">
                    SUCCESS RATE
                  </Typography>
                </Box>
                <FireIcon className="stat-accent" />
              </CardContent>
            </Card>
          </Box>

          <Box>
            <Card className="redline-stat-card">
              <CardContent className="stat-content">
                <TimelineIcon className="stat-icon level" />
                <Box className="stat-info">
                  <Typography className="stat-value">
                    {profile.level}
                  </Typography>
                  <Typography className="stat-label">
                    RANK LEVEL
                  </Typography>
                </Box>
                <FireIcon className="stat-accent" />
              </CardContent>
            </Card>
          </Box>
        </Box>
      </motion.div>

      {/* Content Section */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }} className="content-section">
        {/* Personal Information */}
        <Box>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="redline-content-card">
              <CardContent>
                <Typography className="card-title">
                  PERSONAL INFORMATION
                </Typography>
                <Divider className="redline-divider" />

                <Box className="form-fields">
                  <TextField
                    label="Username"
                    value={profile.username}
                    disabled={!editing}
                    className="redline-field"
                    fullWidth
                  />
                  
                  <TextField
                    label="Email"
                    value={profile.email}
                    disabled={!editing}
                    className="redline-field"
                    fullWidth
                  />
                  
                  <TextField
                    label="Phone"
                    value={profile.phone}
                    disabled={!editing}
                    className="redline-field"
                    fullWidth
                  />
                  
                  <TextField
                    label="Location"
                    value={profile.location}
                    disabled={!editing}
                    className="redline-field"
                    fullWidth
                  />
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Box>

        {/* Settings */}
        <Box>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="redline-content-card">
              <CardContent>
                <Typography className="card-title">
                  PREFERENCES
                </Typography>
                <Divider className="redline-divider" />

                <Box className="form-fields">
                  <FormControl fullWidth disabled={!editing}>
                    <InputLabel className="redline-label">Language</InputLabel>
                    <Select
                      value={profile.preferences.language}
                      className="redline-select"
                    >
                      <MenuItem value="ru">Русский</MenuItem>
                      <MenuItem value="en">English</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl fullWidth disabled={!editing}>
                    <InputLabel className="redline-label">Currency</InputLabel>
                    <Select
                      value={profile.preferences.currency}
                      className="redline-select"
                    >
                      <MenuItem value="RUB">RUB (₽)</MenuItem>
                      <MenuItem value="USD">USD ($)</MenuItem>
                      <MenuItem value="EUR">EUR (€)</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl fullWidth disabled={!editing}>
                    <InputLabel className="redline-label">Theme</InputLabel>
                    <Select
                      value={profile.preferences.theme}
                      className="redline-select"
                    >
                      <MenuItem value="redline">AK-47 Redline</MenuItem>
                      <MenuItem value="dark">Dark Theme</MenuItem>
                      <MenuItem value="light">Light Theme</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Box>

        {/* Notifications */}
        <Box sx={{ gridColumn: { xs: '1', md: '1 / -1' } }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="redline-content-card">
              <CardContent>
                <Typography className="card-title">
                  NOTIFICATION SETTINGS
                </Typography>
                <Divider className="redline-divider" />

                <Box className="notification-settings">
                  <FormControlLabel
                    control={
                      <Switch
                        checked={profile.notifications.email}
                        disabled={!editing}
                        className="redline-switch"
                      />
                    }
                    label="Email Notifications"
                    className="switch-label"
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={profile.notifications.push}
                        disabled={!editing}
                        className="redline-switch"
                      />
                    }
                    label="Push Notifications"
                    className="switch-label"
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={profile.notifications.telegram}
                        disabled={!editing}
                        className="redline-switch"
                      />
                    }
                    label="Telegram Notifications"
                    className="switch-label"
                  />
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Box>
      </Box>
    </Box>
  );
};

export default Profile;