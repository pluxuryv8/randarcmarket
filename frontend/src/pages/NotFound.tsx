import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        height: '100vh',
        backgroundColor: '#0d0d0d',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        px: 2,
      }}
    >
      <Box>
        <Typography variant="h2" sx={{ color: '#ff1744', fontWeight: 800 }}>
          404
        </Typography>
        <Typography variant="h5" sx={{ color: '#fff', mt: 2 }}>
          Страница не найдена
        </Typography>
        <Typography variant="body1" sx={{ color: '#aaa', mt: 1 }}>
          Похоже, вы попали в зону без скинов...
        </Typography>
        <Button
          variant="contained"
          color="error"
          onClick={() => navigate('/')}
          sx={{ mt: 4 }}
        >
          Вернуться на главную
        </Button>
      </Box>
    </Box>
  );
}