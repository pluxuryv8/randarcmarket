import React from 'react';
import { Box, Chip, Typography } from '@mui/material';
import { NFTItem } from '../../types/nft';

interface NFTCardProps {
  item: NFTItem;
}

const NFTCard: React.FC<NFTCardProps> = ({ item }) => {
  return (
    <Box sx={{
      border: '1px solid rgba(198, 38, 38, 0.2)',
      borderRadius: 2,
      overflow: 'hidden',
      background: 'rgba(17,17,20,0.8)',
      backdropFilter: 'blur(12px)'
    }}>
      <Box sx={{ position: 'relative', pt: '100%', overflow: 'hidden' }}>
        <img
          src={item.imageUrl}
          alt={item.name}
          style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover' }}
          loading="lazy"
        />
      </Box>
      <Box sx={{ p: 1.5 }}>
        <Typography sx={{ fontWeight: 600 }}>{item.name}</Typography>
        {item.collectionName && (
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>{item.collectionName}</Typography>
        )}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
          {item.priceTon !== undefined && <Chip size="small" label={`${item.priceTon} TON`} />}
          {item.verified && <Chip size="small" color="success" label="Verified" />}
        </Box>
      </Box>
    </Box>
  );
};

export default NFTCard;


