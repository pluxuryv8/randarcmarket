import React from 'react';
import Layout from '../components/Layout';
import { Box, Container, Avatar, Typography, Paper, Divider } from '@mui/material';

export default function Profile() {
  const user = {
    username: 'randar_user',
    steamId: '7656119xxxxxxx',
    balance: 1543.75,
    avatar: 'https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/avatars/cc/cc3d9dffb0cc1453d2b5d400f3b3e91be8b81f55_full.jpg',
  };

  return (
    <Layout>
      <Box sx={{ py: 8, backgroundColor: 'var(--color-bg-panel)', minHeight: '80vh' }}>
        <Container maxWidth="sm">
          <Paper sx={{ p: 4, backgroundColor: 'var(--color-bg)', color: '#fff', borderRadius: 2 }}>
            <Avatar
              src={user.avatar}
              sx={{ width: 96, height: 96, mx: 'auto', mb: 2, border: `2px solid var(--color-accent)` }}
            />
            <Typography variant="h5" align="center">{user.username}</Typography>
            <Typography variant="body2" align="center" sx={{ color: '#aaa', mb: 3 }}>
              Steam ID: {user.steamId}
            </Typography>
            <Divider sx={{ backgroundColor: '#333', mb: 3 }} />
            <Typography variant="subtitle1" sx={{ color: '#aaa' }}>Баланс</Typography>
            <Typography variant="h4" sx={{ color: '#4caf50', mb: 2 }}>
              {user.balance.toFixed(2)} ₽
            </Typography>
          </Paper>
        </Container>
      </Box>
    </Layout>
  );
}
