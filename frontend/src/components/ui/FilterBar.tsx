import React from 'react';
import { Box, Chip, TextField, InputAdornment, Select, MenuItem } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

interface FilterBarProps {
  query: string;
  onQueryChange: (val: string) => void;
  sort: string;
  onSortChange: (val: string) => void;
  verifiedOnly: boolean;
  onToggleVerified: () => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ query, onQueryChange, sort, onSortChange, verifiedOnly, onToggleVerified }) => {
  return (
    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center', mb: 2 }}>
      <TextField
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        placeholder="Поиск"
        size="small"
        sx={{ minWidth: 240 }}
        InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon /></InputAdornment>) }}
      />

      <Select size="small" value={sort} onChange={(e) => onSortChange(e.target.value as string)}>
        <MenuItem value={'price_desc'}>Цена ⬇</MenuItem>
        <MenuItem value={'price_asc'}>Цена ⬆</MenuItem>
        <MenuItem value={'name_asc'}>Имя A-Z</MenuItem>
        <MenuItem value={'name_desc'}>Имя Z-A</MenuItem>
      </Select>

      <Chip
        label={verifiedOnly ? 'Verified: ON' : 'Verified: OFF'}
        color={verifiedOnly ? 'success' : 'default'}
        variant={verifiedOnly ? 'filled' : 'outlined'}
        onClick={onToggleVerified}
      />
    </Box>
  );
};

export default FilterBar;


