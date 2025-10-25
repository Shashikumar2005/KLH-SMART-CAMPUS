import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  TextField,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  IconButton,
  Collapse,
} from '@mui/material';
import {
  Add,
  ExpandMore,
  ExpandLess,
  HourglassEmpty,
  Autorenew,
  CheckCircle,
  Warning,
} from '@mui/icons-material';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import { fetchGrievances } from '../redux/slices/grievanceSlice';
import { grievanceAPI } from '../services/api';

const Grievances = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { grievanceList, loading } = useSelector((state) => state.grievances);

  const [openDialog, setOpenDialog] = useState(false);
  const [openResponseDialog, setOpenResponseDialog] = useState(false);
  const [selectedGrievance, setSelectedGrievance] = useState(null);
  const [responseText, setResponseText] = useState('');
  const [actionTaken, setActionTaken] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [expandedItems, setExpandedItems] = useState({});

  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    category: 'other',
    severity: 'medium',
    priority: 'medium',
    isAnonymous: false,
  });

  useEffect(() => {
    dispatch(fetchGrievances());
  }, [dispatch]);

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({
      subject: '',
      description: '',
      category: 'other',
      severity: 'medium',
      priority: 'medium',
      isAnonymous: false,
    });
  };

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await grievanceAPI.create(formData);
      toast.success('Grievance submitted successfully');
      dispatch(fetchGrievances());
      handleCloseDialog();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit grievance');
    }
  };

  const handleOpenResponseDialog = (grievance) => {
    setSelectedGrievance(grievance);
    setOpenResponseDialog(true);
  };

  const handleSubmitResponse = async () => {
    try {
      await grievanceAPI.respond(selectedGrievance._id, {
        response: responseText,
        actionTaken,
        status: 'action-taken'
      });
      toast.success('Response submitted successfully');
      dispatch(fetchGrievances());
      setOpenResponseDialog(false);
      setSelectedGrievance(null);
      setResponseText('');
      setActionTaken('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit response');
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await grievanceAPI.updateStatus(id, { status });
      toast.success(`Status updated to ${status}`);
      dispatch(fetchGrievances());
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const toggleExpand = (id) => {
    setExpandedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const getSeverityColor = (severity) => {
    const colors = {
      low: 'success',
      medium: 'warning',
      high: 'error',
      critical: 'error',
    };
    return colors[severity] || 'default';
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'warning',
      'under-review': 'info',
      investigating: 'info',
      'action-taken': 'primary',
      resolved: 'success',
      closed: 'default',
    };
    return colors[status] || 'default';
  };

  const canRespond = user?.role === 'faculty' || user?.role === 'admin';

  const filteredGrievances = filterStatus === 'all'
    ? (grievanceList || [])
    : (grievanceList || []).filter(g => g.status === filterStatus);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Grievances
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Report and track serious complaints and issues
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="error"
          startIcon={<Add />}
          onClick={handleOpenDialog}
        >
          Submit Grievance
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
          <MenuItem value="under-review">Under Review</MenuItem>
          <MenuItem value="investigating">Investigating</MenuItem>
          <MenuItem value="action-taken">Action Taken</MenuItem>
          <MenuItem value="resolved">Resolved</MenuItem>
          <MenuItem value="closed">Closed</MenuItem>
        </TextField>
      </Box>

      {filteredGrievances.length === 0 ? (
        <Alert severity="info">
          No grievances found. Submit your first grievance if you face any serious issues.
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {filteredGrievances.map((grievance) => (
            <Grid item xs={12} key={grievance._id}>
              <Card>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                    <Box display="flex" gap={1} flexWrap="wrap">
                      <Chip
                        label={grievance.category}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                      <Chip
                        label={grievance.severity}
                        size="small"
                        color={getSeverityColor(grievance.severity)}
                      />
                      <Chip
                        label={grievance.status}
                        size="small"
                        color={getStatusColor(grievance.status)}
                      />
                    </Box>
                  </Box>

                  <Typography variant="h6" gutterBottom>
                    {grievance.subject}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Submitted by {grievance.isAnonymous ? 'Anonymous' : grievance.submittedBy?.name} on{' '}
                    {format(new Date(grievance.createdAt), 'MMM dd, yyyy hh:mm a')}
                  </Typography>

                  {canRespond && grievance.status !== 'resolved' && grievance.status !== 'closed' && (
                    <Box mt={2} display="flex" gap={1}>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleUpdateStatus(grievance._id, 'under-review')}
                        disabled={grievance.status !== 'pending'}
                      >
                        Mark Under Review
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleUpdateStatus(grievance._id, 'investigating')}
                      >
                        Mark Investigating
                      </Button>
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => handleOpenResponseDialog(grievance)}
                      >
                        Respond
                      </Button>
                      <Button
                        size="small"
                        variant="contained"
                        color="success"
                        onClick={() => handleUpdateStatus(grievance._id, 'resolved')}
                      >
                        Mark Resolved
                      </Button>
                    </Box>
                  )}

                  <Typography variant="body2" sx={{ mt: 2, whiteSpace: 'pre-wrap' }}>
                    {grievance.description}
                  </Typography>

                  {grievance.response && (
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
                        Response from {grievance.respondedBy?.name}
                      </Typography>
                      <Typography variant="body2">
                        {grievance.response}
                      </Typography>
                      {grievance.actionTaken && (
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          <strong>Action Taken:</strong> {grievance.actionTaken}
                        </Typography>
                      )}
                      <Typography variant="caption" color="text.secondary" display="block" mt={1}>
                        {format(new Date(grievance.respondedAt), 'MMM dd, yyyy hh:mm a')}
                      </Typography>
                    </Box>
                  )}

                  <Box mt={2} display="flex" justifyContent="flex-end">
                    <IconButton
                      size="small"
                      onClick={() => toggleExpand(grievance._id)}
                    >
                      {expandedItems[grievance._id] ? <ExpandLess /> : <ExpandMore />}
                    </IconButton>
                  </Box>

                  <Collapse in={expandedItems[grievance._id]}>
                    <Box mt={2} p={2} sx={{ bgcolor: 'action.hover', borderRadius: 1 }}>
                      <Typography variant="caption" color="text.secondary" display="block">
                        <strong>Grievance ID:</strong> {grievance._id}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block">
                        <strong>Last Updated:</strong> {format(new Date(grievance.updatedAt), 'MMM dd, yyyy hh:mm a')}
                      </Typography>
                    </Box>
                  </Collapse>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Submit Grievance Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Submit Grievance</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            {user?.role === 'faculty' && (
              <Alert severity="info" sx={{ mb: 2 }}>
                <Typography variant="body2" fontWeight="600">
                  ✨ Staff Access: You can submit and manage grievances directly!
                </Typography>
              </Alert>
            )}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                fullWidth
                label="Subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
              />
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={4}
                required
              />
              <TextField
                select
                fullWidth
                label="Category"
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <MenuItem value="harassment">Harassment</MenuItem>
                <MenuItem value="discrimination">Discrimination</MenuItem>
                <MenuItem value="safety">Safety</MenuItem>
                <MenuItem value="facilities">Facilities</MenuItem>
                <MenuItem value="academic">Academic</MenuItem>
                <MenuItem value="administrative">Administrative</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </TextField>
              <TextField
                select
                fullWidth
                label="Severity"
                name="severity"
                value={formData.severity}
                onChange={handleChange}
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
                <MenuItem value="critical">Critical</MenuItem>
              </TextField>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" variant="contained" color="error">
              Submit Grievance
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Response Dialog */}
      <Dialog open={openResponseDialog} onClose={() => setOpenResponseDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Respond to Grievance</DialogTitle>
        <DialogContent>
          {selectedGrievance && (
            <Box>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                {selectedGrievance.subject}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {selectedGrievance.description}
              </Typography>
              <TextField
                fullWidth
                label="Response *"
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                multiline
                rows={4}
                sx={{ mt: 2 }}
                required
              />
              <TextField
                fullWidth
                label="Action Taken"
                value={actionTaken}
                onChange={(e) => setActionTaken(e.target.value)}
                multiline
                rows={2}
                sx={{ mt: 2 }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenResponseDialog(false)}>Cancel</Button>
          <Button onClick={handleSubmitResponse} variant="contained" color="primary">
            Submit Response
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Grievances;
