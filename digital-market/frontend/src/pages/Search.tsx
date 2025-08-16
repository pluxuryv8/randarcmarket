import React from 'react';
import { useLocation } from 'react-router-dom';
import { Typography } from '@mui/material';

const useQuery = () => new URLSearchParams(useLocation().search);

const Search: React.FC = ()=>{
	const q = useQuery().get('q') || '';
	return <Typography variant="h6">Поиск: {q}</Typography>;
};

export default Search;


