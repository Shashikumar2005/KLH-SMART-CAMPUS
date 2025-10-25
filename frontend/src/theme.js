import { createTheme } from '@mui/material/styles';

// Professional Campus Theme with Glassmorphism
export const getTheme = (mode) => createTheme({
  palette: {
    mode,
    primary: {
      main: mode === 'light' ? '#1976d2' : '#64b5f6',
      light: mode === 'light' ? '#4791db' : '#90caf9',
      dark: mode === 'light' ? '#115293' : '#42a5f5',
      contrastText: '#ffffff',
    },
    secondary: {
      main: mode === 'light' ? '#9c27b0' : '#ce93d8',
      light: mode === 'light' ? '#ba68c8' : '#e1bee7',
      dark: mode === 'light' ? '#7b1fa2' : '#ab47bc',
      contrastText: '#ffffff',
    },
    background: {
      default: mode === 'light' ? '#f0f2f5' : '#0a0e27',
      paper: mode === 'light' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(30, 30, 46, 0.85)',
      glass: mode === 'light' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(30, 30, 46, 0.7)',
    },
    text: {
      primary: mode === 'light' ? '#1a1a2e' : '#ffffff',
      secondary: mode === 'light' ? '#4a5568' : '#cbd5e0',
    },
    divider: mode === 'light' ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.08)',
    success: {
      main: mode === 'light' ? '#10b981' : '#34d399',
    },
    warning: {
      main: mode === 'light' ? '#f59e0b' : '#fbbf24',
    },
    error: {
      main: mode === 'light' ? '#ef4444' : '#f87171',
    },
    info: {
      main: mode === 'light' ? '#3b82f6' : '#60a5fa',
    },
  },
  typography: {
    fontFamily: '"Inter", "Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.75rem',
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontWeight: 700,
      fontSize: '2.25rem',
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.875rem',
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
      fontSize: '1.125rem',
      lineHeight: 1.5,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      letterSpacing: '0.02em',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
    },
  },
  shape: {
    borderRadius: 16,
  },
  shadows: mode === 'light' ? [
    'none',
    '0px 2px 8px rgba(99, 102, 241, 0.08)',
    '0px 4px 12px rgba(99, 102, 241, 0.1)',
    '0px 6px 16px rgba(99, 102, 241, 0.12)',
    '0px 8px 20px rgba(99, 102, 241, 0.14)',
    '0px 10px 24px rgba(99, 102, 241, 0.16)',
    '0px 12px 28px rgba(99, 102, 241, 0.18)',
    '0px 14px 32px rgba(99, 102, 241, 0.2)',
    '0px 16px 36px rgba(99, 102, 241, 0.22)',
    '0px 18px 40px rgba(99, 102, 241, 0.24)',
    '0px 20px 44px rgba(99, 102, 241, 0.26)',
    '0px 22px 48px rgba(99, 102, 241, 0.28)',
    '0px 24px 52px rgba(99, 102, 241, 0.3)',
    '0px 26px 56px rgba(99, 102, 241, 0.32)',
    '0px 28px 60px rgba(99, 102, 241, 0.34)',
    '0px 30px 64px rgba(99, 102, 241, 0.36)',
    '0px 32px 68px rgba(99, 102, 241, 0.38)',
    '0px 34px 72px rgba(99, 102, 241, 0.4)',
    '0px 36px 76px rgba(99, 102, 241, 0.42)',
    '0px 38px 80px rgba(99, 102, 241, 0.44)',
    '0px 40px 84px rgba(99, 102, 241, 0.46)',
    '0px 42px 88px rgba(99, 102, 241, 0.48)',
    '0px 44px 92px rgba(99, 102, 241, 0.5)',
    '0px 46px 96px rgba(99, 102, 241, 0.52)',
    '0px 48px 100px rgba(99, 102, 241, 0.54)',
  ] : [
    'none',
    '0px 2px 8px rgba(0, 0, 0, 0.4)',
    '0px 4px 12px rgba(0, 0, 0, 0.45)',
    '0px 6px 16px rgba(0, 0, 0, 0.5)',
    '0px 8px 20px rgba(0, 0, 0, 0.55)',
    '0px 10px 24px rgba(0, 0, 0, 0.6)',
    '0px 12px 28px rgba(0, 0, 0, 0.65)',
    '0px 14px 32px rgba(0, 0, 0, 0.7)',
    '0px 16px 36px rgba(0, 0, 0, 0.75)',
    '0px 18px 40px rgba(0, 0, 0, 0.8)',
    '0px 20px 44px rgba(0, 0, 0, 0.85)',
    '0px 22px 48px rgba(0, 0, 0, 0.9)',
    '0px 24px 52px rgba(0, 0, 0, 0.95)',
    '0px 26px 56px rgba(0, 0, 0, 1)',
    '0px 28px 60px rgba(0, 0, 0, 1)',
    '0px 30px 64px rgba(0, 0, 0, 1)',
    '0px 32px 68px rgba(0, 0, 0, 1)',
    '0px 34px 72px rgba(0, 0, 0, 1)',
    '0px 36px 76px rgba(0, 0, 0, 1)',
    '0px 38px 80px rgba(0, 0, 0, 1)',
    '0px 40px 84px rgba(0, 0, 0, 1)',
    '0px 42px 88px rgba(0, 0, 0, 1)',
    '0px 44px 92px rgba(0, 0, 0, 1)',
    '0px 46px 96px rgba(0, 0, 0, 1)',
    '0px 48px 100px rgba(0, 0, 0, 1)',
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: mode === 'light'
            ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            : 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
          backgroundAttachment: 'fixed',
          minHeight: '100vh',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '10px 24px',
          fontWeight: 600,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          textTransform: 'none',
        },
        contained: {
          boxShadow: mode === 'light'
            ? '0px 4px 12px rgba(99, 102, 241, 0.25)'
            : '0px 4px 12px rgba(100, 181, 246, 0.25)',
          '&:hover': {
            boxShadow: mode === 'light'
              ? '0px 8px 24px rgba(99, 102, 241, 0.35)'
              : '0px 8px 24px rgba(100, 181, 246, 0.35)',
            transform: 'translateY(-2px)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        },
        outlined: {
          borderWidth: 2,
          '&:hover': {
            borderWidth: 2,
            backgroundColor: mode === 'light'
              ? 'rgba(99, 102, 241, 0.04)'
              : 'rgba(100, 181, 246, 0.08)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          background: mode === 'light'
            ? 'rgba(255, 255, 255, 0.8)'
            : 'rgba(30, 30, 46, 0.8)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          border: mode === 'light'
            ? '1px solid rgba(255, 255, 255, 0.3)'
            : '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: mode === 'light'
            ? '0px 8px 32px rgba(99, 102, 241, 0.12)'
            : '0px 8px 32px rgba(0, 0, 0, 0.6)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-8px) scale(1.02)',
            boxShadow: mode === 'light'
              ? '0px 16px 48px rgba(99, 102, 241, 0.2)'
              : '0px 16px 48px rgba(0, 0, 0, 0.8)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          background: mode === 'light'
            ? 'rgba(255, 255, 255, 0.9)'
            : 'rgba(30, 30, 46, 0.9)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
        },
        elevation1: {
          boxShadow: mode === 'light'
            ? '0px 4px 20px rgba(99, 102, 241, 0.1)'
            : '0px 4px 20px rgba(0, 0, 0, 0.5)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            background: mode === 'light'
              ? 'rgba(255, 255, 255, 0.6)'
              : 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.3s ease',
            '&:hover': {
              background: mode === 'light'
                ? 'rgba(255, 255, 255, 0.8)'
                : 'rgba(255, 255, 255, 0.08)',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: mode === 'light' ? '#667eea' : '#64b5f6',
                borderWidth: 2,
              },
            },
            '&.Mui-focused': {
              background: mode === 'light'
                ? 'rgba(255, 255, 255, 0.9)'
                : 'rgba(255, 255, 255, 0.1)',
              '& .MuiOutlinedInput-notchedOutline': {
                borderWidth: 2,
                borderColor: mode === 'light' ? '#667eea' : '#64b5f6',
              },
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          borderRadius: 10,
          backdropFilter: 'blur(10px)',
          background: mode === 'light'
            ? 'rgba(99, 102, 241, 0.1)'
            : 'rgba(100, 181, 246, 0.15)',
          border: mode === 'light'
            ? '1px solid rgba(99, 102, 241, 0.2)'
            : '1px solid rgba(100, 181, 246, 0.2)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: mode === 'light'
            ? 'rgba(255, 255, 255, 0.8)'
            : 'rgba(30, 30, 46, 0.8)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          boxShadow: mode === 'light'
            ? '0px 4px 20px rgba(99, 102, 241, 0.1)'
            : '0px 4px 20px rgba(0, 0, 0, 0.5)',
          borderBottom: mode === 'light'
            ? '1px solid rgba(255, 255, 255, 0.3)'
            : '1px solid rgba(255, 255, 255, 0.1)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: mode === 'light'
            ? 'rgba(255, 255, 255, 0.9)'
            : 'rgba(30, 30, 46, 0.95)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRight: mode === 'light'
            ? '1px solid rgba(255, 255, 255, 0.3)'
            : '1px solid rgba(255, 255, 255, 0.1)',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          margin: '4px 12px',
          transition: 'all 0.2s ease',
          '&:hover': {
            background: mode === 'light'
              ? 'rgba(99, 102, 241, 0.08)'
              : 'rgba(100, 181, 246, 0.12)',
            transform: 'translateX(4px)',
          },
          '&.Mui-selected': {
            background: mode === 'light'
              ? 'rgba(99, 102, 241, 0.15)'
              : 'rgba(100, 181, 246, 0.2)',
            '&:hover': {
              background: mode === 'light'
                ? 'rgba(99, 102, 241, 0.2)'
                : 'rgba(100, 181, 246, 0.25)',
            },
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 20,
          background: mode === 'light'
            ? 'rgba(255, 255, 255, 0.95)'
            : 'rgba(30, 30, 46, 0.95)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backdropFilter: 'blur(10px)',
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          border: mode === 'light'
            ? '2px solid rgba(255, 255, 255, 0.8)'
            : '2px solid rgba(255, 255, 255, 0.2)',
          boxShadow: mode === 'light'
            ? '0px 4px 12px rgba(99, 102, 241, 0.2)'
            : '0px 4px 12px rgba(0, 0, 0, 0.4)',
        },
      },
    },
    MuiBadge: {
      styleOverrides: {
        badge: {
          boxShadow: mode === 'light'
            ? '0px 2px 8px rgba(99, 102, 241, 0.3)'
            : '0px 2px 8px rgba(100, 181, 246, 0.3)',
        },
      },
    },
  },
});
