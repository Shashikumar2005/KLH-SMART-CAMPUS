import { useDispatch, useSelector } from 'react-redux';
import {
  Popover,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Button,
  Divider,
  Chip,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { format } from 'date-fns';
import {
  markAsRead,
  markAllAsRead,
  removeNotification,
} from '../../redux/slices/notificationSlice';
import PropTypes from 'prop-types';

const NotificationPanel = ({ anchorEl, open, onClose }) => {
  const dispatch = useDispatch();
  const { notifications } = useSelector((state) => state.notifications);

  const handleMarkAsRead = (id) => {
    dispatch(markAsRead(id));
  };

  const handleMarkAllRead = () => {
    dispatch(markAllAsRead());
  };

  const handleRemove = (id) => {
    dispatch(removeNotification(id));
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'success':
        return 'success';
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      default:
        return 'info';
    }
  };

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      PaperProps={{
        sx: { width: 360, maxHeight: 480 },
      }}
    >
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Notifications</Typography>
        {notifications.length > 0 && (
          <Button size="small" onClick={handleMarkAllRead}>
            Mark all read
          </Button>
        )}
      </Box>
      <Divider />

      {notifications.length === 0 ? (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            No notifications
          </Typography>
        </Box>
      ) : (
        <List sx={{ maxHeight: 400, overflow: 'auto' }}>
          {notifications.map((notification) => (
            <ListItem
              key={notification.id}
              sx={{
                bgcolor: notification.read ? 'transparent' : 'action.hover',
                '&:hover': { bgcolor: 'action.selected' },
              }}
              secondaryAction={
                <IconButton
                  edge="end"
                  size="small"
                  onClick={() => handleRemove(notification.id)}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              }
              onClick={() => !notification.read && handleMarkAsRead(notification.id)}
            >
              <ListItemText
                primary={notification.type}
                secondary={
                  <Box component="div">
                    <Box component="span" sx={{ display: 'block', mb: 0.5, fontSize: '0.875rem' }}>
                      {notification.message}
                    </Box>
                    <Box component="span" sx={{ display: 'block', fontSize: '0.75rem', color: 'text.secondary' }}>
                      {format(new Date(notification.timestamp), 'MMM dd, yyyy hh:mm a')}
                    </Box>
                  </Box>
                }
                primaryTypographyProps={{
                  sx: { display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }
                }}
                secondaryTypographyProps={{ component: 'div' }}
              />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Chip
                  label={notification.type}
                  size="small"
                  color={getNotificationColor(notification.type)}
                  sx={{ height: 20, fontSize: '0.7rem' }}
                />
                {!notification.read && (
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: 'primary.main',
                    }}
                  />
                )}
              </Box>
            </ListItem>
          ))}
        </List>
      )}
    </Popover>
  );
};

NotificationPanel.propTypes = {
  anchorEl: PropTypes.any,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default NotificationPanel;
