import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Alert,
  Tabs,
  Tab,
  Avatar,
  CircularProgress,
} from '@mui/material';
import {
  People,
  Event,
  FindInPage,
  Feedback,
  Campaign,
  Edit,
  Delete,
  Block,
  CheckCircle,
  Add,
  Refresh,
} from '@mui/icons-material';
import { fetchEvents } from '../redux/slices/eventSlice';
import { fetchLostItems } from '../redux/slices/lostItemSlice';
import { fetchFeedback } from '../redux/slices/feedbackSlice';
import { fetchAnnouncements } from '../redux/slices/announcementSlice';
import { authAPI, clubAPI, pollAPI } from '../services/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { io } from 'socket.io-client';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { events } = useSelector((state) => state.events);
  const { items } = useSelector((state) => state.lostItems);
  const { feedbackList } = useSelector((state) => state.feedback);
  const { announcements } = useSelector((state) => state.announcements);

  const [activeTab, setActiveTab] = useState(0);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editUserDialog, setEditUserDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState('');
  const [pendingClubs, setPendingClubs] = useState([]);
  const [pendingPolls, setPendingPolls] = useState([]);

  // Fetch all data
  useEffect(() => {
    loadAllData();

    // Set up Socket.IO connection for real-time updates
    const socket = io('http://localhost:5000');

    socket.on('eventUpdated', () => {
      dispatch(fetchEvents());
    });

    return () => {
      socket.disconnect();
    };
  }, [dispatch]);

  const loadAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        dispatch(fetchEvents()),
        dispatch(fetchLostItems()),
        dispatch(fetchFeedback()),
        dispatch(fetchAnnouncements()),
        fetchUsers(),
        fetchPendingClubs(),
        fetchPendingPolls(),
      ]);
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await authAPI.getAllUsers();
      setUsers(response.data.data || []);
    } catch (error) {
      toast.error('Failed to fetch users');
    }
  };

  const fetchPendingClubs = async () => {
    try {
      const response = await clubAPI.getPending();
      setPendingClubs(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch pending clubs:', error);
    }
  };

  const fetchPendingPolls = async () => {
    try {
      const response = await pollAPI.getPending();
      setPendingPolls(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch pending polls:', error);
    }
  };

  const handleApproveClub = async (clubId) => {
    try {
      await clubAPI.approve(clubId);
      toast.success('Club approved successfully');
      fetchPendingClubs();
    } catch (error) {
      toast.error('Failed to approve club');
    }
  };

  const handleRejectClub = async (clubId) => {
    const reason = window.prompt('Please provide a reason for rejection:');
    if (reason) {
      try {
        await clubAPI.reject(clubId, { reason });
        toast.success('Club rejected');
        fetchPendingClubs();
      } catch (error) {
        toast.error('Failed to reject club');
      }
    }
  };

  const handleApprovePoll = async (pollId) => {
    try {
      await pollAPI.approve(pollId);
      toast.success('Poll approved successfully');
      fetchPendingPolls();
    } catch (error) {
      toast.error('Failed to approve poll');
    }
  };

  const handleRejectPoll = async (pollId) => {
    const reason = window.prompt('Please provide a reason for rejection:');
    if (reason) {
      try {
        await pollAPI.reject(pollId, { reason });
        toast.success('Poll rejected');
        fetchPendingPolls();
      } catch (error) {
        toast.error('Failed to reject poll');
      }
    }
  };

  const handleEditRole = (user) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setEditUserDialog(true);
  };

  const handleUpdateRole = async () => {
    try {
      await authAPI.updateUserRole(selectedUser._id, newRole);
      toast.success('User role updated successfully');
      setEditUserDialog(false);
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update role');
    }
  };

  const handleDeactivateUser = async (userId) => {
    if (window.confirm('Are you sure you want to deactivate this user?')) {
      try {
        await authAPI.deactivateUser(userId);
        toast.success('User deactivated successfully');
        fetchUsers();
      } catch (error) {
        toast.error('Failed to deactivate user');
      }
    }
  };

  // Statistics
  const stats = [
    {
      title: 'Total Users',
      value: users.length,
      icon: <People fontSize="large" />,
      color: '#3f51b5',
      bgColor: '#e8eaf6',
      details: `${users.filter(u => u.role === 'student').length} Students, ${users.filter(u => u.role === 'faculty').length} Faculty`,
    },
    {
      title: 'Total Events',
      value: events.length,
      icon: <Event fontSize="large" />,
      color: '#f50057',
      bgColor: '#fce4ec',
      details: `${events.filter(e => new Date(e.date) >= new Date()).length} Upcoming`,
    },
    {
      title: 'Lost & Found',
      value: items.length,
      icon: <FindInPage fontSize="large" />,
      color: '#ff9800',
      bgColor: '#fff3e0',
      details: `${items.filter(i => i.status === 'pending-approval').length} Pending Approval`,
    },
    {
      title: 'Feedback',
      value: feedbackList.length,
      icon: <Feedback fontSize="large" />,
      color: '#4caf50',
      bgColor: '#e8f5e9',
      details: `${feedbackList.filter(f => f.status === 'pending').length} Pending`,
    },
    {
      title: 'Announcements',
      value: announcements.length,
      icon: <Campaign fontSize="large" />,
      color: '#9c27b0',
      bgColor: '#f3e5f5',
      details: `${announcements.filter(a => a.isPinned).length} Pinned`,
    },
  ];

  // Pending approvals count
  const totalPendingApprovals = pendingClubs.length + pendingPolls.length;

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Admin Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Complete system control and management
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={loadAllData}
        >
          Refresh All
        </Button>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} mb={4}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={2.4} key={index}>
            <Card
              elevation={2}
              sx={{
                height: '100%',
                transition: 'transform 0.2s',
                '&:hover': { transform: 'translateY(-4px)' },
              }}
            >
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
                </Box>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                  {stat.value}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {stat.title}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {stat.details}
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
            onClick={() => navigate('/events/create')}
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
            onClick={() => navigate('/announcements/create')}
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
            Manage Events
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

      {/* Tabs for detailed management */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label={`Users (${users.length})`} />
          <Tab label={`Events (${events.length})`} />
          <Tab label={`Lost & Found (${items.length})`} />
          <Tab label={`Feedback (${feedbackList.length})`} />
          <Tab 
            label={`Pending Approvals (${totalPendingApprovals})`} 
            icon={totalPendingApprovals > 0 ? <Chip label={totalPendingApprovals} size="small" color="warning" /> : null}
          />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      {activeTab === 0 && (
        <Paper>
          <Box p={2} display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">User Management</Typography>
            <Typography variant="body2" color="text.secondary">
              Total: {users.length} users
            </Typography>
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                          {user.name.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight="medium">
                            {user.name}
                          </Typography>
                          {user.studentId && (
                            <Typography variant="caption" color="text.secondary">
                              ID: {user.studentId}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Chip
                        label={user.role}
                        size="small"
                        color={
                          user.role === 'admin'
                            ? 'error'
                            : user.role === 'faculty'
                            ? 'primary'
                            : 'default'
                        }
                      />
                    </TableCell>
                    <TableCell>{user.department || 'N/A'}</TableCell>
                    <TableCell>
                      <Chip
                        icon={user.isActive ? <CheckCircle /> : <Block />}
                        label={user.isActive ? 'Active' : 'Inactive'}
                        size="small"
                        color={user.isActive ? 'success' : 'default'}
                      />
                    </TableCell>
                    <TableCell align="right">
                      {user._id !== user._id && (
                        <>
                          <IconButton
                            size="small"
                            onClick={() => handleEditRole(user)}
                            title="Edit Role"
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDeactivateUser(user._id)}
                            title="Deactivate"
                            color="error"
                          >
                            <Block fontSize="small" />
                          </IconButton>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {activeTab === 1 && (
        <Paper>
          <Box p={2}>
            <Typography variant="h6">Event Management</Typography>
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Event</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Date & Time</TableCell>
                  <TableCell>Venue</TableCell>
                  <TableCell>Created By</TableCell>
                  <TableCell>Interested</TableCell>
                  <TableCell>Registrations</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {events.slice(0, 10).map((event) => (
                  <TableRow key={event._id}>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {event.title}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={event.category} size="small" />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {event.date ? format(new Date(event.date), 'MMM dd, yyyy') : 'N/A'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {event.time || 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell>{event.venue}</TableCell>
                    <TableCell>{event.createdBy?.name || event.organizerName || 'Unknown'}</TableCell>
                    <TableCell>
                      <Chip
                        label={event.interestedUsers?.length || 0}
                        size="small"
                        color="success"
                        variant="outlined"
                        icon={<EventAvailable />}
                        sx={{ cursor: 'pointer' }}
                        onClick={() => navigate(`/events/${event._id}`)}
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<People />}
                        onClick={() => navigate(`/events/${event._id}`)}
                        disabled={!event.registeredUsers || event.registeredUsers.length === 0}
                      >
                        {event.registeredUsers?.length || 0}
                        {event.maxParticipants && `/${event.maxParticipants}`}
                      </Button>
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        size="small"
                        onClick={() => navigate(`/events/${event._id}`)}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {activeTab === 2 && (
        <Paper>
          <Box p={2}>
            <Typography variant="h6">Lost & Found Management</Typography>
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Item</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Reporter</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.slice(0, 10).map((item) => (
                  <TableRow key={item._id}>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {item.title}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={item.type}
                        size="small"
                        color={item.type === 'lost' ? 'error' : 'success'}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip label={item.category} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell>{item.location}</TableCell>
                    <TableCell>
                      {format(new Date(item.date), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={item.status}
                        size="small"
                        color={item.status === 'claimed' ? 'success' : 'default'}
                      />
                    </TableCell>
                    <TableCell>{item.reportedBy?.name || 'Anonymous'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {activeTab === 3 && (
        <Paper>
          <Box p={2}>
            <Typography variant="h6">Feedback Management</Typography>
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Priority</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Submitted By</TableCell>
                  <TableCell>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {feedbackList.slice(0, 10).map((feedback) => (
                  <TableRow key={feedback._id}>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {feedback.subject}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={feedback.category} size="small" />
                    </TableCell>
                    <TableCell>
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
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={feedback.status}
                        size="small"
                        color={
                          feedback.status === 'resolved'
                            ? 'success'
                            : feedback.status === 'in-progress'
                            ? 'info'
                            : 'default'
                        }
                      />
                    </TableCell>
                    <TableCell>
                      {feedback.isAnonymous
                        ? 'Anonymous'
                        : feedback.submittedBy?.name || 'Unknown'}
                    </TableCell>
                    <TableCell>
                      {format(new Date(feedback.createdAt), 'MMM dd, yyyy')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* Pending Approvals Tab */}
      {activeTab === 4 && (
        <Box>
          {/* Pending Clubs */}
          {pendingClubs.length > 0 && (
            <Paper sx={{ mb: 3 }}>
              <Box p={2}>
                <Typography variant="h6">Pending Clubs ({pendingClubs.length})</Typography>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Club Name</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell>President</TableCell>
                      <TableCell>Created Date</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {pendingClubs.map((club) => (
                      <TableRow key={club._id}>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <Avatar src={club.logo} sx={{ mr: 2 }}>
                              {club.name.charAt(0)}
                            </Avatar>
                            <Box>
                              <Typography variant="body2" fontWeight="medium">
                                {club.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {club.description.substring(0, 50)}...
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip label={club.category} size="small" color="primary" variant="outlined" />
                        </TableCell>
                        <TableCell>
                          {club.president?.name || 'Unknown'}
                        </TableCell>
                        <TableCell>
                          {format(new Date(club.createdAt), 'MMM dd, yyyy')}
                        </TableCell>
                        <TableCell>
                          <Box display="flex" gap={1}>
                            <Button
                              size="small"
                              variant="contained"
                              color="success"
                              startIcon={<CheckCircle />}
                              onClick={() => handleApproveClub(club._id)}
                            >
                              Approve
                            </Button>
                            <Button
                              size="small"
                              variant="outlined"
                              color="error"
                              startIcon={<Block />}
                              onClick={() => handleRejectClub(club._id)}
                            >
                              Reject
                            </Button>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          )}

          {/* Pending Polls */}
          {pendingPolls.length > 0 && (
            <Paper>
              <Box p={2}>
                <Typography variant="h6">Pending Polls ({pendingPolls.length})</Typography>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Question</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Created By</TableCell>
                      <TableCell>End Date</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {pendingPolls.map((poll) => (
                      <TableRow key={poll._id}>
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">
                            {poll.question}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {poll.options.length} options
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip label={poll.category} size="small" />
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={poll.type === 'single' ? 'Single Choice' : 'Multiple Choice'} 
                            size="small" 
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          {poll.createdBy?.name || 'Unknown'}
                        </TableCell>
                        <TableCell>
                          {format(new Date(poll.endDate), 'MMM dd, yyyy')}
                        </TableCell>
                        <TableCell>
                          <Box display="flex" gap={1}>
                            <Button
                              size="small"
                              variant="contained"
                              color="success"
                              startIcon={<CheckCircle />}
                              onClick={() => handleApprovePoll(poll._id)}
                            >
                              Approve
                            </Button>
                            <Button
                              size="small"
                              variant="outlined"
                              color="error"
                              startIcon={<Block />}
                              onClick={() => handleRejectPoll(poll._id)}
                            >
                              Reject
                            </Button>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          )}

          {/* No Pending Items */}
          {pendingClubs.length === 0 && pendingPolls.length === 0 && (
            <Paper>
              <Box p={4} textAlign="center">
                <CheckCircle sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  All Caught Up!
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  There are no pending clubs or polls waiting for approval.
                </Typography>
              </Box>
            </Paper>
          )}
        </Box>
      )}

      {/* Edit User Role Dialog */}
      <Dialog open={editUserDialog} onClose={() => setEditUserDialog(false)}>
        <DialogTitle>Edit User Role</DialogTitle>
        <DialogContent>
          <Box sx={{ minWidth: 300, pt: 2 }}>
            <TextField
              fullWidth
              select
              label="New Role"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
            >
              <MenuItem value="student">Student</MenuItem>
              <MenuItem value="faculty">Faculty</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </TextField>
            {selectedUser && (
              <Alert severity="info" sx={{ mt: 2 }}>
                Changing role for: <strong>{selectedUser.name}</strong>
              </Alert>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditUserDialog(false)}>Cancel</Button>
          <Button onClick={handleUpdateRole} variant="contained">
            Update Role
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminDashboard;
