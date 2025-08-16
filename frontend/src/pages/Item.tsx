import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Chip, Skeleton } from '@mui/material';
import { fetchMarketItems } from '../services/nft';
import { NFTItem } from '../types/nft';

const Item: React.FC = () => {
  const { id } = useParams();
  const [item, setItem] = useState<NFTItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchMarketItems().then((res) => {
      setItem(res.find((i) => i.id === id) || null);
      setLoading(false);
    });
  }, [id]);

  if (loading || !item) {
    return <Skeleton variant="rectangular" height={420} sx={{ borderRadius: 2 }} />;
  }

  return (
    <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
      <Box>
        <Box sx={{ border: '1px solid rgba(198, 38, 38, 0.2)', borderRadius: 2, overflow: 'hidden' }}>
          <Box sx={{ position: 'relative', pt: '100%', overflow: 'hidden' }}>
            <img src={item.imageUrl} alt={item.name} style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover' }} />
          </Box>
        </Box>
      </Box>
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>{item.name}</Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', mb: 2 }}>{item.collectionName}</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Chip label={`${item.priceTon} TON`} />
          {item.priceUsd && <Chip label={`≈ $${item.priceUsd}`} variant="outlined" />}
          {item.verified && <Chip color="success" label="Verified" />}
        </Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {item.traits?.map((t) => (
            <Chip key={`${t.key}-${t.value}`} label={`${t.key}: ${t.value}`} variant="outlined" />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default Item;


