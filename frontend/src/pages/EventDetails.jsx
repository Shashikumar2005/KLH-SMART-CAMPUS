import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  Grid,
  CircularProgress,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  IconButton,
} from '@mui/material';
import {
  CalendarMonth,
  LocationOn,
  Person,
  EventAvailable,
  Edit,
  Delete,
  ArrowBack,
  Category,
} from '@mui/icons-material';
import { eventsAPI } from '../services/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [markingInterest, setMarkingInterest] = useState(false);

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      const response = await eventsAPI.getOne(id);
      setEvent(response.data);
    } catch (error) {
      toast.error('Failed to load event details');
      navigate('/events');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    setRegistering(true);
    try {
      await eventsAPI.register(id);
      toast.success('Successfully registered for the event!');
      fetchEventDetails();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to register');
    } finally {
      setRegistering(false);
    }
  };

  const handleInterested = async () => {
    setMarkingInterest(true);
    try {
      const isInterested = event?.interestedUsers?.some(u => u._id === user?.id || u === user?.id);
      
      if (isInterested) {
        await eventsAPI.unmarkInterested(id);
        toast.success('Removed from interested list');
      } else {
        await eventsAPI.markInterested(id);
        toast.success('Marked as interested!');
      }
      
      fetchEventDetails();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update interest');
    } finally {
      setMarkingInterest(false);
    }
  };

  const handleEdit = () => {
    navigate(`/events?edit=${id}`);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await eventsAPI.delete(id);
        toast.success('Event deleted successfully');
        navigate('/events');
      } catch (error) {
        toast.error('Failed to delete event');
      }
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      technical: 'primary',
      cultural: 'secondary',
      sports: 'success',
      academic: 'info',
      workshop: 'warning',
      seminar: 'primary',
      other: 'default',
    };
    return colors[category] || 'default';
  };

  const canManage = user?.role === 'admin' || 
    (user?.role === 'faculty' && event?.organizer?._id === user?.id);

  const isRegistered = event?.registeredUsers?.some(
    (regUser) => regUser?._id === user?.id || regUser === user?.id
  );

  const isInterested = event?.interestedUsers?.some(
    (intUser) => intUser?._id === user?.id || intUser === user?.id
  );

  const canRegister = 
    event?.registrationRequired && 
    !isRegistered && 
    user?.role === 'student' &&
    new Date(event.date) > new Date() &&
    (!event.maxParticipants || event.registeredUsers?.length < event.maxParticipants);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!event) {
    return (
      <Box>
        <Alert severity="error">Event not found</Alert>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/events')} sx={{ mt: 2 }}>
          Back to Events
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate('/events')}
        sx={{ mb: 2 }}
      >
        Back to Events
      </Button>

      <Grid container spacing={3}>
        {/* Main Event Details */}
        <Grid item xs={12} md={8}>
          <Card>
            {event.image && (
              <CardMedia
                component="img"
                height="400"
                image={event.image}
                alt={event.title}
                sx={{ objectFit: 'cover' }}
              />
            )}
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                <Box flex={1}>
                  <Box display="flex" gap={1} mb={2}>
                    <Chip
                      label={event.category}
                      color={getCategoryColor(event.category)}
                      icon={<Category />}
                    />
                    {event.registrationRequired ? (
                      <Chip label="Registration Required" color="success" size="small" />
                    ) : (
                      <Chip label="Open Event" color="info" size="small" />
                    )}
                    <Chip label={event.status} size="small" color="default" />
                  </Box>

                  <Typography variant="h4" fontWeight="bold" gutterBottom>
                    {event.title}
                  </Typography>
                </Box>

                {canManage && (
                  <Box display="flex" gap={1}>
                    <IconButton color="primary" onClick={handleEdit}>
                      <Edit />
                    </IconButton>
                    <IconButton color="error" onClick={handleDelete}>
                      <Delete />
                    </IconButton>
                  </Box>
                )}
              </Box>

              <Grid container spacing={2} mb={3}>
                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <CalendarMonth color="action" />
                    <Box>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Date & Time
                      </Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {event.date ? format(new Date(event.date), 'EEEE, MMMM dd, yyyy') : 'Date not set'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {event.time || 'Time not set'}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <LocationOn color="action" />
                    <Box>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Venue
                      </Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {event.venue}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Person color="action" />
                    <Box>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Organized By
                      </Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {event.organizer?.name || 'Unknown'}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <EventAvailable color="action" />
                    <Box>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Registrations
                      </Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {event.registeredUsers?.length || 0} 
                        {event.maxParticipants ? ` / ${event.maxParticipants}` : ''} participants
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" fontWeight="bold" gutterBottom>
                About This Event
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph sx={{ whiteSpace: 'pre-wrap' }}>
                {event.description}
              </Typography>

              {/* Action Buttons */}
              <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
                {/* Register Button (for students with registration required) */}
                {canRegister && (
                  <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    onClick={handleRegister}
                    disabled={registering}
                  >
                    {registering ? <CircularProgress size={24} /> : 'Register for Event'}
                  </Button>
                )}

                {/* I'm Interested Button (for students and staff only, not admin or event creator) */}
                {user?.role !== 'admin' && user?.id !== event.organizer?._id && (
                  <Button
                    variant={isInterested ? 'contained' : 'outlined'}
                    color={isInterested ? 'success' : 'primary'}
                    size="large"
                    fullWidth
                    onClick={handleInterested}
                    disabled={markingInterest}
                    startIcon={isInterested ? <CheckCircle /> : <EventAvailable />}
                  >
                    {markingInterest ? (
                      <CircularProgress size={24} />
                    ) : isInterested ? (
                      "You're Interested ✓"
                    ) : (
                      "I'm Interested"
                    )}
                  </Button>
                )}
              </Box>

              {isRegistered && (
                <Alert severity="success" sx={{ mt: 3 }}>
                  You are registered for this event!
                </Alert>
              )}

              {!canRegister && !isRegistered && user?.role === 'student' && event?.registrationRequired && (
                <Alert severity="info" sx={{ mt: 3 }}>
                  {new Date(event.date) <= new Date()
                    ? 'This event has already passed'
                    : 'Registration is currently closed for this event'}
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          {/* Interested Users */}
          {event.interestedUsers && event.interestedUsers.length > 0 && (
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Interested ({event.interestedUsers.length})
                </Typography>
                <List>
                  {event.interestedUsers.slice(0, 5).map((user, index) => (
                    <ListItem key={index} disablePadding sx={{ mb: 1 }}>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'success.main' }}>
                          {user?.name?.[0] || 'U'}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={user?.name || 'Unknown User'}
                        secondary={
                          <>
                            {user?.role === 'student' ? 'Student' : user?.role === 'faculty' ? 'Faculty' : 'Staff'}
                            {user?.department && ` • ${user.department}`}
                          </>
                        }
                        primaryTypographyProps={{ variant: 'body2', fontWeight: 'medium' }}
                        secondaryTypographyProps={{ variant: 'caption' }}
                      />
                    </ListItem>
                  ))}
                  {event.interestedUsers.length > 5 && (
                    <Typography variant="caption" color="text.secondary" display="block" textAlign="center" mt={1}>
                      + {event.interestedUsers.length - 5} more interested
                    </Typography>
                  )}
                </List>
              </CardContent>
            </Card>
          )}

          {/* Registered Participants */}
          {event.registrationRequired && (
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Registered Participants ({event.registeredUsers?.length || 0})
                </Typography>

                {event.registeredUsers?.length > 0 ? (
                  <List>
                    {event.registeredUsers.slice(0, 10).map((user, index) => (
                      <ListItem key={index} disablePadding sx={{ mb: 1 }}>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: 'primary.main' }}>
                            {user?.name?.[0] || 'U'}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={user?.name || 'Unknown User'}
                          secondary={user?.department || user?.email}
                          primaryTypographyProps={{ variant: 'body2', fontWeight: 'medium' }}
                          secondaryTypographyProps={{ variant: 'caption' }}
                        />
                      </ListItem>
                    ))}
                    {event.registeredUsers.length > 10 && (
                      <Typography variant="caption" color="text.secondary" display="block" textAlign="center" mt={1}>
                        + {event.registeredUsers.length - 10} more participants
                      </Typography>
                    )}
                  </List>
                ) : (
                  <Alert severity="info" sx={{ mt: 2 }}>
                    No registrations yet. Be the first to register!
                  </Alert>
                )}
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default EventDetails;
