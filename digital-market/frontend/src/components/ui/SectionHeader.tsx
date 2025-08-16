import React from 'react';
import { Box, Typography } from '@mui/material';
import TabsRange from './TabsRange';
import type { TimeRange } from '../../types/domain';

type Props = {
  title: string;
  subtitle?: string;
  range?: TimeRange;
  onRangeChange?: (r: TimeRange) => void;
  actionsRight?: React.ReactNode;
};

const SectionHeader: React.FC<Props> = ({ title, subtitle, range, onRangeChange, actionsRight }) => {
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'baseline', 
        justifyContent: 'space-between', 
        mb: 3,
        pb: 3,
        borderBottom: '1px solid rgba(35, 36, 40, 0.6)',
      }}
    >
      <Box>
        <Typography variant="h5" sx={{ color: 'var(--c-text)', mb: subtitle ? 0.5 : 0 }}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" sx={{ color: 'var(--c-muted)' }}>
            {subtitle}
          </Typography>
        )}
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {range && onRangeChange && <TabsRange value={range} onChange={onRangeChange} />}
        {actionsRight}
      </Box>
    </Box>
  );
};

export default SectionHeader;


