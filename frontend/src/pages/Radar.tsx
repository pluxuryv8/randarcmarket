import React, { useState } from 'react';
import { Box, Typography, Button, Card, CardContent, CircularProgress } from '@mui/material';

const BACKEND = process.env.REACT_APP_BACKEND_URL;

type RadarResult = { item: string; buyPrice: number; potentialProfit: number };

export default function Radar() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<RadarResult | null>(null);

  const runRadar = async () => {
    setLoading(true);
    const res = await fetch(`${BACKEND}/radar`);
    const json = await res.json();
    setData(json);
    setLoading(false);
  };

  return (
    <Box textAlign="center">
      <Typography variant="h5" sx={{ mb: 2 }}>Radar Skins</Typography>
      <Button variant="contained" color="primary" onClick={runRadar} disabled={loading}>
        {loading ? <CircularProgress size={24} color="inherit" /> : 'Запустить Radar'}
      </Button>

      {data && (
        <Card sx={{ maxWidth: 360, mx: 'auto', mt: 3 }}>
          <CardContent>
            <Typography variant="h6" color="primary">{data.item}</Typography>
            <Typography>Цена выкупа: {data.buyPrice} ₽</Typography>
            <Typography color="success.main">Прибыль: +{data.potentialProfit} ₽</Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}