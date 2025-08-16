import React from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

const slides = [
  { id: 1, title: 'Маркет RandarNFT', desc: 'Современный маркет в экосистеме TON', image: 'https://picsum.photos/seed/hero1/1200/420' },
  { id: 2, title: 'Коллекции', desc: 'Проверенные и трендовые коллекции', image: 'https://picsum.photos/seed/hero2/1200/420' },
  { id: 3, title: 'Дропы', desc: 'Не пропусти важные события', image: 'https://picsum.photos/seed/hero3/1200/420' },
  { id: 4, title: 'Активность', desc: 'Лайв лента сделок', image: 'https://picsum.photos/seed/hero4/1200/420' },
];

const Hero: React.FC = () => {
  const [idx, setIdx] = React.useState(0);
  const next = () => setIdx((p) => (p + 1) % slides.length);
  const prev = () => setIdx((p) => (p - 1 + slides.length) % slides.length);
  
  React.useEffect(() => { 
    const id = setInterval(next, 5000); 
    return () => clearInterval(id); 
  }, []);

  return (
    <Box sx={{
      position: 'relative',
      borderRadius: 16,
      overflow: 'hidden',
      border: '1px solid var(--c-line)',
      mb: 0,
    }}>
      <AnimatePresence initial={false}>
        <motion.img
          key={slides[idx].id}
          src={slides[idx].image}
          alt={slides[idx].title}
          loading="lazy"
          style={{ width: '100%', height: 420, objectFit: 'cover' }}
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        />
      </AnimatePresence>
      
      <Box sx={{ 
        position: 'absolute', 
        inset: 0, 
        display: 'flex', 
        alignItems: 'flex-end', 
        p: 4, 
        background: 'linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.7))' 
      }}>
        <Box>
          <Typography variant="h1" sx={{ mb: 1, color: 'var(--c-text)' }}>
            {slides[idx].title}
          </Typography>
          <Typography variant="body1" sx={{ color: 'var(--c-muted)' }}>
            {slides[idx].desc}
          </Typography>
        </Box>
      </Box>
      
      <IconButton 
        onClick={prev} 
        sx={{ 
          position: 'absolute', 
          top: '50%', 
          left: 16, 
          transform: 'translateY(-50%)', 
          bgcolor: 'rgba(0,0,0,0.6)',
          color: 'var(--c-text)',
          '&:hover': {
            bgcolor: 'rgba(0,0,0,0.8)',
          },
        }}
      >
        ‹
      </IconButton>
      
      <IconButton 
        onClick={next} 
        sx={{ 
          position: 'absolute', 
          top: '50%', 
          right: 16, 
          transform: 'translateY(-50%)', 
          bgcolor: 'rgba(0,0,0,0.6)',
          color: 'var(--c-text)',
          '&:hover': {
            bgcolor: 'rgba(0,0,0,0.8)',
          },
        }}
      >
        ›
      </IconButton>
      
      <Box sx={{ 
        position: 'absolute', 
        bottom: 16, 
        left: 16, 
        display: 'flex', 
        gap: 1 
      }}>
        {slides.map((s, i) => (
          <Box 
            key={s.id} 
            sx={{ 
              width: 8, 
              height: 8, 
              borderRadius: '50%', 
              bgcolor: i === idx ? 'var(--c-brand)' : 'var(--c-line)',
              transition: 'background-color 0.3s ease',
            }} 
          />
        ))}
      </Box>
    </Box>
  );
};

export default Hero;


