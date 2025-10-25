import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Avatar,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
  useTheme,
  useMediaQuery,
  Tooltip,
  Paper,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  AccountCircle,
  Dashboard as DashboardIcon,
  Event as EventIcon,
  FindInPage as LostFoundIcon,
  Feedback as FeedbackIcon,
  Campaign as AnnouncementIcon,
  Logout as LogoutIcon,
  Settings as SettingsIcon,
  Groups as ClubsIcon,
  Poll as PollIcon,
  Report as GrievanceIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';
import { logout } from '../../redux/slices/authSlice';
import NotificationCenter from '../notifications/NotificationCenter';
import Chatbot from '../chatbot/Chatbot';
import { useThemeMode } from '../../contexts/ThemeContext';

const collapsedWidth = 70;
const expandedWidth = 260;

const Layout = () => {
  const theme = useTheme();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { unreadCount } = useSelector((state) => state.notifications);
  const { mode, toggleTheme } = useThemeMode();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Events', icon: <EventIcon />, path: '/events' },
    { text: 'Clubs', icon: <ClubsIcon />, path: '/clubs' },
    { text: 'Polls', icon: <PollIcon />, path: '/polls' },
    { text: 'Lost & Found', icon: <LostFoundIcon />, path: '/lost-found' },
    { text: 'Feedback', icon: <FeedbackIcon />, path: '/feedback' },
    { text: 'Grievances', icon: <GrievanceIcon />, path: '/grievances' },
  ];

  if (user?.role === 'faculty' || user?.role === 'admin') {
    menuItems.push({
      text: 'Announcements',
      icon: <AnnouncementIcon />,
      path: '/announcements',
    });
  }

  // Modern Floating Sidebar for Desktop
  const modernSidebar = (
    <Paper
      elevation={24}
      onMouseEnter={() => !isMobile && setSidebarExpanded(true)}
      onMouseLeave={() => !isMobile && setSidebarExpanded(false)}
      sx={{
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        width: sidebarExpanded ? expandedWidth : collapsedWidth,
        background: mode === 'light' 
          ? 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)'
          : 'linear-gradient(180deg, #1a237e 0%, #0d47a1 100%)',
        borderRadius: '0 24px 24px 0',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        overflow: 'hidden',
        zIndex: theme.zIndex.drawer,
        boxShadow: sidebarExpanded 
          ? '8px 0 32px rgba(102, 126, 234, 0.4)'
          : '4px 0 16px rgba(102, 126, 234, 0.2)',
      }}
    >
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          color: 'white',
        }}
      >
        {/* Logo Section */}
        <Box
          sx={{
            p: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: sidebarExpanded ? 'flex-start' : 'center',
            gap: 2,
            minHeight: 80,
          }}
        >
          <Avatar
            sx={{
              width: 44,
              height: 44,
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              border: '2px solid rgba(255, 255, 255, 0.3)',
            }}
          >
            🏛️
          </Avatar>
          {sidebarExpanded && (
            <Box sx={{ opacity: sidebarExpanded ? 1 : 0, transition: 'opacity 0.3s' }}>
              <Typography variant="h6" fontWeight="bold" sx={{ lineHeight: 1.2 }}>
                Smart Campus
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.9 }}>
                Click to go back, hold to see history
              </Typography>
            </Box>
          )}
        </Box>

        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.2)', mx: 2 }} />

        {/* Menu Items */}
        <List sx={{ flex: 1, py: 2 }}>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Tooltip
                key={item.text}
                title={!sidebarExpanded ? item.text : ''}
                placement="right"
                arrow
              >
                <ListItem disablePadding sx={{ px: 1.5, mb: 0.5 }}>
                  <ListItemButton
                    onClick={() => navigate(item.path)}
                    sx={{
                      borderRadius: 3,
                      minHeight: 56,
                      justifyContent: sidebarExpanded ? 'flex-start' : 'center',
                      px: sidebarExpanded ? 2 : 1.5,
                      background: isActive
                        ? 'rgba(255, 255, 255, 0.25)'
                        : 'transparent',
                      backdropFilter: isActive ? 'blur(10px)' : 'none',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        background: 'rgba(255, 255, 255, 0.15)',
                        transform: 'translateX(8px)',
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: sidebarExpanded ? 40 : 'auto',
                        color: 'white',
                        justifyContent: 'center',
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    {sidebarExpanded && (
                      <ListItemText
                        primary={item.text}
                        sx={{
                          opacity: sidebarExpanded ? 1 : 0,
                          transition: 'opacity 0.3s',
                          '& .MuiTypography-root': {
                            fontWeight: isActive ? 600 : 400,
                          },
                        }}
                      />
                    )}
                    {sidebarExpanded && isActive && (
                      <ChevronRightIcon sx={{ opacity: 0.7 }} />
                    )}
                  </ListItemButton>
                </ListItem>
              </Tooltip>
            );
          })}
        </List>

        {/* Bottom Section - User Info */}
        <Box
          sx={{
            p: 2,
            borderTop: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: sidebarExpanded ? 'flex-start' : 'center',
              gap: 2,
              p: 1.5,
              borderRadius: 2,
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.2)',
              },
            }}
            onClick={handleProfileMenuOpen}
          >
            <Avatar
              sx={{
                width: 36,
                height: 36,
                bgcolor: 'rgba(255, 255, 255, 0.3)',
                fontWeight: 'bold',
              }}
            >
              {user?.name?.charAt(0).toUpperCase()}
            </Avatar>
            {sidebarExpanded && (
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" fontWeight={600} noWrap>
                  {user?.name}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }} noWrap>
                  {user?.role}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Paper>
  );

  // Mobile Drawer
  const mobileDrawer = (
    <Box sx={{ background: 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)', height: '100%', color: 'white' }}>
      <Toolbar>
        <Typography variant="h6" noWrap component="div" fontWeight="bold">
          Smart Campus
        </Typography>
      </Toolbar>
      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.2)' }} />
      <List>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                onClick={() => {
                  navigate(item.path);
                  setMobileOpen(false);
                }}
                sx={{
                  background: isActive ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.15)',
                  },
                }}
              >
                <ListItemIcon sx={{ color: 'white' }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Desktop Floating Sidebar */}
      {!isMobile && modernSidebar}

      {/* Mobile Drawer */}
      {isMobile && (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: 280,
            },
          }}
        >
          {mobileDrawer}
        </Drawer>
      )}

      {/* AppBar */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: isMobile ? '100%' : `calc(100% - ${collapsedWidth}px)`,
          ml: isMobile ? 0 : `${collapsedWidth}px`,
          background: 'transparent',
          backdropFilter: 'blur(20px)',
          backgroundColor: mode === 'light' 
            ? 'rgba(255, 255, 255, 0.8)' 
            : 'rgba(18, 18, 18, 0.8)',
          borderBottom: `1px solid ${mode === 'light' ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.05)'}`,
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              flexGrow: 1,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 'bold',
            }}
          >
            {user?.role === 'admin' && 'Admin Panel'}
            {user?.role === 'faculty' && 'Faculty Dashboard'}
            {user?.role === 'student' && 'Student Portal'}
          </Typography>

          {/* Theme Toggle Button */}
          <Tooltip title={mode === 'light' ? 'Dark Mode' : 'Light Mode'}>
            <IconButton
              onClick={toggleTheme}
              sx={{
                mr: 1,
                background: mode === 'light' 
                  ? 'rgba(102, 126, 234, 0.1)' 
                  : 'rgba(102, 126, 234, 0.2)',
                '&:hover': {
                  background: mode === 'light' 
                    ? 'rgba(102, 126, 234, 0.2)' 
                    : 'rgba(102, 126, 234, 0.3)',
                },
              }}
            >
              {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
            </IconButton>
          </Tooltip>

          {/* Notification Center */}
          <NotificationCenter />

          <IconButton
            edge="end"
            onClick={handleProfileMenuOpen}
            sx={{
              ml: 2,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
              },
            }}
          >
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'rgba(255, 255, 255, 0.3)' }}>
              {user?.name?.charAt(0).toUpperCase()}
            </Avatar>
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: isMobile ? '100%' : `calc(100% - ${collapsedWidth}px)`,
          ml: isMobile ? 0 : `${collapsedWidth}px`,
          mt: 8,
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <Outlet />
      </Box>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          elevation: 8,
          sx: {
            borderRadius: 2,
            minWidth: 200,
            mt: 1,
          },
        }}
      >
        <MenuItem
          onClick={() => {
            navigate('/profile');
            handleMenuClose();
          }}
        >
          <ListItemIcon>
            <AccountCircle fontSize="small" />
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem
          onClick={() => {
            navigate('/settings');
            handleMenuClose();
          }}
        >
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" color="error" />
          </ListItemIcon>
          <Typography color="error">Logout</Typography>
        </MenuItem>
      </Menu>

      {/* AI Chatbot */}
      <Chatbot />
    </Box>
  );
};

export default Layout;
