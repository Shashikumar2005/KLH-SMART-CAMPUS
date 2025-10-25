import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  CircularProgress,
  Alert,
  IconButton,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  People,
  CalendarMonth,
  LocationOn,
  EventAvailable,
} from '@mui/icons-material';
import { fetchEvents } from '../redux/slices/eventSlice';
import { eventsAPI } from '../services/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const Events = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { events, loading } = useSelector((state) => state.events);

  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'academic',
    date: '',
    time: '',
    venue: '',
    department: '',
    registrationRequired: false,
    maxParticipants: '',
  });

  useEffect(() => {
    dispatch(fetchEvents());

    // Set up Socket.IO connection for real-time updates
    const socket = io('http://localhost:5000');

    socket.on('eventUpdated', () => {
      dispatch(fetchEvents());
    });

    return () => {
      socket.disconnect();
    };
  }, [dispatch]);

  const canManageEvents = user?.role === 'faculty' || user?.role === 'admin';

  const handleOpenDialog = (event = null) => {
    if (event) {
      setEditMode(true);
      setCurrentEvent(event);
      setFormData({
        title: event.title,
        description: event.description,
        category: event.category,
        date: new Date(event.date).toISOString().split('T')[0],
        time: event.time,
        venue: event.venue,
        department: event.department || '',
        registrationRequired: event.registrationRequired || false,
        maxParticipants: event.maxParticipants || '',
      });
    } else {
      setEditMode(false);
      setCurrentEvent(null);
      setFormData({
        title: '',
        description: '',
        category: 'academic',
        date: '',
        time: '',
        venue: '',
        department: '',
        registrationRequired: false,
        maxParticipants: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditMode(false);
    setCurrentEvent(null);
  };

  const handleSubmit = async () => {
    try {
      if (editMode && currentEvent) {
        await eventsAPI.update(currentEvent._id, formData);
        toast.success('Event updated successfully');
      } else {
        await eventsAPI.create(formData);
        toast.success('Event created successfully');
      }
      dispatch(fetchEvents());
      handleCloseDialog();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save event');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await eventsAPI.delete(id);
        toast.success('Event deleted successfully');
        dispatch(fetchEvents());
      } catch (error) {
        toast.error('Failed to delete event');
      }
    }
  };

  const handleRegister = async (eventId) => {
    try {
      await eventsAPI.register(eventId);
      toast.success('Registered successfully');
      dispatch(fetchEvents());
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to register');
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      academic: 'primary',
      cultural: 'secondary',
      sports: 'success',
      workshop: 'info',
      seminar: 'warning',
      other: 'default',
    };
    return colors[category] || 'default';
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Campus Events
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Discover and register for upcoming events
          </Typography>
        </Box>
        {canManageEvents && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenDialog()}
          >
            Create Event
          </Button>
        )}
      </Box>

      {events.length === 0 ? (
        <Alert severity="info">No events available at the moment.</Alert>
      ) : (
        <Grid container spacing={3}>
          {events.map((event) => (
            <Grid item xs={12} sm={6} md={4} key={event._id}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  borderRadius: 3,
                  overflow: 'hidden',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                  border: '1px solid',
                  borderColor: (theme) => 
                    theme.palette.mode === 'light'
                      ? 'rgba(0, 0, 0, 0.05)'
                      : 'rgba(255, 255, 255, 0.05)',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'translateY(-12px)',
                    boxShadow: '0 16px 40px rgba(102, 126, 234, 0.25)',
                    borderColor: (theme) => theme.palette.primary.main,
                    '& .event-image': {
                      transform: 'scale(1.1) rotate(2deg)',
                    },
                    '& .event-category': {
                      transform: 'translateX(-4px)',
                    },
                  },
                }}
              >
                {event.imageUrl && (
                  <Box sx={{ overflow: 'hidden', height: 180, position: 'relative' }}>
                    <CardMedia
                      className="event-image"
                      component="img"
                      height="180"
                      image={event.imageUrl}
                      alt={event.title}
                      sx={{
                        transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                      }}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.3) 100%)',
                      }}
                    />
                  </Box>
                )}
                <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
                  <Box display="flex" justifyContent="space-between" mb={1.5}>
                    <Chip
                      className="event-category"
                      label={event.category}
                      size="small"
                      color={getCategoryColor(event.category)}
                      sx={{
                        fontWeight: 600,
                        transition: 'transform 0.3s ease',
                      }}
                    />
                    {canManageEvents && event.createdBy?._id === user?.id && (
                      <Box>
                        <IconButton
                          size="small"
                          onClick={() => handleOpenDialog(event)}
                          sx={{
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'scale(1.2) rotate(10deg)',
                              bgcolor: 'action.hover',
                            },
                          }}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDelete(event._id)}
                          sx={{
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'scale(1.2)',
                              bgcolor: 'error.lighter',
                            },
                          }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Box>
                    )}
                  </Box>

                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {event.title}
                  </Typography>
                  
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    paragraph
                    sx={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {event.description}
                  </Typography>

                  <Box display="flex" alignItems="center" gap={0.5} mb={1}>
                    <CalendarMonth fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      {format(new Date(event.date), 'MMM dd, yyyy')} • {event.time}
                    </Typography>
                  </Box>

                  <Box display="flex" alignItems="center" gap={0.5} mb={1}>
                    <LocationOn fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      {event.venue}
                    </Typography>
                  </Box>

                  {/* Interested Count - Always shown */}
                  <Box display="flex" alignItems="center" gap={0.5} mb={1}>
                    <EventAvailable fontSize="small" sx={{ color: 'success.main' }} />
                    <Typography variant="body2" color="text.secondary">
                      {event.interestedUsers?.length || 0} interested
                    </Typography>
                    {event.interestedUsers?.some(u => u._id === user?.id) && (
                      <Chip 
                        label="You're interested" 
                        size="small" 
                        color="success" 
                        sx={{ ml: 1 }}
                      />
                    )}
                  </Box>

                  {/* Registered Count - Only if registration required */}
                  {event.registrationRequired && (
                    <Box display="flex" alignItems="center" gap={0.5} mb={1}>
                      <People fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {event.registeredUsers?.length || 0}
                        {event.maxParticipants && `/${event.maxParticipants}`} registered
                      </Typography>
                      {event.registeredUsers?.some(u => u._id === user?.id) && (
                        <Chip 
                          label="You're registered" 
                          size="small" 
                          color="primary" 
                          sx={{ ml: 1 }}
                        />
                      )}
                    </Box>
                  )}
                </CardContent>

                <CardActions sx={{ p: 2, pt: 0 }}>
                  {event.registrationRequired && (
                    <Button
                      fullWidth
                      variant={event.registeredUsers?.some(u => u._id === user?.id) ? 'outlined' : 'contained'}
                      color={event.registeredUsers?.some(u => u._id === user?.id) ? 'success' : 'primary'}
                      onClick={() => handleRegister(event._id)}
                      disabled={
                        event.registeredUsers?.some(u => u._id === user?.id) ||
                        (event.maxParticipants &&
                          event.registeredUsers?.length >= event.maxParticipants)
                      }
                      sx={{
                        borderRadius: 2,
                        py: 1,
                        fontWeight: 600,
                        boxShadow: event.registeredUsers?.some(u => u._id === user?.id) 
                          ? 'none' 
                          : '0 4px 12px rgba(25, 118, 210, 0.3)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: event.registeredUsers?.some(u => u._id === user?.id)
                            ? '0 4px 12px rgba(46, 125, 50, 0.2)'
                            : '0 6px 20px rgba(25, 118, 210, 0.4)',
                        },
                      }}
                    >
                      {event.registeredUsers?.some(u => u._id === user?.id)
                        ? '✓ Registered'
                        : event.maxParticipants &&
                          event.registeredUsers?.length >= event.maxParticipants
                        ? 'Full'
                        : 'Register Now'}
                    </Button>
                  )}
                  <Button
                    fullWidth={!event.registrationRequired}
                    onClick={() => navigate(`/events/${event._id}`)}
                    sx={{
                      borderRadius: 2,
                      fontWeight: 600,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        bgcolor: 'action.hover',
                      },
                    }}
                  >
                    View Details
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Create/Edit Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
          },
        }}
      >
        <DialogTitle>
          {editMode ? 'Edit Event' : 'Create New Event'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Event Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
            <TextField
              fullWidth
              select
              label="Category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <MenuItem value="academic">Academic</MenuItem>
              <MenuItem value="cultural">Cultural</MenuItem>
              <MenuItem value="sports">Sports</MenuItem>
              <MenuItem value="workshop">Workshop</MenuItem>
              <MenuItem value="seminar">Seminar</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </TextField>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
            </Grid>
            <TextField
              fullWidth
              label="Venue"
              value={formData.venue}
              onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
              required
            />
            <TextField
              fullWidth
              label="Department (Optional)"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            />
            <TextField
              fullWidth
              label="Max Participants (Optional)"
              type="number"
              value={formData.maxParticipants}
              onChange={(e) => setFormData({ ...formData, maxParticipants: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editMode ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Events;
