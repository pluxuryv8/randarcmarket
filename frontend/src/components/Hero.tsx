import React from 'react';
import { Box, Typography, Button } from '@mui/material';

const Hero: React.FC = () => (
  <Box
    component="section"
    sx={{
      // «Выхлоп» из контейнера — полный экран
      position: 'relative',
      left: '50%',
      right: '50%',
      marginLeft: '-50vw',
      marginRight: '-50vw',
      width: '100vw',
      height: '100vh',

      // Фон
      backgroundImage: `url(${process.env.PUBLIC_URL}/Hero.png)`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',

      // Центрируем контент
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',

      // Тёмный градиент поверх картинки
      '&::before': {
        content: '""',
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(180deg, rgba(0,0,0,0.6), rgba(0,0,0,0.9))',
        zIndex: 1,
      },
    }}
  >
    <Box sx={{ position: 'relative', zIndex: 2, px: 2 }}>
      <Typography variant="h3" sx={{ mb: 4, fontWeight: 700, color: '#fff', maxWidth: 600, mx: 'auto' }}>
        Торгуйте скинами и подарками без забот
      </Typography>
      <Button variant="contained" color="error" size="large">
        Запустить радар
      </Button>
    </Box>
  </Box>
);

export default Hero;