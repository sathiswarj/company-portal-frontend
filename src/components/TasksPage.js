import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Tooltip,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  CircularProgress,
  InputAdornment
} from '@mui/material';
import {
  CheckCircle,
  PhoneInTalk,
  Email,
  Assignment,
  Add as AddIcon,
  LockOutlined,
  CalendarTodayOutlined,
  SearchOutlined,
  RestartAlt
} from '@mui/icons-material';
import { getLeads, getTasks, createTask, updateTaskStatus, getUsers } from '../services/api';

const TasksPage = ({ currentUser }) => {
  const [tasks, setTasks] = useState([]);
  const [availableLeads, setAvailableLeads] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [leadsLoading, setLeadsLoading] = useState(false);
  const [usersLoading, setUsersLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [assigneeFilter, setAssigneeFilter] = useState('All');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  // Add Task Modal State
  const [openModal, setOpenModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: 'Call',
    lead: '',
    leadId: '',
    dueDate: '',
    assignedTo: currentUser?.email || 'admin@gmail.com'
  });

  const loggedInUserEmail = (currentUser?.email || 'admin@gmail.com').toLowerCase();

  const fetchTasksList = async () => {
    try {
      setLoading(true);
      const res = await getTasks();
      if (res.success) {
        setTasks(res.data);
      }
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to fetch tasks.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableLeads = async () => {
    try {
      setLeadsLoading(true);
      const firstPage = await getLeads(1, 100);
      if (!firstPage.success) throw new Error('Failed to fetch leads.');

      const pageNumbers = Array.from(
        { length: Math.max(0, firstPage.pagination.totalPages - 1) },
        (_, index) => index + 2
      );
      const remainingPages = await Promise.all(pageNumbers.map((pageNumber) => getLeads(pageNumber, 100)));
      setAvailableLeads([
        ...firstPage.data,
        ...remainingPages.flatMap((page) => page.success ? page.data : [])
      ]);
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to load leads for task creation.', severity: 'error' });
    } finally {
      setLeadsLoading(false);
    }
  };

  const fetchAvailableUsers = async () => {
    try {
      setUsersLoading(true);
      const users = await getUsers();
      setAvailableUsers(Array.isArray(users) ? users : []);
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to load users for task assignment.', severity: 'error' });
    } finally {
      setUsersLoading(false);
    }
  };

  useEffect(() => {
    fetchTasksList();
    fetchAvailableLeads();
    fetchAvailableUsers();
  }, []);

  const handleClearFilters = () => {
    setSearch('');
    setStatusFilter('All');
    setTypeFilter('All');
    setAssigneeFilter('All');
  };

  const handleToggleStatus = async (task) => {
    try {
      const nextStatus = task.status === 'Pending' ? 'Done' : 'Pending';
      const res = await updateTaskStatus(task._id, nextStatus);
      if (res.success) {
        setTasks(tasks.map((t) => (t._id === task._id ? res.data : t)));
        setSnackbar({
          open: true,
          message: `Task status updated to ${nextStatus}!`,
          severity: 'success'
        });
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Error updating task status.';
      setSnackbar({ open: true, message: msg, severity: 'error' });
    }
  };

  const handleCreateTask = async () => {
    if (!newTask.lead || !newTask.dueDate) return;

    try {
      const res = await createTask(newTask);
      if (res.success) {
        setTasks([res.data, ...tasks]);
        setNewTask({ title: 'Call', lead: '', leadId: '', dueDate: '', assignedTo: loggedInUserEmail });
        setOpenModal(false);
        setSnackbar({ open: true, message: 'Task created successfully!', severity: 'success' });
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || 'Failed to create task.',
        severity: 'error'
      });
    }
  };

  const getTaskIcon = (title) => {
    switch (title.toLowerCase()) {
      case 'call':
        return <PhoneInTalk fontSize="small" sx={{ color: '#2563eb' }} />;
      case 'email':
      case 'follow-up email':
        return <Email fontSize="small" sx={{ color: '#059669' }} />;
      default:
        return <Assignment fontSize="small" sx={{ color: '#7c3aed' }} />;
    }
  };

  // Filter tasks in real-time
  const filteredTasks = tasks.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.lead.toLowerCase().includes(search.toLowerCase()) ||
      t.assignedTo.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
    const matchesType = typeFilter === 'All' || t.title.toLowerCase().includes(typeFilter.toLowerCase());
    const matchesAssignee = assigneeFilter === 'All' || t.assignedTo.toLowerCase() === assigneeFilter.toLowerCase();
    return matchesSearch && matchesStatus && matchesType && matchesAssignee;
  });

  return (
    <Box>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, sm: 3.5 },
          borderRadius: 3,
          border: '1px solid #e2e8f0',
          bgcolor: '#ffffff'
        }}
      >
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h5" fontWeight={700} sx={{ color: '#0f172a', letterSpacing: '-0.02em' }}>
              Tasks
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>
              Track follow-ups, calls, and customer deliverables. Only assigned users can update task progress.
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setOpenModal(true)}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: 2,
              minWidth: 160,
              py: 1
            }}
          >
            Create Task
          </Button>
        </Box>


        {/* Filter Toolbar: Single line Search + Status + Type + Assignee + Clear (Equal size, fully covering line) */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(5, 1fr)' },
            gap: 1.5,
            mb: 3,
            p: 2,
            bgcolor: '#f8fafc',
            borderRadius: 2.5,
            border: '1px solid #f1f5f9',
            alignItems: 'center',
            width: '100%'
          }}
        >
          {/* 1. Search */}
          <TextField
            size="small"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{
              width: '100%',
              bgcolor: '#ffffff',
              '& .MuiOutlinedInput-root': { borderRadius: 2 }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchOutlined fontSize="small" sx={{ color: '#94a3b8' }} />
                </InputAdornment>
              ),
            }}
          />

          {/* 2. Status Filter */}
          <TextField
            select
            size="small"
            label="Status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            sx={{
              width: '100%',
              bgcolor: '#ffffff',
              '& .MuiOutlinedInput-root': { borderRadius: 2 }
            }}
          >
            <MenuItem value="All">All Statuses</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Done">Done</MenuItem>
          </TextField>

          {/* 3. Task Type Filter */}
          <TextField
            select
            size="small"
            label="Task Type"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            sx={{
              width: '100%',
              bgcolor: '#ffffff',
              '& .MuiOutlinedInput-root': { borderRadius: 2 }
            }}
          >
            <MenuItem value="All">All Types</MenuItem>
            <MenuItem value="Call">Call</MenuItem>
            <MenuItem value="Email">Email</MenuItem>
            <MenuItem value="Demo">Demo</MenuItem>
            <MenuItem value="Review">Review</MenuItem>
          </TextField>

          {/* 4. Assignee Filter */}
          <TextField
            select
            size="small"
            label="Assigned To"
            value={assigneeFilter}
            onChange={(e) => setAssigneeFilter(e.target.value)}
            sx={{
              width: '100%',
              bgcolor: '#ffffff',
              '& .MuiOutlinedInput-root': { borderRadius: 2 }
            }}
          >
            <MenuItem value="All">All Assignees</MenuItem>
            {availableUsers.map((user) => (
              <MenuItem key={user._id || user.id || user.email} value={user.email}>{user.email}</MenuItem>
            ))}
          </TextField>

          {/* 5. Clear Filters Button */}
          <Button
            variant="outlined"
            color="inherit"
            startIcon={<RestartAlt />}
            onClick={handleClearFilters}
            sx={{
              width: '100%',
              height: 40,
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: 2,
              borderColor: '#cbd5e1',
              color: '#475569',
              bgcolor: '#ffffff',
              whiteSpace: 'nowrap',
              '&:hover': {
                borderColor: '#94a3b8',
                bgcolor: '#f1f5f9'
              }
            }}
          >
            Clear Filters
          </Button>
        </Box>

        {/* Tasks Table */}
        <TableContainer sx={{ border: '1px solid #e2e8f0', borderRadius: 2.5, overflow: 'hidden' }}>
          <Table>
            <TableHead sx={{ bgcolor: '#f8fafc' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, color: '#475569', py: 1.8 }}>Title</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#475569', py: 1.8 }}>Lead</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#475569', py: 1.8 }}>Due Date</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#475569', py: 1.8 }}>Assigned To</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#475569', py: 1.8 }}>Status</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600, color: '#475569', py: 1.8 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                    <CircularProgress size={28} />
                  </TableCell>
                </TableRow>
              ) : filteredTasks.length > 0 ? (
                filteredTasks.map((task) => {
                  const canEdit = task.assignedTo?.toLowerCase() === loggedInUserEmail;
                  const isDone = task.status === 'Done';

                  return (
                    <TableRow
                      key={task._id}
                      hover
                      sx={{
                        bgcolor: isDone ? '#fafafa' : 'inherit',
                        '&:last-child td, &:last-child th': { border: 0 }
                      }}
                    >
                      {/* Title */}
                      <TableCell sx={{ fontWeight: 600, color: isDone ? '#94a3b8' : '#0f172a' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          {getTaskIcon(task.title)}
                          <span style={{ textDecoration: isDone ? 'line-through' : 'none' }}>
                            {task.title}
                          </span>
                        </Box>
                      </TableCell>

                      {/* Lead */}
                      <TableCell sx={{ color: isDone ? '#94a3b8' : '#334155', fontWeight: 500 }}>
                        {task.lead}
                      </TableCell>

                      {/* Due Date */}
                      <TableCell sx={{ color: isDone ? '#94a3b8' : '#475569' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                          <CalendarTodayOutlined fontSize="inherit" sx={{ color: '#94a3b8' }} />
                          <span>{task.dueDate}</span>
                        </Box>
                      </TableCell>

                      {/* Assigned To */}
                      <TableCell sx={{ color: '#64748b', fontSize: '0.85rem' }}>
                        <Chip
                          label={task.assignedTo}
                          size="small"
                          sx={{
                            bgcolor: task.assignedTo?.toLowerCase() === loggedInUserEmail ? '#eff6ff' : '#f1f5f9',
                            color: task.assignedTo?.toLowerCase() === loggedInUserEmail ? '#1d4ed8' : '#475569',
                            fontWeight: task.assignedTo?.toLowerCase() === loggedInUserEmail ? 600 : 500,
                            fontSize: '0.75rem'
                          }}
                        />
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        <Chip
                          label={task.status}
                          color={isDone ? 'success' : 'warning'}
                          size="small"
                          variant={isDone ? 'filled' : 'outlined'}
                          sx={{ fontWeight: 600, borderRadius: 1.5 }}
                        />
                      </TableCell>

                      {/* Actions: Done */}
                      <TableCell align="right">
                        {canEdit ? (
                          <Button
                            size="small"
                            variant={isDone ? 'outlined' : 'contained'}
                            color={isDone ? 'inherit' : 'success'}
                            startIcon={<CheckCircle fontSize="small" />}
                            onClick={() => handleToggleStatus(task)}
                            sx={{
                              textTransform: 'none',
                              borderRadius: 1.5,
                              fontWeight: 600,
                              px: 2,
                              py: 0.5,
                              minWidth: 90
                            }}
                          >
                            {isDone ? 'Undo' : 'Done'}
                          </Button>
                        ) : (
                          <Tooltip title={`Restricted: Only ${task.assignedTo} can update`}>
                            <span>
                              <Button
                                size="small"
                                variant="outlined"
                                disabled
                                startIcon={<LockOutlined fontSize="small" />}
                                sx={{ textTransform: 'none', borderRadius: 1.5 }}
                              >
                                Locked
                              </Button>
                            </span>
                          </Tooltip>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6, color: '#64748b' }}>
                    No tasks found matching your filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Create Task Modal */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Create New Task</DialogTitle>
        <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 2 }}>
          <TextField
            select
            label="Task Type / Title"
            size="small"
            fullWidth
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          >
            <MenuItem value="Call">Call</MenuItem>
            <MenuItem value="Follow-up Email">Follow-up Email</MenuItem>
            <MenuItem value="Product Demo">Product Demo</MenuItem>
            <MenuItem value="Contract Review">Contract Review</MenuItem>
            <MenuItem value="Price Negotiation">Price Negotiation</MenuItem>
          </TextField>

          <TextField
            select
            label="Lead Name"
            size="small"
            required
            fullWidth
            value={newTask.lead}
            disabled={leadsLoading || availableLeads.length === 0}
            onChange={(e) => {
              const selectedLead = availableLeads.find((lead) => lead._id === e.target.value);
              setNewTask({
                ...newTask,
                lead: selectedLead?.name || '',
                leadId: selectedLead?._id || ''
              });
            }}
          >
            {availableLeads.length ? availableLeads.map((lead) => (
              <MenuItem key={lead._id} value={lead._id}>
                {lead.email ? `${lead.name} (${lead.email})` : lead.name}
              </MenuItem>
            )) : (
              <MenuItem value="" disabled>
                {leadsLoading ? 'Loading leads...' : 'No leads available'}
              </MenuItem>
            )}
          </TextField>

          <TextField
            label="Due Date"
            type="date"
            size="small"
            required
            fullWidth
            value={newTask.dueDate}
            onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            select
            label="Assign To (Email)"
            size="small"
            required
            fullWidth
            value={newTask.assignedTo}
            disabled={usersLoading || availableUsers.length === 0}
            onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
          >
            {availableUsers.length ? availableUsers.map((user) => (
              <MenuItem key={user._id || user.id || user.email} value={user.email}>{user.email}</MenuItem>
            )) : (
              <MenuItem value="" disabled>
                {usersLoading ? 'Loading users...' : 'No users available'}
              </MenuItem>
            )}
          </TextField>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenModal(false)} sx={{ textTransform: 'none' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleCreateTask}
            disabled={usersLoading || availableUsers.length === 0}
            sx={{ textTransform: 'none', fontWeight: 600 }}
          >
            Create Task
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%', borderRadius: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default TasksPage;
