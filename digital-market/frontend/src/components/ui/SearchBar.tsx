import React, { useState, useEffect, useRef } from 'react';
import { Box, InputBase, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';

interface SearchBarProps {
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ placeholder = 'Поиск...' }) => {
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
        height: 40,
        bgcolor: '#0f1013',
        borderRadius: 12,
        border: '1px solid var(--c-line)',
        transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
        '&:focus-within': {
          borderColor: 'var(--c-brand)',
          boxShadow: '0 0 0 2px rgba(225, 29, 72, 0.2)',
        },
      }}
    >
      <InputBase
        sx={{ 
          ml: 2, 
          flex: 1, 
          color: 'var(--c-text)',
          fontSize: '14px',
          '& input::placeholder': {
            color: 'var(--c-muted)',
            opacity: 1,
          },
        }}
        placeholder={placeholder}
        inputProps={{ 'aria-label': placeholder }}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <IconButton 
        type="submit" 
        sx={{ 
          p: 1, 
          mr: 0.5,
          color: 'var(--c-muted)',
          '&:hover': {
            color: 'var(--c-text)',
          },
        }} 
        aria-label="search"
      >
        <SearchIcon sx={{ fontSize: 18 }} />
      </IconButton>
    </Box>
  );
};

export default SearchBar;
