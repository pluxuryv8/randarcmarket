import React from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import Card from '../ui/Card';
import StatBadge from '../ui/StatBadge';
import { formatTon } from '../../lib/format';
import type { Gift, TimeRange } from '../../types/domain';

const GiftCard: React.FC<{ data: Gift; range: TimeRange }> = ({ data, range }) => {
  const stats = data.stats[range];
  
  return (
    <Card sx={{ height: 220, p: 3, display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Avatar 
          src={data.image} 
          alt={data.name}
          sx={{ 
            width: 64, 
            height: 64, 
            borderRadius: 2,
            mr: 2,
            flexShrink: 0,
          }}
        />
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 600, 
              color: 'var(--c-text)',
              mb: 0.5,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {data.name}
          </Typography>
          {data.verified && (
            <Box sx={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              px: 1, 
              py: 0.25, 
              borderRadius: 1,
              bgcolor: 'rgba(59,130,246,0.1)',
              color: '#3b82f6',
              fontSize: 12,
              fontWeight: 500,
            }}>
              ✓ Verified
            </Box>
          )}
        </Box>
      </Box>
      
      <Box sx={{ mt: 'auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
        <Box>
          <Typography variant="body2" sx={{ color: 'var(--c-muted)', mb: 0.5 }}>
            Floor
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 600, color: 'var(--c-text)' }}>
            {formatTon(stats.floorTon)}
          </Typography>
        </Box>
        
        <Box>
          <Typography variant="body2" sx={{ color: 'var(--c-muted)', mb: 0.5 }}>
            Volume
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 600, color: 'var(--c-text)' }}>
            {formatTon(stats.volumeTon)}
          </Typography>
        </Box>
        
        <Box sx={{ gridColumn: '1 / -1' }}>
          <StatBadge value={stats.changePct} />
        </Box>
      </Box>
    </Card>
  );
};

export default GiftCard;


