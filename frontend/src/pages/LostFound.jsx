import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Grid,
  Card,
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
  Tabs,
  Tab,
  IconButton,
  CardMedia,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  LocationOn,
  CalendarMonth,
  CheckCircle,
  Upload,
  Image as ImageIcon,
} from '@mui/icons-material';
import { fetchLostItems } from '../redux/slices/lostItemSlice';
import { lostItemsAPI } from '../services/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const LostFound = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { items, loading } = useSelector((state) => state.lostItems);

  const [activeTab, setActiveTab] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'electronics',
    type: 'lost',
    location: '',
    date: '',
    reporterContact: '',
  });

  useEffect(() => {
    dispatch(fetchLostItems());
  }, [dispatch]);

  const handleOpenDialog = (item = null) => {
    if (item) {
      setEditMode(true);
      setCurrentItem(item);
      setFormData({
        title: item.title,
        description: item.description,
        category: item.category,
        type: item.type,
        location: item.location,
        date: new Date(item.date).toISOString().split('T')[0],
        reporterContact: item.reporterContact || '',
      });
      setImagePreview(item.image || null);
      setSelectedImage(null);
    } else {
      setEditMode(false);
      setCurrentItem(null);
      setFormData({
        title: '',
        description: '',
        category: 'electronics',
        type: activeTab === 0 ? 'lost' : 'found',
        location: '',
        date: new Date().toISOString().split('T')[0],
        reporterContact: '',
      });
      setImagePreview(null);
      setSelectedImage(null);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditMode(false);
    setCurrentItem(null);
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Image size should be less than 5MB');
        return;
      }
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    try {
      const submitData = new FormData();
      Object.keys(formData).forEach(key => {
        submitData.append(key, formData[key]);
      });
      
      if (selectedImage) {
        submitData.append('image', selectedImage);
      }

      if (editMode && currentItem) {
        await lostItemsAPI.update(currentItem._id, submitData);
        toast.success('Item updated successfully');
      } else {
        await lostItemsAPI.create(submitData);
        toast.success('Item reported successfully');
      }
      dispatch(fetchLostItems());
      handleCloseDialog();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save item');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await lostItemsAPI.delete(id);
        toast.success('Item deleted successfully');
        dispatch(fetchLostItems());
      } catch (error) {
        toast.error('Failed to delete item');
      }
    }
  };

  const handleClaim = async (id) => {
    if (window.confirm('Are you sure you want to request to claim this item? Admin approval will be required.')) {
      try {
        await lostItemsAPI.claim(id);
        toast.success('Claim request submitted. Waiting for admin approval.');
        dispatch(fetchLostItems());
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to submit claim request');
      }
    }
  };

  const handleApproveClaim = async (id) => {
    if (window.confirm('Are you sure you want to approve this claim?')) {
      try {
        await lostItemsAPI.approveClaim(id);
        toast.success('Claim approved successfully');
        dispatch(fetchLostItems());
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to approve claim');
      }
    }
  };

  const handleRejectClaim = async (id) => {
    const reason = prompt('Please enter the reason for rejection (optional):');
    try {
      await lostItemsAPI.rejectClaim(id, reason);
      toast.success('Claim rejected successfully');
      dispatch(fetchLostItems());
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reject claim');
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      electronics: 'primary',
      documents: 'error',
      accessories: 'secondary',
      books: 'info',
      clothing: 'warning',
      other: 'default',
    };
    return colors[category] || 'default';
  };

  const filteredItems = items.filter(item => 
    activeTab === 0 ? item.type === 'lost' : item.type === 'found'
  );

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
            Lost & Found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Report lost items or search for found items
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          Report Item
        </Button>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab label={`Lost Items (${items.filter(i => i.type === 'lost').length})`} />
          <Tab label={`Found Items (${items.filter(i => i.type === 'found').length})`} />
        </Tabs>
      </Box>

      {filteredItems.length === 0 ? (
        <Alert severity="info">
          No {activeTab === 0 ? 'lost' : 'found'} items reported yet.
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {filteredItems.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item._id}>
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
                    borderColor: getCategoryColor(item.category) === 'primary' ? '#1976d2' : undefined,
                    '& .item-image': {
                      transform: 'scale(1.1) rotate(-2deg)',
                    },
                  },
                }}
              >
                {item.image && (
                  <Box sx={{ overflow: 'hidden', height: 200, position: 'relative' }}>
                    <CardMedia
                      className="item-image"
                      component="img"
                      height="200"
                      image={item.image}
                      alt={item.title}
                      sx={{ 
                        objectFit: 'cover',
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
                      label={item.category}
                      size="small"
                      color={getCategoryColor(item.category)}
                      sx={{
                        fontWeight: 600,
                        borderRadius: 1.5,
                      }}
                    />
                    <Chip
                      label={item.status === 'pending-approval' ? 'Pending Approval' : item.status}
                      size="small"
                      color={
                        item.status === 'resolved' ? 'success' : 
                        item.status === 'pending-approval' ? 'warning' : 
                        'default'
                      }
                      icon={item.status === 'resolved' ? <CheckCircle /> : undefined}
                      sx={{
                        fontWeight: 600,
                        borderRadius: 1.5,
                      }}
                    />
                  </Box>

                  {(user?.role === 'admin' || item.reportedBy?._id === user?.id) && (
                    <Box display="flex" justifyContent="flex-end" gap={1} mb={1}>
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(item)}
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
                        onClick={() => handleDelete(item._id)}
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

                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {item.title}
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
                    {item.description}
                  </Typography>

                  <Box display="flex" alignItems="center" gap={0.5} mb={1}>
                    <LocationOn fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      {item.location}
                    </Typography>
                  </Box>

                  <Box display="flex" alignItems="center" gap={0.5} mb={1}>
                    <CalendarMonth fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      {format(new Date(item.date), 'MMM dd, yyyy')}
                    </Typography>
                  </Box>

                  {item.reporterContact && (
                    <Typography variant="caption" color="text.secondary">
                      Contact: {item.reporterContact}
                    </Typography>
                  )}

                  {/* Show claimed by info for pending approval */}
                  {item.status === 'pending-approval' && item.claimedBy && (
                    <Box mt={2} p={1.5} sx={{ bgcolor: 'warning.light', borderRadius: 1 }}>
                      <Typography variant="caption" fontWeight="bold" display="block">
                        Claim Request by:
                      </Typography>
                      <Typography variant="caption">
                        {item.claimedBy.name || 'Unknown User'}
                      </Typography>
                      <Typography variant="caption" display="block">
                        {item.claimedBy.email}
                      </Typography>
                    </Box>
                  )}
                </CardContent>

                <CardActions sx={{ p: 2, pt: 0, flexDirection: 'column', gap: 1 }}>
                  {/* Admin approval buttons for pending items */}
                  {user?.role === 'admin' && item.status === 'pending-approval' && (
                    <Box display="flex" gap={1} width="100%">
                      <Button
                        fullWidth
                        variant="contained"
                        color="success"
                        onClick={() => handleApproveClaim(item._id)}
                        sx={{
                          borderRadius: 2,
                          fontWeight: 600,
                          boxShadow: '0 4px 12px rgba(46, 125, 50, 0.3)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 6px 20px rgba(46, 125, 50, 0.4)',
                          },
                        }}
                      >
                        Approve Claim
                      </Button>
                      <Button
                        fullWidth
                        variant="outlined"
                        color="error"
                        onClick={() => handleRejectClaim(item._id)}
                        sx={{
                          borderRadius: 2,
                          fontWeight: 600,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            bgcolor: 'error.light',
                            color: 'white',
                          },
                        }}
                      >
                        Reject
                      </Button>
                    </Box>
                  )}

                  {/* Claim button for students/staff (only for active items) */}
                  {item.status === 'active' && user?.role !== 'admin' && (
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={() => handleClaim(item._id)}
                      sx={{
                        borderRadius: 2,
                        fontWeight: 600,
                        boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 6px 20px rgba(25, 118, 210, 0.4)',
                        },
                      }}
                    >
                      Request to Claim
                    </Button>
                  )}

                  {/* Show status for pending approval (non-admin users) */}
                  {item.status === 'pending-approval' && user?.role !== 'admin' && (
                    <Alert severity="info" sx={{ width: '100%' }}>
                      {item.claimedBy?._id === user?.id 
                        ? 'Your claim is pending admin approval' 
                        : 'This item has a pending claim request'}
                    </Alert>
                  )}

                  {/* Show resolved status */}
                  {item.status === 'resolved' && (
                    <Alert severity="success" sx={{ width: '100%' }}>
                      Item has been claimed and resolved
                    </Alert>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Report/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editMode ? 'Edit Item' : 'Report Item'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              select
              label="Type"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            >
              <MenuItem value="lost">Lost</MenuItem>
              <MenuItem value="found">Found</MenuItem>
            </TextField>
            <TextField
              fullWidth
              label="Item Title"
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
              <MenuItem value="electronics">Electronics</MenuItem>
              <MenuItem value="documents">Documents</MenuItem>
              <MenuItem value="accessories">Accessories</MenuItem>
              <MenuItem value="books">Books</MenuItem>
              <MenuItem value="clothing">Clothing</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </TextField>
            <TextField
              fullWidth
              label="Location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              required
            />
            <TextField
              fullWidth
              label="Date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              InputLabelProps={{ shrink: true }}
              required
            />
            <TextField
              fullWidth
              label="Contact Information (Optional)"
              value={formData.reporterContact}
              onChange={(e) => setFormData({ ...formData, reporterContact: e.target.value })}
              placeholder="Email or Phone"
            />

            {/* Image Upload */}
            <Box>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="image-upload"
                type="file"
                onChange={handleImageChange}
              />
              <label htmlFor="image-upload">
                <Button
                  variant="outlined"
                  component="span"
                  fullWidth
                  startIcon={<Upload />}
                >
                  {selectedImage ? 'Change Image' : 'Upload Image (Optional)'}
                </Button>
              </label>
              {imagePreview && (
                <Box mt={2} textAlign="center">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{
                      maxWidth: '100%',
                      maxHeight: '200px',
                      borderRadius: '8px',
                      objectFit: 'cover',
                    }}
                  />
                </Box>
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editMode ? 'Update' : 'Report'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LostFound;
