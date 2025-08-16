import React from 'react';
import { Box, Container } from '@mui/material';
import Header from './Header';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const isHome = pathname === '/';
  // no special inventory layout anymore

  return (
    <Box sx={{ 
      backgroundColor: 'transparent', 
      minHeight: '100vh',
      position: 'relative',
      width: '100%',
      overflow: 'visible' // Убираем ограничения скролла
    }}>
      {/* Показываем Header только если пользователь авторизован или не на главной странице */}
      {(user || !isHome) && <Header />}

      {isHome ? (
        // На главной странице не используем контейнер для полного фона
        <Box sx={{ 
          width: '100%', 
          minHeight: '100vh', // Изменяем height на minHeight для прокрутки
          paddingTop: 0, // Убираем отступ сверху для главной страницы
          boxSizing: 'border-box',
          overflow: 'visible' // Убираем ограничения скролла
        }}>
          {children}
        </Box>
      ) : (
        // На остальных страницах используем контейнер с отступом для Header
        <Box sx={{ 
          paddingTop: '70px', // Увеличиваем отступ для фиксированного Header
          minHeight: '100vh',
          width: '100%',
          boxSizing: 'border-box',
          overflow: 'visible' // Убираем ограничения скролла
        }}>
          <Container maxWidth="lg" sx={{ py: 2 }}>
            {children}
          </Container>
        </Box>
      )}
    </Box>
  );
};

export default Layout;
