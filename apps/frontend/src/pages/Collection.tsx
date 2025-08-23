import React from 'react';
import { Box } from '@mui/material';



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
      <Box sx={{ mb: 3 }}>
        <h1>Коллекции</h1>
        <p>Тренды и лидеры</p>
      </Box>
      <Box sx={{ display:'grid', gap:2, gridTemplateColumns:{ xs:'1fr', sm:'repeat(2,1fr)', md:'repeat(3,1fr)' } }}>
        {items ? (
          items.map((c)=> (
            <Box key={c.id} sx={{ p: 2, border: '1px solid #333', borderRadius: 2 }}>
              <h3>{c.name}</h3>
              <p>{c.description}</p>
            </Box>
          ))
        ) : (
          Array.from({ length: 9 }).map((_,i)=> <Box key={i} sx={{ p: 2, border: '1px solid #333', borderRadius: 2, height: 200 }}>Loading...</Box>)
        )}
      </Box>
    </Box>
  );
};

export default Collections;


