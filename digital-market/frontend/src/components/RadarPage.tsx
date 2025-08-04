import React from 'react';
import { Box } from '@mui/material';

const demo = [
  { id:1, name:'AK-47 | Redline', price:12000, discount:15, image:'ak_redline.png' },
  { id:2, name:'AWP | Dragon Lore', price:150000, discount:5, image:'awp_dlore.png' },
];

export default function RadarPage() {
  return (
    <Box sx={{ display: 'flex', p: 4, backgroundColor: 'var(--color-bg-panel)' }}>
      <Box sx={{ width: 240, pr: 3, display: { xs: 'none', lg: 'block' } }}>
        <h3 className="filters-title">Фильтры</h3>
        {/* сюда чекбоксы/слайдеры */}
      </Box>
      <Box sx={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2,1fr)', md: 'repeat(3,1fr)', lg: 'repeat(4,1fr)' },
        gap: 3
      }}>
        {demo.map(it => (
          <Box key={it.id} sx={{
            backgroundColor: 'var(--color-bg)', borderRadius: 2, overflow: 'hidden',
            '&:hover': { boxShadow: `0 0 8px var(--color-accent)` }
          }}>
            <img src={it.image} alt={it.name} className="radar-item-image" />
            <Box sx={{ p: 2 }}>
              <h4 className="radar-item-title">{it.name}</h4>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="radar-item-price">${it.price}</span>
                {it.discount > 0 && <span className="radar-item-discount">-{it.discount}%</span>}
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
