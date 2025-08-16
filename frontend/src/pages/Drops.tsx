import React, { useEffect, useState } from 'react';
import { Box, Typography, Chip, Skeleton } from '@mui/material';
import { fetchDrops } from '../services/nft';
import { NFTDrop } from '../types/nft';

const Drops: React.FC = () => {
  const [drops, setDrops] = useState<NFTDrop[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchDrops().then((res) => {
      setDrops(res);
      setLoading(false);
    });
  }, []);

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>Дропы</Typography>
      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
        {loading
          ? Array.from({ length: 4 }).map((_, idx) => (
              <Skeleton key={idx} variant="rectangular" height={220} sx={{ borderRadius: 2 }} />
            ))
          : drops.map((drop) => (
              <Box key={drop.id} sx={{ border: '1px solid rgba(198, 38, 38, 0.2)', borderRadius: 2, overflow: 'hidden' }}>
                <Box sx={{ position: 'relative', height: 140 }}>
                  <img src={drop.imageUrl} alt={drop.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </Box>
                <Box sx={{ p: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography sx={{ fontWeight: 600, flex: 1 }}>{drop.title}</Typography>
                  <Chip label={`Supply: ${drop.supply ?? '-'} / ${drop.minted ?? '-'}`} variant="outlined" />
                </Box>
              </Box>
            ))}
      </Box>
    </Box>
  );
};

export default Drops;


