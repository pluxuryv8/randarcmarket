// frontend/src/components/Header.tsx
import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Box,
  Avatar,
  Chip,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  ShoppingCart as ShoppingCartIcon,
  Radar as RadarIcon,
  Person as PersonIcon,
  Inventory as InventoryIcon,
  Close as CloseIcon,
  Telegram as TelegramIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const menuItems = [
    { text: 'Главная', icon: <HomeIcon />, path: '/' },
    { text: 'Маркетплейс', icon: <ShoppingCartIcon />, path: '/items' },
    { text: 'Радар', icon: <RadarIcon />, path: '/radar' },
    { text: 'Инвентарь', icon: <InventoryIcon />, path: '/inventory' },
    { text: 'Профиль', icon: <PersonIcon />, path: '/profile' }
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setMobileOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  const drawer = (
    <Box sx={{ 
      width: 280, 
      background: 'rgba(0, 0, 0, 0.95)',
      backdropFilter: 'blur(20px)',
      height: '100%',
      borderRight: '1px solid rgba(139, 0, 0, 0.3)'
    }}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        p: 2,
        borderBottom: '1px solid rgba(139, 0, 0, 0.3)'
      }}>
        <Typography variant="h6" sx={{ 
          color: '#ffffff',
          fontWeight: 700,
          background: 'linear-gradient(135deg, #8B0000, #DC2626)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Randar Market
        </Typography>
        <IconButton
          onClick={handleDrawerToggle}
          sx={{ color: '#ffffff' }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      
      <List sx={{ pt: 2 }}>
        {menuItems.map((item) => (
          <ListItem
            key={item.text}
            onClick={() => handleNavigation(item.path)}
            sx={{
              mx: 2,
              mb: 1,
              borderRadius: 2,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              background: isActive(item.path) 
                ? 'linear-gradient(135deg, rgba(139, 0, 0, 0.3), rgba(220, 38, 38, 0.2))'
                : 'transparent',
              border: isActive(item.path) 
                ? '1px solid rgba(139, 0, 0, 0.5)'
                : '1px solid transparent',
              '&:hover': {
                background: 'rgba(139, 0, 0, 0.1)',
                transform: 'translateX(5px)'
              }
            }}
          >
            <ListItemIcon sx={{ 
              color: isActive(item.path) ? '#DC2626' : '#cccccc',
              minWidth: 40
            }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.text}
              sx={{
                '& .MuiListItemText-primary': {
                  color: isActive(item.path) ? '#ffffff' : '#cccccc',
                  fontWeight: isActive(item.path) ? 600 : 400,
                  fontSize: '16px'
                }
              }}
            />
          </ListItem>
        ))}
      </List>
      
      <Box sx={{ 
        position: 'absolute', 
        bottom: 20, 
        left: 20, 
        right: 20 
      }}>
        <Button
          fullWidth
          variant="contained"
          startIcon={<TelegramIcon />}
          sx={{
            background: 'linear-gradient(135deg, #0088cc, #229ED9)',
            color: 'white',
            borderRadius: 2,
            py: 1.5,
            fontWeight: 600,
            '&:hover': {
              background: 'linear-gradient(135deg, #229ED9, #0088cc)',
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 25px rgba(34, 158, 217, 0.4)'
            }
          }}
        >
          Telegram Bot
        </Button>
      </Box>
    </Box>
  );

  return (
    <>
      <AppBar 
        position="fixed" 
        sx={{
          background: 'rgba(0, 0, 0, 0.95)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(139, 0, 0, 0.3)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.8)',
          zIndex: 1000,
          overflow: 'visible' // Убираем ограничения скролла
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', height: 70 }}>
          {/* Логотип */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar 
                sx={{ 
                  background: 'linear-gradient(135deg, #8B0000, #DC2626)',
                  width: 40,
                  height: 40,
                  fontWeight: 700,
                  fontSize: '18px'
                }}
              >
                R
              </Avatar>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: '#ffffff',
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #8B0000, #DC2626)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  display: { xs: 'none', sm: 'block' }
                }}
              >
                Randar Market
              </Typography>
            </Box>
          </motion.div>

          {/* Десктопное меню */}
          {!isMobile && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {menuItems.map((item) => (
                  <Button
                    key={item.text}
                    onClick={() => handleNavigation(item.path)}
                    startIcon={item.icon}
                    sx={{
                      color: isActive(item.path) ? '#ffffff' : '#cccccc',
                      background: isActive(item.path) 
                        ? 'linear-gradient(135deg, rgba(139, 0, 0, 0.3), rgba(220, 38, 38, 0.2))'
                        : 'transparent',
                      border: isActive(item.path) 
                        ? '1px solid rgba(139, 0, 0, 0.5)'
                        : '1px solid transparent',
                      borderRadius: 2,
                      px: 2,
                      py: 1,
                      fontWeight: isActive(item.path) ? 600 : 400,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        background: 'rgba(139, 0, 0, 0.1)',
                        color: '#ffffff',
                        transform: 'translateY(-2px)'
                      }
                    }}
                  >
                    {item.text}
                  </Button>
                ))}
              </Box>
            </motion.div>
          )}

          {/* Правая часть */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {/* Статус пользователя */}
              <Chip
                label="Онлайн"
                size="small"
                sx={{
                  background: 'linear-gradient(135deg, #10B981, #059669)',
                  color: 'white',
                  fontWeight: 600,
                  display: { xs: 'none', sm: 'flex' }
                }}
              />
              
              {/* Telegram кнопка */}
              <Button
                variant="outlined"
                startIcon={<TelegramIcon />}
                size="small"
                sx={{
                  borderColor: '#0088cc',
                  color: '#0088cc',
                  borderRadius: 2,
                  display: { xs: 'none', sm: 'flex' },
                  '&:hover': {
                    borderColor: '#229ED9',
                    background: 'rgba(34, 158, 217, 0.1)'
                  }
                }}
              >
                Bot
              </Button>

              {/* Мобильная кнопка меню */}
              {isMobile && (
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={handleDrawerToggle}
                  sx={{ color: '#ffffff' }}
                >
                  <MenuIcon />
                </IconButton>
              )}
            </Box>
          </motion.div>
        </Toolbar>
      </AppBar>

      {/* Мобильное меню */}
      <Drawer
        variant="temporary"
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true
        }}
        sx={{
          '& .MuiDrawer-paper': {
            background: 'transparent',
            boxShadow: 'none'
          }
        }}
      >
        {drawer}
      </Drawer>

      {/* Отступ для контента */}
      <Toolbar />
    </>
  );
};

export default Header;
