import React from 'react';
import { Box, Button } from '@mui/material';
import SectionHeader from '../ui/SectionHeader';
import ActivityCard from '../cards/ActivityCard';
import { getLiveActivity } from '../../services/api';
import type { Activity } from '../../types/domain';
import { useNavigate } from 'react-router-dom';

const LiveActivity: React.FC = () => {
  const [items, setItems] = React.useState<Activity[] | null>(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    let mounted = true;
    setItems(null);
    getLiveActivity(8).then((res) => {
      if (mounted) setItems(res);
    });
    
    const interval = setInterval(() => {
      if (mounted) {
        getLiveActivity(8).then((res) => {
          if (mounted) setItems(res);
        });
      }
    }, 15000);

    return () => { 
      mounted = false; 
      clearInterval(interval);
    };
  }, []);

  return (
    <Box className="section">
      <SectionHeader 
        title="Живая активность" 
        subtitle="Последние сделки" 
        actionsRight={
          <Button 
            onClick={() => navigate('/activity')} 
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
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {items ? (
          items.map((item) => (
            <ActivityCard key={item.id} data={item} />
          ))
        ) : (
          Array.from({ length: 8 }).map((_, i) => (
            <Box key={i} sx={{ height: 80, bgcolor: 'var(--c-line)', borderRadius: 2 }} />
          ))
        )}
      </Box>
    </Box>
  );
};

export default LiveActivity;


