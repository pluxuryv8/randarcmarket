import React from 'react';
import { Box, Typography, Divider, TextField, Select, MenuItem, Button, FormControlLabel, Checkbox } from '@mui/material';
import { NFTCollection } from '../../types/nft';

interface SideFilterPanelProps {
  collections: NFTCollection[];
  collectionId: string | null;
  onCollectionChange: (id: string | null) => void;
  minPrice: number | null;
  maxPrice: number | null;
  onMinPriceChange: (val: number | null) => void;
  onMaxPriceChange: (val: number | null) => void;
  verifiedOnly: boolean;
  onToggleVerified: () => void;
  onReset: () => void;
}

const SideFilterPanel: React.FC<SideFilterPanelProps> = ({
  collections,
  collectionId,
  onCollectionChange,
  minPrice,
  maxPrice,
  onMinPriceChange,
  onMaxPriceChange,
  verifiedOnly,
  onToggleVerified,
  onReset
}) => {
  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value.trim();
    onMinPriceChange(v === '' ? null : Number(v));
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value.trim();
    onMaxPriceChange(v === '' ? null : Number(v));
  };

  return (
    <Box sx={{
      border: '1px solid rgba(198, 38, 38, 0.2)',
      borderRadius: 2,
      p: 2,
      background: 'rgba(17,17,20,0.8)',
      backdropFilter: 'blur(12px)'
    }}>
      <Typography sx={{ fontWeight: 700, mb: 1 }}>Фильтры</Typography>
      <Divider sx={{ borderColor: 'rgba(198,38,38,0.25)', mb: 2 }} />

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        <Box>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>Коллекция</Typography>
          <Select
            size="small"
            fullWidth
            value={collectionId ?? ''}
            onChange={(e) => onCollectionChange((e.target.value as string) || null)}
            displayEmpty
          >
            <MenuItem value=""><em>Все коллекции</em></MenuItem>
            {collections.map((c) => (
              <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
            ))}
          </Select>
        </Box>

        <Box>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>Цена, TON</Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField size="small" type="number" placeholder="Мин" value={minPrice ?? ''} onChange={handleMinChange} />
            <TextField size="small" type="number" placeholder="Макс" value={maxPrice ?? ''} onChange={handleMaxChange} />
          </Box>
        </Box>

        <FormControlLabel
          control={<Checkbox checked={verifiedOnly} onChange={onToggleVerified} />}
          label={<Typography variant="body2">Только верифицированные</Typography>}
        />

        <Box sx={{ display: 'flex', gap: 1, pt: 1 }}>
          <Button variant="outlined" fullWidth onClick={onReset}>Сбросить</Button>
        </Box>
      </Box>
    </Box>
  );
};

export default SideFilterPanel;


