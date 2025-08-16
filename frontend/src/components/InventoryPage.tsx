import React, { useEffect, useState } from 'react';
import { Box, Typography, TextField, InputAdornment, Button, Paper, Table, TableHead, TableRow, TableCell, TableBody, CircularProgress } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

interface Item { id: string; name: string; float: number; imageUrl: string; steamPrice: number; marketPrice: number; }

export default function InventoryPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/inventory')
      .then(r => r.json())
      .then((data: any[]) => setItems(data.map((i, idx) => ({
        id: `${i.name}-${idx}`,
        name: i.name,
        float: i.float ?? 0,
        imageUrl: i.imageUrl,
        steamPrice: +(Math.random()*100).toFixed(2),
        marketPrice: +(Math.random()*80).toFixed(2),
      }))))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = items.filter(i => i.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <Box sx={{ p: 4, backgroundColor: 'var(--color-bg-panel)', minHeight: '100vh' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ color: '#fff' }}>Инвентарь ({filtered.length})</Typography>
        <Button className="button-primary">Оценить всё</Button>
      </Box>
      <Box sx={{ mb: 2 }}>
        <TextField
          size="small"
          placeholder="Поиск..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          InputProps={{
            startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#888' }} /></InputAdornment>
          }}
          sx={{ backgroundColor: 'var(--color-bg)', borderRadius: 1, width: 300 }}
        />
      </Box>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress color="inherit"/></Box>
      ) : (
        <Paper sx={{ backgroundColor: 'var(--color-bg)', overflowX: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: '#888' }}>Предмет</TableCell>
                <TableCell sx={{ color: '#888' }}>Float</TableCell>
                <TableCell sx={{ color: '#888' }}>Цена Steam</TableCell>
                <TableCell sx={{ color: '#888' }}>Цена Market</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map(it => (
                <TableRow key={it.id} hover sx={{ '&:hover': { backgroundColor: '#202020' } }}>
                  <TableCell sx={{ display: 'flex', alignItems: 'center', py: 1 }}>
                    <img src={it.imageUrl} alt="" className="inventory-item-image" />
                    <Typography sx={{ color: '#fff' }}>{it.name}</Typography>
                  </TableCell>
                  <TableCell sx={{ color: '#fff' }}>{it.float.toFixed(2)}</TableCell>
                  <TableCell sx={{ color: '#fff' }}>{it.steamPrice.toFixed(2)}₽</TableCell>
                  <TableCell sx={{ color: '#fff' }}>{it.marketPrice.toFixed(2)}₽</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}
    </Box>
  );
}
