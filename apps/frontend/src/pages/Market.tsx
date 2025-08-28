import React, { useState, useEffect } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Skeleton from '../components/ui/Skeleton';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Switch from '../components/ui/Switch';
import { marketApi } from '../services/market';

export default function Market() {
  const [q, setQ] = useState({ search:'', collectionId:'', forSale:false, minPrice:'', maxPrice:'', source:'auto' });
  const [items, setItems] = useState<any[]>([]);
  const [collections, setCollections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const ctrlRef = React.useRef<AbortController|null>(null);

  function cancelPrev(){ if (ctrlRef.current) ctrlRef.current.abort(); }

  async function load(reset=false) {
    cancelPrev();
    const ctrl = new AbortController();
    ctrlRef.current = ctrl;
    setLoading(true);
    try {
      if (reset) { setOffset(0); setItems([]); }
      const cols = await marketApi.getCollections({ limit: 12 }, ctrl.signal);
      if (cols.success) setCollections(cols.collections);
      const params:any = { limit: 24, offset: reset?0:offset };
      if (q.collectionId) params.collectionId = q.collectionId;
      if (q.forSale) params.forSale = true;
      if (q.minPrice) params.minPrice = Number(q.minPrice);
      if (q.maxPrice) params.maxPrice = Number(q.maxPrice);
      if (q.source && q.source !== 'auto') params.source = q.source;
      const res = await marketApi.getItems(params, ctrl.signal);
      if (res.success) setItems(prev => reset? res.items : [...prev, ...res.items]);
    } finally { 
      setLoading(false);
      ctrlRef.current = null;
    }
  }

  const debouncedApply = React.useMemo(()=> {
    let t:any;
    return ()=> { clearTimeout(t); t = setTimeout(()=> load(true), 300); };
  }, [q.collectionId, q.forSale, q.minPrice, q.maxPrice, q.source]);

  useEffect(()=>{ debouncedApply(); /* eslint-disable-next-line */ }, [debouncedApply]);

  return (
    <div className="space-y-8 p-6">
      {/* Фильтры */}
      <Card className="flex flex-wrap gap-3 items-end">
        <div className="flex flex-col">
          <label className="text-sm text-[var(--muted)]">Collection</label>
          <select className="bg-[var(--panel)] border border-[var(--border)] rounded-xl px-3 py-2"
            value={q.collectionId}
            onChange={e=> setQ(v=>({...v, collectionId: e.target.value}))}
          >
            <option value="">All</option>
            {collections.map(c=> <option key={c.id} value={c.id}>{c.title}</option>)}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-[var(--muted)]">For sale</label>
          <input type="checkbox" checked={q.forSale} onChange={e=> setQ(v=>({...v, forSale: e.target.checked}))}/>
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-[var(--muted)]">Min TON</label>
          <input className="bg-[var(--panel)] border border-[var(--border)] rounded-xl px-3 py-2 w-28"
            value={q.minPrice} onChange={e=> setQ(v=>({...v, minPrice: e.target.value}))}/>
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-[var(--muted)]">Max TON</label>
          <input className="bg-[var(--panel)] border border-[var(--border)] rounded-xl px-3 py-2 w-28"
            value={q.maxPrice} onChange={e=> setQ(v=>({...v, maxPrice: e.target.value}))}/>
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-[var(--muted)]">Source</label>
          <select className="bg-[var(--panel)] border border-[var(--border)] rounded-xl px-3 py-2 w-32"
            value={q.source} onChange={e=> setQ(v=>({...v, source: e.target.value}))}>
            <option value="auto">Auto</option>
            <option value="tonapi">TonAPI</option>
            <option value="nftscan">NFTScan</option>
          </select>
        </div>

        <Button onClick={()=> load(true)} className="ml-auto">Apply</Button>
      </Card>

      {/* Грид айтемов */}
      <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(180px,1fr))]">
        {(loading && items.length===0) ? Array.from({length:12}).map((_,i)=>
          <Skeleton key={i} className="h-56" />
        ) : items.map(nft=>(
          <Card key={nft.id} className="p-0 overflow-hidden">
            <img src={`/api/img?url=${encodeURIComponent(nft.image)}`}
                 srcSet={`/api/img?url=${encodeURIComponent(nft.image)} 1x, /api/img?url=${encodeURIComponent(nft.image)} 2x`}
                 alt={nft.title} className="w-full h-44 object-cover"
                 loading="lazy"
                 onError={(e)=>{ (e.currentTarget as HTMLImageElement).style.display='none'; }}/>
            <div className="p-3">
              <div className="truncate">{nft.title}</div>
              {nft.forSale ? <div className="text-[var(--accent-2)] font-semibold">{nft.priceTon} TON</div> : <div className="text-[var(--muted)] text-sm">Not listed</div>}
            </div>
          </Card>
        ))}
      </div>

      {!loading && <div className="flex justify-center">
        <Button onClick={()=> { setOffset(o=>o+24); load(false); }}>Показать ещё</Button>
      </div>}
    </div>
  );
}