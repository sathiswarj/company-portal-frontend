import React, { useState } from 'react';
import LeadsPage from './LeadsPage';
import CompaniesPage from './CompaniesPage';
import TasksPage from './TasksPage';
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
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import {
  DashboardOutlined,
  PeopleAltOutlined,
  BusinessOutlined,
  AssignmentOutlined,
  LogoutRounded,
  Menu as MenuIcon,
  AssignmentTurnedIn,
  CheckCircle,
  ContactMailOutlined,
  TodayOutlined
} from '@mui/icons-material';

const DRAWER_WIDTH = 250;

const Dashboard = ({ user, onLogout }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <DashboardOutlined /> },
    { id: 'leads', label: 'Leads', icon: <PeopleAltOutlined /> },
    { id: 'companies', label: 'Companies', icon: <BusinessOutlined /> },
    { id: 'tasks', label: 'Tasks', icon: <AssignmentOutlined /> },
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
          C
        </Box>
        <Box>
          <Typography variant="subtitle1" fontWeight={700} sx={{ lineHeight: 1.2, color: '#f8fafc' }}>
            CompanyHub
          </Typography>
          <Typography variant="caption" sx={{ color: '#94a3b8' }}>
            Enterprise Portal
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.08)' }} />

      {/* Nav List */}
      <List sx={{ px: 1.5, py: 2, flex: 1 }}>
        {menuItems.map((item) => {
          const isSelected = activeTab === item.id;
          return (
            <ListItem key={item.id} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                selected={isSelected}
                onClick={() => {
                  setActiveTab(item.id);
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
              {user?.name || 'Administrator'}
            </Typography>
            <Typography variant="caption" noWrap sx={{ color: '#94a3b8', display: 'block' }}>
              {user?.email}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f8fafc' }}>
      {/* Top Bar */}
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
            <Typography variant="h6" fontWeight={700} sx={{ textTransform: 'capitalize' }}>
              {activeTab}
            </Typography>
          </Box>

          {/* Right Top Bar Controls: Username, Avatar, Logout */}
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
              avatar={
                <Avatar sx={{ bgcolor: '#2563eb', color: '#fff', fontWeight: 600 }}>
                  {user?.name?.[0] || user?.email?.[0]?.toUpperCase() || 'A'}
                </Avatar>
              }
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

      {/* Responsive Navigation Drawer */}
      <Box
        component="nav"
        sx={{ width: { sm: DRAWER_WIDTH }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
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

      {/* Main Page Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2.5, sm: 4 },
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          mt: '64px'
        }}
      >
        {activeTab === 'dashboard' && (
          <Box>
            {/* Top Metric Cards */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
                gap: 2.5,
                mb: 4
              }}
            >
              {[
                {
                  label: 'Total Leads',
                  value: '1,420',
                  subtext: '+12% from last week',
                  icon: <ContactMailOutlined sx={{ color: '#2563eb', fontSize: 24 }} />,
                  iconBg: '#eff6ff',
                  borderColor: '#bfdbfe'
                },
                {
                  label: 'Qualified Leads',
                  value: '486',
                  subtext: '34.2% conversion rate',
                  icon: <CheckCircle sx={{ color: '#059669', fontSize: 24 }} />,
                  iconBg: '#ecfdf5',
                  borderColor: '#a7f3d0'
                },
                {
                  label: 'Tasks Due Today',
                  value: '18',
                  subtext: '5 high priority',
                  icon: <TodayOutlined sx={{ color: '#d97706', fontSize: 24 }} />,
                  iconBg: '#fffbeb',
                  borderColor: '#fde68a'
                },
                {
                  label: 'Completed Tasks',
                  value: '124',
                  subtext: '92% on-time completion',
                  icon: <AssignmentTurnedIn sx={{ color: '#7c3aed', fontSize: 24 }} />,
                  iconBg: '#f5f3ff',
                  borderColor: '#ddd6fe'
                },
              ].map((stat, i) => (
                <Paper
                  key={i}
                  elevation={0}
                  sx={{
                    p: 2.5,
                    borderRadius: 3,
                    border: '1px solid #e2e8f0',
                    bgcolor: '#ffffff',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      borderColor: '#cbd5e1',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                    <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
                      {stat.label}
                    </Typography>
                    <Box
                      sx={{
                        p: 1,
                        borderRadius: 2,
                        bgcolor: stat.iconBg,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {stat.icon}
                    </Box>
                  </Box>

                  <Typography variant="h4" fontWeight={800} sx={{ color: '#0f172a', mb: 0.5, letterSpacing: '-0.02em' }}>
                    {stat.value}
                  </Typography>

                  <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 500 }}>
                    {stat.subtext}
                  </Typography>
                </Paper>
              ))}
            </Box>

            {/* Recent Leads Table Card */}
            <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid #e2e8f0', bgcolor: '#ffffff', overflow: 'hidden' }}>
              <Box sx={{ p: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="subtitle1" fontWeight={700} sx={{ color: '#0f172a' }}>
                    Recent Activity & Leads
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748b' }}>
                    Latest inquiries and accounts registered
                  </Typography>
                </Box>
                <Button size="small" variant="outlined" onClick={() => setActiveTab('leads')}>
                  View All Leads
                </Button>
              </Box>
              <Divider />
              <TableContainer>
                <Table size="medium">
                  <TableHead sx={{ bgcolor: '#f8fafc' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Lead Contact</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Company</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Assigned To</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {[
                      { name: 'Sarah Jenkins', email: 'sarah.j@acme.com', company: 'Acme Corporation', status: 'Qualified', color: 'success' },
                      { name: 'Michael Chang', email: 'm.chang@apextech.io', company: 'Apex Tech', status: 'Contacted', color: 'info' },
                      { name: 'Elena Rostova', email: 'elena@novasoft.org', company: 'NovaSoft Ltd', status: 'Proposal Sent', color: 'warning' },
                      { name: 'David Miller', email: 'david@zenithlogistics.com', company: 'Zenith Logistics', status: 'Negotiation', color: 'secondary' }
                    ].map((row, idx) => (
                      <TableRow key={idx} hover>
                        <TableCell>
                          <Typography variant="body2" fontWeight={600} sx={{ color: '#0f172a' }}>
                            {row.name}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#64748b' }}>
                            {row.email}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ color: '#334155', fontWeight: 500 }}>{row.company}</TableCell>
                        <TableCell>
                          <Chip label={row.status} color={row.color} size="small" variant="outlined" sx={{ fontWeight: 600 }} />
                        </TableCell>
                        <TableCell sx={{ color: '#64748b', fontSize: '0.875rem' }}>Admin Team</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Box>
        )}

        {activeTab === 'leads' && (
          <LeadsPage />
        )}

        {activeTab === 'companies' && (
          <CompaniesPage />
        )}

        {activeTab === 'tasks' && (
          <TasksPage currentUser={user} />
        )}
      </Box>
    </Box>
  );
};

export default Dashboard;
