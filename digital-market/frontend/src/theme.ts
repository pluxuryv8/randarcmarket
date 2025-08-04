import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    background: { default: '#0a0a0a', paper: '#1a1a1a' },
    primary: { main: '#d13333', contrastText: '#fff' },
    text: { primary: '#e0e0e0', secondary: '#aaa' },
  },
  typography: {
    fontFamily: ['"Segoe UI"', 'Roboto', 'sans-serif'].join(','),
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
          borderRadius: 4,
          padding: '8px 24px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(26,26,26,0.75)',
          backdropFilter: 'blur(4px)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
          transition: 'transform .2s, box-shadow .2s',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 16px rgba(0,0,0,0.7)',
          },
        },
      },
    },
  },
});

export default theme;
