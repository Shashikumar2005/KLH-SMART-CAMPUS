import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  IconButton,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  PushPin,
  PushPinOutlined,
  Campaign,
} from '@mui/icons-material';
import { fetchAnnouncements } from '../redux/slices/announcementSlice';
import { announcementsAPI } from '../services/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const Announcements = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { announcements, loading } = useSelector((state) => state.announcements);

  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentAnnouncement, setCurrentAnnouncement] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'general',
    priority: 'medium',
    targetAudience: ['all'],
    expiryDate: '',
    isPinned: false,
  });

  useEffect(() => {
    dispatch(fetchAnnouncements());
  }, [dispatch]);

  const handleOpenDialog = (announcement = null) => {
    if (announcement) {
      setEditMode(true);
      setCurrentAnnouncement(announcement);
      setFormData({
        title: announcement.title,
        content: announcement.content,
        category: announcement.category,
        priority: announcement.priority || 'medium',
        targetAudience: announcement.targetAudience || ['all'],
        expiryDate: announcement.expiryDate
          ? new Date(announcement.expiryDate).toISOString().split('T')[0]
          : '',
        isPinned: announcement.isPinned || false,
      });
    } else {
      setEditMode(false);
      setCurrentAnnouncement(null);
      setFormData({
        title: '',
        content: '',
        category: 'general',
        priority: 'medium',
        targetAudience: ['all'],
        expiryDate: '',
        isPinned: false,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditMode(false);
    setCurrentAnnouncement(null);
  };

  const handleSubmit = async () => {
    try {
      if (editMode && currentAnnouncement) {
        await announcementsAPI.update(currentAnnouncement._id, formData);
        toast.success('Announcement updated successfully');
      } else {
        await announcementsAPI.create(formData);
        toast.success('Announcement created successfully');
      }
      dispatch(fetchAnnouncements());
      handleCloseDialog();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save announcement');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this announcement?')) {
      try {
        await announcementsAPI.delete(id);
        toast.success('Announcement deleted successfully');
        dispatch(fetchAnnouncements());
      } catch (error) {
        toast.error('Failed to delete announcement');
      }
    }
  };

  const handleTogglePin = async (id) => {
    try {
      await announcementsAPI.togglePin(id);
      toast.success('Pin status updated');
      dispatch(fetchAnnouncements());
    } catch (error) {
      toast.error('Failed to update pin status');
    }
  };

  const canManageAnnouncements = user?.role === 'faculty' || user?.role === 'admin';

  const getCategoryColor = (category) => {
    const colors = {
      general: 'default',
      academic: 'primary',
      urgent: 'error',
      event: 'success',
      holiday: 'warning',
    };
    return colors[category] || 'default';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'default',
      medium: 'info',
      high: 'error',
    };
    return colors[priority] || 'default';
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
            Announcements
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Important updates and notifications
          </Typography>
        </Box>
        {canManageAnnouncements && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenDialog()}
          >
            New Announcement
          </Button>
        )}
      </Box>

      {announcements.length === 0 ? (
        <Alert severity="info">No announcements available.</Alert>
      ) : (
        <Grid container spacing={3}>
          {announcements.map((announcement) => (
            <Grid item xs={12} key={announcement._id}>
              <Card
                elevation={announcement.isPinned ? 4 : 1}
                sx={{
                  borderLeft: announcement.isPinned ? 4 : 0,
                  borderColor: 'primary.main',
                }}
              >
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                    <Box display="flex" gap={1} alignItems="center" flexWrap="wrap">
                      {announcement.isPinned && (
                        <Chip
                          icon={<PushPin />}
                          label="Pinned"
                          size="small"
                          color="primary"
                        />
                      )}
                      <Chip
                        label={announcement.category}
                        size="small"
                        color={getCategoryColor(announcement.category)}
                      />
                      <Chip
                        label={announcement.priority}
                        size="small"
                        color={getPriorityColor(announcement.priority)}
                        variant="outlined"
                      />
                    </Box>
                    {canManageAnnouncements && (
                      <Box>
                        {user?.role === 'admin' && (
                          <IconButton
                            size="small"
                            onClick={() => handleTogglePin(announcement._id)}
                            color={announcement.isPinned ? 'primary' : 'default'}
                          >
                            {announcement.isPinned ? <PushPin /> : <PushPinOutlined />}
                          </IconButton>
                        )}
                        <IconButton
                          size="small"
                          onClick={() => handleOpenDialog(announcement)}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDelete(announcement._id)}
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    )}
                  </Box>

                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {announcement.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" paragraph>
                    {announcement.content}
                  </Typography>

                  <Box display="flex" gap={2} mt={2}>
                    <Typography variant="caption" color="text.secondary">
                      Posted: {format(new Date(announcement.createdAt), 'MMM dd, yyyy')}
                    </Typography>
                    {announcement.expiryDate && (
                      <Typography variant="caption" color="text.secondary">
                        Expires: {format(new Date(announcement.expiryDate), 'MMM dd, yyyy')}
                      </Typography>
                    )}
                    <Typography variant="caption" color="text.secondary">
                      By: {announcement.createdBy?.name || 'Unknown'}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editMode ? 'Edit Announcement' : 'Create New Announcement'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
            <TextField
              fullWidth
              label="Content"
              multiline
              rows={4}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              required
            />
            <TextField
              fullWidth
              select
              label="Category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <MenuItem value="general">General</MenuItem>
              <MenuItem value="academic">Academic</MenuItem>
              <MenuItem value="urgent">Urgent</MenuItem>
              <MenuItem value="event">Event</MenuItem>
              <MenuItem value="holiday">Holiday</MenuItem>
            </TextField>
            <TextField
              fullWidth
              select
              label="Priority"
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
            >
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
            </TextField>
            <TextField
              fullWidth
              label="Expiry Date"
              type="date"
              value={formData.expiryDate}
              onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
              InputLabelProps={{ shrink: true }}
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

export default Announcements;
