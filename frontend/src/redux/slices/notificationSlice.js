import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  notifications: [],
  unreadCount: 0,
  soundEnabled: true,
  filterType: 'all', // 'all', 'unread', 'info', 'success', 'warning', 'error'
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action) => {
      const newNotification = {
        id: action.payload.id || `notif-${Date.now()}-${Math.random()}`,
        ...action.payload,
        read: false,
        timestamp: action.payload.timestamp || new Date().toISOString(),
        priority: action.payload.priority || 'normal', // 'low', 'normal', 'high', 'urgent'
      };
      
      // Prevent duplicate notifications (check last 3 notifications only)
      const isDuplicate = state.notifications.slice(0, 3).some(
        n => n.message === newNotification.message && 
             n.type === newNotification.type &&
             (Date.now() - new Date(n.timestamp).getTime()) < 3000 // within 3 seconds
      );
      
      if (!isDuplicate) {
        state.notifications.unshift(newNotification);
        state.unreadCount += 1;
        
        console.log('✅ Notification added:', newNotification.message);
        console.log('📊 Total notifications:', state.notifications.length);
        console.log('🔔 Unread count:', state.unreadCount);
        
        // Limit notifications to 100 to prevent memory issues
        if (state.notifications.length > 100) {
          const removed = state.notifications.pop();
          if (!removed.read) {
            state.unreadCount = Math.max(0, state.unreadCount - 1);
          }
        }
      } else {
        console.log('⚠️ Duplicate notification prevented:', newNotification.message);
      }
    },
    markAsRead: (state, action) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification && !notification.read) {
        notification.read = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
        console.log('✓ Marked as read:', notification.message);
        console.log('📊 Unread count:', state.unreadCount);
      }
    },
    markAllAsRead: (state) => {
      const unreadCount = state.notifications.filter(n => !n.read).length;
      state.notifications.forEach(n => n.read = true);
      state.unreadCount = 0;
      console.log(`✓ Marked ${unreadCount} notifications as read`);
    },
    removeNotification: (state, action) => {
      const index = state.notifications.findIndex(n => n.id === action.payload);
      if (index !== -1) {
        if (!state.notifications[index].read) {
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
        state.notifications.splice(index, 1);
      }
    },
    clearAllNotifications: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
    },
    clearReadNotifications: (state) => {
      state.notifications = state.notifications.filter(n => !n.read);
    },
    toggleSound: (state) => {
      state.soundEnabled = !state.soundEnabled;
    },
    setFilterType: (state, action) => {
      state.filterType = action.payload;
    },
    // Batch operations for better performance
    addMultipleNotifications: (state, action) => {
      const newNotifications = action.payload.map(notif => ({
        id: notif.id || `notif-${Date.now()}-${Math.random()}`,
        ...notif,
        read: false,
        timestamp: notif.timestamp || new Date().toISOString(),
        priority: notif.priority || 'normal',
      }));
      
      state.notifications.unshift(...newNotifications);
      state.unreadCount += newNotifications.length;
      
      // Limit to 100 notifications
      if (state.notifications.length > 100) {
        const excess = state.notifications.length - 100;
        const removed = state.notifications.splice(100, excess);
        const unreadRemoved = removed.filter(n => !n.read).length;
        state.unreadCount = Math.max(0, state.unreadCount - unreadRemoved);
      }
    },
  },
});

export const {
  addNotification,
  markAsRead,
  markAllAsRead,
  removeNotification,
  clearAllNotifications,
  clearReadNotifications,
  toggleSound,
  setFilterType,
  addMultipleNotifications,
} = notificationSlice.actions;

export default notificationSlice.reducer;
