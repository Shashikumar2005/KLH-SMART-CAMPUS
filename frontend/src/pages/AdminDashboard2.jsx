import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
  Badge,
  Tooltip,
  Divider,
  LinearProgress,
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
  Groups,
  Poll,
  TrendingUp,
  Notifications,
  Schedule,
  EventAvailable,
} from '@mui/icons-material';
import { fetchEvents } from '../redux/slices/eventSlice';
import { fetchLostItems } from '../redux/slices/lostItemSlice';
import { fetchFeedback } from '../redux/slices/feedbackSlice';
import { fetchAnnouncements } from '../redux/slices/announcementSlice';
import { authAPI, clubAPI, pollAPI } from '../services/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
    },
  },
};

const cardHoverVariants = {
  rest: { scale: 1, boxShadow: '0px 2px 4px rgba(0,0,0,0.1)' },
  hover: {
    scale: 1.05,
    boxShadow: '0px 8px 24px rgba(0,0,0,0.15)',
    transition: { duration: 0.3 },
  },
};

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
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadAllData();
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
      console.error('Load error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await authAPI.getAllUsers();
      setUsers(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const fetchPendingClubs = async () => {
    try {
      const response = await clubAPI.getPending();
      console.log('Pending clubs response:', response.data);
      setPendingClubs(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch pending clubs:', error);
      setPendingClubs([]);
    }
  };

  const fetchPendingPolls = async () => {
    try {
      const response = await pollAPI.getPending();
      console.log('Pending polls response:', response.data);
      setPendingPolls(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch pending polls:', error);
      setPendingPolls([]);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAllData();
    setRefreshing(false);
    toast.success('Data refreshed!');
  };

  const handleApproveClub = async (clubId) => {
    try {
      await clubAPI.approve(clubId);
      toast.success('Club approved successfully! 🎉');
      fetchPendingClubs();
      dispatch(fetchEvents()); // Refresh events as clubs might create events
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
      toast.success('Poll approved successfully! 📊');
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

  const totalPendingApprovals = pendingClubs.length + pendingPolls.length;

  const stats = [
    {
      title: 'Total Users',
      value: users.length,
      icon: <People fontSize="large" />,
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      details: `${users.filter((u) => u.role === 'student').length} Students, ${
        users.filter((u) => u.role === 'faculty').length
      } Faculty`,
      trend: '+12%',
    },
    {
      title: 'Events',
      value: events.length,
      icon: <Event fontSize="large" />,
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      details: `${events.filter((e) => new Date(e.date) >= new Date()).length} Upcoming`,
      trend: '+8%',
    },
    {
      title: 'Clubs',
      value: pendingClubs.length,
      icon: <Groups fontSize="large" />,
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      details: 'Pending Approval',
      trend: 'New',
      highlight: pendingClubs.length > 0,
    },
    {
      title: 'Polls',
      value: pendingPolls.length,
      icon: <Poll fontSize="large" />,
      gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      details: 'Pending Approval',
      trend: 'New',
      highlight: pendingPolls.length > 0,
    },
    {
      title: 'Lost & Found',
      value: items.length,
      icon: <FindInPage fontSize="large" />,
      gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      details: `${items.filter((i) => i.status === 'pending-approval').length} Pending`,
      trend: '+5%',
    },
    {
      title: 'Feedback',
      value: feedbackList.length,
      icon: <Feedback fontSize="large" />,
      gradient: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
      details: `${feedbackList.filter((f) => f.status === 'pending').length} Pending`,
      trend: '+15%',
    },
  ];

  if (loading) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h6" sx={{ mt: 3 }} color="text.secondary">
          Loading Dashboard...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ pb: 4 }}>
      {/* Animated Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={4}
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: 3,
            p: 3,
            color: 'white',
            boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
          }}
        >
          <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              👋 Welcome back, {user?.name}!
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              Here's what's happening with your campus today
            </Typography>
          </Box>
          <Tooltip title="Refresh Data">
            <IconButton
              onClick={handleRefresh}
              disabled={refreshing}
              sx={{
                bgcolor: 'rgba(255,255,255,0.2)',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
                color: 'white',
              }}
            >
              <motion.div
                animate={refreshing ? { rotate: 360 } : {}}
                transition={{ duration: 1, repeat: refreshing ? Infinity : 0, ease: 'linear' }}
              >
                <Refresh />
              </motion.div>
            </IconButton>
          </Tooltip>
        </Box>
      </motion.div>

      {/* Animated Stats Grid */}
      <motion.div variants={containerVariants} initial="hidden" animate="visible">
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={4} lg={2} key={index}>
              <Tooltip
                title={
                  <Box>
                    <Typography variant="body2" fontWeight="bold">{stat.title}</Typography>
                    <Typography variant="caption">{stat.details}</Typography>
                    <br />
                    <Typography variant="caption" sx={{ color: '#90EE90' }}>
                      Trend: {stat.trend}
                    </Typography>
                    {stat.highlight && (
                      <>
                        <br />
                        <Typography variant="caption" sx={{ color: '#FFD700' }}>
                          ⚠️ Needs Attention! Click to review
                        </Typography>
                      </>
                    )}
                  </Box>
                }
                arrow
                placement="top"
              >
                <motion.div variants={itemVariants} whileHover="hover" initial="rest">
                  <motion.div variants={cardHoverVariants}>
                    <Card
                      sx={{
                        background: stat.gradient,
                        color: 'white',
                        height: '100%',
                        position: 'relative',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        border: stat.highlight ? '3px solid #FFD700' : 'none',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                        },
                      }}
                      onClick={() => {
                        if (stat.title === 'Total Users') {
                          setActiveTab(0);
                        } else if (stat.title === 'Events') {
                          setActiveTab(1);
                        } else if (stat.title === 'Clubs' || stat.title === 'Polls') {
                          setActiveTab(4);
                        } else if (stat.title === 'Lost & Found') {
                          setActiveTab(2);
                        } else if (stat.title === 'Feedback') {
                          setActiveTab(3);
                        }
                      }}
                    >
                      {stat.highlight && (
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          style={{
                            position: 'absolute',
                            top: 10,
                            right: 10,
                            background: '#FFD700',
                            borderRadius: '50%',
                            width: 12,
                            height: 12,
                          }}
                        />
                      )}
                      <CardContent>
                        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                          <Box>
                            <Typography variant="h3" fontWeight="bold">
                              {stat.value}
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
                              {stat.title}
                            </Typography>
                            <Typography variant="caption" sx={{ opacity: 0.8 }}>
                              {stat.details}
                            </Typography>
                          </Box>
                          <Box sx={{ opacity: 0.8 }}>{stat.icon}</Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </motion.div>
                </motion.div>
              </Tooltip>
            </Grid>
          ))}
        </Grid>
      </motion.div>

      {/* Pending Approvals Alert */}
      <AnimatePresence>
        {totalPendingApprovals > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Alert
              severity="warning"
              icon={<Notifications />}
              sx={{
                mb: 3,
                borderRadius: 2,
                boxShadow: 2,
                cursor: 'pointer',
              }}
              onClick={() => setActiveTab(4)}
            >
              <Typography fontWeight="bold">
                {totalPendingApprovals} item{totalPendingApprovals > 1 ? 's' : ''} waiting for approval!
              </Typography>
              <Typography variant="body2">
                {pendingClubs.length > 0 && `${pendingClubs.length} club${pendingClubs.length > 1 ? 's' : ''}`}
                {pendingClubs.length > 0 && pendingPolls.length > 0 && ' and '}
                {pendingPolls.length > 0 && `${pendingPolls.length} poll${pendingPolls.length > 1 ? 's' : ''}`}
              </Typography>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tabs */}
      <Paper sx={{ mb: 3, borderRadius: 2, overflow: 'hidden' }}>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            '& .MuiTab-root': {
              fontWeight: 600,
              fontSize: '0.95rem',
              transition: 'all 0.3s ease',
              '&:hover': {
                background: 'rgba(102, 126, 234, 0.1)',
                transform: 'translateY(-2px)',
              },
            },
            '& .Mui-selected': {
              color: '#667eea',
            },
          }}
        >
          <Tooltip 
            title={
              <Box>
                <Typography variant="body2" fontWeight="bold">All Users</Typography>
                <Typography variant="caption">Students: {users.filter((u) => u.role === 'student').length}</Typography>
                <br />
                <Typography variant="caption">Faculty: {users.filter((u) => u.role === 'faculty').length}</Typography>
                <br />
                <Typography variant="caption">Admins: {users.filter((u) => u.role === 'admin').length}</Typography>
              </Box>
            }
            arrow
            placement="top"
          >
            <Tab label={`Users (${users.length})`} />
          </Tooltip>
          
          <Tooltip 
            title={
              <Box>
                <Typography variant="body2" fontWeight="bold">Campus Events</Typography>
                <Typography variant="caption">Upcoming: {events.filter((e) => new Date(e.date) >= new Date()).length}</Typography>
                <br />
                <Typography variant="caption">Past: {events.filter((e) => new Date(e.date) < new Date()).length}</Typography>
              </Box>
            }
            arrow
            placement="top"
          >
            <Tab label={`Events (${events.length})`} />
          </Tooltip>
          
          <Tooltip 
            title={
              <Box>
                <Typography variant="body2" fontWeight="bold">Lost & Found Items</Typography>
                <Typography variant="caption">Lost: {items.filter((i) => i.type === 'lost').length}</Typography>
                <br />
                <Typography variant="caption">Found: {items.filter((i) => i.type === 'found').length}</Typography>
                <br />
                <Typography variant="caption">Claimed: {items.filter((i) => i.status === 'claimed').length}</Typography>
              </Box>
            }
            arrow
            placement="top"
          >
            <Tab label={`Lost & Found (${items.length})`} />
          </Tooltip>
          
          <Tooltip 
            title={
              <Box>
                <Typography variant="body2" fontWeight="bold">User Feedback</Typography>
                <Typography variant="caption">Pending: {feedbackList.filter((f) => f.status === 'pending').length}</Typography>
                <br />
                <Typography variant="caption">Reviewed: {feedbackList.filter((f) => f.status === 'reviewed').length}</Typography>
                <br />
                <Typography variant="caption">Anonymous: {feedbackList.filter((f) => f.isAnonymous).length}</Typography>
              </Box>
            }
            arrow
            placement="top"
          >
            <Tab label={`Feedback (${feedbackList.length})`} />
          </Tooltip>
          
          <Tooltip 
            title={
              <Box>
                <Typography variant="body2" fontWeight="bold">Pending Approvals</Typography>
                <Typography variant="caption">Clubs: {pendingClubs.length}</Typography>
                <br />
                <Typography variant="caption">Polls: {pendingPolls.length}</Typography>
                <br />
                <Typography variant="caption" sx={{ color: '#FFD700' }}>Click to review!</Typography>
              </Box>
            }
            arrow
            placement="top"
          >
            <Tab
              label={
                <Box display="flex" alignItems="center" gap={1}>
                  Pending Approvals
                  {totalPendingApprovals > 0 && (
                    <Badge badgeContent={totalPendingApprovals} color="error">
                      <Box />
                    </Badge>
                  )}
                </Box>
              }
            />
          </Tooltip>
        </Tabs>
      </Paper>

      {/* Tab Content with Animations */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {/* Users Tab */}
          {activeTab === 0 && (
            <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
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
                      <TableRow key={user._id} sx={{ '&:hover': { bgcolor: 'action.hover' } }}>
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
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          )}

          {/* Events Tab */}
          {activeTab === 1 && (
            <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
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
                      <TableRow key={event._id} sx={{ '&:hover': { bgcolor: 'action.hover' } }}>
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

          {/* Lost & Found Tab */}
          {activeTab === 2 && (
            <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
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
                      <TableRow key={item._id} sx={{ '&:hover': { bgcolor: 'action.hover' } }}>
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

          {/* Feedback Tab */}
          {activeTab === 3 && (
            <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
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
                      <TableRow key={feedback._id} sx={{ '&:hover': { bgcolor: 'action.hover' } }}>
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
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Paper sx={{ mb: 3, borderRadius: 2, overflow: 'hidden' }}>
                    <Box
                      p={2}
                      sx={{
                        background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                        color: 'white',
                      }}
                    >
                      <Typography variant="h6" fontWeight="bold">
                        🏛️ Pending Clubs ({pendingClubs.length})
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Review and approve student club requests
                      </Typography>
                    </Box>
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Club Info</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell>President</TableCell>
                            <TableCell>Members</TableCell>
                            <TableCell>Created</TableCell>
                            <TableCell align="center">Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {pendingClubs.map((club, index) => (
                            <motion.tr
                              key={club._id}
                              component={TableRow}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              whileHover={{ backgroundColor: '#f5f5f5' }}
                            >
                              <TableCell>
                                <Box display="flex" alignItems="center" gap={2}>
                                  <Avatar
                                    src={club.logo}
                                    sx={{
                                      width: 50,
                                      height: 50,
                                      bgcolor: 'primary.main',
                                    }}
                                  >
                                    {club.name.charAt(0)}
                                  </Avatar>
                                  <Box>
                                    <Typography variant="body1" fontWeight="bold">
                                      {club.name}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                      {club.description.substring(0, 60)}...
                                    </Typography>
                                  </Box>
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Chip
                                  label={club.category}
                                  size="small"
                                  sx={{
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    color: 'white',
                                    fontWeight: 'bold',
                                  }}
                                />
                              </TableCell>
                              <TableCell>
                                <Box display="flex" alignItems="center" gap={1}>
                                  <Avatar sx={{ width: 32, height: 32 }}>
                                    {club.president?.name?.charAt(0) || '?'}
                                  </Avatar>
                                  <Typography variant="body2">
                                    {club.president?.name || 'Unknown'}
                                  </Typography>
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Chip label={`${club.members?.length || 0} members`} size="small" />
                              </TableCell>
                              <TableCell>
                                <Box>
                                  <Typography variant="body2">
                                    {format(new Date(club.createdAt), 'MMM dd, yyyy')}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    {format(new Date(club.createdAt), 'h:mm a')}
                                  </Typography>
                                </Box>
                              </TableCell>
                              <TableCell align="center">
                                <Box display="flex" gap={1} justifyContent="center">
                                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                                    <Button
                                      size="small"
                                      variant="contained"
                                      sx={{
                                        background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                                        color: 'white',
                                        fontWeight: 'bold',
                                      }}
                                      startIcon={<CheckCircle />}
                                      onClick={() => handleApproveClub(club._id)}
                                    >
                                      Approve
                                    </Button>
                                  </motion.div>
                                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                                    <Button
                                      size="small"
                                      variant="outlined"
                                      color="error"
                                      startIcon={<Block />}
                                      onClick={() => handleRejectClub(club._id)}
                                    >
                                      Reject
                                    </Button>
                                  </motion.div>
                                </Box>
                              </TableCell>
                            </motion.tr>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Paper>
                </motion.div>
              )}

              {/* Pending Polls */}
              {pendingPolls.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: pendingClubs.length > 0 ? 0.2 : 0.1 }}
                >
                  <Paper sx={{ mb: 3, borderRadius: 2, overflow: 'hidden' }}>
                    <Box
                      p={2}
                      sx={{
                        background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                        color: 'white',
                      }}
                    >
                      <Typography variant="h6" fontWeight="bold">
                        📊 Pending Polls ({pendingPolls.length})
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Review and approve campus poll requests
                      </Typography>
                    </Box>
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Question</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell>Options</TableCell>
                            <TableCell>Created By</TableCell>
                            <TableCell>End Date</TableCell>
                            <TableCell align="center">Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {pendingPolls.map((poll, index) => (
                            <motion.tr
                              key={poll._id}
                              component={TableRow}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              whileHover={{ backgroundColor: '#f5f5f5' }}
                            >
                              <TableCell>
                                <Typography variant="body1" fontWeight="medium">
                                  {poll.question}
                                </Typography>
                                {poll.description && (
                                  <Typography variant="caption" color="text.secondary">
                                    {poll.description.substring(0, 50)}...
                                  </Typography>
                                )}
                              </TableCell>
                              <TableCell>
                                <Chip
                                  label={poll.category}
                                  size="small"
                                  sx={{
                                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                                    color: 'white',
                                  }}
                                />
                              </TableCell>
                              <TableCell>
                                <Chip
                                  label={poll.type === 'single' ? 'Single Choice' : 'Multiple Choice'}
                                  size="small"
                                  variant="outlined"
                                  color={poll.type === 'single' ? 'primary' : 'secondary'}
                                />
                              </TableCell>
                              <TableCell>
                                <Chip label={`${poll.options.length} options`} size="small" />
                              </TableCell>
                              <TableCell>
                                <Box display="flex" alignItems="center" gap={1}>
                                  <Avatar sx={{ width: 32, height: 32 }}>
                                    {poll.createdBy?.name?.charAt(0) || '?'}
                                  </Avatar>
                                  <Typography variant="body2">
                                    {poll.createdBy?.name || 'Unknown'}
                                  </Typography>
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Box>
                                  <Typography variant="body2">
                                    {format(new Date(poll.endDate), 'MMM dd, yyyy')}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    {format(new Date(poll.endDate), 'h:mm a')}
                                  </Typography>
                                </Box>
                              </TableCell>
                              <TableCell align="center">
                                <Box display="flex" gap={1} justifyContent="center">
                                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                                    <Button
                                      size="small"
                                      variant="contained"
                                      sx={{
                                        background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                                        color: 'white',
                                        fontWeight: 'bold',
                                      }}
                                      startIcon={<CheckCircle />}
                                      onClick={() => handleApprovePoll(poll._id)}
                                    >
                                      Approve
                                    </Button>
                                  </motion.div>
                                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                                    <Button
                                      size="small"
                                      variant="outlined"
                                      color="error"
                                      startIcon={<Block />}
                                      onClick={() => handleRejectPoll(poll._id)}
                                    >
                                      Reject
                                    </Button>
                                  </motion.div>
                                </Box>
                              </TableCell>
                            </motion.tr>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Paper>
                </motion.div>
              )}

              {/* No Pending Items */}
              {pendingClubs.length === 0 && pendingPolls.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Paper
                    sx={{
                      borderRadius: 3,
                      textAlign: 'center',
                      p: 6,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                    }}
                  >
                    <motion.div
                      animate={{ scale: [1, 1.1, 1], rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <CheckCircle sx={{ fontSize: 100, mb: 2 }} />
                    </motion.div>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                      All Caught Up!
                    </Typography>
                    <Typography variant="h6" sx={{ opacity: 0.9 }}>
                      No pending clubs or polls waiting for approval
                    </Typography>
                    <Typography variant="body1" sx={{ opacity: 0.8, mt: 2 }}>
                      Great job keeping everything up to date! 🎉
                    </Typography>
                  </Paper>
                </motion.div>
              )}
            </Box>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Edit User Dialog */}
      <Dialog open={editUserDialog} onClose={() => setEditUserDialog(false)} maxWidth="sm" fullWidth>
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
