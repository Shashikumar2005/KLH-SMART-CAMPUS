import { createTheme } from '@mui/material/styles';

// Professional Campus Theme Generator
export const getTheme = (mode) => createTheme({
  palette: {
    mode,
    primary: {
      main: mode === 'light' ? '#1976d2' : '#42a5f5',
      light: mode === 'light' ? '#4791db' : '#64b5f6',
      dark: mode === 'light' ? '#115293' : '#1e88e5',
      contrastText: '#ffffff',
    },
    secondary: {
      main: mode === 'light' ? '#dc004e' : '#f48fb1',
      light: mode === 'light' ? '#e33371' : '#f6a5c0',
      dark: mode === 'light' ? '#9a0036' : '#aa647b',
      contrastText: '#ffffff',
    },
    background: {
      default: mode === 'light' ? '#f5f5f5' : '#121212',
      paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
    },
    text: {
      primary: mode === 'light' ? '#212121' : '#ffffff',
      secondary: mode === 'light' ? '#757575' : '#b0b0b0',
    },
    divider: mode === 'light' ? '#e0e0e0' : '#2c2c2c',
    success: {
      main: mode === 'light' ? '#2e7d32' : '#66bb6a',
    },
    warning: {
      main: mode === 'light' ? '#ed6c02' : '#ffa726',
    },
    error: {
      main: mode === 'light' ? '#d32f2f' : '#f44336',
    },
    info: {
      main: mode === 'light' ? '#0288d1' : '#29b6f6',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 600,
      fontSize: '2.5rem',
      lineHeight: 1.2,
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
      lineHeight: 1.3,
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
      lineHeight: 1.4,
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.4,
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.5,
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  shadows: mode === 'light' ? [
    'none',
    '0px 2px 4px rgba(0,0,0,0.05)',
    '0px 4px 8px rgba(0,0,0,0.08)',
    '0px 6px 12px rgba(0,0,0,0.1)',
    '0px 8px 16px rgba(0,0,0,0.12)',
    '0px 10px 20px rgba(0,0,0,0.14)',
    '0px 12px 24px rgba(0,0,0,0.16)',
    '0px 14px 28px rgba(0,0,0,0.18)',
    '0px 16px 32px rgba(0,0,0,0.2)',
    '0px 18px 36px rgba(0,0,0,0.22)',
    '0px 20px 40px rgba(0,0,0,0.24)',
    '0px 22px 44px rgba(0,0,0,0.26)',
    '0px 24px 48px rgba(0,0,0,0.28)',
    '0px 26px 52px rgba(0,0,0,0.3)',
    '0px 28px 56px rgba(0,0,0,0.32)',
    '0px 30px 60px rgba(0,0,0,0.34)',
    '0px 32px 64px rgba(0,0,0,0.36)',
    '0px 34px 68px rgba(0,0,0,0.38)',
    '0px 36px 72px rgba(0,0,0,0.4)',
    '0px 38px 76px rgba(0,0,0,0.42)',
    '0px 40px 80px rgba(0,0,0,0.44)',
    '0px 42px 84px rgba(0,0,0,0.46)',
    '0px 44px 88px rgba(0,0,0,0.48)',
    '0px 46px 92px rgba(0,0,0,0.5)',
    '0px 48px 96px rgba(0,0,0,0.52)',
  ] : [
    'none',
    '0px 2px 4px rgba(0,0,0,0.3)',
    '0px 4px 8px rgba(0,0,0,0.35)',
    '0px 6px 12px rgba(0,0,0,0.4)',
    '0px 8px 16px rgba(0,0,0,0.45)',
    '0px 10px 20px rgba(0,0,0,0.5)',
    '0px 12px 24px rgba(0,0,0,0.55)',
    '0px 14px 28px rgba(0,0,0,0.6)',
    '0px 16px 32px rgba(0,0,0,0.65)',
    '0px 18px 36px rgba(0,0,0,0.7)',
    '0px 20px 40px rgba(0,0,0,0.75)',
    '0px 22px 44px rgba(0,0,0,0.8)',
    '0px 24px 48px rgba(0,0,0,0.85)',
    '0px 26px 52px rgba(0,0,0,0.9)',
    '0px 28px 56px rgba(0,0,0,0.95)',
    '0px 30px 60px rgba(0,0,0,1)',
    '0px 32px 64px rgba(0,0,0,1)',
    '0px 34px 68px rgba(0,0,0,1)',
    '0px 36px 72px rgba(0,0,0,1)',
    '0px 38px 76px rgba(0,0,0,1)',
    '0px 40px 80px rgba(0,0,0,1)',
    '0px 42px 84px rgba(0,0,0,1)',
    '0px 44px 88px rgba(0,0,0,1)',
    '0px 46px 92px rgba(0,0,0,1)',
    '0px 48px 96px rgba(0,0,0,1)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
          fontWeight: 500,
          transition: 'all 0.2s ease-in-out',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 4px 12px rgba(25, 118, 210, 0.3)',
            transform: 'translateY(-1px)',
          },
        },
        outlined: {
          borderWidth: 1.5,
          '&:hover': {
            borderWidth: 1.5,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          transition: 'all 0.3s ease-in-out',
          border: mode === 'light' ? '1px solid #e0e0e0' : '1px solid #2c2c2c',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: mode === 'light' 
              ? '0px 8px 24px rgba(0,0,0,0.12)' 
              : '0px 8px 24px rgba(0,0,0,0.6)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        elevation1: {
          boxShadow: mode === 'light' 
            ? '0px 2px 8px rgba(0,0,0,0.08)' 
            : '0px 2px 8px rgba(0,0,0,0.4)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: mode === 'light' ? '#1976d2' : '#42a5f5',
              },
            },
            '&.Mui-focused': {
              '& .MuiOutlinedInput-notchedOutline': {
                borderWidth: 2,
              },
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          borderRadius: 6,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: mode === 'light' 
            ? '0px 1px 3px rgba(0,0,0,0.08)' 
            : '0px 1px 3px rgba(0,0,0,0.5)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: mode === 'light' ? '1px solid #e0e0e0' : '1px solid #2c2c2c',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin: '4px 8px',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            backgroundColor: mode === 'light' 
              ? 'rgba(25, 118, 210, 0.08)' 
              : 'rgba(66, 165, 245, 0.12)',
          },
          '&.Mui-selected': {
            backgroundColor: mode === 'light' 
              ? 'rgba(25, 118, 210, 0.12)' 
              : 'rgba(66, 165, 245, 0.16)',
            '&:hover': {
              backgroundColor: mode === 'light' 
                ? 'rgba(25, 118, 210, 0.16)' 
                : 'rgba(66, 165, 245, 0.2)',
            },
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 12,
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});
