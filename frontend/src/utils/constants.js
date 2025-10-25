// User roles
export const USER_ROLES = {
  STUDENT: 'student',
  FACULTY: 'faculty',
  ADMIN: 'admin',
};

// Event categories
export const EVENT_CATEGORIES = {
  ACADEMIC: 'academic',
  CULTURAL: 'cultural',
  SPORTS: 'sports',
  WORKSHOP: 'workshop',
  SEMINAR: 'seminar',
  OTHER: 'other',
};

// Event status
export const EVENT_STATUS = {
  UPCOMING: 'upcoming',
  ONGOING: 'ongoing',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

// Lost item types
export const ITEM_TYPES = {
  LOST: 'lost',
  FOUND: 'found',
};

// Lost item categories
export const ITEM_CATEGORIES = {
  ELECTRONICS: 'electronics',
  DOCUMENTS: 'documents',
  ACCESSORIES: 'accessories',
  BOOKS: 'books',
  CLOTHING: 'clothing',
  OTHER: 'other',
};

// Item status
export const ITEM_STATUS = {
  ACTIVE: 'active',
  RESOLVED: 'resolved',
  EXPIRED: 'expired',
};

// Feedback categories
export const FEEDBACK_CATEGORIES = {
  INFRASTRUCTURE: 'infrastructure',
  TEACHING: 'teaching',
  FACILITIES: 'facilities',
  ADMINISTRATION: 'administration',
  OTHER: 'other',
};

// Feedback status
export const FEEDBACK_STATUS = {
  PENDING: 'pending',
  REVIEWED: 'reviewed',
  RESOLVED: 'resolved',
  REJECTED: 'rejected',
};

// Priority levels
export const PRIORITY_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
};

// Announcement categories
export const ANNOUNCEMENT_CATEGORIES = {
  GENERAL: 'general',
  ACADEMIC: 'academic',
  URGENT: 'urgent',
  EVENT: 'event',
  HOLIDAY: 'holiday',
};

// Target audiences
export const TARGET_AUDIENCES = {
  ALL: 'all',
  STUDENT: 'student',
  FACULTY: 'faculty',
  ADMIN: 'admin',
};

// Notification types
export const NOTIFICATION_TYPES = {
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error',
};

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    ME: '/auth/me',
  },
  EVENTS: '/events',
  LOST_ITEMS: '/lost-items',
  FEEDBACK: '/feedback',
  ANNOUNCEMENTS: '/announcements',
  CHATBOT: '/chatbot',
};

// Date formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy',
  DISPLAY_LONG: 'MMMM dd, yyyy',
  DISPLAY_WITH_TIME: 'MMM dd, yyyy hh:mm a',
  INPUT: 'yyyy-MM-dd',
};

// Socket events
export const SOCKET_EVENTS = {
  NOTIFICATION: 'notification',
  NEW_EVENT: 'newEvent',
  EVENT_UPDATED: 'eventUpdated',
  NEW_LOST_ITEM: 'newLostItem',
  LOST_ITEM_UPDATED: 'lostItemUpdated',
  LOST_ITEM_CLAIMED: 'lostItemClaimed',
  NEW_ANNOUNCEMENT: 'newAnnouncement',
  ANNOUNCEMENT_UPDATED: 'announcementUpdated',
  NEW_FEEDBACK: 'newFeedback',
  FEEDBACK_RESPONDED: 'feedbackResponded',
};

export default {
  USER_ROLES,
  EVENT_CATEGORIES,
  EVENT_STATUS,
  ITEM_TYPES,
  ITEM_CATEGORIES,
  ITEM_STATUS,
  FEEDBACK_CATEGORIES,
  FEEDBACK_STATUS,
  PRIORITY_LEVELS,
  ANNOUNCEMENT_CATEGORIES,
  TARGET_AUDIENCES,
  NOTIFICATION_TYPES,
  API_ENDPOINTS,
  DATE_FORMATS,
  SOCKET_EVENTS,
};
