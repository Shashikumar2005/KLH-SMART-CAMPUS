import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
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
  FormControlLabel,
  Checkbox,
  IconButton,
  Collapse,
} from '@mui/material';
import {
  Add,
  ExpandMore,
  ExpandLess,
  Reply,
  CheckCircle,
  HourglassEmpty,
  Autorenew,
} from '@mui/icons-material';
import { fetchFeedback } from '../redux/slices/feedbackSlice';
import { feedbackAPI } from '../services/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const Feedback = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { feedbackList, loading } = useSelector((state) => state.feedback);

  const [openDialog, setOpenDialog] = useState(false);
  const [openResponseDialog, setOpenResponseDialog] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [expandedItems, setExpandedItems] = useState({});
  const [responseText, setResponseText] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [formData, setFormData] = useState({
    category: 'facilities',
    subject: '',
    message: '',
    priority: 'medium',
    isAnonymous: false,
  });

  useEffect(() => {
    dispatch(fetchFeedback());
  }, [dispatch]);

  const handleOpenDialog = () => {
    setFormData({
      category: 'facilities',
      subject: '',
      message: '',
      priority: 'medium',
      isAnonymous: false,
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSubmit = async () => {
    try {
      await feedbackAPI.create(formData);
      toast.success('Feedback submitted successfully');
      dispatch(fetchFeedback());
      handleCloseDialog();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit feedback');
    }
  };

  const handleOpenResponseDialog = (feedback) => {
    setSelectedFeedback(feedback);
    setResponseText('');
    setOpenResponseDialog(true);
  };

  const handleSubmitResponse = async () => {
    try {
      await feedbackAPI.respond(selectedFeedback._id, { response: responseText, status: 'reviewed' });
      toast.success('Response submitted successfully');
      dispatch(fetchFeedback());
      setOpenResponseDialog(false);
      setSelectedFeedback(null);
      setResponseText('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit response');
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await feedbackAPI.updateStatus(id, { status });
      toast.success(`Status updated to ${status}`);
      dispatch(fetchFeedback());
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const toggleExpand = (id) => {
    setExpandedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'warning',
      'in-progress': 'info',
      resolved: 'success',
    };
    return colors[status] || 'default';
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: <HourglassEmpty fontSize="small" />,
      'in-progress': <Autorenew fontSize="small" />,
      resolved: <CheckCircle fontSize="small" />,
    };
    return icons[status];
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'success',
      medium: 'warning',
      high: 'error',
    };
    return colors[priority] || 'default';
  };

  const canRespond = user?.role === 'faculty' || user?.role === 'admin';

  const filteredFeedbacks = filterStatus === 'all' 
    ? (feedbackList || [])
    : (feedbackList || []).filter(f => f.status === filterStatus);

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
            Feedback
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Submit feedback and suggestions for campus improvement
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleOpenDialog}
        >
          Submit Feedback
        </Button>
      </Box>

      <Box mb={3}>
        <TextField
          select
          label="Filter by Status"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="pending">Pending</MenuItem>
          <MenuItem value="in-progress">In Progress</MenuItem>
          <MenuItem value="resolved">Resolved</MenuItem>
        </TextField>
      </Box>

      {filteredFeedbacks.length === 0 ? (
        <Alert severity="info">
          No feedback found. Submit your first feedback to help improve the campus!
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {filteredFeedbacks.map((feedback) => (
            <Grid item xs={12} key={feedback._id}>
              <Card>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                    <Box flex={1}>
                      <Box display="flex" gap={1} alignItems="center" mb={1}>
                        <Chip
                          label={feedback.category}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                        <Chip
                          label={feedback.priority}
                          size="small"
                          color={getPriorityColor(feedback.priority)}
                        />
                        <Chip
                          label={feedback.status}
                          size="small"
                          color={getStatusColor(feedback.status)}
                          icon={getStatusIcon(feedback.status)}
                        />
                      </Box>
                      
                      <Typography variant="h6" fontWeight="bold">
                        {feedback.subject}
                      </Typography>
                      
                      <Typography variant="caption" color="text.secondary" display="block">
                        Submitted by {feedback.isAnonymous ? 'Anonymous' : feedback.submittedBy?.name} on{' '}
                        {format(new Date(feedback.createdAt), 'MMM dd, yyyy hh:mm a')}
                      </Typography>
                    </Box>

                    {canRespond && (
                      <Box display="flex" gap={1}>
                        {feedback.status !== 'resolved' && (
                          <>
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => handleUpdateStatus(feedback._id, 'in-progress')}
                              disabled={feedback.status === 'in-progress'}
                            >
                              In Progress
                            </Button>
                            <Button
                              size="small"
                              variant="outlined"
                              color="success"
                              onClick={() => handleUpdateStatus(feedback._id, 'resolved')}
                            >
                              Resolve
                            </Button>
                          </>
                        )}
                        <Button
                          size="small"
                          variant="contained"
                          startIcon={<Reply />}
                          onClick={() => handleOpenResponseDialog(feedback)}
                        >
                          Respond
                        </Button>
                      </Box>
                    )}
                  </Box>

                  <Typography variant="body2" color="text.secondary" paragraph>
                    {feedback.message}
                  </Typography>

                  {feedback.response && (
                    <Box
                      mt={2}
                      p={2}
                      sx={{
                        bgcolor: 'action.hover',
                        borderRadius: 1,
                        borderLeft: 4,
                        borderColor: 'primary.main',
                      }}
                    >
                      <Typography variant="subtitle2" fontWeight="bold" color="primary" gutterBottom>
                        Response from {feedback.respondedBy?.name}
                      </Typography>
                      <Typography variant="body2">
                        {feedback.response}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block" mt={1}>
                        {format(new Date(feedback.respondedAt), 'MMM dd, yyyy hh:mm a')}
                      </Typography>
                    </Box>
                  )}

                  <Box mt={2} display="flex" justifyContent="flex-end">
                    <IconButton
                      size="small"
                      onClick={() => toggleExpand(feedback._id)}
                    >
                      {expandedItems[feedback._id] ? <ExpandLess /> : <ExpandMore />}
                    </IconButton>
                  </Box>

                  <Collapse in={expandedItems[feedback._id]}>
                    <Box mt={2} p={2} sx={{ bgcolor: 'action.hover', borderRadius: 1 }}>
                      <Typography variant="caption" color="text.secondary" display="block">
                        <strong>Feedback ID:</strong> {feedback._id}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block">
                        <strong>Last Updated:</strong> {format(new Date(feedback.updatedAt), 'MMM dd, yyyy hh:mm a')}
                      </Typography>
                    </Box>
                  </Collapse>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Submit Feedback Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Submit Feedback</DialogTitle>
        <DialogContent>
          {user?.role === 'faculty' && (
            <Alert severity="info" sx={{ mt: 2, mb: 2 }}>
              <Typography variant="body2" fontWeight="600">
                ✨ Staff Access: You can submit and respond to feedback directly!
              </Typography>
            </Alert>
          )}
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              select
              label="Category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <MenuItem value="facilities">Facilities</MenuItem>
              <MenuItem value="academic">Academic</MenuItem>
              <MenuItem value="events">Events</MenuItem>
              <MenuItem value="safety">Safety</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </TextField>
            <TextField
              fullWidth
              label="Subject"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              required
            />
            <TextField
              fullWidth
              label="Message"
              multiline
              rows={5}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              required
            />
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
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.isAnonymous}
                  onChange={(e) => setFormData({ ...formData, isAnonymous: e.target.checked })}
                />
              }
              label="Submit anonymously"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      {/* Response Dialog */}
      <Dialog open={openResponseDialog} onClose={() => setOpenResponseDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Respond to Feedback</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            {selectedFeedback && (
              <Box mb={2} p={2} sx={{ bgcolor: 'action.hover', borderRadius: 1 }}>
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                  {selectedFeedback.subject}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedFeedback.message}
                </Typography>
              </Box>
            )}
            <TextField
              fullWidth
              label="Response"
              multiline
              rows={5}
              value={responseText}
              onChange={(e) => setResponseText(e.target.value)}
              placeholder="Type your response here..."
              required
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenResponseDialog(false)}>Cancel</Button>
          <Button onClick={handleSubmitResponse} variant="contained" disabled={!responseText.trim()}>
            Submit Response
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Feedback;
