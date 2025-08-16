import React from 'react';
import { Box, Typography, Button } from '@mui/material';

const Home: React.FC = () => {
  return (
    <Box sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #000000 0%, #1a0000 50%, #000000 100%)',
      color: 'white',
      textAlign: 'center',
      padding: 4
    }}>
      {/* ВРЕМЕННЫЙ МАРКЕР - НОВЫЙ ИНТЕРФЕЙС ЗАГРУЖЕН */}
      <Box sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        background: 'linear-gradient(90deg, #ff0000, #00ff00, #0000ff)',
        color: 'white',
        textAlign: 'center',
        padding: '8px',
        fontSize: '16px',
        fontWeight: 'bold',
        zIndex: 9999,
        animation: 'pulse 2s infinite'
      }}>
        🎉 НОВЫЙ ИНТЕРФЕЙС RANDAR NFT ЗАГРУЖЕН! 🎉
      </Box>
      
      <Typography variant="h1" sx={{ mb: 4, color: '#e11d48', fontWeight: 800 }}>
        RANDAR NFT
      </Typography>
      
      <Typography variant="h2" sx={{ mb: 2, color: 'white' }}>
        Новый интерфейс работает!
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 4, color: '#a1a1aa', maxWidth: 600 }}>
        Если вы видите эту страницу, значит новый интерфейс загружается правильно. 
        Это тестовая страница для проверки работы React и MUI.
      </Typography>
      
      <Button 
        variant="contained" 
        size="large"
        sx={{ 
          background: '#e11d48',
          '&:hover': { background: '#be123c' }
        }}
      >
        Тестовая кнопка
      </Button>
      
      <Box sx={{ mt: 8, p: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Время загрузки: {new Date().toLocaleTimeString()}
        </Typography>
      </Box>
    </Box>
  );
};

export default Home;