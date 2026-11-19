import React, { useState } from 'react';
import {
  Outlet,
  useNavigate,
  useLocation
} from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Button,
  Chip
} from '@mui/material';
import {
  DashboardOutlined,
  PeopleAltOutlined,
  BusinessOutlined,
  AssignmentOutlined,
  LogoutRounded,
  Menu as MenuIcon
} from '@mui/icons-material';

const DRAWER_WIDTH = 250;

const MainLayout = ({ user, onLogout }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <DashboardOutlined /> },
    { path: '/leads', label: 'Leads', icon: <PeopleAltOutlined /> },
    { path: '/companies', label: 'Companies', icon: <BusinessOutlined /> },
    { path: '/tasks', label: 'Tasks', icon: <AssignmentOutlined /> },
  ];

  // Drawer Sidebar Content
  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#0f172a', color: '#f8fafc' }}>
      {/* Brand Header */}
      <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: 2,
            bgcolor: 'primary.main',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '1.1rem'
          }}
        >
          M
        </Box>
        <Box>
          <Typography variant="subtitle1" fontWeight={700} sx={{ lineHeight: 1.2, color: '#f8fafc' }}>
            MINI CRM
          </Typography>
          <Typography variant="caption" sx={{ color: '#94a3b8' }}>
            Management Portal
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.08)' }} />

      {/* Nav List - Persists across all pages */}
      <List sx={{ px: 1.5, py: 2, flex: 1 }}>
        {menuItems.map((item) => {
          const isSelected = location.pathname.startsWith(item.path);
          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                selected={isSelected}
                onClick={() => {
                  navigate(item.path);
                  setMobileOpen(false);
                }}
                sx={{
                  borderRadius: 2,
                  py: 1.2,
                  px: 2,
                  color: isSelected ? '#ffffff' : '#94a3b8',
                  bgcolor: isSelected ? 'rgba(37, 99, 235, 0.25) !important' : 'transparent',
                  border: isSelected ? '1px solid rgba(59, 130, 246, 0.4)' : '1px solid transparent',
                  '&:hover': {
                    bgcolor: isSelected ? 'rgba(37, 99, 235, 0.3)' : 'rgba(255, 255, 255, 0.05)',
                    color: '#ffffff'
                  }
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isSelected ? '#3b82f6' : '#64748b',
                    minWidth: 40
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: '0.925rem',
                    fontWeight: isSelected ? 600 : 500
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* Bottom Profile Info in Sidebar */}
      <Box sx={{ p: 2, m: 1.5, borderRadius: 2.5, bgcolor: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar sx={{ width: 34, height: 34, bgcolor: '#3b82f6', fontSize: '0.9rem', fontWeight: 600 }}>
            {user?.name?.[0] || user?.email?.[0]?.toUpperCase() || 'A'}
          </Avatar>
          <Box sx={{ overflow: 'hidden' }}>
            <Typography variant="body2" fontWeight={600} noWrap sx={{ color: '#f8fafc' }}>
              {user?.name || 'Admin User'}
            </Typography>
            <Typography variant="caption" noWrap sx={{ color: '#94a3b8', display: 'block' }}>
              {user?.email}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );

  const getPageTitle = () => {
    if (location.pathname.includes('leads')) return 'Leads';
    if (location.pathname.includes('companies')) return 'Companies';
    if (location.pathname.includes('tasks')) return 'Tasks';
    return 'Dashboard';
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f8fafc' }}>
      {/* Top Bar: User Name | Logout */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { sm: `${DRAWER_WIDTH}px` },
          bgcolor: '#ffffff',
          color: '#0f172a',
          borderBottom: '1px solid #e2e8f0'
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, sm: 3 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" fontWeight={700}>
              {getPageTitle()}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ textAlign: 'right', display: { xs: 'none', md: 'block' } }}>
              <Typography variant="body2" fontWeight={600} sx={{ color: '#0f172a', lineHeight: 1.2 }}>
                {user?.name || user?.email?.split('@')[0] || 'Admin'}
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748b' }}>
                {user?.email}
              </Typography>
            </Box>

            <Chip
              label={user?.role?.toUpperCase() || 'ADMIN'}
              size="small"
              sx={{
                bgcolor: '#eff6ff',
                color: '#1d4ed8',
                fontWeight: 600,
                fontSize: '0.75rem',
                border: '1px solid #bfdbfe'
              }}
            />

            <Button
              variant="outlined"
              color="error"
              size="small"
              startIcon={<LogoutRounded />}
              onClick={onLogout}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: 2,
                px: 2,
                py: 0.6
              }}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Persistent Sidebar Drawer */}
      <Box
        component="nav"
        sx={{ width: { sm: DRAWER_WIDTH }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DRAWER_WIDTH, border: 'none' }
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DRAWER_WIDTH, borderRight: '1px solid #1e293b' }
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Page Content Area (Rendered via React Router Outlet) */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2.5, sm: 4 },
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          mt: '64px'
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default MainLayout;
