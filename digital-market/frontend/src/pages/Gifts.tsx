import React from 'react';
import { Box } from '@mui/material';
import SectionHeader from '../components/ui/SectionHeader';
import SkeletonCard from '../components/ui/SkeletonCard';
import GiftCard from '../components/cards/GiftCard';
import { getTopGifts } from '../services/api';
import type { TimeRange, Gift } from '../types/domain';

const Gifts: React.FC = ()=>{
  const [range, setRange] = React.useState<TimeRange>('7d');
  const [items, setItems] = React.useState<Gift[] | null>(null);

  React.useEffect(()=>{
    let mounted = true;
    setItems(null);
    getTopGifts(range).then((res)=>{ if(mounted) setItems(res); });
    return ()=>{ mounted = false; };
  },[range]);

  return (
    <Box>
      <SectionHeader title="Подарки" subtitle="Тренды Telegram Gifts" range={range} onRangeChange={setRange} />
      <Box sx={{ display:'grid', gap:1.5 }}>
        {items ? (
          items.map((g)=> (
            <GiftCard key={g.id} data={g} range={range} />
          ))
        ) : (
          Array.from({ length: 10 }).map((_,i)=> <SkeletonCard key={i} height={80} />)
        )}
      </Box>
    </Box>
  );
};

export default Gifts;


