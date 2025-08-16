import React, { useEffect, useState } from 'react';
import { Box, Typography, Chip, Skeleton, Button } from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import NFTCard from '../components/ui/NFTCard';
import VirtualGrid from '../components/ui/VirtualGrid';
import SideFilterPanel from '../components/ui/SideFilterPanel';
import { fetchMarketItems, MarketSort, fetchCollections } from '../services/nft';
import { NFTItem, NFTCollection } from '../types/nft';
import FilterBar from '../components/ui/FilterBar';

const Market: React.FC = () => {
  const [items, setItems] = useState<NFTItem[]>([]);
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<MarketSort>('price_desc');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [collections, setCollections] = useState<NFTCollection[]>([]);
  const [collectionId, setCollectionId] = useState<string | null>(null);
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [sentinelRef, setSentinelRef] = useState<HTMLDivElement | null>(null);

  // Инициализация из URL один раз
  useEffect(() => {
    const q = searchParams.get('q') || '';
    const s = (searchParams.get('sort') as MarketSort) || 'price_desc';
    const v = searchParams.get('verified') === '1';
    const min = searchParams.get('min');
    const max = searchParams.get('max');
    const col = searchParams.get('col');
    setQuery(q);
    setSort(s);
    setVerifiedOnly(v);
    setMinPrice(min ? Number(min) : null);
    setMaxPrice(max ? Number(max) : null);
    setCollectionId(col || null);
    setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Синхронизация фильтров в URL
  useEffect(() => {
    const p = new URLSearchParams();
    if (query) p.set('q', query);
    if (sort) p.set('sort', sort);
    if (verifiedOnly) p.set('verified', '1');
    if (minPrice !== null) p.set('min', String(minPrice));
    if (maxPrice !== null) p.set('max', String(maxPrice));
    if (collectionId) p.set('col', collectionId);
    setSearchParams(p, { replace: true });
  }, [query, sort, verifiedOnly, minPrice, maxPrice, collectionId, setSearchParams]);

  // Список коллекций для фильтра
  useEffect(() => {
    fetchCollections().then(setCollections);
  }, []);

  // Сброс страницы при изменении фильтров
  useEffect(() => {
    setPage(1);
  }, [query, sort, verifiedOnly, minPrice, maxPrice, collectionId]);

  // Загрузка данных
  useEffect(() => {
    setLoading(true);
    fetchMarketItems({
      q: query,
      sort,
      verifiedOnly,
      minPriceTon: minPrice ?? undefined,
      maxPriceTon: maxPrice ?? undefined,
      collectionId: collectionId ?? undefined,
      page,
      pageSize: 24
    }).then((res) => {
      setHasMore(res.length === 24);
      setItems(prev => page === 1 ? res : [...prev, ...res]);
      setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, sort, verifiedOnly, minPrice, maxPrice, collectionId, page]);

  const filtered = items;

  // Автоподгрузка через IntersectionObserver
  useEffect(() => {
    if (!sentinelRef) return;
    const observer = new IntersectionObserver((entries) => {
      const first = entries[0];
      if (first.isIntersecting && hasMore && !loading) {
        setPage((p) => p + 1);
      }
    }, { root: null, rootMargin: '600px 0px', threshold: 0 });
    observer.observe(sentinelRef);
    return () => observer.disconnect();
  }, [sentinelRef, hasMore, loading]);

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>Маркет</Typography>
        <Chip label={`Всего: ${items.length}`} variant="outlined" sx={{ borderColor: 'rgba(198, 38, 38, 0.25)' }} />
      </Box>

      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', lg: '260px 1fr' } }}>
        {/* Левая панель фильтров (десктоп) */}
        <Box sx={{ display: { xs: 'none', lg: 'block' }, position: 'sticky', top: 90, height: 'fit-content' }}>
          <SideFilterPanel
            collections={collections}
            collectionId={collectionId}
            onCollectionChange={setCollectionId}
            minPrice={minPrice}
            maxPrice={maxPrice}
            onMinPriceChange={setMinPrice}
            onMaxPriceChange={setMaxPrice}
            verifiedOnly={verifiedOnly}
            onToggleVerified={() => setVerifiedOnly(v => !v)}
            onReset={() => {
              setQuery('');
              setSort('price_desc');
              setVerifiedOnly(false);
              setMinPrice(null);
              setMaxPrice(null);
              setCollectionId(null);
            }}
          />
        </Box>

        {/* Контент */}
        <Box>
          <FilterBar
            query={query}
            onQueryChange={setQuery}
            sort={sort}
            onSortChange={(v) => setSort(v as MarketSort)}
            verifiedOnly={verifiedOnly}
            onToggleVerified={() => setVerifiedOnly(v => !v)}
          />

          {loading ? (
            <Box
              sx={{
                display: 'grid',
                gap: 2,
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(3, 1fr)',
                  lg: 'repeat(4, 1fr)'
                }
              }}
            >
              {Array.from({ length: 12 }).map((_, idx) => (
                <Skeleton key={idx} variant="rectangular" height={280} sx={{ borderRadius: 2 }} />
              ))}
            </Box>
          ) : (
            <VirtualGrid
              items={filtered}
              renderItem={(nft) => (
                <NFTCard item={nft} />
              )}
              extraItemHeight={110}
              gap={16}
            />
          )}

          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Button variant="outlined" onClick={() => setPage(p => p + 1)} disabled={loading || !hasMore}>
              {hasMore ? 'Показать ещё' : 'Больше нет'}
            </Button>
          </Box>

          <Box ref={setSentinelRef as any} sx={{ height: 1 }} />
        </Box>
      </Box>
    </Box>
  );
};

export default Market;


