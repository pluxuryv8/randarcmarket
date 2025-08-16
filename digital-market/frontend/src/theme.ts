import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#e11d48' }, // brand
    background: { default: '#0b0b0e', paper: '#101114' }, // bg, panel
  },
  typography: {
    fontFamily: ['"Inter"', '"Segoe UI"', 'Roboto', 'sans-serif'].join(','),
    h1: { 
      fontSize: 'clamp(22px, 2.2vw, 28px)',
      lineHeight: 1.15,
      fontWeight: 700,
      letterSpacing: '-0.01em',
      color: '#f3f4f6'
    },
    h2: { 
      fontSize: 'clamp(18px, 1.6vw, 22px)',
      lineHeight: 1.2,
      fontWeight: 600,
      letterSpacing: '-0.01em',
      color: '#f3f4f6'
    },
    h5: { 
      fontSize: 'clamp(16px, 1.2vw, 18px)',
      lineHeight: 1.3,
      fontWeight: 600,
      letterSpacing: '-0.01em',
      color: '#f3f4f6'
    },
    body1: { 
      fontSize: 'clamp(14px, 1vw, 16px)',
      lineHeight: 1.55,
      color: '#f3f4f6'
    },
    body2: { 
      fontSize: 'clamp(13px, 0.9vw, 15px)',
      lineHeight: 1.5,
      color: '#a1a1aa'
    },
  },
  shape: { borderRadius: 12 }, // Global border radius
  components: {
    MuiButton: {
      defaultProps: { variant: 'contained', color: 'primary' },
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 12,
          height: 36,
          padding: '0 12px',
          boxShadow: 'none',
          '&:hover': { boxShadow: 'none' },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#121318', // card
          border: '1px solid #232428', // line
          borderRadius: 12,
          boxShadow: '0 8px 30px rgba(0,0,0,0.35)',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            borderColor: 'rgba(225, 29, 72, 0.4)',
          },
        },
      },
    },
  },
});

export default theme;
