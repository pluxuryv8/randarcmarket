import { createTheme } from '@mui/material/styles';

// Тёмная тема с красными акцентами
const theme = createTheme({
  palette: {
    mode: 'dark',
    background: { default: '#121212', paper: '#1E1E1E' },
    primary:   { main: '#ff3b3f', contrastText: '#fff' },
    secondary: { main: '#e0e0e0' },
    text:      { primary: '#e0e0e0', secondary: '#bbbbbb' }
  },
  typography: {
    fontFamily: '"Montserrat", sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 600 },
    button: { textTransform: 'none' }
  },
  components: {
    MuiAppBar: {
      styleOverrides: { root: { backgroundColor: '#1E1E1E' } }
    },
    MuiCard: {
      styleOverrides: { root: {
        backgroundColor: '#1E1E1E',
        border: '1px solid #2A2A2A'
      } }
    },
    MuiButton: {
      defaultProps: { variant: 'contained', color: 'primary' },
      styleOverrides: {
        containedPrimary: {
          boxShadow: 'none',
          '&:hover': { backgroundColor: '#e22a2e' }
        }
      }
    }
  }
});

export default theme;
