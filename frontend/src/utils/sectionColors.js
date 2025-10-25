// Section-specific color utilities for consistent theming across the app

export const getSectionColor = (section, mode = 'light') => {
  const colors = {
    events: {
      light: {
        main: '#8b5cf6',
        light: '#a78bfa',
        bg: 'rgba(139, 92, 246, 0.1)',
        border: 'rgba(139, 92, 246, 0.3)',
      },
      dark: {
        main: '#a78bfa',
        light: '#c4b5fd',
        bg: 'rgba(167, 139, 250, 0.15)',
        border: 'rgba(167, 139, 250, 0.3)',
      },
    },
    clubs: {
      light: {
        main: '#ec4899',
        light: '#f472b6',
        bg: 'rgba(236, 72, 153, 0.1)',
        border: 'rgba(236, 72, 153, 0.3)',
      },
      dark: {
        main: '#f472b6',
        light: '#f9a8d4',
        bg: 'rgba(244, 114, 182, 0.15)',
        border: 'rgba(244, 114, 182, 0.3)',
      },
    },
    polls: {
      light: {
        main: '#14b8a6',
        light: '#2dd4bf',
        bg: 'rgba(20, 184, 166, 0.1)',
        border: 'rgba(20, 184, 166, 0.3)',
      },
      dark: {
        main: '#5eead4',
        light: '#99f6e4',
        bg: 'rgba(94, 234, 212, 0.15)',
        border: 'rgba(94, 234, 212, 0.3)',
      },
    },
    lostFound: {
      light: {
        main: '#f59e0b',
        light: '#fbbf24',
        bg: 'rgba(245, 158, 11, 0.1)',
        border: 'rgba(245, 158, 11, 0.3)',
      },
      dark: {
        main: '#fbbf24',
        light: '#fde047',
        bg: 'rgba(251, 191, 36, 0.15)',
        border: 'rgba(251, 191, 36, 0.3)',
      },
    },
    feedback: {
      light: {
        main: '#06b6d4',
        light: '#22d3ee',
        bg: 'rgba(6, 182, 212, 0.1)',
        border: 'rgba(6, 182, 212, 0.3)',
      },
      dark: {
        main: '#22d3ee',
        light: '#67e8f9',
        bg: 'rgba(34, 211, 238, 0.15)',
        border: 'rgba(34, 211, 238, 0.3)',
      },
    },
    announcements: {
      light: {
        main: '#8b5cf6',
        light: '#a78bfa',
        bg: 'rgba(139, 92, 246, 0.1)',
        border: 'rgba(139, 92, 246, 0.3)',
      },
      dark: {
        main: '#a78bfa',
        light: '#c4b5fd',
        bg: 'rgba(167, 139, 250, 0.15)',
        border: 'rgba(167, 139, 250, 0.3)',
      },
    },
    grievances: {
      light: {
        main: '#ef4444',
        light: '#f87171',
        bg: 'rgba(239, 68, 68, 0.1)',
        border: 'rgba(239, 68, 68, 0.3)',
      },
      dark: {
        main: '#f87171',
        light: '#fca5a5',
        bg: 'rgba(248, 113, 113, 0.15)',
        border: 'rgba(248, 113, 113, 0.3)',
      },
    },
  };

  return colors[section]?.[mode] || colors.events[mode];
};

// Icon colors for sections
export const getSectionIcon = (section) => {
  const icons = {
    events: '📅',
    clubs: '🎭',
    polls: '📊',
    lostFound: '🔍',
    feedback: '💬',
    announcements: '📢',
    grievances: '⚠️',
  };

  return icons[section] || '📌';
};

// Get gradient for section headers
export const getSectionGradient = (section, mode = 'light') => {
  const color = getSectionColor(section, mode);
  return `linear-gradient(135deg, ${color.main}, ${color.light})`;
};

// Status badge colors
export const getStatusColor = (status) => {
  const statusColors = {
    active: { color: '#10b981', bg: 'rgba(16, 185, 129, 0.12)' },
    pending: { color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.12)' },
    resolved: { color: '#10b981', bg: 'rgba(16, 185, 129, 0.12)' },
    rejected: { color: '#ef4444', bg: 'rgba(239, 68, 68, 0.12)' },
    expired: { color: '#64748b', bg: 'rgba(100, 116, 139, 0.12)' },
    upcoming: { color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.12)' },
    ongoing: { color: '#10b981', bg: 'rgba(16, 185, 129, 0.12)' },
    completed: { color: '#64748b', bg: 'rgba(100, 116, 139, 0.12)' },
  };

  return statusColors[status.toLowerCase()] || statusColors.pending;
};

// Priority badge colors
export const getPriorityColor = (priority) => {
  const priorityColors = {
    low: { color: '#10b981', bg: 'rgba(16, 185, 129, 0.12)' },
    medium: { color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.12)' },
    high: { color: '#ef4444', bg: 'rgba(239, 68, 68, 0.12)' },
  };

  return priorityColors[priority.toLowerCase()] || priorityColors.medium;
};
