import React from 'react';
import { Box, Typography, Container, Avatar, Paper, Divider } from '@mui/material';

export default function Profile() {
  const user = {
    username: 'randar_user',
    steamId: '7656119xxxxxxx',
    balance: 1543.75,
    avatar: 'https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/avatars/cc/cc3d9dffb0cc1453d2b5d400f3b3e91be8b81f55_full.jpg',
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#0d0d0d', py: 8 }}>
      <Container maxWidth="sm">
        <Paper
          elevation={6}
          sx={{
            backgroundColor: '#1c1c1c',
            color: '#fff',
            p: 4,
            borderRadius: 4,
            textAlign: 'center',
          }}
        >
          <Avatar
            src={user.avatar}
            alt={user.username}
            sx={{ width: 96, height: 96, mx: 'auto', mb: 2 }}
          />
          <Typography variant="h5" gutterBottom>
            {user.username}
          </Typography>
          <Typography variant="body2" sx={{ color: '#aaa' }}>
            Steam ID: {user.steamId}
          </Typography>

          <Divider sx={{ my: 3, backgroundColor: '#333' }} />

          <Typography variant="subtitle1" sx={{ color: '#aaa' }}>
            Баланс
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#4caf50' }}>
            {user.balance.toFixed(2)} ₽
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}