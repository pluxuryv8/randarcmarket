import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import Card from '../ui/Card';
import type { Drop } from '../../types/domain';

const DropCard: React.FC<{ data: Drop }> = ({ data }) => {
  return (
    <Card sx={{
      height: 160,
      p: 0,
      display: 'flex',
      alignItems: 'stretch',
      minWidth: 300,
      overflow: 'hidden',
    }}>
      <Box sx={{ 
        width: 160, 
        height: '100%', 
        overflow: 'hidden', 
        flexShrink: 0,
        position: 'relative',
      }}>
        <img 
          loading="lazy" 
          src={data.image} 
          alt={data.title} 
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover',
            aspectRatio: '16/9',
          }} 
        />
      </Box>
      <Box sx={{ 
        p: 3, 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}>
        <Box>
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 600, 
              color: 'var(--c-text)',
              mb: 1,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {data.title}
          </Typography>
          {data.description && (
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'var(--c-muted)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                lineHeight: 1.4,
              }}
            >
              {data.description}
            </Typography>
          )}
        </Box>
        <Button 
          variant="contained" 
          size="small" 
          sx={{ 
            alignSelf: 'flex-start',
            mt: 2,
          }}
        >
          {data.cta || 'Подробнее'}
        </Button>
      </Box>
    </Card>
  );
};

export default DropCard;


