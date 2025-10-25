import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Button,
  List,
  ListItem,
  ListItemText,
  Chip,
  Divider,
} from '@mui/material';
import {
  Event,
  FindInPage,
  Feedback,
  Campaign,
  Add,
  TrendingUp,
} from '@mui/icons-material';
import { fetchEvents } from '../redux/slices/eventSlice';
import { fetchLostItems } from '../redux/slices/lostItemSlice';
import { fetchFeedback } from '../redux/slices/feedbackSlice';
import { fetchAnnouncements } from '../redux/slices/announcementSlice';
import { format } from 'date-fns';

const FacultyDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { events } = useSelector((state) => state.events);
  const { items } = useSelector((state) => state.lostItems);
  const { feedbackList } = useSelector((state) => state.feedback);
  const { announcements } = useSelector((state) => state.announcements);

  useEffect(() => {
    dispatch(fetchEvents());
    dispatch(fetchLostItems());
    dispatch(fetchFeedback());
    dispatch(fetchAnnouncements());
  }, [dispatch]);

  // Filter data for faculty
  const myEvents = events.filter(e => e.createdBy?._id === user?.id);
  const upcomingEvents = events.filter(e => new Date(e.date) >= new Date()).slice(0, 5);
  const pendingFeedback = feedbackList.filter(f => f.status === 'pending').slice(0, 5);
  const recentAnnouncements = announcements.slice(0, 3);

  const stats = [
    {
      title: 'My Events',
      value: myEvents.length,
      icon: <Event fontSize="large" />,
      color: '#3f51b5',
      bgColor: '#e8eaf6',
    },
    {
      title: 'Total Events',
      value: events.length,
      icon: <Event fontSize="large" />,
      color: '#f50057',
      bgColor: '#fce4ec',
    },
    {
      title: 'Pending Feedback',
      value: pendingFeedback.length,
      icon: <Feedback fontSize="large" />,
      color: '#ff9800',
      bgColor: '#fff3e0',
    },
    {
      title: 'Lost & Found',
      value: items.length,
      icon: <FindInPage fontSize="large" />,
      color: '#4caf50',
      bgColor: '#e8f5e9',
    },
  ];

  return (
    <Box>
      <Box mb={3}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Welcome back, {user?.name}!
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Faculty Dashboard - Manage events and monitor campus activities
        </Typography>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} mb={4}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card elevation={2}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Box
                    sx={{
                      width: 50,
                      height: 50,
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: stat.bgColor,
                      color: stat.color,
                    }}
                  >
                    {stat.icon}
                  </Box>
                  <TrendingUp color="success" />
                </Box>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                  {stat.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stat.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Quick Actions */}
      <Grid container spacing={2} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Button
            fullWidth
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate('/events')}
          >
            Create Event
          </Button>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Button
            fullWidth
            variant="contained"
            color="secondary"
            startIcon={<Campaign />}
            onClick={() => navigate('/announcements')}
          >
            New Announcement
          </Button>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<Event />}
            onClick={() => navigate('/events')}
          >
            View All Events
          </Button>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<Feedback />}
            onClick={() => navigate('/feedback')}
          >
            View Feedback
          </Button>
        </Grid>
      </Grid>

      {/* Content Grid */}
      <Grid container spacing={3}>
        {/* Upcoming Events */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" fontWeight="bold">
                Upcoming Events
              </Typography>
              <Button size="small" onClick={() => navigate('/events')}>
                View All
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            {upcomingEvents.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No upcoming events
              </Typography>
            ) : (
              <List>
                {upcomingEvents.map((event) => (
                  <ListItem
                    key={event._id}
                    sx={{
                      borderRadius: 1,
                      mb: 1,
                      bgcolor: 'background.default',
                      cursor: 'pointer',
                      '&:hover': { bgcolor: 'action.hover' },
                    }}
                    onClick={() => navigate(`/events/${event._id}`)}
                  >
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography variant="body1" fontWeight="medium">
                            {event.title}
                          </Typography>
                          <Chip label={event.category} size="small" />
                        </Box>
                      }
                      secondary={
                        <>
                          {format(new Date(event.date), 'MMM dd, yyyy')} • {event.venue}
                          {event.createdBy?._id === user?.id && (
                            <Chip label="By You" size="small" color="primary" sx={{ ml: 1 }} />
                          )}
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Grid>

        {/* Pending Feedback */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" fontWeight="bold">
                Pending Feedback
              </Typography>
              <Button size="small" onClick={() => navigate('/feedback')}>
                View All
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            {pendingFeedback.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No pending feedback
              </Typography>
            ) : (
              <List>
                {pendingFeedback.map((feedback) => (
                  <ListItem
                    key={feedback._id}
                    sx={{
                      borderRadius: 1,
                      mb: 1,
                      bgcolor: 'background.default',
                      cursor: 'pointer',
                      '&:hover': { bgcolor: 'action.hover' },
                    }}
                    onClick={() => navigate('/feedback')}
                  >
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography variant="body1" fontWeight="medium">
                            {feedback.subject}
                          </Typography>
                          <Chip
                            label={feedback.priority}
                            size="small"
                            color={
                              feedback.priority === 'high'
                                ? 'error'
                                : feedback.priority === 'medium'
                                ? 'warning'
                                : 'default'
                            }
                          />
                        </Box>
                      }
                      secondary={
                        <>
                          {feedback.category} • {format(new Date(feedback.createdAt), 'MMM dd')}
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Grid>

        {/* Recent Announcements */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" fontWeight="bold">
                Recent Announcements
              </Typography>
              <Button size="small" onClick={() => navigate('/announcements')}>
                View All
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            {recentAnnouncements.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No recent announcements
              </Typography>
            ) : (
              <List>
                {recentAnnouncements.map((announcement) => (
                  <ListItem
                    key={announcement._id}
                    sx={{
                      borderRadius: 1,
                      mb: 1,
                      bgcolor: 'background.default',
                    }}
                  >
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography variant="body1" fontWeight="medium">
                            {announcement.title}
                          </Typography>
                          {announcement.isPinned && (
                            <Chip label="Pinned" size="small" color="primary" />
                          )}
                          <Chip label={announcement.category} size="small" />
                        </Box>
                      }
                      secondary={
                        <>
                          {announcement.content.substring(0, 100)}...
                          <br />
                          <Typography variant="caption" color="text.secondary">
                            {format(new Date(announcement.createdAt), 'MMM dd, yyyy')}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FacultyDashboard;
