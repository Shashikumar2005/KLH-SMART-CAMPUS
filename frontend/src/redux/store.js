import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import eventReducer from './slices/eventSlice';
import lostItemReducer from './slices/lostItemSlice';
import feedbackReducer from './slices/feedbackSlice';
import grievanceReducer from './slices/grievanceSlice';
import announcementReducer from './slices/announcementSlice';
import notificationReducer from './slices/notificationSlice';
import chatbotReducer from './slices/chatbotSlice';
import clubReducer from './slices/clubSlice';
import pollReducer from './slices/pollSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    events: eventReducer,
    lostItems: lostItemReducer,
    feedback: feedbackReducer,
    grievances: grievanceReducer,
    announcements: announcementReducer,
    notifications: notificationReducer,
    chatbot: chatbotReducer,
    clubs: clubReducer,
    polls: pollReducer,
  },
});

export default store;
