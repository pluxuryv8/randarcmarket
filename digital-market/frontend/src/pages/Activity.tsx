import React from 'react';
import { Box } from '@mui/material';
import SectionHeader from '../components/ui/SectionHeader';
import SkeletonCard from '../components/ui/SkeletonCard';
import ActivityCard from '../components/cards/ActivityCard';
import { getLiveActivity } from '../services/api';
import type { Activity } from '../types/domain';

const ActivityPage: React.FC = ()=>{
  const [items, setItems] = React.useState<Activity[] | null>(null);

  const load = React.useCallback(()=>{ getLiveActivity(60).then(setItems); },[]);

  React.useEffect(()=>{
    let mounted = true;
    setItems(null);
    load();
    return ()=>{ mounted = false; };
  },[load]);

  return (
    <Box>
      <SectionHeader title="Активность" subtitle="Лента последних событий" />
      <Box sx={{ display:'grid', gap:1.5 }}>
        {items ? (
          items.map((a)=> (
            <ActivityCard key={a.id} data={a} />
          ))
        ) : (
          Array.from({ length: 12 }).map((_,i)=> <SkeletonCard key={i} height={72} />)
        )}
      </Box>
    </Box>
  );
};

export default ActivityPage;


