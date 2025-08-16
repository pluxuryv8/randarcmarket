import React from 'react';
import { Box, Skeleton } from '@mui/material';

const SkeletonCard: React.FC<{ height?: number }> = ({ height = 220 }) => {
  return (
    <Box sx={{
      height: height,
      border: '1px solid var(--c-line)',
      borderRadius: 12,
      background: 'var(--c-card)',
      p: 0,
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <Skeleton 
        variant="rectangular" 
        height={height * 0.6} 
        animation="wave" 
        sx={{
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)',
          backgroundSize: '200px 100%',
          animation: 'shimmer 1.5s infinite',
        }}
      />
      <Box sx={{ p: 2, flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Skeleton height={18} width="60%" animation="wave" />
        <Skeleton height={14} width="40%" animation="wave" />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 'auto' }}>
          <Skeleton height={16} width="30%" animation="wave" />
          <Skeleton height={16} width="25%" animation="wave" />
        </Box>
      </Box>
    </Box>
  );
};

export default SkeletonCard;


