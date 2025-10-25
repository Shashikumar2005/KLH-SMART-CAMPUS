import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  IconButton,
  Badge,
  Popover,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Button,
  Chip,
  Tabs,
  Tab,
  Switch,
  FormControlLabel,
  Tooltip,
  Paper,
  alpha,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  NotificationsActive,
  CheckCircle,
  Info,
  Warning,
  Error as ErrorIcon,
  Delete,
  DoneAll,
  FilterList,
  VolumeUp,
  VolumeOff,
  Clear,
  Event,
  Announcement,
  Feedback,
  FindInPage,
  Groups,
  Poll,
} from '@mui/icons-material';
import {
  markAsRead,
  markAllAsRead,
  removeNotification,
  clearAllNotifications,
  clearReadNotifications,
  toggleSound,
  setFilterType,
} from '../../redux/slices/notificationSlice';
import { formatDistanceToNow } from 'date-fns';

const NotificationCenter = () => {
  const dispatch = useDispatch();
  const { notifications, unreadCount, soundEnabled, filterType } = useSelector(
    (state) => state.notifications
  );
  const [anchorEl, setAnchorEl] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  // Play notification sound
  useEffect(() => {
    if (soundEnabled && unreadCount > 0) {
      // Create a subtle notification sound
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      gainNode.gain.value = 0.1;
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    }
  }, [notifications.length]); // Only trigger on new notifications

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMarkAsRead = (id, event) => {
    event.stopPropagation();
    dispatch(markAsRead(id));
  };

  const handleMarkAllAsRead = () => {
    dispatch(markAllAsRead());
  };

  const handleRemove = (id, event) => {
    event.stopPropagation();
    dispatch(removeNotification(id));
  };

  const handleClearAll = () => {
    dispatch(clearAllNotifications());
  };

  const handleClearRead = () => {
    dispatch(clearReadNotifications());
  };

  const handleToggleSound = () => {
    dispatch(toggleSound());
  };

  const open = Boolean(anchorEl);
  const id = open ? 'notification-popover' : undefined;

  // Filter notifications based on active tab
  const getFilteredNotifications = () => {
    let filtered = notifications;

    switch (activeTab) {
      case 1: // Unread
        filtered = notifications.filter(n => !n.read);
        break;
      case 2: // Important
        filtered = notifications.filter(n => ['high', 'urgent'].includes(n.priority));
        break;
      default:
        filtered = notifications;
    }

    return filtered;
  };

  const filteredNotifications = getFilteredNotifications();

  // Get icon based on notification type
  const getNotificationIcon = (type, category) => {
    if (category === 'event') return <Event />;
    if (category === 'announcement') return <Announcement />;
    if (category === 'feedback') return <Feedback />;
    if (category === 'lost-item') return <FindInPage />;
    if (category === 'club') return <Groups />;
    if (category === 'poll') return <Poll />;

    switch (type) {
      case 'success':
        return <CheckCircle />;
      case 'warning':
        return <Warning />;
      case 'error':
        return <ErrorIcon />;
      default:
        return <Info />;
    }
  };

  // Get color based on notification type
  const getNotificationColor = (type) => {
    switch (type) {
      case 'success':
        return '#4caf50';
      case 'warning':
        return '#ff9800';
      case 'error':
        return '#f44336';
      default:
        return '#2196f3';
    }
  };

  // Get priority badge
  const getPriorityBadge = (priority) => {
    if (priority === 'urgent') {
      return <Chip label="URGENT" size="small" color="error" sx={{ height: 20 }} />;
    }
    if (priority === 'high') {
      return <Chip label="High" size="small" color="warning" sx={{ height: 20 }} />;
    }
    return null;
  };

  return (
    <>
      <Tooltip title="Notifications">
        <IconButton
          color="inherit"
          onClick={handleClick}
          sx={{
            position: 'relative',
            '&:hover': {
              backgroundColor: alpha('#fff', 0.1),
            },
          }}
        >
          <Badge badgeContent={unreadCount} color="error" max={99}>
            {unreadCount > 0 ? (
              <motion.div
                animate={{ rotate: [0, -15, 15, -15, 15, 0] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
              >
                <NotificationsActive />
              </motion.div>
            ) : (
              <NotificationsIcon />
            )}
          </Badge>
        </IconButton>
      </Tooltip>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            width: 400,
            maxHeight: 600,
            mt: 1,
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
          },
        }}
      >
        <Box>
          {/* Header */}
          <Box
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              p: 2,
            }}
          >
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6" fontWeight="bold">
                Notifications
              </Typography>
              <Box>
                <Tooltip title={soundEnabled ? 'Mute' : 'Unmute'}>
                  <IconButton size="small" onClick={handleToggleSound} sx={{ color: 'white' }}>
                    {soundEnabled ? <VolumeUp /> : <VolumeOff />}
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              {unreadCount} unread message{unreadCount !== 1 ? 's' : ''}
            </Typography>
          </Box>

          {/* Tabs */}
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            variant="fullWidth"
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
              '& .MuiTab-root': {
                minHeight: 48,
                textTransform: 'none',
              },
            }}
          >
            <Tab label={`All (${notifications.length})`} />
            <Tab label={`Unread (${unreadCount})`} />
            <Tab
              label={`Important (${notifications.filter(n => ['high', 'urgent'].includes(n.priority)).length})`}
            />
          </Tabs>

          {/* Actions */}
          {filteredNotifications.length > 0 && (
            <Box
              sx={{
                px: 2,
                py: 1,
                bgcolor: 'background.default',
                display: 'flex',
                gap: 1,
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Button
                size="small"
                startIcon={<DoneAll />}
                onClick={handleMarkAllAsRead}
                disabled={unreadCount === 0}
              >
                Mark all read
              </Button>
              <Box>
                <Button size="small" startIcon={<Clear />} onClick={handleClearRead}>
                  Clear read
                </Button>
                <Button size="small" color="error" startIcon={<Delete />} onClick={handleClearAll}>
                  Clear all
                </Button>
              </Box>
            </Box>
          )}

          {/* Notifications List */}
          <List
            sx={{
              maxHeight: 400,
              overflow: 'auto',
              p: 0,
              '&::-webkit-scrollbar': {
                width: '8px',
              },
              '&::-webkit-scrollbar-track': {
                background: '#f1f1f1',
              },
              '&::-webkit-scrollbar-thumb': {
                background: '#888',
                borderRadius: '4px',
              },
              '&::-webkit-scrollbar-thumb:hover': {
                background: '#555',
              },
            }}
          >
            <AnimatePresence>
              {filteredNotifications.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Box sx={{ p: 4, textAlign: 'center' }}>
                    <NotificationsIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="body1" color="text.secondary">
                      No notifications
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      You're all caught up!
                    </Typography>
                  </Box>
                </motion.div>
              ) : (
                filteredNotifications.map((notification, index) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <ListItem
                      sx={{
                        bgcolor: notification.read ? 'transparent' : alpha('#667eea', 0.05),
                        borderLeft: notification.read
                          ? 'none'
                          : `4px solid ${getNotificationColor(notification.type)}`,
                        '&:hover': {
                          bgcolor: alpha('#667eea', 0.1),
                        },
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                      onClick={(e) => !notification.read && handleMarkAsRead(notification.id, e)}
                    >
                      <ListItemAvatar>
                        <Avatar
                          sx={{
                            bgcolor: getNotificationColor(notification.type),
                            width: 40,
                            height: 40,
                          }}
                        >
                          {getNotificationIcon(notification.type, notification.category)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box display="flex" alignItems="center" gap={1}>
                            <Typography
                              variant="body2"
                              fontWeight={notification.read ? 'normal' : 'bold'}
                              sx={{ flex: 1 }}
                            >
                              {notification.message}
                            </Typography>
                            {getPriorityBadge(notification.priority)}
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              {formatDistanceToNow(new Date(notification.timestamp), {
                                addSuffix: true,
                              })}
                            </Typography>
                            {notification.description && (
                              <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                                {notification.description}
                              </Typography>
                            )}
                          </Box>
                        }
                      />
                      <Box display="flex" gap={0.5}>
                        {!notification.read && (
                          <Tooltip title="Mark as read">
                            <IconButton
                              size="small"
                              onClick={(e) => handleMarkAsRead(notification.id, e)}
                            >
                              <DoneAll fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                        <Tooltip title="Remove">
                          <IconButton
                            size="small"
                            onClick={(e) => handleRemove(notification.id, e)}
                          >
                            <Clear fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </ListItem>
                    <Divider />
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </List>
        </Box>
      </Popover>
    </>
  );
};

export default NotificationCenter;
