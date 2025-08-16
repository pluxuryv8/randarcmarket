import React, { useEffect, useState, useMemo } from 'react';
import { Box, Typography, Chip, Skeleton, Avatar, TextField, Select, MenuItem } from '@mui/material';
import { fetchCollections } from '../services/nft';
import { NFTCollection } from '../types/nft';

const Collections: React.FC = () => {
  const [collections, setCollections] = useState<NFTCollection[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sort, setSort] = useState<'volume_desc' | 'floor_desc' | 'floor_asc' | 'name_asc' | 'name_desc'>('volume_desc');

  useEffect(() => {
    setLoading(true);
    fetchCollections().then((res) => {
      setCollections(res);
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(() => {
    let list = collections;
    if (query) list = list.filter(c => c.name.toLowerCase().includes(query.toLowerCase()));
    if (verifiedOnly) list = list.filter(c => c.verified);
    const copy = [...list];
    switch (sort) {
      case 'floor_asc':
        return copy.sort((a, b) => (a.floorPriceTon ?? 0) - (b.floorPriceTon ?? 0));
      case 'floor_desc':
        return copy.sort((a, b) => (b.floorPriceTon ?? 0) - (a.floorPriceTon ?? 0));
      case 'name_desc':
        return copy.sort((a, b) => b.name.localeCompare(a.name));
      case 'name_asc':
        return copy.sort((a, b) => a.name.localeCompare(b.name));
      case 'volume_desc':
      default:
        return copy.sort((a, b) => (b.volumeTon ?? 0) - (a.volumeTon ?? 0));
    }
  }, [collections, query, verifiedOnly, sort]);

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>Коллекции</Typography>
        {!loading && <Chip label={`Всего: ${filtered.length}`} variant="outlined" sx={{ borderColor: 'rgba(198, 38, 38, 0.25)' }} />}
      </Box>

      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center', mb: 2 }}>
        <TextField size="small" placeholder="Поиск коллекций" value={query} onChange={(e) => setQuery(e.target.value)} sx={{ minWidth: 240 }} />
        <Select size="small" value={sort} onChange={(e) => setSort(e.target.value as any)}>
          <MenuItem value={'volume_desc'}>Объём ⬇</MenuItem>
          <MenuItem value={'floor_desc'}>Floor ⬇</MenuItem>
          <MenuItem value={'floor_asc'}>Floor ⬆</MenuItem>
          <MenuItem value={'name_asc'}>Имя A-Z</MenuItem>
          <MenuItem value={'name_desc'}>Имя Z-A</MenuItem>
        </Select>
        <Chip
          label={verifiedOnly ? 'Verified: ON' : 'Verified: OFF'}
          color={verifiedOnly ? 'success' : 'default'}
          variant={verifiedOnly ? 'filled' : 'outlined'}
          onClick={() => setVerifiedOnly(v => !v)}
        />
      </Box>

      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)'
          }
        }}
      >
        {loading
          ? Array.from({ length: 6 }).map((_, idx) => (
              <Skeleton key={idx} variant="rectangular" height={220} sx={{ borderRadius: 2 }} />
            ))
          : filtered.map((col) => (
              <Box key={col.id} sx={{
                border: '1px solid rgba(198, 38, 38, 0.2)',
                borderRadius: 2,
                overflow: 'hidden',
                background: 'rgba(17,17,20,0.8)'
              }}>
                <Box sx={{ position: 'relative', height: 120, overflow: 'hidden' }}>
                  <img src={col.bannerUrl} alt={col.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5 }}>
                  <Avatar src={col.avatarUrl} alt={col.name} />
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontWeight: 600 }}>{col.name}</Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>Floor: {col.floorPriceTon} TON</Typography>
                  </Box>
                  {col.verified && <Chip size="small" color="success" label="Verified" />}
                </Box>
              </Box>
            ))}
      </Box>
    </Box>
  );
};

export default Collections;


