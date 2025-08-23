import React from 'react';
import { Box } from '@mui/material';
import SectionHeader from '../components/ui/SectionHeader';
import SkeletonCard from '../components/ui/SkeletonCard';
import DropCard from '../components/cards/DropCard';
import { getDrops } from '../services/api';
import type { Drop } from '../types/domain';

const Drops: React.FC = ()=>{
  const [items, setItems] = React.useState<Drop[] | null>(null);

  React.useEffect(()=>{
    let mounted = true;
    setItems(null);
    getDrops().then((res)=>{ if(mounted) setItems(res); });
    return ()=>{ mounted = false; };
  },[]);

  return (
    <Box>
      <SectionHeader title="Дропы" subtitle="Скоро и сейчас" />
      <Box sx={{ display:'grid', gap:2, gridTemplateColumns:{ xs:'1fr', md:'repeat(2,1fr)' } }}>
        {items ? (
          items.map((d)=> (
            <DropCard key={d.id} data={d} />
          ))
        ) : (
          Array.from({ length: 6 }).map((_,i)=> <SkeletonCard key={i} height={120} />)
        )}
      </Box>
    </Box>
  );
};

export default Drops;


