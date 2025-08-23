import React from 'react';
import { getDrops } from '../services/api';

type Drop = {
  id: string;
  title: string;
  cover?: string;
  priceTon?: number;
};

const Drops: React.FC = () => {
  const [items, setItems] = React.useState<Drop[] | null>(null);

  React.useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await getDrops();
        if (alive) setItems(res.data || []);
      } catch {
        if (alive) setItems([]);
      }
    })();
    return () => { alive = false; };
  }, []);

  if (!items) return <div style={{padding:16}}>Загрузка дропов…</div>;
  if (items.length === 0) return <div style={{padding:16}}>Пока нет активных дропов.</div>;

  return (
    <div style={{padding:16, display:'grid', gap:16, gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))'}}>
      {items.map(d => (
        <div key={d.id} style={{border:'1px solid #eee', borderRadius:12, padding:12}}>
          {d.cover && <img src={d.cover} alt={d.title} style={{width:'100%', borderRadius:8, marginBottom:8}} />}
          <div style={{fontWeight:600, marginBottom:8}}>{d.title}</div>
          {d.priceTon && <div>{d.priceTon} TON</div>}
          <button style={{marginTop:8}}>Участвовать</button>
        </div>
      ))}
    </div>
  );
};

export default Drops;
