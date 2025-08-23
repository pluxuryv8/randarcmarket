import React from 'react';
import { Box } from '@mui/material';
import SectionHeader from '../components/ui/SectionHeader';
import SkeletonCard from '../components/ui/SkeletonCard';
import CollectionCard from '../components/cards/CollectionCard';
import { getTrendingCollections } from '../services/api';
import type { TimeRange, Collection } from '../types/domain';

const Collections: React.FC = ()=>{
  const [range, setRange] = React.useState<TimeRange>('7d');
  const [items, setItems] = React.useState<Collection[] | null>(null);

  React.useEffect(()=>{
    let mounted = true;
    setItems(null);
    getTrendingCollections(range).then((res)=>{ if(mounted) setItems(res); });
    return ()=>{ mounted = false; };
  },[range]);

  return (
    <Box>
      <SectionHeader title="Коллекции" subtitle="Тренды и лидеры" range={range} onRangeChange={setRange} />
      <Box sx={{ display:'grid', gap:2, gridTemplateColumns:{ xs:'1fr', sm:'repeat(2,1fr)', md:'repeat(3,1fr)' } }}>
        {items ? (
          items.map((c)=> (
            <CollectionCard key={c.id} data={c} range={range} />
          ))
        ) : (
          Array.from({ length: 9 }).map((_,i)=> <SkeletonCard key={i} />)
        )}
      </Box>
    </Box>
  );
};

export default Collections;


