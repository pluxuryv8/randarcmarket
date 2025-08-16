// frontend/src/AppLayout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import Header from './components/Header';
const AppLayout: React.FC = () => {
  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      {/* Шапка */}
      <Header />

      {/* Основной контент */}
      <Container component="main" sx={{ flexGrow: 1, py: 2 }}>
        <Outlet />
      </Container>

      {/* (Опционально) футер */}
      {/* <Box component="footer" sx={{ py:1, textAlign:'center', bgcolor:'background.paper' }}>
        © 2025 RandarNFT
      </Box> */}
    </Box>
  );
};

export default AppLayout;