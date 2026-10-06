import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2d3436',
      light: '#4a5357',
      dark: '#1f2729',
      contrastText: '#f5f7f8',
    },
    secondary: {
      main: '#dfe6e9',
      light: '#eef3f5',
      dark: '#c7d3d8',
      contrastText: '#2d3436',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    text: {
      primary: '#2d3436',
      secondary: '#5b676a',
    },
    warning: {
      main: '#f59e0b',
      light: '#fbbf24',
      contrastText: '#111827',
    },
  },
  shape: {
    borderRadius: 16,
  },
  typography: {
    fontFamily: 'Inter, Roboto, Helvetica, Arial, sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 700,
    },
    h4: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 700,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08)',
        },
      },
    },
  },
});
