import React, { useState, useEffect, useRef } from 'react';
import { Box, InputBase, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';

interface SearchBarProps {
  placeholder?: string;
}

const SearchBarNew: React.FC<SearchBarProps> = ({ placeholder = 'Поиск...' }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    debounceTimeout.current = setTimeout(() => {
      // Optional: perform search as user types, or just wait for submit
    }, 300);

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [query]);

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSearch}
      sx={{
        display: 'flex',
        alignItems: 'center',
        bgcolor: '#121318',
        borderRadius: 12,
        p: 0.5,
        border: '1px solid rgba(42,42,42,0.7)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
        '&:focus-within': {
          borderColor: '#e11d48',
          boxShadow: '0 0 0 2px rgba(225, 29, 72, 0.3)',
        },
      }}
    >
      <InputBase
        sx={{ ml: 1.5, flex: 1, color: '#f3f4f6' }}
        placeholder={placeholder}
        inputProps={{ 'aria-label': placeholder }}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <IconButton type="submit" sx={{ p: '8px' }} aria-label="search">
        <SearchIcon sx={{ color: '#a1a1aa' }} />
      </IconButton>
    </Box>
  );
};

export default SearchBarNew;
