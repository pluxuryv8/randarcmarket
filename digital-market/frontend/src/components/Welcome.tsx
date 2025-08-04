import React from 'react';
import { Box, Typography, Button, Card, CardContent } from '@mui/material';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import PatternBackground from './PatternBackground';
import SkinIcon from '@mui/icons-material/ShoppingCart';
import NFTIcon from '@mui/icons-material/Apps';
import FeeIcon from '@mui/icons-material/AttachMoney';
import BotIcon from '@mui/icons-material/Telegram';

const heroVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const features = [
  {
    icon: <SkinIcon fontSize="large" sx={{ color: 'primary.main' }} />,
    title: 'Торгуйте скинами',
    desc: 'Все популярные скины CS:GO в одном месте',
  },
  {
    icon: <NFTIcon fontSize="large" sx={{ color: 'primary.main' }} />,
    title: 'Поддержка NFT',
    desc: 'Торгуйте не только скинами, но и NFT',
  },
  {
    icon: <FeeIcon fontSize="large" sx={{ color: 'primary.main' }} />,
    title: 'Минимальные комиссии',
    desc: 'Платите всего 1% от сделки',
  },
  {
    icon: <BotIcon fontSize="large" sx={{ color: 'primary.main' }} />,
    title: 'Telegram-бот',
    desc: 'Уведомления о сделках прямо в чате',
  },
];

export default function Welcome() {
  const { loginWithSteam, loginWithTelegram } = useAuth();

  return (
    <Box sx={{ position: 'relative', overflow: 'hidden' }}>
      {/* 1) Анимированный фон (из index.css) */}
      <div className="animated-bg" />

      {/* 2) Vanta.js сеть */}
      <PatternBackground />

      {/* 3) Hero-блок: заголовок + кнопки */}
      <Box
        component={motion.div}
        initial="hidden"
        animate="visible"
        variants={heroVariants}
        transition={{ duration: 0.8 }}
        sx={{
          position: 'relative',
          zIndex: 1,
          minHeight: '60vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          px: 2,
        }}
      >
        <Typography variant="h1" gutterBottom sx={{ color: '#fff' }}>
          Открой тайны рынка скинов
        </Typography>
        <Typography variant="h6" sx={{ maxWidth: 600, mb: 4, color: '#ccc' }}>
          Анализируй свой инвентарь, находи лучшие сделки и торгуй скинами CS:GO в одном месте.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Button onClick={loginWithSteam}>Войти через Steam</Button>
          <Button onClick={loginWithTelegram}>Подключить Telegram</Button>
        </Box>
      </Box>

      {/* 4) Блок с фичами – ПОСЛЕ Hero-блока */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          display: 'grid',
          gap: 2,
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2,1fr)',
            md: 'repeat(4,1fr)',
          },
          px: 2,
          pt: 4,
          maxWidth: 900,
          mx: 'auto',
        }}
      >
        {features.map(f => (
          <Card key={f.title} sx={{ backgroundColor: 'rgba(26,26,26,0.75)' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              {f.icon}
              <Typography variant="h6" sx={{ mt: 1, color: '#fff' }}>
                {f.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {f.desc}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
