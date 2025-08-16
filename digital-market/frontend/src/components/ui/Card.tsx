import React from 'react';
import { Card as MuiCard, CardProps } from '@mui/material';

const Card: React.FC<CardProps> = ({ sx, ...props }) => {
  return (
    <MuiCard
      sx={{
        background: 'var(--c-card)',
        border: '1px solid var(--c-line)',
        borderRadius: 12,
        boxShadow: 'var(--shadow-card)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
        willChange: 'transform',
        '&:hover': {
          transform: 'translateY(-2px)',
          borderColor: 'rgba(225, 29, 72, 0.4)',
        },
        ...sx,
      }}
      {...props}
    />
  );
};

export default Card;


