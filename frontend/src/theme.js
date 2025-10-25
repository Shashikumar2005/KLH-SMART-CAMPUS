import { createTheme } from '@mui/material/styles';

// College Branding Colors with Section-specific Palette
export const getTheme = (mode) => createTheme({
  palette: {
    mode,
    // Primary: Minimal Dark Gray/Slate
    primary: {
      main: mode === 'light' ? '#0f172a' : '#60a5fa',
      light: mode === 'light' ? '#334155' : '#93c5fd',
      dark: mode === 'light' ? '#020617' : '#3b82f6',
      contrastText: '#ffffff',
    },
    // Secondary: Neutral Gray
    secondary: {
      main: mode === 'light' ? '#64748b' : '#94a3b8',
      light: mode === 'light' ? '#94a3b8' : '#cbd5e1',
      dark: mode === 'light' ? '#475569' : '#64748b',
      contrastText: '#ffffff',
    },
    // Background with subtle patterns
    background: {
      default: mode === 'light' ? '#f8fafc' : '#0f172a',
      paper: mode === 'light' ? '#ffffff' : '#1e293b',
      glass: mode === 'light' ? 'rgba(255, 255, 255, 0.98)' : 'rgba(30, 41, 59, 0.98)',
    },
    text: {
      primary: mode === 'light' ? '#0f172a' : '#f1f5f9',
      secondary: mode === 'light' ? '#475569' : '#cbd5e1',
    },
    divider: mode === 'light' ? 'rgba(0, 0, 0, 0.06)' : 'rgba(255, 255, 255, 0.06)',
    // Section-specific colors
    events: {
      main: mode === 'light' ? '#8b5cf6' : '#a78bfa',
      light: mode === 'light' ? '#a78bfa' : '#c4b5fd',
      dark: mode === 'light' ? '#7c3aed' : '#8b5cf6',
      contrastText: '#ffffff',
    },
    clubs: {
      main: mode === 'light' ? '#ec4899' : '#f472b6',
      light: mode === 'light' ? '#f472b6' : '#f9a8d4',
      dark: mode === 'light' ? '#db2777' : '#ec4899',
      contrastText: '#ffffff',
    },
    polls: {
      main: mode === 'light' ? '#14b8a6' : '#5eead4',
      light: mode === 'light' ? '#2dd4bf' : '#99f6e4',
      dark: mode === 'light' ? '#0f766e' : '#14b8a6',
      contrastText: '#ffffff',
    },
    lostFound: {
      main: mode === 'light' ? '#f59e0b' : '#fbbf24',
      light: mode === 'light' ? '#fbbf24' : '#fde047',
      dark: mode === 'light' ? '#d97706' : '#f59e0b',
      contrastText: '#ffffff',
    },
    feedback: {
      main: mode === 'light' ? '#06b6d4' : '#22d3ee',
      light: mode === 'light' ? '#22d3ee' : '#67e8f9',
      dark: mode === 'light' ? '#0891b2' : '#06b6d4',
      contrastText: '#ffffff',
    },
    announcements: {
      main: mode === 'light' ? '#8b5cf6' : '#a78bfa',
      light: mode === 'light' ? '#a78bfa' : '#c4b5fd',
      dark: mode === 'light' ? '#7c3aed' : '#8b5cf6',
      contrastText: '#ffffff',
    },
    // Status colors
    success: {
      main: mode === 'light' ? '#10b981' : '#34d399',
      light: mode === 'light' ? '#34d399' : '#6ee7b7',
      dark: mode === 'light' ? '#059669' : '#10b981',
    },
    warning: {
      main: mode === 'light' ? '#f59e0b' : '#fbbf24',
      light: mode === 'light' ? '#fbbf24' : '#fde047',
      dark: mode === 'light' ? '#d97706' : '#f59e0b',
    },
    error: {
      main: mode === 'light' ? '#ef4444' : '#f87171',
      light: mode === 'light' ? '#f87171' : '#fca5a5',
      dark: mode === 'light' ? '#dc2626' : '#ef4444',
    },
    info: {
      main: mode === 'light' ? '#3b82f6' : '#60a5fa',
      light: mode === 'light' ? '#60a5fa' : '#93c5fd',
      dark: mode === 'light' ? '#2563eb' : '#3b82f6',
    },
  },
  typography: {
    fontFamily: '"Inter", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", sans-serif',
    h1: {
      fontWeight: 800,
      fontSize: '2.5rem',
      lineHeight: 1.2,
      letterSpacing: '-0.025em',
      color: mode === 'light' ? '#0f172a' : '#f1f5f9',
    },
    h2: {
      fontWeight: 700,
      fontSize: '2rem',
      lineHeight: 1.3,
      letterSpacing: '-0.02em',
      color: mode === 'light' ? '#0f172a' : '#f1f5f9',
    },
    h3: {
      fontWeight: 700,
      fontSize: '1.75rem',
      lineHeight: 1.35,
      letterSpacing: '-0.015em',
      color: mode === 'light' ? '#0f172a' : '#f1f5f9',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.4,
      color: mode === 'light' ? '#1e293b' : '#e2e8f0',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.5,
      color: mode === 'light' ? '#1e293b' : '#e2e8f0',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.125rem',
      lineHeight: 1.5,
      color: mode === 'light' ? '#334155' : '#cbd5e1',
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.75,
      color: mode === 'light' ? '#475569' : '#cbd5e1',
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
      lineHeight: 1.57,
      color: mode === 'light' ? '#64748b' : '#94a3b8',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
      color: mode === 'light' ? '#475569' : '#cbd5e1',
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
      color: mode === 'light' ? '#64748b' : '#94a3b8',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      fontSize: '0.9375rem',
      letterSpacing: '0.015em',
    },
    caption: {
      fontSize: '0.75rem',
      lineHeight: 1.66,
      color: mode === 'light' ? '#64748b' : '#94a3b8',
    },
    overline: {
      fontSize: '0.75rem',
      fontWeight: 600,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      color: mode === 'light' ? '#64748b' : '#94a3b8',
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
            ? '#f8fafc'
            : '#0f172a',
          backgroundAttachment: 'fixed',
          minHeight: '100vh',
          scrollBehavior: 'smooth',
        },
        '*': {
          scrollBehavior: 'smooth',
        },
        '*::-webkit-scrollbar': {
          width: '10px',
          height: '10px',
        },
        '*::-webkit-scrollbar-track': {
          background: mode === 'light' ? '#f1f5f9' : '#1e293b',
          borderRadius: '10px',
        },
        '*::-webkit-scrollbar-thumb': {
          background: mode === 'light'
            ? '#cbd5e1'
            : '#475569',
          borderRadius: '10px',
          border: mode === 'light' ? '2px solid #f1f5f9' : '2px solid #1e293b',
          '&:hover': {
            background: mode === 'light'
              ? '#94a3b8'
              : '#64748b',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '10px 24px',
          fontWeight: 600,
          fontSize: '0.9375rem',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          textTransform: 'none',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '0',
            height: '0',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.3)',
            transform: 'translate(-50%, -50%)',
            transition: 'width 0.6s, height 0.6s',
          },
          '&:active::before': {
            width: '300px',
            height: '300px',
          },
          '&:active': {
            transform: 'scale(0.97)',
          },
        },
        contained: {
          boxShadow: mode === 'light'
            ? '0px 2px 8px rgba(0, 0, 0, 0.15)'
            : '0px 4px 12px rgba(96, 165, 250, 0.25)',
          '&:hover': {
            boxShadow: mode === 'light'
              ? '0px 8px 24px rgba(0, 0, 0, 0.25)'
              : '0px 8px 24px rgba(96, 165, 250, 0.35)',
            transform: 'translateY(-3px) scale(1.02)',
          },
        },
        outlined: {
          borderWidth: 2,
          '&:hover': {
            borderWidth: 2,
            backgroundColor: mode === 'light'
              ? 'rgba(15, 23, 42, 0.04)'
              : 'rgba(96, 165, 250, 0.08)',
            transform: 'translateY(-2px) scale(1.01)',
          },
        },
        text: {
          '&:hover': {
            backgroundColor: mode === 'light'
              ? 'rgba(15, 23, 42, 0.04)'
              : 'rgba(96, 165, 250, 0.08)',
            transform: 'scale(1.05)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          background: mode === 'light'
            ? '#ffffff'
            : '#1e293b',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          border: mode === 'light'
            ? '1px solid rgba(59, 130, 246, 0.1)'
            : '1px solid rgba(148, 163, 184, 0.1)',
          boxShadow: mode === 'light'
            ? '0px 4px 20px rgba(0, 0, 0, 0.08)'
            : '0px 4px 20px rgba(0, 0, 0, 0.5)',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          cursor: 'pointer',
          position: 'relative',
          overflow: 'hidden',
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '100%',
            height: '100%',
            background: mode === 'light'
              ? 'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.1), transparent)'
              : 'linear-gradient(90deg, transparent, rgba(96, 165, 250, 0.1), transparent)',
            transition: 'left 0.5s ease',
          },
          '&:hover': {
            transform: 'translateY(-8px) scale(1.02)',
            boxShadow: mode === 'light'
              ? '0px 12px 40px rgba(59, 130, 246, 0.2)'
              : '0px 12px 40px rgba(96, 165, 250, 0.3)',
            borderColor: mode === 'light'
              ? 'rgba(59, 130, 246, 0.3)'
              : 'rgba(96, 165, 250, 0.3)',
            '&::after': {
              left: '100%',
            },
          },
          '&:active': {
            transform: 'translateY(-6px) scale(1.01)',
          },
          animation: 'floatIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
          '@keyframes floatIn': {
            '0%': {
              opacity: 0,
              transform: 'translateY(40px) scale(0.9)',
            },
            '50%': {
              transform: 'translateY(-5px) scale(1.02)',
            },
            '100%': {
              opacity: 1,
              transform: 'translateY(0) scale(1)',
            },
          },
          '@keyframes fadeInUp': {
            '0%': {
              opacity: 0,
              transform: 'translateY(20px)',
            },
            '100%': {
              opacity: 1,
              transform: 'translateY(0)',
            },
          },
          '@keyframes slideInRight': {
            '0%': {
              opacity: 0,
              transform: 'translateX(100px)',
            },
            '100%': {
              opacity: 1,
              transform: 'translateX(0)',
            },
          },
          '@keyframes float': {
            '0%, 100%': {
              transform: 'translateY(0px)',
            },
            '50%': {
              transform: 'translateY(-10px)',
            },
          },
          '@keyframes pulse': {
            '0%': {
              boxShadow: mode === 'light'
                ? '0 0 0 0 rgba(15, 23, 42, 0.4)'
                : '0 0 0 0 rgba(96, 165, 250, 0.4)',
            },
            '70%': {
              boxShadow: mode === 'light'
                ? '0 0 0 10px rgba(15, 23, 42, 0)'
                : '0 0 0 10px rgba(96, 165, 250, 0)',
            },
            '100%': {
              boxShadow: mode === 'light'
                ? '0 0 0 0 rgba(15, 23, 42, 0)'
                : '0 0 0 0 rgba(96, 165, 250, 0)',
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          background: mode === 'light'
            ? '#ffffff'
            : '#1e293b',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          animation: 'slideIn 0.3s ease-out',
          '@keyframes slideIn': {
            '0%': {
              opacity: 0,
              transform: 'scale(0.95)',
            },
            '100%': {
              opacity: 1,
              transform: 'scale(1)',
            },
          },
        },
        elevation1: {
          boxShadow: mode === 'light'
            ? '0px 2px 12px rgba(0, 0, 0, 0.08)'
            : '0px 2px 12px rgba(0, 0, 0, 0.5)',
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
            backgroundColor: mode === 'light' ? '#ffffff' : '#1e293b',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: mode === 'light'
                ? 'rgba(15, 23, 42, 0.15)'
                : 'rgba(96, 165, 250, 0.2)',
              borderWidth: 1,
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            },
            '&:hover': {
              transform: 'translateY(-2px) scale(1.01)',
              boxShadow: mode === 'light'
                ? '0px 4px 20px rgba(0, 0, 0, 0.08)'
                : '0px 4px 12px rgba(96, 165, 250, 0.1)',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: mode === 'light'
                  ? 'rgba(15, 23, 42, 0.3)'
                  : 'rgba(96, 165, 250, 0.4)',
                borderWidth: 2,
              },
            },
            '&.Mui-focused': {
              transform: 'translateY(-3px) scale(1.02)',
              animation: 'pulse 0.5s ease-in-out',
              boxShadow: mode === 'light'
                ? '0px 8px 30px rgba(0, 0, 0, 0.12)'
                : '0px 8px 24px rgba(96, 165, 250, 0.15)',
              '& .MuiOutlinedInput-notchedOutline': {
                borderWidth: 2,
                borderColor: mode === 'light' ? '#0f172a' : '#64b5f6',
              },
            },
          },
          '& .MuiInputLabel-root': {
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&.Mui-focused': {
              fontWeight: 600,
              transform: 'scale(1.05)',
            },
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          '&:hover': {
            transform: 'scale(1.01)',
          },
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          transition: 'all 0.2s ease',
          '&:hover': {
            transform: 'translateX(5px)',
            backgroundColor: mode === 'light'
              ? 'rgba(15, 23, 42, 0.06)'
              : 'rgba(96, 165, 250, 0.08)',
          },
        },
      },
    },
    MuiList: {
      styleOverrides: {
        root: {
          '& .MuiListItem-root': {
            transition: 'all 0.2s ease',
            '&:hover': {
              transform: 'translateX(4px)',
            },
          },
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateX(8px) scale(1.02)',
            backgroundColor: mode === 'light'
              ? 'rgba(15, 23, 42, 0.06)'
              : 'rgba(96, 165, 250, 0.08)',
          },
          '&.Mui-selected': {
            animation: 'pulse 0.5s ease-in-out',
            '&:hover': {
              transform: 'translateX(10px) scale(1.02)',
            },
          },
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          '& .MuiSwitch-thumb': {
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          },
          '&:hover .MuiSwitch-thumb': {
            transform: 'scale(1.2)',
          },
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          transition: 'all 0.2s ease',
          '&:hover': {
            transform: 'scale(1.15) rotate(5deg)',
          },
        },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: {
          animation: 'float 3s ease-in-out infinite',
          '&:hover': {
            animation: 'none',
            transform: 'scale(1.1) rotate(5deg)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          fontSize: '0.8125rem',
          borderRadius: 8,
          backdropFilter: 'blur(10px)',
          height: 28,
        },
        colorPrimary: {
          background: mode === 'light'
            ? 'rgba(30, 64, 175, 0.12)'
            : 'rgba(96, 165, 250, 0.18)',
          color: mode === 'light' ? '#1e40af' : '#60a5fa',
          border: mode === 'light'
            ? '1px solid rgba(30, 64, 175, 0.25)'
            : '1px solid rgba(96, 165, 250, 0.25)',
        },
        colorSuccess: {
          background: mode === 'light'
            ? 'rgba(16, 185, 129, 0.12)'
            : 'rgba(52, 211, 153, 0.18)',
          color: mode === 'light' ? '#059669' : '#34d399',
          border: mode === 'light'
            ? '1px solid rgba(16, 185, 129, 0.25)'
            : '1px solid rgba(52, 211, 153, 0.25)',
        },
        colorError: {
          background: mode === 'light'
            ? 'rgba(239, 68, 68, 0.12)'
            : 'rgba(248, 113, 113, 0.18)',
          color: mode === 'light' ? '#dc2626' : '#f87171',
          border: mode === 'light'
            ? '1px solid rgba(239, 68, 68, 0.25)'
            : '1px solid rgba(248, 113, 113, 0.25)',
        },
        colorWarning: {
          background: mode === 'light'
            ? 'rgba(245, 158, 11, 0.12)'
            : 'rgba(251, 191, 36, 0.18)',
          color: mode === 'light' ? '#d97706' : '#fbbf24',
          border: mode === 'light'
            ? '1px solid rgba(245, 158, 11, 0.25)'
            : '1px solid rgba(251, 191, 36, 0.25)',
        },
      },
    },
    MuiBadge: {
      styleOverrides: {
        badge: {
          fontWeight: 700,
          fontSize: '0.6875rem',
          minWidth: 20,
          height: 20,
          padding: '0 5px',
          boxShadow: mode === 'light'
            ? '0px 2px 8px rgba(30, 64, 175, 0.3)'
            : '0px 2px 8px rgba(96, 165, 250, 0.3)',
        },
        dot: {
          width: 10,
          height: 10,
          borderRadius: '50%',
          border: mode === 'light'
            ? '2px solid #ffffff'
            : '2px solid rgba(30, 41, 59, 0.9)',
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: mode === 'light'
            ? 'rgba(15, 23, 42, 0.95)'
            : 'rgba(248, 250, 252, 0.95)',
          color: mode === 'light' ? '#f1f5f9' : '#0f172a',
          fontSize: '0.8125rem',
          fontWeight: 500,
          padding: '8px 12px',
          borderRadius: 8,
          backdropFilter: 'blur(10px)',
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
        },
        arrow: {
          color: mode === 'light'
            ? 'rgba(15, 23, 42, 0.95)'
            : 'rgba(248, 250, 252, 0.95)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: mode === 'light'
            ? '#ffffff'
            : '#1e293b',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          boxShadow: mode === 'light'
            ? '0px 2px 12px rgba(0, 0, 0, 0.08)'
            : '0px 2px 12px rgba(0, 0, 0, 0.5)',
          borderBottom: mode === 'light'
            ? '1px solid rgba(59, 130, 246, 0.1)'
            : '1px solid rgba(148, 163, 184, 0.1)',
          animation: 'slideDown 0.4s ease-out',
          '@keyframes slideDown': {
            '0%': {
              opacity: 0,
              transform: 'translateY(-100%)',
            },
            '100%': {
              opacity: 1,
              transform: 'translateY(0)',
            },
          },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: mode === 'light'
            ? '#ffffff'
            : '#1e293b',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRight: mode === 'light'
            ? '1px solid rgba(59, 130, 246, 0.1)'
            : '1px solid rgba(148, 163, 184, 0.1)',
          boxShadow: mode === 'light'
            ? '2px 0 12px rgba(0, 0, 0, 0.08)'
            : '2px 0 12px rgba(0, 0, 0, 0.5)',
          animation: 'slideInLeft 0.3s ease-out',
          '@keyframes slideInLeft': {
            '0%': {
              opacity: 0,
              transform: 'translateX(-100%)',
            },
            '100%': {
              opacity: 1,
              transform: 'translateX(0)',
            },
          },
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          margin: '4px 12px',
          padding: '12px 16px',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            left: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            width: '0px',
            height: '60%',
            backgroundColor: mode === 'light' ? '#1e40af' : '#60a5fa',
            borderRadius: '0 4px 4px 0',
            transition: 'width 0.3s ease',
          },
          '&:hover': {
            background: mode === 'light'
              ? 'rgba(30, 64, 175, 0.08)'
              : 'rgba(96, 165, 250, 0.12)',
            transform: 'translateX(4px)',
            '&::before': {
              width: '4px',
            },
            '& .MuiListItemIcon-root': {
              transform: 'scale(1.1)',
            },
          },
          '&.Mui-selected': {
            background: mode === 'light'
              ? 'rgba(30, 64, 175, 0.15)'
              : 'rgba(96, 165, 250, 0.2)',
            fontWeight: 600,
            boxShadow: mode === 'light'
              ? '0px 2px 8px rgba(30, 64, 175, 0.15)'
              : '0px 2px 8px rgba(96, 165, 250, 0.3)',
            '&::before': {
              width: '4px',
            },
            '&:hover': {
              background: mode === 'light'
                ? 'rgba(30, 64, 175, 0.2)'
                : 'rgba(96, 165, 250, 0.25)',
            },
          },
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          minWidth: 40,
          transition: 'transform 0.2s ease',
        },
      },
    },
    MuiListItemText: {
      styleOverrides: {
        primary: {
          fontWeight: 500,
          fontSize: '0.9375rem',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 20,
          background: mode === 'light'
            ? '#ffffff'
            : '#1e293b',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: mode === 'light'
            ? '1px solid rgba(59, 130, 246, 0.1)'
            : '1px solid rgba(148, 163, 184, 0.1)',
          boxShadow: mode === 'light'
            ? '0px 20px 60px rgba(0, 0, 0, 0.15)'
            : '0px 20px 60px rgba(0, 0, 0, 0.6)',
          animation: 'popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          '@keyframes popIn': {
            '0%': {
              opacity: 0,
              transform: 'scale(0.8) translateY(-20px)',
            },
            '100%': {
              opacity: 1,
              transform: 'scale(1) translateY(0)',
            },
          },
        },
        backdrop: {
          backdropFilter: 'blur(8px)',
          backgroundColor: mode === 'light'
            ? 'rgba(15, 23, 42, 0.4)'
            : 'rgba(0, 0, 0, 0.7)',
        },
      },
    },
    MuiBackdrop: {
      styleOverrides: {
        root: {
          backdropFilter: 'blur(8px)',
          backgroundColor: mode === 'light'
            ? 'rgba(15, 23, 42, 0.4)'
            : 'rgba(0, 0, 0, 0.7)',
          animation: 'fadeIn 0.3s ease-out',
          '@keyframes fadeIn': {
            '0%': {
              opacity: 0,
            },
            '100%': {
              opacity: 1,
            },
          },
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: mode === 'light'
            ? 'rgba(15, 23, 42, 0.08)'
            : 'rgba(241, 245, 249, 0.08)',
          '&::before, &::after': {
            borderColor: mode === 'light'
              ? 'rgba(15, 23, 42, 0.08)'
              : 'rgba(241, 245, 249, 0.08)',
          },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backdropFilter: 'blur(10px)',
          animation: 'slideInRight 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: mode === 'light'
            ? '0px 4px 12px rgba(0, 0, 0, 0.1)'
            : '0px 4px 12px rgba(0, 0, 0, 0.5)',
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          border: mode === 'light'
            ? '3px solid rgba(255, 255, 255, 0.9)'
            : '3px solid rgba(30, 41, 59, 0.9)',
          boxShadow: mode === 'light'
            ? '0px 4px 12px rgba(30, 64, 175, 0.2)'
            : '0px 4px 12px rgba(0, 0, 0, 0.4)',
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          transition: 'all 0.2s ease',
          '&:hover': {
            backgroundColor: mode === 'light'
              ? 'rgba(30, 64, 175, 0.04)'
              : 'rgba(96, 165, 250, 0.08)',
            transform: 'scale(1.005)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          transition: 'all 0.2s ease',
          '&:hover': {
            transform: 'scale(1.05)',
            boxShadow: mode === 'light'
              ? '0px 4px 12px rgba(30, 64, 175, 0.2)'
              : '0px 4px 12px rgba(96, 165, 250, 0.2)',
          },
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          animation: 'popIn 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        },
      },
    },
  },
});
