import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Box } from '@mui/material';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import FacultyDashboard from './pages/FacultyDashboard';
import AdminDashboard from './pages/AdminDashboard2'; // New animated dashboard
import Events from './pages/Events';
import EventDetails from './pages/EventDetails';
import LostFound from './pages/LostFound';
import Feedback from './pages/Feedback';
import Grievances from './pages/Grievances';
import Announcements from './pages/Announcements';
import Clubs from './pages/Clubs';
import Polls from './pages/Polls';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

// Components
import PrivateRoute from './components/common/PrivateRoute';
import Layout from './components/common/Layout';
import Chatbot from './components/chatbot/Chatbot';

// Socket
import { initializeSocket } from './services/socket';
import { subscribeToEvent } from './services/socket';
import { addNotification } from './redux/slices/notificationSlice';
import { addEventRealtime, updateEventRealtime } from './redux/slices/eventSlice';
import { addItemRealtime, updateItemRealtime } from './redux/slices/lostItemSlice';
import { addAnnouncementRealtime } from './redux/slices/announcementSlice';

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, token, user } = useSelector((state) => state.auth);

  useEffect(() => {
    // Initialize socket connection if authenticated
    if (isAuthenticated && token) {
      console.log('🔌 Initializing socket connection...');
      initializeSocket(token);

      // Subscribe to real-time events
      subscribeToEvent('notification', (data) => {
        console.log('🔔 Received notification:', data);
        dispatch(addNotification({
          ...data,
          id: `notif-${Date.now()}-${Math.random()}`,
          timestamp: new Date().toISOString(),
        }));
      });

      subscribeToEvent('newEvent', (event) => {
        console.log('📅 New event received:', event.title);
        dispatch(addEventRealtime(event));
        dispatch(addNotification({
          type: 'info',
          category: 'event',
          message: `New event: ${event.title}`,
          description: `Scheduled for ${new Date(event.date).toLocaleDateString()}`,
          priority: 'normal',
        }));
      });

      subscribeToEvent('eventUpdated', (event) => {
        console.log('📅 Event updated:', event.title);
        dispatch(updateEventRealtime(event));
        dispatch(addNotification({
          type: 'info',
          category: 'event',
          message: `Event updated: ${event.title}`,
          priority: 'low',
        }));
      });

      subscribeToEvent('newLostItem', (item) => {
        dispatch(addItemRealtime(item));
        dispatch(addNotification({
          type: 'info',
          category: 'lost-item',
          message: `New ${item.type} item reported: ${item.title}`,
          description: `Location: ${item.location}`,
          priority: 'normal',
        }));
      });

      subscribeToEvent('lostItemUpdated', (item) => {
        dispatch(updateItemRealtime(item));
        dispatch(addNotification({
          type: 'info',
          category: 'lost-item',
          message: `Lost item updated: ${item.title}`,
          priority: 'low',
        }));
      });

      subscribeToEvent('lostItemClaimed', (item) => {
        dispatch(updateItemRealtime(item));
        dispatch(addNotification({
          type: 'success',
          category: 'lost-item',
          message: `Item claimed: ${item.title}`,
          description: 'The owner has been reunited with their item!',
          priority: 'normal',
        }));
      });

      subscribeToEvent('newAnnouncement', (announcement) => {
        dispatch(addAnnouncementRealtime(announcement));
        dispatch(addNotification({
          type: 'warning',
          category: 'announcement',
          message: `New announcement: ${announcement.title}`,
          description: announcement.message.substring(0, 100),
          priority: announcement.priority || 'high',
        }));
      });

      // Club approval notifications
      subscribeToEvent('clubPendingApproval', (club) => {
        if (user?.role === 'admin') {
          dispatch(addNotification({
            type: 'warning',
            category: 'club',
            message: `New club pending approval: ${club.name}`,
            description: `Created by ${club.president?.name || 'Unknown'}`,
            priority: 'high',
          }));
        }
      });

      subscribeToEvent('clubApproved', (club) => {
        dispatch(addNotification({
          type: 'success',
          category: 'club',
          message: `Club approved: ${club.name}`,
          description: 'The club is now live and visible to all users!',
          priority: 'normal',
        }));
      });

      subscribeToEvent('clubRejected', (data) => {
        dispatch(addNotification({
          type: 'error',
          category: 'club',
          message: `Club rejected: ${data.clubName}`,
          description: `Reason: ${data.reason}`,
          priority: 'high',
        }));
      });

      // Poll approval notifications
      subscribeToEvent('pollPendingApproval', (poll) => {
        if (user?.role === 'admin') {
          dispatch(addNotification({
            type: 'warning',
            category: 'poll',
            message: `New poll pending approval`,
            description: poll.question,
            priority: 'high',
          }));
        }
      });

      subscribeToEvent('pollApproved', (poll) => {
        dispatch(addNotification({
          type: 'success',
          category: 'poll',
          message: `Poll approved: ${poll.question}`,
          description: 'Your poll is now live!',
          priority: 'normal',
        }));
      });

      subscribeToEvent('pollRejected', (data) => {
        dispatch(addNotification({
          type: 'error',
          category: 'poll',
          message: `Poll rejected`,
          description: `Reason: ${data.reason}`,
          priority: 'high',
        }));
      });

      // Feedback notifications
      subscribeToEvent('feedbackResponse', (feedback) => {
        dispatch(addNotification({
          type: 'info',
          category: 'feedback',
          message: `Your feedback received a response`,
          description: feedback.response?.substring(0, 100),
          priority: 'normal',
        }));
      });
    }
  }, [isAuthenticated, token, dispatch, user?.role]);

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh' }}>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />}
        />
        <Route
          path="/register"
          element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" />}
        />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" />} />
          
          {/* Dashboard Routes based on role */}
          <Route path="dashboard" element={<DashboardRouter />} />
          
          {/* Common Routes */}
          <Route path="events" element={<Events />} />
          <Route path="events/:id" element={<EventDetails />} />
          <Route path="clubs" element={<Clubs />} />
          <Route path="polls" element={<Polls />} />
          <Route path="lost-found" element={<LostFound />} />
          <Route path="feedback" element={<Feedback />} />
          <Route path="grievances" element={<Grievances />} />
          <Route path="announcements" element={<Announcements />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* Chatbot */}
      {isAuthenticated && <Chatbot />}
    </Box>
  );
}

// Dashboard Router based on user role
function DashboardRouter() {
  const { user } = useSelector((state) => state.auth);

  if (user?.role === 'admin') {
    return <AdminDashboard />;
  } else if (user?.role === 'faculty') {
    return <FacultyDashboard />;
  } else {
    return <StudentDashboard />;
  }
}

export default App;
