import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Chip,
  Tooltip,
  useTheme,
} from '@mui/material';
import { ArrowUpward, ArrowDownward, TrendingUp } from '@mui/icons-material';
import { getSectionColor } from '../../utils/sectionColors';

const DashboardCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  section = 'events',
  trend,
  trendValue,
  actionIcon: ActionIcon,
  onActionClick,
  onClick,
  children,
  chip,
  sx = {},
}) => {
  const theme = useTheme();
  const sectionColor = getSectionColor(section, theme.palette.mode);

  const getTrendIcon = () => {
    if (trend === 'up') return <ArrowUpward sx={{ fontSize: 16 }} />;
    if (trend === 'down') return <ArrowDownward sx={{ fontSize: 16 }} />;
    return <TrendingUp sx={{ fontSize: 16 }} />;
  };

  const getTrendColor = () => {
    if (trend === 'up') return theme.palette.success.main;
    if (trend === 'down') return theme.palette.error.main;
    return theme.palette.info.main;
  };

  return (
    <Card
      onClick={onClick}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'visible',
        cursor: onClick ? 'pointer' : 'default',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: `linear-gradient(90deg, ${sectionColor.main}, ${sectionColor.light})`,
          borderRadius: '16px 16px 0 0',
        },
        ...sx,
      }}
    >
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        {/* Header with Icon and Action */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: 3,
              background: sectionColor.bg,
              border: `1px solid ${sectionColor.border}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'rotate(5deg) scale(1.05)',
              },
            }}
          >
            {Icon && <Icon sx={{ fontSize: 28, color: sectionColor.main }} />}
          </Box>
          
          {ActionIcon && (
            <Tooltip title={`${title} Actions`} arrow>
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onActionClick?.();
                }}
                sx={{
                  bgcolor: theme.palette.mode === 'light'
                    ? 'rgba(255, 255, 255, 0.8)'
                    : 'rgba(30, 41, 59, 0.8)',
                  '&:hover': {
                    bgcolor: sectionColor.bg,
                    color: sectionColor.main,
                  },
                }}
              >
                <ActionIcon sx={{ fontSize: 20 }} />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        {/* Title and Chip */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography
            variant="h6"
            sx={{
              fontSize: '0.875rem',
              fontWeight: 600,
              color: theme.palette.text.secondary,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            {title}
          </Typography>
          {chip && (
            <Chip
              label={chip.label}
              size="small"
              color={chip.color || 'primary'}
              sx={{
                height: 20,
                fontSize: '0.6875rem',
                fontWeight: 700,
              }}
            />
          )}
        </Box>

        {/* Main Value */}
        <Typography
          variant="h3"
          sx={{
            fontSize: '2.5rem',
            fontWeight: 800,
            background: `linear-gradient(135deg, ${sectionColor.main}, ${sectionColor.light})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            mb: 1,
          }}
        >
          {value}
        </Typography>

        {/* Subtitle and Trend */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography
            variant="body2"
            sx={{
              color: theme.palette.text.secondary,
              fontSize: '0.875rem',
            }}
          >
            {subtitle}
          </Typography>
          
          {trend && trendValue && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                color: getTrendColor(),
                fontSize: '0.8125rem',
                fontWeight: 600,
              }}
            >
              {getTrendIcon()}
              {trendValue}
            </Box>
          )}
        </Box>

        {/* Custom Children Content */}
        {children && (
          <Box sx={{ mt: 2 }}>
            {children}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardCard;
