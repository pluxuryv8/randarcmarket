import React from 'react';
import { Box, Container, Link, Typography } from '@mui/material';
import Header from './Header';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const isHome = pathname === '/';

  return (
    <Box sx={{ backgroundColor: 'transparent', minHeight: '100vh' }}>
      {/* Показываем Header только если пользователь авторизован или не на главной странице */}
      {(user || !isHome) && <Header />}

      {isHome ? (
        // На главной странице не используем контейнер для полного фона
        <Box sx={{ width: '100%', height: '100vh' }}>
          {children}
        </Box>
      ) : (
        // На остальных страницах используем контейнер
        <Container maxWidth="lg" sx={{ pt: 4 }}>
          {children}
        </Container>
      )}

      {/* Навигацию и футер НЕ рендерим на главной (/) */}
      {!isHome && (
        <Box component="footer" sx={{ mt: 8, py: 4, backgroundColor: 'rgba(26,26,26,0.9)' }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 6, flexWrap: 'wrap', mb: 2 }}>
            {['Инвентарь','Радар','Профиль','Безопасность'].map(link => (
              <Link
                key={link}
                component={NavLink}
                to={`/${link.toLowerCase()}`}
                sx={{ color: 'text.secondary', textDecoration: 'none' }}
              >
                {link}
              </Link>
            ))}
          </Box>
          <Typography variant="body2" color="text.secondary" textAlign="center">
            © 2025 Randar Market. Все права защищены.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default Layout;
