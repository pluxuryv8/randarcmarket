import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import Card from '../ui/Card';

const promos = [
  { id: 1, title: 'Не упусти', desc: 'Горячие коллекции этой недели', cta: 'Открыть', image: 'https://picsum.photos/seed/fav1/800/420' },
  { id: 2, title: 'Принять участие', desc: 'Эксклюзивные дропы', cta: 'Перейти', image: 'https://picsum.photos/seed/fav2/800/420' },
  { id: 3, title: 'Запрашивай', desc: 'Сотрудничества и листинги', cta: 'Связаться', image: 'https://picsum.photos/seed/fav3/800/420' },
];

const Favorites: React.FC = () => {
  return (
    <Box className="section">
      <Box className="grid-cols-12">
        {promos.map((p) => (
          <Box key={p.id} className="col-span-12 md:col-span-4">
            <Card sx={{ p: 0, overflow: 'hidden', height: 280 }}>
              <Box sx={{ position: 'relative', height: 180 }}>
                <img 
                  loading="lazy" 
                  src={p.image} 
                  alt={p.title} 
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover' 
                  }} 
                />
              </Box>
              <Box sx={{ p: 3, height: 100, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: 'var(--c-text)', mb: 1 }}>
                    {p.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'var(--c-muted)' }}>
                    {p.desc}
                  </Typography>
                </Box>
                <Button 
                  variant="contained" 
                  size="small" 
                  sx={{ alignSelf: 'flex-start', mt: 2 }}
                >
                  {p.cta}
                </Button>
              </Box>
            </Card>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Favorites;


