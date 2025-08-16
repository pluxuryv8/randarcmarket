// frontend/src/components/ItemsList.tsx
import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  CircularProgress,
} from '@mui/material';

interface Item {
  id: string;
  name: string;
  imageUrl: string;
}

export const ItemsList: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Демо-данные с изображениями оружий CS:GO
    const demoWeapons = [
      {
        id: 'ak47-demo',
        name: 'AK-47 | Redline',
        imageUrl: 'https://via.placeholder.com/300x160/8B0000/FFFFFF?text=AK-47+Redline'
      },
      {
        id: 'm4a4-demo',
        name: 'M4A4 | Desolate Space',
        imageUrl: 'https://via.placeholder.com/300x160/4A90E2/FFFFFF?text=M4A4+Desolate+Space'
      },
      {
        id: 'awp-demo',
        name: 'AWP | Dragon Lore',
        imageUrl: 'https://via.placeholder.com/300x160/FFD700/000000?text=AWP+Dragon+Lore'
      },
      {
        id: 'glock-demo',
        name: 'Glock-18 | Fade',
        imageUrl: 'https://via.placeholder.com/300x160/FF6B6B/FFFFFF?text=Glock-18+Fade'
      },
      {
        id: 'usp-demo',
        name: 'USP-S | Kill Confirmed',
        imageUrl: 'https://via.placeholder.com/300x160/2C3E50/FFFFFF?text=USP-S+Kill+Confirmed'
      },
      {
        id: 'deagle-demo',
        name: 'Desert Eagle | Golden Koi',
        imageUrl: 'https://via.placeholder.com/300x160/FFA500/000000?text=Desert+Eagle+Golden+Koi'
      },
      {
        id: 'knife-demo',
        name: 'Karambit | Fade',
        imageUrl: 'https://via.placeholder.com/300x160/9B59B6/FFFFFF?text=Karambit+Fade'
      },
      {
        id: 'm4a1s-demo',
        name: 'M4A1-S | Hyper Beast',
        imageUrl: 'https://via.placeholder.com/300x160/27AE60/FFFFFF?text=M4A1-S+Hyper+Beast'
      }
    ];

    // Имитируем загрузку данных
    setTimeout(() => {
      setItems(demoWeapons);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(4, 1fr)',
        },
        gap: 2,
        p: 2,
      }}
    >
      {items.map(item => (
        <Card 
          key={item.id} 
          sx={{ 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column',
            backgroundColor: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 8px 25px rgba(255,0,0,0.2)',
              borderColor: 'rgba(255,0,0,0.3)'
            }
          }}
        >
          <CardMedia
            component="img"
            height="160"
            image={item.imageUrl}
            alt={item.name}
            sx={{
              objectFit: 'cover',
              borderBottom: '1px solid rgba(255,255,255,0.1)'
            }}
            onError={(e) => {
              e.currentTarget.src = 'https://via.placeholder.com/300x160/333/666?text=Weapon';
            }}
          />
          <CardContent sx={{ flexGrow: 1, backgroundColor: 'transparent' }}>
            <Typography 
              variant="h6" 
              gutterBottom 
              sx={{ 
                color: '#fff',
                fontSize: '0.9rem',
                fontWeight: 500
              }}
            >
              {item.name}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};
