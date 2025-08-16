import React from 'react';
import { Box, Chip, Select, MenuItem, SelectChangeEvent } from '@mui/material';

export type ActivityType = 'all' | 'sale' | 'list' | 'mint';
export type Timeframe = '1h' | '6h' | '24h' | '7d' | '30d' | 'all';

interface ActivityFiltersProps {
  type: ActivityType;
  onTypeChange: (t: ActivityType) => void;
  timeframe: Timeframe;
  onTimeframeChange: (t: Timeframe) => void;
  verifiedOnly: boolean;
  onToggleVerified: () => void;
}

const ActivityFilters: React.FC<ActivityFiltersProps> = ({ type, onTypeChange, timeframe, onTimeframeChange, verifiedOnly, onToggleVerified }) => {
  return (
    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center', mb: 2 }}>
      <Chip
        label={verifiedOnly ? 'Verified: ON' : 'Verified: OFF'}
        color={verifiedOnly ? 'success' : 'default'}
        variant={verifiedOnly ? 'filled' : 'outlined'}
        onClick={onToggleVerified}
      />

      <Select size="small" value={type} onChange={(e: SelectChangeEvent<ActivityType>) => onTypeChange(e.target.value as ActivityType)}>
        <MenuItem value={'all'}>Все события</MenuItem>
        <MenuItem value={'sale'}>Продажи</MenuItem>
        <MenuItem value={'list'}>Листинги</MenuItem>
        <MenuItem value={'mint'}>Минты</MenuItem>
      </Select>

      <Select size="small" value={timeframe} onChange={(e: SelectChangeEvent<Timeframe>) => onTimeframeChange(e.target.value as Timeframe)}>
        <MenuItem value={'1h'}>1ч</MenuItem>
        <MenuItem value={'6h'}>6ч</MenuItem>
        <MenuItem value={'24h'}>24ч</MenuItem>
        <MenuItem value={'7d'}>7д</MenuItem>
        <MenuItem value={'30d'}>30д</MenuItem>
        <MenuItem value={'all'}>Все</MenuItem>
      </Select>
    </Box>
  );
};

export default ActivityFilters;


