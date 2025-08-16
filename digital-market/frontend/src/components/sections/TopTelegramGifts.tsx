import React from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import Card from '../ui/Card';
import SectionHeader from '../ui/SectionHeader';
import { getTopGifts } from '../../services/api';
import { formatTon, formatPct } from '../../lib/format';
import type { TimeRange, Gift } from '../../types/domain';

const TopTelegramGifts: React.FC = () => {
  const [range, setRange] = React.useState<TimeRange>('1d');
  const [items, setItems] = React.useState<Gift[] | null>(null);

  React.useEffect(() => {
    let mounted = true;
    setItems(null);
    getTopGifts(range).then((res) => {
      if (mounted) setItems(res);
    });
    return () => { mounted = false; };
  }, [range]);

  return (
    <Box className="section">
      <SectionHeader 
        title="Топ Telegram подарков" 
        subtitle="По объему торгов" 
        range={range} 
        onRangeChange={setRange} 
      />
      
      <Card sx={{ p: 3 }}>
        {/* Header */}
        <Box className="leaderboard-grid" sx={{ 
          pb: 2, 
          mb: 2, 
          borderBottom: '1px solid var(--c-line)',
          fontWeight: 600,
          color: 'var(--c-muted)',
          fontSize: '14px',
        }}>
          <Box>#</Box>
          <Box>Название</Box>
          <Box sx={{ textAlign: 'right' }}>Floor</Box>
          <Box sx={{ textAlign: 'right' }}>Volume</Box>
          <Box sx={{ textAlign: 'right' }}>24ч</Box>
        </Box>

        {/* Items */}
        {items ? (
          items.slice(0, 10).map((item, index) => {
            const stats = item.stats[range];
            return (
              <Box key={item.id} className="leaderboard-grid" sx={{ 
                py: 2,
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.02)',
                  borderRadius: 1,
                },
              }}>
                <Box sx={{ color: 'var(--c-muted)', fontWeight: 500 }}>
                  {index + 1}
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar 
                    src={item.image} 
                    alt={item.name}
                    sx={{ width: 32, height: 32, borderRadius: 1 }}
                  />
                  <Box sx={{ minWidth: 0 }}>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontWeight: 600, 
                        color: 'var(--c-text)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {item.name}
                    </Typography>
                    {item.verified && (
                      <Typography variant="caption" sx={{ color: '#3b82f6', fontSize: '10px' }}>
                        ✓ Verified
                      </Typography>
                    )}
                  </Box>
                </Box>
                <Box sx={{ textAlign: 'right', fontWeight: 600, color: 'var(--c-text)' }}>
                  {formatTon(stats.floorTon)}
                </Box>
                <Box sx={{ textAlign: 'right', fontWeight: 600, color: 'var(--c-text)' }}>
                  {formatTon(stats.volumeTon)}
                </Box>
                <Box sx={{ 
                  textAlign: 'right', 
                  fontWeight: 600,
                  color: stats.changePct >= 0 ? 'var(--c-green)' : 'var(--c-red)',
                }}>
                  {formatPct(stats.changePct)}
                </Box>
              </Box>
            );
          })
        ) : (
          Array.from({ length: 10 }).map((_, i) => (
            <Box key={i} className="leaderboard-grid" sx={{ py: 2 }}>
              <Box sx={{ color: 'var(--c-muted)' }}>{i + 1}</Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ width: 32, height: 32, borderRadius: 1, bgcolor: 'var(--c-line)' }} />
                <Box sx={{ width: 120, height: 16, bgcolor: 'var(--c-line)', borderRadius: 1 }} />
              </Box>
              <Box sx={{ textAlign: 'right', width: 60, height: 16, bgcolor: 'var(--c-line)', borderRadius: 1 }} />
              <Box sx={{ textAlign: 'right', width: 80, height: 16, bgcolor: 'var(--c-line)', borderRadius: 1 }} />
              <Box sx={{ textAlign: 'right', width: 50, height: 16, bgcolor: 'var(--c-line)', borderRadius: 1 }} />
            </Box>
          ))
        )}
      </Card>
    </Box>
  );
};

export default TopTelegramGifts;


