import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  LinearProgress
} from '@mui/material';
import {
  ContactMailOutlined,
  CheckCircle,
  TodayOutlined,
  AssignmentTurnedIn,
  TrendingUp,
  ArrowForward,
  Business,
  Add as AddIcon
} from '@mui/icons-material';
import { getDashboardStats, getLeads, getTasks } from '../services/api';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalLeads: 0,
    qualifiedLeads: 0,
    tasksDueToday: 0,
    completedTasks: 0
  });
  const [recentLeads, setRecentLeads] = useState([]);
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');

      const [statsRes, leadsRes, tasksRes] = await Promise.all([
        getDashboardStats(),
        getLeads(1, 4),
        getTasks()
      ]);

      if (statsRes.success) setStats(statsRes.data);
      if (leadsRes.success) setRecentLeads(leadsRes.data || []);
      if (tasksRes.success) setRecentTasks((tasksRes.data || []).slice(0, 4));
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const leadConversionRate = stats.totalLeads > 0
    ? Math.round((stats.qualifiedLeads / stats.totalLeads) * 100)
    : 0;

  const cards = [
    {
      label: 'Total Leads',
      value: stats.totalLeads,
      badge: '+12% this month',
      badgeColor: '#2563eb',
      badgeBg: '#eff6ff',
      icon: <ContactMailOutlined sx={{ color: '#2563eb', fontSize: 26 }} />,
      iconBg: '#eff6ff',
      progress: Math.min(100, stats.totalLeads * 10),
      color: '#2563eb'
    },
    {
      label: 'Qualified Leads',
      value: stats.qualifiedLeads,
      badge: `${leadConversionRate}% conversion`,
      badgeColor: '#059669',
      badgeBg: '#ecfdf5',
      icon: <CheckCircle sx={{ color: '#059669', fontSize: 26 }} />,
      iconBg: '#ecfdf5',
      progress: leadConversionRate,
      color: '#059669'
    },
    {
      label: 'Tasks Due Today',
      value: stats.tasksDueToday,
      badge: 'Action required',
      badgeColor: '#d97706',
      badgeBg: '#fffbeb',
      icon: <TodayOutlined sx={{ color: '#d97706', fontSize: 26 }} />,
      iconBg: '#fffbeb',
      progress: Math.min(100, stats.tasksDueToday * 15),
      color: '#d97706'
    },
    {
      label: 'Completed Tasks',
      value: stats.completedTasks,
      badge: '94% on time',
      badgeColor: '#7c3aed',
      badgeBg: '#f5f3ff',
      icon: <AssignmentTurnedIn sx={{ color: '#7c3aed', fontSize: 26 }} />,
      iconBg: '#f5f3ff',
      progress: Math.min(100, stats.completedTasks * 8),
      color: '#7c3aed'
    },
  ];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 14 }}>
        <CircularProgress size={38} thickness={4} />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
      {/* Header Greeting Banner */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
          mb: 4
        }}
      >
        <Box>
          <Typography variant="h5" fontWeight={800} sx={{ color: '#0f172a', letterSpacing: '-0.025em' }}>
            CRM Dashboard Overview
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>
            Real-time pipeline performance and live metrics aggregated from MongoDB.
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button
            variant="outlined"
            color="inherit"
            onClick={() => navigate('/tasks')}
            sx={{
              textTransform: 'none',
              borderRadius: 2,
              fontWeight: 600,
              borderColor: '#cbd5e1',
              color: '#334155',
              bgcolor: '#ffffff',
              '&:hover': { bgcolor: '#f8fafc' }
            }}
          >
            View Tasks
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => navigate('/leads')}
            sx={{
              textTransform: 'none',
              borderRadius: 2,
              fontWeight: 600,
              boxShadow: 'none',
              px: 2.5
            }}
          >
            Add Lead
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {/* 4 Metric Cards Grid */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
          gap: 2.5,
          mb: 4
        }}
      >
        {cards.map((card, i) => (
          <Paper
            key={i}
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              border: '1px solid #e2e8f0',
              bgcolor: '#ffffff',
              transition: 'all 0.2s ease-in-out',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              '&:hover': {
                borderColor: '#cbd5e1',
                boxShadow: '0 8px 24px -4px rgba(0, 0, 0, 0.06)',
                transform: 'translateY(-2px)'
              }
            }}
          >
            <div>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box
                  sx={{
                    width: 46,
                    height: 46,
                    borderRadius: 2.5,
                    bgcolor: card.iconBg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {card.icon}
                </Box>
                <Chip
                  label={card.badge}
                  size="small"
                  sx={{
                    bgcolor: card.badgeBg,
                    color: card.badgeColor,
                    fontWeight: 700,
                    fontSize: '0.72rem',
                    borderRadius: 1.5,
                    border: `1px solid ${card.badgeColor}25`
                  }}
                />
              </Box>

              <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600, mb: 0.5 }}>
                {card.label}
              </Typography>

              <Typography variant="h4" fontWeight={800} sx={{ color: '#0f172a', letterSpacing: '-0.03em', mb: 2 }}>
                {card.value}
              </Typography>
            </div>

            <Box sx={{ width: '100%' }}>
              <LinearProgress
                variant="determinate"
                value={card.progress}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  bgcolor: '#f1f5f9',
                  '& .MuiLinearProgress-bar': {
                    bgcolor: card.color,
                    borderRadius: 3
                  }
                }}
              />
            </Box>
          </Paper>
        ))}
      </Box>

      {/* Two Column Grid: Recent Leads & Pending Tasks */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '1.2fr 0.8fr' },
          gap: 3
        }}
      >
        {/* Recent Inbound Leads Card */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            border: '1px solid #e2e8f0',
            bgcolor: '#ffffff',
            overflow: 'hidden'
          }}
        >
          <Box sx={{ p: 2.5, px: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9' }}>
            <Box>
              <Typography variant="subtitle1" fontWeight={700} sx={{ color: '#0f172a' }}>
                Recent Leads
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748b' }}>
                Latest prospective client contacts
              </Typography>
            </Box>
            <Button
              size="small"
              endIcon={<ArrowForward fontSize="small" />}
              onClick={() => navigate('/leads')}
              sx={{ textTransform: 'none', fontWeight: 600 }}
            >
              View All
            </Button>
          </Box>

          <TableContainer>
            <Table size="small">
              <TableHead sx={{ bgcolor: '#f8fafc' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, color: '#475569', py: 1.5 }}>Lead</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#475569', py: 1.5 }}>Company</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#475569', py: 1.5 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#475569', py: 1.5 }}>Assignee</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentLeads.length > 0 ? (
                  recentLeads.map((lead) => (
                    <TableRow key={lead._id} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600} sx={{ color: '#0f172a' }}>
                          {lead.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#64748b' }}>
                          {lead.email}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ color: '#334155', fontWeight: 500 }}>
                        {lead.companyName || (typeof lead.company === 'object' ? lead.company?.name : '-') || '-'}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={lead.status}
                          size="small"
                          color={lead.status === 'Qualified' ? 'success' : lead.status === 'Contacted' ? 'info' : 'default'}
                          variant="outlined"
                          sx={{ fontWeight: 600, borderRadius: 1.5 }}
                        />
                      </TableCell>
                      <TableCell sx={{ color: '#64748b', fontSize: '0.8rem' }}>
                        {lead.assignedTo?.split('@')[0] || 'Admin'}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 4, color: '#64748b' }}>
                      No active leads found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Priority Deliverables / Action Items */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            border: '1px solid #e2e8f0',
            bgcolor: '#ffffff',
            overflow: 'hidden'
          }}
        >
          <Box sx={{ p: 2.5, px: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9' }}>
            <Box>
              <Typography variant="subtitle1" fontWeight={700} sx={{ color: '#0f172a' }}>
                Pending Deliverables
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748b' }}>
                Upcoming client task deadlines
              </Typography>
            </Box>
            <Button
              size="small"
              endIcon={<ArrowForward fontSize="small" />}
              onClick={() => navigate('/tasks')}
              sx={{ textTransform: 'none', fontWeight: 600 }}
            >
              All Tasks
            </Button>
          </Box>

          <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {recentTasks.length > 0 ? (
              recentTasks.map((t) => (
                <Box
                  key={t._id}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: t.status === 'Done' ? '#f8fafc' : '#ffffff',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <Box>
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      sx={{
                        color: t.status === 'Done' ? '#94a3b8' : '#0f172a',
                        textDecoration: t.status === 'Done' ? 'line-through' : 'none'
                      }}
                    >
                      {t.title} &bull; {t.lead}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748b' }}>
                      Due: {t.dueDate} &bull; Assigned to: {t.assignedTo}
                    </Typography>
                  </Box>
                  <Chip
                    label={t.status}
                    size="small"
                    color={t.status === 'Done' ? 'success' : 'warning'}
                    variant={t.status === 'Done' ? 'filled' : 'outlined'}
                    sx={{ fontWeight: 600, borderRadius: 1.5 }}
                  />
                </Box>
              ))
            ) : (
              <Typography variant="body2" sx={{ color: '#64748b', textAlign: 'center', py: 4 }}>
                No pending tasks found.
              </Typography>
            )}
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default DashboardPage;
