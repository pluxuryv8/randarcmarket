import React from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import Card from '../ui/Card';
import { formatTon } from '../../lib/format';
import type { Activity } from '../../types/domain';

const ActivityCard: React.FC<{ data: Activity }> = ({ data }) => {
  return (
    <Card sx={{
      p: 3,
      display: 'flex',
      alignItems: 'center',
      gap: 2,
    }}>
      <Avatar 
        src={data.image} 
        alt={data.title}
        sx={{ 
          width: 56, 
          height: 56, 
          borderRadius: 2,
          flexShrink: 0,
        }}
      />
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography 
          variant="body1" 
          sx={{ 
            fontWeight: 600, 
            color: 'var(--c-text)',
            mb: 0.5,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {data.title}
        </Typography>
        <Typography 
          variant="body2" 
          sx={{ color: 'var(--c-muted)' }}
        >
          {data.user} • {data.ago}
        </Typography>
      </Box>
      <Typography 
        variant="body1" 
        sx={{ 
          fontWeight: 700, 
          color: 'var(--c-text)',
          flexShrink: 0,
        }}
      >
        {formatTon(data.priceTon)}
      </Typography>
    </Card>
  );
};

export default ActivityCard;


