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
  Grid
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  TrendingUp as TrendingUpIcon,
  AttachMoney as MoneyIcon,
  Inventory as InventoryIcon,
  Timeline as TimelineIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';

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
  const [profile, setProfile] = useState<UserProfile>({
    id: '1',
    username: 'TraderPro',
    email: 'trader@example.com',
    phone: '+7 (999) 123-45-67',
    location: 'Москва, Россия',
    avatar: '',
    level: 15,
    experience: 1250,
    balance: 25000,
    totalTrades: 156,
    successRate: 87.5,
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
      theme: 'dark'
    }
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<UserProfile>(profile);

  const handleEdit = () => {
    setEditedProfile(profile);
    setIsEditing(true);
  };

  const handleSave = () => {
    setProfile(editedProfile);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: any) => {
    setEditedProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNotificationChange = (type: string, value: boolean) => {
    setEditedProfile(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [type]: value
      }
    }));
  };

  const handlePreferenceChange = (type: string, value: string) => {
    setEditedProfile(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [type]: value
      }
    }));
  };

  const currentProfile = isEditing ? editedProfile : profile;

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #000000 0%, #1a0000 50%, #000000 100%)',
      color: '#ffffff',
      padding: '20px'
    }}>
      {/* Анимированный фон */}
      <div className="page-background" />

      {/* Заголовок */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h3" className="page-title">
            👤 Профиль
          </Typography>
          <Typography variant="h6" className="page-subtitle">
            Управление аккаунтом и настройками
          </Typography>
        </Box>
      </motion.div>

      {/* Основная информация */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1 }}
      >
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Аватар и основная информация */}
          <Box sx={{ width: '33.33%' }}>
            <Card className="glass-card">
              <CardContent sx={{ textAlign: 'center' }}>
                <Avatar 
                  sx={{ 
                    width: 120, 
                    height: 120, 
                    mx: 'auto', 
                    mb: 2,
                    background: 'linear-gradient(135deg, #8B0000, #DC2626)',
                    fontSize: '48px',
                    fontWeight: 700
                  }}
                >
                  {currentProfile.username.charAt(0).toUpperCase()}
                </Avatar>
                
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                  {currentProfile.username}
                </Typography>
                
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 2 }}>
                  <Chip 
                    label={`Уровень ${currentProfile.level}`}
                    sx={{ 
                      background: 'linear-gradient(135deg, #8B0000, #DC2626)',
                      color: 'white',
                      fontWeight: 600
                    }}
                  />
                  {currentProfile.isVerified && (
                    <Chip 
                      label="Верифицирован"
                      sx={{ 
                        background: 'linear-gradient(135deg, #10B981, #059669)',
                        color: 'white',
                        fontWeight: 600
                      }}
                    />
                  )}
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                  <Button
                    variant="contained"
                    startIcon={<EditIcon />}
                    onClick={handleEdit}
                    disabled={isEditing}
                    className="gradient-button"
                  >
                    Редактировать
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Box>

          {/* Статистика */}
          <Box sx={{ width: '66.67%' }}>
            <Grid container spacing={2}>
              <Box sx={{ width: '25%' }}>
                <Card className="glass-card">
                  <CardContent sx={{ textAlign: 'center' }}>
                    <MoneyIcon sx={{ fontSize: 40, color: '#10b981', mb: 1 }} />
                    <Typography variant="h5" sx={{ color: '#10b981', fontWeight: 'bold' }}>
                      {currentProfile.balance.toLocaleString()} ₽
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#cccccc' }}>
                      Баланс
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
              
              <Box sx={{ width: '25%' }}>
                <Card className="glass-card">
                  <CardContent sx={{ textAlign: 'center' }}>
                    <InventoryIcon sx={{ fontSize: 40, color: '#3b82f6', mb: 1 }} />
                    <Typography variant="h5" sx={{ color: '#3b82f6', fontWeight: 'bold' }}>
                      {currentProfile.totalTrades}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#cccccc' }}>
                      Сделок
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
              
              <Box sx={{ width: '25%' }}>
                <Card className="glass-card">
                  <CardContent sx={{ textAlign: 'center' }}>
                    <TrendingUpIcon sx={{ fontSize: 40, color: '#f59e0b', mb: 1 }} />
                    <Typography variant="h5" sx={{ color: '#f59e0b', fontWeight: 'bold' }}>
                      {currentProfile.successRate}%
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#cccccc' }}>
                      Успешность
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
              
              <Box sx={{ width: '25%' }}>
                <Card className="glass-card">
                  <CardContent sx={{ textAlign: 'center' }}>
                    <TimelineIcon sx={{ fontSize: 40, color: '#8b5cf6', mb: 1 }} />
                    <Typography variant="h5" sx={{ color: '#8b5cf6', fontWeight: 'bold' }}>
                      {currentProfile.experience}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#cccccc' }}>
                      Опыт
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            </Grid>
          </Box>
        </Grid>
      </motion.div>

      {/* Форма редактирования */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <Card className="glass-card" sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 3, color: '#ffffff' }}>
              {isEditing ? '✏️ Редактирование профиля' : '📋 Личная информация'}
            </Typography>
            
            <Grid container spacing={3}>
              <Box sx={{ width: '50%' }}>
                <TextField
                  fullWidth
                  label="Имя пользователя"
                  value={currentProfile.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  disabled={!isEditing}
                  className="glass-input"
                  sx={{ mb: 2 }}
                />
                
                <TextField
                  fullWidth
                  label="Email"
                  value={currentProfile.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  disabled={!isEditing}
                  className="glass-input"
                  sx={{ mb: 2 }}
                />
                
                <TextField
                  fullWidth
                  label="Телефон"
                  value={currentProfile.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  disabled={!isEditing}
                  className="glass-input"
                  sx={{ mb: 2 }}
                />
                
                <TextField
                  fullWidth
                  label="Местоположение"
                  value={currentProfile.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  disabled={!isEditing}
                  className="glass-input"
                />
              </Box>
              
              <Box sx={{ width: '50%' }}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel sx={{ color: '#cccccc' }}>Язык</InputLabel>
                  <Select
                    value={currentProfile.preferences.language}
                    onChange={(e) => handlePreferenceChange('language', e.target.value)}
                    disabled={!isEditing}
                    className="gradient-select"
                  >
                    <MenuItem value="ru">Русский</MenuItem>
                    <MenuItem value="en">English</MenuItem>
                    <MenuItem value="zh">中文</MenuItem>
                  </Select>
                </FormControl>
                
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel sx={{ color: '#cccccc' }}>Валюта</InputLabel>
                  <Select
                    value={currentProfile.preferences.currency}
                    onChange={(e) => handlePreferenceChange('currency', e.target.value)}
                    disabled={!isEditing}
                    className="gradient-select"
                  >
                    <MenuItem value="RUB">Рубль (₽)</MenuItem>
                    <MenuItem value="USD">Доллар ($)</MenuItem>
                    <MenuItem value="EUR">Евро (€)</MenuItem>
                  </Select>
                </FormControl>
                
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel sx={{ color: '#cccccc' }}>Тема</InputLabel>
                  <Select
                    value={currentProfile.preferences.theme}
                    onChange={(e) => handlePreferenceChange('theme', e.target.value)}
                    disabled={!isEditing}
                    className="gradient-select"
                  >
                    <MenuItem value="dark">Темная</MenuItem>
                    <MenuItem value="light">Светлая</MenuItem>
                    <MenuItem value="auto">Авто</MenuItem>
                  </Select>
                </FormControl>
                
                <Typography variant="body2" sx={{ color: '#cccccc', mb: 2 }}>
                  Дата регистрации: {new Date(currentProfile.joinDate).toLocaleDateString('ru-RU')}
                </Typography>
              </Box>
            </Grid>
            
            {isEditing && (
              <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  onClick={handleSave}
                  className="gradient-button"
                >
                  Сохранить
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<CancelIcon />}
                  onClick={handleCancel}
                  className="outline-button"
                >
                  Отмена
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Уведомления */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <Card className="glass-card">
          <CardContent>
            <Typography variant="h6" sx={{ mb: 3, color: '#ffffff' }}>
              🔔 Настройки уведомлений
            </Typography>
            
            <Grid container spacing={3}>
              <Box sx={{ width: '33.33%' }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={currentProfile.notifications.email}
                      onChange={(e) => handleNotificationChange('email', e.target.checked)}
                      disabled={!isEditing}
                      className="gradient-switch"
                    />
                  }
                  label="Email уведомления"
                  sx={{ color: '#cccccc' }}
                />
              </Box>
              
              <Box sx={{ width: '33.33%' }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={currentProfile.notifications.push}
                      onChange={(e) => handleNotificationChange('push', e.target.checked)}
                      disabled={!isEditing}
                      className="gradient-switch"
                    />
                  }
                  label="Push уведомления"
                  sx={{ color: '#cccccc' }}
                />
              </Box>
              
              <Box sx={{ width: '33.33%' }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={currentProfile.notifications.telegram}
                      onChange={(e) => handleNotificationChange('telegram', e.target.checked)}
                      disabled={!isEditing}
                      className="gradient-switch"
                    />
                  }
                  label="Telegram уведомления"
                  sx={{ color: '#cccccc' }}
                />
              </Box>
            </Grid>
          </CardContent>
        </Card>
      </motion.div>
    </Box>
  );
};

export default Profile;
