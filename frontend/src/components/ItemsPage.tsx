import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  CircularProgress,
  Button,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';

interface Item {
  id: number;
  name: string;
  imageUrl: string;
  price: number;
}

const ItemsPage: React.FC = () => {
  const { user, logout } = useAuth();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetch('/items')        // прокси отправит на localhost:4001/items
      .then(res => res.json())
      .then(data => setItems(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  if (!user) {
    return (
      <Typography className="text-center mt-4 text-white">
        Пожалуйста, войдите через Steam
      </Typography>
    );
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress color="inherit" />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2, backgroundColor: 'black', minHeight: '100vh' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Typography variant="h4" color="white">Каталог предметов</Typography>
        <Button variant="outlined" color="secondary" onClick={logout}>
          Выйти
        </Button>
      </Box>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2,1fr)', md: 'repeat(4,1fr)' },
          gap: 2
        }}
      >
        {items.map(item => (
          <Card key={item.id} sx={{ backgroundColor: '#1e1e1e' }}>
            <CardMedia
              component="img"
              height="140"
              image={item.imageUrl}
              alt={item.name}
            />
            <CardContent>
              <Typography variant="h6" color="white">
                {item.name}
              </Typography>
              <Typography variant="h6" color="red" sx={{ mt: 1 }}>
                ${item.price.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        ))}
        {items.length === 0 && (
          <Typography color="gray" sx={{ gridColumn: '1/-1', textAlign: 'center' }}>
            Нет доступных предметов
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default ItemsPage;
