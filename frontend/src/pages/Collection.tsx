import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Chip, Avatar, Skeleton } from '@mui/material';
import NFTCard from '../components/ui/NFTCard';
import VirtualGrid from '../components/ui/VirtualGrid';
import { fetchCollections, fetchMarketItems } from '../services/nft';
import { NFTCollection, NFTItem } from '../types/nft';

const Collection: React.FC = () => {
  const { id } = useParams();
  const [collection, setCollection] = useState<NFTCollection | null>(null);
  const [items, setItems] = useState<NFTItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchCollections(), fetchMarketItems()]).then(([cols, its]) => {
      const col = cols.find((c) => c.id === id) || null;
      setCollection(col);
      setItems(its.filter((i) => i.collectionId === id));
      setLoading(false);
    });
  }, [id]);

  return (
    <Box>
      {loading || !collection ? (
        <Skeleton variant="rectangular" height={220} sx={{ borderRadius: 2, mb: 2 }} />
      ) : (
        <Box sx={{ border: '1px solid rgba(198, 38, 38, 0.2)', borderRadius: 2, overflow: 'hidden', mb: 3 }}>
          <Box sx={{ position: 'relative', height: 160 }}>
            <img src={collection.bannerUrl} alt={collection.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <Avatar src={collection.avatarUrl} sx={{ position: 'absolute', bottom: -24, left: 24, width: 64, height: 64, border: '3px solid #111114' }} />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, pt: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>{collection.name}</Typography>
            {collection.verified && <Chip size="small" color="success" label="Verified" />}
            <Box sx={{ flex: 1 }} />
            <Chip variant="outlined" label={`Floor: ${collection.floorPriceTon} TON`} />
            <Chip variant="outlined" label={`Volume: ${collection.volumeTon} TON`} />
          </Box>
        </Box>
      )}

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
          items={items}
          renderItem={(nft) => (
            <NFTCard item={nft} />
          )}
          extraItemHeight={110}
          gap={16}
        />
      )}
    </Box>
  );
};

export default Collection;


