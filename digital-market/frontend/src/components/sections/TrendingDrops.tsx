import React from 'react';
import { Box, Button } from '@mui/material';
import SectionHeader from '../ui/SectionHeader';
import DropCard from '../cards/DropCard';
import { getDrops } from '../../services/api';
import type { Drop } from '../../types/domain';
import { useNavigate } from 'react-router-dom';

const TrendingDrops: React.FC = () => {
  const [items, setItems] = React.useState<Drop[] | null>(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    let mounted = true;
    setItems(null);
    getDrops().then((res) => {
      if (mounted) setItems(res);
    });
    return () => { mounted = false; };
  }, []);

  return (
    <Box className="section">
      <SectionHeader 
        title="Трендящие дропы" 
        subtitle="Не пропусти важные события" 
        actionsRight={
          <Button 
            onClick={() => navigate('/drops')} 
            size="small" 
            variant="outlined"
            sx={{
              borderColor: 'var(--c-line)',
              color: 'var(--c-text)',
              '&:hover': {
                borderColor: 'var(--c-brand)',
              },
            }}
          >
            Смотреть все
          </Button>
        }
      />
      <Box sx={{ 
        display: 'flex', 
        gap: 3, 
        overflowX: 'auto', 
        pb: 2,
        '&::-webkit-scrollbar': {
          height: 6,
        },
        '&::-webkit-scrollbar-track': {
          background: 'var(--c-line)',
          borderRadius: 3,
        },
        '&::-webkit-scrollbar-thumb': {
          background: 'var(--c-muted)',
          borderRadius: 3,
        },
      }}>
        {items ? (
          items.map((item) => (
            <Box key={item.id} sx={{ minWidth: 300, flexShrink: 0 }}>
              <DropCard data={item} />
            </Box>
          ))
        ) : (
          Array.from({ length: 6 }).map((_, i) => (
            <Box key={i} sx={{ 
              minWidth: 300, 
              height: 160, 
              bgcolor: 'var(--c-line)', 
              borderRadius: 2,
              flexShrink: 0,
            }} />
          ))
        )}
      </Box>
    </Box>
  );
};

export default TrendingDrops;


