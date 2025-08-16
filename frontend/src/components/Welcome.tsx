import React from 'react';
import { Box, Typography, Button, Card, CardContent } from '@mui/material';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import PatternBackground from './PatternBackground';
import NFTIcon from '@mui/icons-material/Apps';
import FeeIcon from '@mui/icons-material/AttachMoney';
import BotIcon from '@mui/icons-material/Telegram';
import ShieldIcon from '@mui/icons-material/Security';

const heroVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const features = [
  {
    icon: <NFTIcon fontSize="large" sx={{ color: 'primary.main' }} />,
    title: 'Маркет NFT',
    desc: 'Telegram/TON коллекции и предметы в одном месте',
  },
  {
    icon: <BotIcon fontSize="large" sx={{ color: 'primary.main' }} />,
    title: 'Вход через Telegram',
    desc: 'Уведомления и авторизация через бота',
  },
  {
    icon: <FeeIcon fontSize="large" sx={{ color: 'primary.main' }} />,
    title: 'Низкие комиссии',
    desc: 'Прозрачные сборы и быстрые транзакции',
  },
  {
    icon: <ShieldIcon fontSize="large" sx={{ color: 'primary.main' }} />,
    title: 'Безопасность',
    desc: 'TON кошельки и проверенные коллекции',
  },
];

export default function Welcome() {
  const { loginWithTelegram } = useAuth();

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
          RandarNFT — маркет Telegram/TON NFT
        </Typography>
        <Typography variant="h6" sx={{ maxWidth: 600, mb: 4, color: '#ccc' }}>
          Исследуй коллекции, отслеживай активность и подключай TON кошелёк для быстрых покупок.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Button onClick={loginWithTelegram}>Войти через Telegram</Button>
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
