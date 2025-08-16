import React, { useMemo, useState } from 'react';
import { Box, Typography, Table, TableHead, TableRow, TableCell, TableBody, Chip } from '@mui/material';
import ActivityFilters, { ActivityType, Timeframe } from '../components/ui/ActivityFilters';

const rows = Array.from({ length: 40 }).map((_, i) => ({
  id: i + 1,
  type: ['sale', 'list', 'mint'][i % 3] as ActivityType,
  verified: i % 3 === 0,
  item: `RandArc #${1000 + i}`,
  priceTon: Number((Math.random() * 20 + 2).toFixed(2)),
  buyer: `@user_${i}`,
  minutesAgo: (i + 1) * 5
}));

const Activity: React.FC = () => {
  const [type, setType] = useState<ActivityType>('all');
  const [timeframe, setTimeframe] = useState<Timeframe>('24h');
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  const filtered = useMemo(() => {
    const maxMinutes = timeframe === '1h' ? 60 : timeframe === '6h' ? 360 : timeframe === '24h' ? 1440 : timeframe === '7d' ? 7 * 1440 : timeframe === '30d' ? 30 * 1440 : Infinity;
    return rows
      .filter(r => (type === 'all' ? true : r.type === type))
      .filter(r => verifiedOnly ? r.verified : true)
      .filter(r => r.minutesAgo <= maxMinutes)
      .slice(0, 30);
  }, [type, timeframe, verifiedOnly]);

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>Активность</Typography>

      <ActivityFilters
        type={type}
        onTypeChange={setType}
        timeframe={timeframe}
        onTimeframeChange={setTimeframe}
        verifiedOnly={verifiedOnly}
        onToggleVerified={() => setVerifiedOnly(v => !v)}
      />

      <Table size="small" sx={{ border: '1px solid rgba(198, 38, 38, 0.2)', borderRadius: 2, overflow: 'hidden' }}>
        <TableHead>
          <TableRow>
            <TableCell>Тип</TableCell>
            <TableCell>Item</TableCell>
            <TableCell>Цена</TableCell>
            <TableCell>Покупатель</TableCell>
            <TableCell>Когда</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filtered.map((r) => (
            <TableRow key={r.id}>
              <TableCell>
                <Chip size="small" label={r.type.toUpperCase()} variant="outlined" />
                {r.verified && <Chip size="small" color="success" label="Verified" sx={{ ml: 1 }} />}
              </TableCell>
              <TableCell>{r.item}</TableCell>
              <TableCell><Chip size="small" label={`${r.priceTon} TON`} /></TableCell>
              <TableCell>{r.buyer}</TableCell>
              <TableCell>{`${r.minutesAgo}m ago`}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default Activity;


