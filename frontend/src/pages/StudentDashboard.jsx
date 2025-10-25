import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  Chip,
} from '@mui/material';
import {
  Event as EventIcon,
  FindInPage as LostFoundIcon,
  Feedback as FeedbackIcon,
  Campaign as AnnouncementIcon,
  Groups as ClubsIcon,
  Poll as PollIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { fetchEvents } from '../redux/slices/eventSlice';
import { fetchAnnouncements } from '../redux/slices/announcementSlice';
import { fetchClubs } from '../redux/slices/clubSlice';
import { fetchPolls } from '../redux/slices/pollSlice';
import { format } from 'date-fns';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { events } = useSelector((state) => state.events);
  const { announcements } = useSelector((state) => state.announcements);
  const { clubList } = useSelector((state) => state.clubs);
  const { pollList } = useSelector((state) => state.polls);

  useEffect(() => {
    dispatch(fetchEvents({ status: 'upcoming' }));
    dispatch(fetchAnnouncements());
    dispatch(fetchClubs());
    dispatch(fetchPolls({ isActive: true }));
  }, [dispatch]);

  const stats = [
    {
      title: 'Upcoming Events',
      value: events.filter(e => e.status === 'upcoming').length,
      icon: <EventIcon sx={{ fontSize: 40 }} />,
      color: '#1976d2',
      action: () => navigate('/events'),
    },
    {
      title: 'Student Clubs',
      value: clubList.length,
      icon: <ClubsIcon sx={{ fontSize: 40 }} />,
      color: '#9c27b0',
      action: () => navigate('/clubs'),
    },
    {
      title: 'Active Polls',
      value: pollList.filter(p => p.isActive).length,
      icon: <PollIcon sx={{ fontSize: 40 }} />,
      color: '#00897b',
      action: () => navigate('/polls'),
    },
    {
      title: 'Lost & Found',
      value: 'View Items',
      icon: <LostFoundIcon sx={{ fontSize: 40 }} />,
      color: '#f57c00',
      action: () => navigate('/lost-found'),
    },
    {
      title: 'Submit Feedback',
      value: 'Share Ideas',
      icon: <FeedbackIcon sx={{ fontSize: 40}} />,
      color: '#388e3c',
      action: () => navigate('/feedback'),
    },
    {
      title: 'Announcements',
      value: announcements.length,
      icon: <AnnouncementIcon sx={{ fontSize: 40 }} />,
      color: '#d32f2f',
      action: () => navigate('/announcements'),
    },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Welcome back, {user?.name}!
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Here's what's happening in your campus today
      </Typography>

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                cursor: 'pointer',
                height: '100%',
              }}
              onClick={stat.action}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box
                    sx={{
                      p: 1,
                      borderRadius: 2,
                      bgcolor: `${stat.color}20`,
                      color: stat.color,
                    }}
                  >
                    {stat.icon}
                  </Box>
                </Box>
                <Typography variant="h4" fontWeight="bold">
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

      {/* Recent Events and Announcements */}
      <Grid container spacing={3} sx={{ mt: 3 }}>
        {/* Upcoming Events */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6" fontWeight="bold">
                Upcoming Events
              </Typography>
              <Button size="small" onClick={() => navigate('/events')}>
                View All
              </Button>
            </Box>
            <List>
              {events.slice(0, 5).map((event) => (
                <ListItem
                  key={event._id}
                  sx={{
                    cursor: 'pointer',
                    '&:hover': { bgcolor: 'action.hover' },
                    borderRadius: 1,
                  }}
                  onClick={() => navigate(`/events/${event._id}`)}
                >
                  <ListItemText
                    primary={event.title}
                    secondary={`${format(new Date(event.date), 'MMM dd, yyyy')} • ${event.venue}`}
                    secondaryTypographyProps={{ component: 'div' }}
                  />
                  <Chip
                    label={event.category}
                    size="small"
                    sx={{ ml: 1 }}
                  />
                </ListItem>
              ))}
              {events.length === 0 && (
                <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
                  No upcoming events
                </Typography>
              )}
            </List>
          </Paper>
        </Grid>

        {/* Recent Announcements */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6" fontWeight="bold">
                Recent Announcements
              </Typography>
              <Button size="small" onClick={() => navigate('/announcements')}>
                View All
              </Button>
            </Box>
            <List>
              {announcements.slice(0, 5).map((announcement) => (
                <ListItem
                  key={announcement._id}
                  sx={{
                    cursor: 'pointer',
                    '&:hover': { bgcolor: 'action.hover' },
                    borderRadius: 1,
                    alignItems: 'flex-start',
                  }}
                >
                  <ListItemText
                    primary={announcement.title}
                    secondary={`${announcement.content.substring(0, 100)}...`}
                    primaryTypographyProps={{
                      sx: { display: 'flex', alignItems: 'center', gap: 1 }
                    }}
                    secondaryTypographyProps={{ component: 'div' }}
                  />
                  {announcement.isPinned && (
                    <Chip label="Pinned" size="small" color="primary" sx={{ mr: 1 }} />
                  )}
                  <Chip
                    label={announcement.category}
                    size="small"
                    color={announcement.priority === 'high' ? 'error' : 'default'}
                  />
                </ListItem>
              ))}
              {announcements.length === 0 && (
                <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
                  No announcements
                </Typography>
              )}
            </List>
          </Paper>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Quick Actions
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2 }}>
          <Button
            variant="contained"
            startIcon={<EventIcon />}
            onClick={() => navigate('/events')}
          >
            Browse Events
          </Button>
          <Button
            variant="contained"
            startIcon={<LostFoundIcon />}
            onClick={() => navigate('/lost-found')}
          >
            Report Lost Item
          </Button>
          <Button
            variant="contained"
            startIcon={<FeedbackIcon />}
            onClick={() => navigate('/feedback')}
          >
            Submit Feedback
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default StudentDashboard;
