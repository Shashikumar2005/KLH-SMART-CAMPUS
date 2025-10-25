import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Chip,
  Avatar,
  IconButton,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  Paper,
} from '@mui/material';
import {
  Add as AddIcon,
  People as PeopleIcon,
  Event as EventIcon,
  EmojiEvents as AchievementIcon,
  Folder as ResourceIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { fetchClubs, createClub, fetchClub, requestJoinClub, clearSelectedClub } from '../redux/slices/clubSlice';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const Clubs = () => {
  const dispatch = useDispatch();
  const { clubList, selectedClub, loading } = useSelector((state) => state.clubs);
  const { user } = useSelector((state) => state.auth);

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState('');
  const [tabValue, setTabValue] = useState(0);

  const [newClub, setNewClub] = useState({
    name: '',
    description: '',
    category: 'technical',
    logo: '',
    coverImage: '',
    socialLinks: {
      website: '',
      instagram: '',
      twitter: '',
    },
    meetingSchedule: {
      day: '',
      time: '',
      location: '',
    },
  });

  useEffect(() => {
    dispatch(fetchClubs({ category: filterCategory }));
  }, [dispatch, filterCategory]);

  const handleCreateClub = async () => {
    if (!newClub.name.trim()) {
      toast.error('Please enter a club name');
      return;
    }

    if (!newClub.description.trim()) {
      toast.error('Please enter a club description');
      return;
    }

    if (newClub.description.trim().length < 20) {
      toast.error('Description must be at least 20 characters long');
      return;
    }

    try {
      const result = await dispatch(createClub(newClub)).unwrap();
      // Show the message from backend (approved or pending)
      toast.success(result.message || 'Club created successfully!');
      setCreateDialogOpen(false);
      setNewClub({
        name: '',
        description: '',
        category: 'technical',
        logo: '',
        coverImage: '',
        socialLinks: { website: '', instagram: '', twitter: '' },
        meetingSchedule: { day: '', time: '', location: '' },
      });
    } catch (error) {
      toast.error(error || 'Failed to create club');
    }
  };

  const handleViewDetails = async (clubId) => {
    await dispatch(fetchClub(clubId));
    setDetailDialogOpen(true);
  };

  const handleJoinClub = async () => {
    try {
      await dispatch(requestJoinClub({ id: selectedClub._id, message: '' })).unwrap();
      toast.success('Membership request sent successfully!');
    } catch (error) {
      toast.error(error || 'Failed to send request');
    }
  };

  const handleCloseDetailDialog = () => {
    setDetailDialogOpen(false);
    dispatch(clearSelectedClub());
  };

  const categories = ['technical', 'cultural', 'sports', 'social', 'academic', 'arts', 'other'];

  const filteredClubs = clubList;

  const isMember = selectedClub?.members?.some(m => m.user._id === user?._id);
  const hasRequested = selectedClub?.membershipRequests?.some(r => r.user._id === user?._id);
  const isPresident = selectedClub?.president?._id === user?._id;

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" fontWeight="bold">
          Student Clubs & Organizations
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateDialogOpen(true)}
        >
          Create Club
        </Button>
      </Box>

      {/* Category Filter */}
      <Box mb={3}>
        <TextField
          select
          label="Filter by Category"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          sx={{ minWidth: 200 }}
          size="small"
        >
          <MenuItem value="">All Categories</MenuItem>
          {categories.map((cat) => (
            <MenuItem key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      {/* Clubs Grid */}
      <Grid container spacing={3}>
        {filteredClubs.map((club) => (
          <Grid item xs={12} sm={6} md={4} key={club._id}>
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
                  transform: 'translateY(-12px) scale(1.02)',
                  boxShadow: '0 16px 40px rgba(102, 126, 234, 0.25)',
                  borderColor: (theme) => theme.palette.primary.main,
                  '& .club-cover': {
                    transform: 'scale(1.15)',
                  },
                  '& .club-avatar': {
                    transform: 'scale(1.1) rotate(5deg)',
                  },
                },
              }}
            >
              {club.coverImage && (
                <Box sx={{ overflow: 'hidden', height: 140, position: 'relative' }}>
                  <CardMedia
                    className="club-cover"
                    component="img"
                    height="140"
                    image={club.coverImage}
                    alt={club.name}
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
                <Box display="flex" alignItems="center" mb={2}>
                  {club.logo ? (
                    <Avatar 
                      src={club.logo} 
                      className="club-avatar"
                      sx={{ 
                        width: 56, 
                        height: 56, 
                        mr: 2,
                        border: '3px solid',
                        borderColor: 'background.paper',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      }} 
                    />
                  ) : (
                    <Avatar 
                      className="club-avatar"
                      sx={{ 
                        width: 56, 
                        height: 56, 
                        mr: 2, 
                        bgcolor: 'primary.main',
                        border: '3px solid',
                        borderColor: 'background.paper',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      }}
                    >
                      {club.name.charAt(0)}
                    </Avatar>
                  )}
                  <Box>
                    <Typography variant="h6" fontWeight="bold">{club.name}</Typography>
                    <Chip
                      label={club.category}
                      size="small"
                      color="primary"
                      variant="outlined"
                      sx={{
                        borderRadius: 1.5,
                        fontWeight: 600,
                      }}
                    />
                  </Box>
                </Box>
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  mb={2}
                  sx={{
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {club.description}
                </Typography>
                <Box display="flex" alignItems="center" gap={2}>
                  <Box display="flex" alignItems="center">
                    <PeopleIcon fontSize="small" sx={{ mr: 0.5, color: 'primary.main' }} />
                    <Typography variant="body2" fontWeight={500}>
                      {club.members?.length || 0} members
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center">
                    <EventIcon fontSize="small" sx={{ mr: 0.5, color: 'secondary.main' }} />
                    <Typography variant="body2" fontWeight={500}>
                      {club.events?.length || 0} events
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
              <Box p={2}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => handleViewDetails(club._id)}
                  sx={{
                    borderRadius: 2,
                    py: 1,
                    fontWeight: 600,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                      bgcolor: 'primary.main',
                      color: 'white',
                      borderColor: 'primary.main',
                    },
                  }}
                >
                  View Details
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Create Club Dialog */}
      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create New Club</DialogTitle>
        <DialogContent>
          {user?.role === 'faculty' && (
            <Paper 
              sx={{ 
                p: 2, 
                mb: 2, 
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(236, 72, 153, 0.1))',
                border: '1px solid rgba(99, 102, 241, 0.3)',
              }}
            >
              <Typography variant="body2" color="primary" fontWeight="600">
                ✨ Staff Privilege: Your clubs will be published immediately without admin approval!
              </Typography>
            </Paper>
          )}
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Club Name"
              fullWidth
              value={newClub.name}
              onChange={(e) => setNewClub({ ...newClub, name: e.target.value })}
              required
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              value={newClub.description}
              onChange={(e) => setNewClub({ ...newClub, description: e.target.value })}
              required
            />
            <TextField
              select
              label="Category"
              fullWidth
              value={newClub.category}
              onChange={(e) => setNewClub({ ...newClub, category: e.target.value })}
            >
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Logo URL"
              fullWidth
              value={newClub.logo}
              onChange={(e) => setNewClub({ ...newClub, logo: e.target.value })}
            />
            <TextField
              label="Cover Image URL"
              fullWidth
              value={newClub.coverImage}
              onChange={(e) => setNewClub({ ...newClub, coverImage: e.target.value })}
            />
            <Typography variant="subtitle2" fontWeight="bold">Meeting Schedule</Typography>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <TextField
                  label="Day"
                  fullWidth
                  value={newClub.meetingSchedule.day}
                  onChange={(e) => setNewClub({
                    ...newClub,
                    meetingSchedule: { ...newClub.meetingSchedule, day: e.target.value }
                  })}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  label="Time"
                  fullWidth
                  value={newClub.meetingSchedule.time}
                  onChange={(e) => setNewClub({
                    ...newClub,
                    meetingSchedule: { ...newClub.meetingSchedule, time: e.target.value }
                  })}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  label="Location"
                  fullWidth
                  value={newClub.meetingSchedule.location}
                  onChange={(e) => setNewClub({
                    ...newClub,
                    meetingSchedule: { ...newClub.meetingSchedule, location: e.target.value }
                  })}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleCreateClub} variant="contained">Create</Button>
        </DialogActions>
      </Dialog>

      {/* Club Details Dialog */}
      <Dialog open={detailDialogOpen} onClose={handleCloseDetailDialog} maxWidth="md" fullWidth>
        {selectedClub && (
          <>
            <DialogTitle>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box display="flex" alignItems="center">
                  <Avatar src={selectedClub.logo} sx={{ width: 48, height: 48, mr: 2 }}>
                    {selectedClub.name.charAt(0)}
                  </Avatar>
                  {selectedClub.name}
                </Box>
                <IconButton onClick={handleCloseDetailDialog}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ mb: 2 }}>
                <Tab label="About" />
                <Tab label="Members" />
                <Tab label="Achievements" />
                <Tab label="Resources" />
              </Tabs>

              {tabValue === 0 && (
                <Box>
                  <Typography variant="body1" paragraph>{selectedClub.description}</Typography>
                  <Chip label={selectedClub.category} color="primary" sx={{ mb: 2 }} />
                  
                  {selectedClub.meetingSchedule?.day && (
                    <Paper sx={{ p: 2, mb: 2 }}>
                      <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                        Meeting Schedule
                      </Typography>
                      <Typography variant="body2">
                        {selectedClub.meetingSchedule.day} at {selectedClub.meetingSchedule.time}
                      </Typography>
                      <Typography variant="body2">
                        Location: {selectedClub.meetingSchedule.location}
                      </Typography>
                    </Paper>
                  )}

                  <Typography variant="subtitle2" fontWeight="bold" gutterBottom>Leadership</Typography>
                  <List>
                    {selectedClub.president && (
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar>{selectedClub.president.name?.charAt(0)}</Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={selectedClub.president.name}
                          secondary="President"
                        />
                      </ListItem>
                    )}
                    {selectedClub.faculty && (
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar>{selectedClub.faculty.name?.charAt(0)}</Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={selectedClub.faculty.name}
                          secondary="Faculty Advisor"
                        />
                      </ListItem>
                    )}
                  </List>
                </Box>
              )}

              {tabValue === 1 && (
                <List>
                  {selectedClub.members?.map((member, index) => (
                    <React.Fragment key={index}>
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar>{member.user.name?.charAt(0)}</Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={member.user.name}
                          secondary={`${member.role} • Joined ${format(new Date(member.joinedAt), 'MMM yyyy')}`}
                        />
                      </ListItem>
                      {index < selectedClub.members.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              )}

              {tabValue === 2 && (
                <Box>
                  {selectedClub.achievements?.length > 0 ? (
                    selectedClub.achievements.map((achievement, index) => (
                      <Paper key={index} sx={{ p: 2, mb: 2 }}>
                        <Typography variant="h6">{achievement.title}</Typography>
                        <Typography variant="body2" color="text.secondary" paragraph>
                          {achievement.description}
                        </Typography>
                        <Typography variant="caption">
                          {format(new Date(achievement.date), 'MMMM dd, yyyy')}
                        </Typography>
                      </Paper>
                    ))
                  ) : (
                    <Typography color="text.secondary">No achievements yet</Typography>
                  )}
                </Box>
              )}

              {tabValue === 3 && (
                <List>
                  {selectedClub.resources?.length > 0 ? (
                    selectedClub.resources.map((resource, index) => (
                      <React.Fragment key={index}>
                        <ListItem>
                          <ListItemAvatar>
                            <Avatar><ResourceIcon /></Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={resource.title}
                            secondary={resource.description}
                          />
                          <Button href={resource.link} target="_blank">Open</Button>
                        </ListItem>
                        {index < selectedClub.resources.length - 1 && <Divider />}
                      </React.Fragment>
                    ))
                  ) : (
                    <Typography color="text.secondary">No resources available</Typography>
                  )}
                </List>
              )}
            </DialogContent>
            <DialogActions>
              {!isMember && !hasRequested && !isPresident && (
                <Button variant="contained" onClick={handleJoinClub}>
                  Request to Join
                </Button>
              )}
              {hasRequested && (
                <Chip label="Request Pending" color="warning" />
              )}
              {isMember && (
                <Chip label="Member" color="success" />
              )}
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default Clubs;
