// frontend/src/pages/Inventory.tsx

import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Switch,
  Stack,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import VisibilityIcon from '@mui/icons-material/Visibility';

interface InventoryItem {
  id: string;          // уникальный идентификатор штуки
  name: string;        // market_hash_name
  float: number;       // float value
  imageUrl: string;    // URL иконки
  steamPrice: number;  // цена Steam
  marketPrice: number; // цена Market
}

export default function Inventory() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'steam' | 'market'>('steam');

  useEffect(() => {
    async function load() {
      const res = await fetch('http://localhost:4001/inventory');
      const data = await res.json();
      // Преобразуем каждую штуку в отдельный элемент с уникальным id
      const detailed: InventoryItem[] = data.map((i: any, idx: number) => ({
        id: `${i.name}-${idx}`,
        name: i.name,
        float: i.float,
        imageUrl: i.imageUrl,
        steamPrice: +(Math.random() * 100).toFixed(2),
        marketPrice: +(Math.random() * 80).toFixed(2),
      }));
      setItems(detailed);
    }
    load();
  }, []);

  // Фильтрация и сортировка
  const filtered = items
    .filter(i => i.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      const key = sortBy === 'steam' ? 'steamPrice' : 'marketPrice';
      return b[key] - a[key];
    });

  return (
    <Box sx={{ p: 4, backgroundColor: '#0d0d0d', minHeight: '100vh' }}>
      <Typography variant="h4" gutterBottom sx={{ color: '#fff' }}>
        Предметы на продажу
      </Typography>

      {/* Поиск и сортировка */}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
        <TextField
          size="small"
          placeholder="Поиск"
          value={search}
          onChange={e => setSearch(e.target.value)}
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#888' }} /></InputAdornment> }}
          sx={{ backgroundColor: '#1e1e1e', borderRadius: 1 }}
        />

        <FormControl size="small" sx={{ minWidth: 140, backgroundColor: '#1e1e1e', borderRadius: 1 }}>
          <InputLabel sx={{ color: '#888' }}>Сортировка</InputLabel>
          <Select value={sortBy} label="Сортировка" onChange={e => setSortBy(e.target.value as any)} sx={{ color: '#fff' }}>
            <MenuItem value="steam">Цена Steam</MenuItem>
            <MenuItem value="market">Цена Market</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      {/* Кнопки действий */}
      <Box sx={{ mb: 2, display: 'flex', gap: 1 }}>
        <Button variant="contained" startIcon={<AddCircleOutlineIcon />}>Добавить всё</Button>
        <Button variant="outlined" startIcon={<ClearAllIcon />}>Очистить всё</Button>
      </Box>

      {/* Таблица с каждой штукой как отдельная строка */}
      <Paper sx={{ overflowX: 'auto', backgroundColor: '#1e1e1e' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: '#888' }}>Изображение</TableCell>
              <TableCell sx={{ color: '#888' }}>Название</TableCell>
              <TableCell sx={{ color: '#888' }}>Float</TableCell>
              <TableCell sx={{ color: '#888' }}>Цена Steam</TableCell>
              <TableCell sx={{ color: '#888' }}>Цена Market</TableCell>
              <TableCell sx={{ color: '#888' }}>Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map(item => (
              <TableRow key={item.id} hover>
                <TableCell>
                  <Box component="img" src={item.imageUrl} alt={item.name}
                    sx={{ width: 50, height: 50, borderRadius: 1 }}
                  />
                </TableCell>
                <TableCell sx={{ color: '#fff' }}>{item.name}</TableCell>
                <TableCell sx={{ color: '#fff' }}>{item.float.toFixed(2)}</TableCell>
                <TableCell sx={{ color: '#fff' }}>{item.steamPrice.toFixed(2)}₽</TableCell>
                <TableCell sx={{ color: '#fff' }}>{item.marketPrice.toFixed(2)}₽</TableCell>
                <TableCell>
                  <IconButton color="primary"><VisibilityIcon /></IconButton>
                  <IconButton color="secondary"><AddCircleOutlineIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}
