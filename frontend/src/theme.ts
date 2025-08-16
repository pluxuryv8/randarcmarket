import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    // глубоко-тёмный фон, светлая типографика, акценты — прохладные (в духе TON)
    background: { default: '#0B0B0C', paper: '#111114' },
    primary: { main: '#21A0F0', contrastText: '#fff' }, // основной акцент — голубой/циан
    secondary: { main: '#7C5CFF' }, // фиолетовый дополнительный
    // тонкие красные — как фирменный подпороговый акцент RandArc
    error: { main: '#C62626' },
    text: { primary: '#E7E7EA', secondary: '#A7A7AE' },
  },
  typography: {
    fontFamily: ['Inter', 'Roboto', 'system-ui', 'sans-serif'].join(','),
    h1: {
      fontWeight: 700,
      fontSize: '3rem',
      '@media (max-width:600px)': { fontSize: '2rem' },
    },
    h6: { color: '#ccc' },
  },
  components: {
    MuiButton: {
      defaultProps: { variant: 'contained', color: 'primary' },
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 10,
          padding: '10px 20px',
          border: '1px solid rgba(198, 38, 38, 0.25)', // тонкая красная обводка
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(17,17,20,0.8)',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.55)',
          transition: 'transform .2s, box-shadow .2s',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 24px 60px rgba(0,0,0,0.7)',
            borderColor: 'rgba(198, 38, 38, 0.35)'
          },
          border: '1px solid rgba(198, 38, 38, 0.2)', // тонкая красная обводка для фирменности
          borderRadius: 16,
        },
      },
    },
  },
});

export default theme;
