import React from 'react';
import { Box, Typography } from '@mui/material';
import { formatPct } from '../../lib/format';

const StatBadge: React.FC<{ value: number }> = ({ value }) => {
  const positive = value >= 0;
  return (
    <Box sx={{
      display: 'inline-flex',
      alignItems: 'center',
      px: 1,
      py: 0.5,
      borderRadius: 1,
      fontSize: 12,
      fontWeight: 600,
      color: positive ? 'var(--c-green)' : 'var(--c-red)',
      border: `1px solid ${positive ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
      background: positive ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
    }}>
      {positive ? '▲' : '▼'} {formatPct(value)}
    </Box>
  );
};

export default StatBadge;


