// frontend/src/components/Header.tsx
import React from 'react';
import { AppBar, Toolbar, Box, Button } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';

export default function Header() {
  const { user } = useAuth();    // из контекста узнаём, залогинен ли пользователь

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        backgroundColor: 'transparent',
        top: 0, left: 0, right: 0,
        zIndex: 100,
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', px: 4 }}>
        {/* Логотип всегда */}
        <Box
          component="img"
          src={logo}
          alt="Randar Market"
          sx={{ height: 40, cursor: 'pointer' }}
          onClick={() => window.location.href = '/'}
        />

        {/* Кнопки навигации только после того, как user != null */}
        {user && (
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button component={NavLink} to="/inventory" color="primary">Инвентарь</Button>
            <Button component={NavLink} to="/radar"     color="primary">Радар</Button>
            <Button component={NavLink} to="/profile"   color="primary">Профиль</Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}
