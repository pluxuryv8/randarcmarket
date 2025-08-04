import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { Telegram } from '@mui/icons-material';

const BACKEND = process.env.REACT_APP_BACKEND_URL;

export default function Login() {
  const [steamId, setSteamId] = useState<string | null>(null);
  const [tgId, setTgId] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has('steam')) {
      setSteamId(params.get('steam')!);
      window.history.replaceState({}, '', '/login');
    }
    if (params.has('tg_user')) {
      setTgId(params.get('tg_user')!);
      window.history.replaceState({}, '', '/login');
    }
  }, []);

  const steamLogin = () => {
    window.location.href = `${BACKEND}/auth/steam`;
  };

  const telegramLogin = () => {
    window.location.href = `${BACKEND}/auth/telegram`;
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#0d0d0d',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        px: 2,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 5,
          borderRadius: 4,
          backgroundColor: '#1c1c1c',
          textAlign: 'center',
          width: '100%',
          maxWidth: 420,
          color: '#fff',
        }}
      >
        <Typography
          variant="h5"
          gutterBottom
          sx={{ fontWeight: 700 }}
        >
          Войдите, чтобы начать торговлю
        </Typography>

        {!steamId && !tgId && (
          <>
            <Button
              variant="contained"
              fullWidth
              size="large"
              onClick={steamLogin}
              sx={{
                mt: 3,
                backgroundColor: '#171a21',
                color: '#fff',
                '&:hover': { backgroundColor: '#1b1f2a' },
              }}
            >
              Войти через Steam
            </Button>

            <Button
              variant="contained"
              fullWidth
              size="large"
              startIcon={<Telegram />}
              onClick={telegramLogin}
              sx={{
                mt: 2,
                backgroundColor: '#229ED9',
                color: '#fff',
                '&:hover': { backgroundColor: '#1b88c2' },
              }}
            >
              Войти через Telegram
            </Button>
          </>
        )}

        {(steamId || tgId) && (
          <Typography sx={{ mt: 4, color: 'lightgreen' }}>
            Вы успешно авторизованы
          </Typography>
        )}
      </Paper>
    </Box>
  );
}