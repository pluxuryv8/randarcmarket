import React from 'react';
import { Box, Button } from '@mui/material';
import SectionHeader from '../ui/SectionHeader';
import SkeletonCard from '../ui/SkeletonCard';
import CollectionCard from '../cards/CollectionCard';
import { getTrendingCollections } from '../../services/api';
import type { TimeRange, Collection } from '../../types/domain';
import { useNavigate } from 'react-router-dom';

const TrendingCollections: React.FC = () => {
  const [range, setRange] = React.useState<TimeRange>('1d');
  const [items, setItems] = React.useState<Collection[] | null>(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    let mounted = true;
    setItems(null);
    getTrendingCollections(range).then((res) => {
      if (mounted) setItems(res);
    });
    return () => { mounted = false; };
  }, [range]);

  return (
    <Box className="section">
      <SectionHeader 
        title="Трендящие коллекции" 
        subtitle="За выбранный период" 
        range={range} 
        onRangeChange={setRange} 
        actionsRight={
          <Button 
            onClick={() => navigate('/collections')} 
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
      <Box className="grid-cols-12">
        {items ? (
          items.map((c) => (
            <Box key={c.id} className="col-span-12 md:col-span-4">
              <CollectionCard data={c} range={range} />
            </Box>
          ))
        ) : (
          Array.from({ length: 9 }).map((_, i) => (
            <Box key={i} className="col-span-12 md:col-span-4">
              <SkeletonCard height={220} />
            </Box>
          ))
        )}
      </Box>
    </Box>
  );
};

export default TrendingCollections;


