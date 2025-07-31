// frontend/src/theme.ts
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#121212',
      paper:   '#1E1E1E',
    },
    primary: {
      main:         '#E53935',   // насыщенный красный
      contrastText: '#FFFFFF',
    },
    secondary: {
      main:         '#FF8F00',   // теплый оранжево-золотой акцент
      contrastText: '#FFFFFF',
    },
    text: {
      primary:   '#E0E0E0',
      secondary: '#B0B0B0',
    },
  },
  typography: {
    fontFamily: ['Roboto','Helvetica','Arial','sans-serif'].join(','),
    h1: { fontWeight: 700, letterSpacing: '-0.02em' },
    h4: { fontWeight: 600 },
    button: { textTransform: 'none' },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow:    '0 4px 8px rgba(0,0,0,0.3)',
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#1F1F1F',
          boxShadow:       '0 4px 12px rgba(0,0,0,0.4)',
          borderRadius:    12,
        }
      }
    }
  }
});

export default theme;