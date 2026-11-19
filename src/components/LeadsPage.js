import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  MenuItem,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  Pagination,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  SearchOutlined,
  Add as AddIcon,
  Edit,
  Delete,
  Person,
  RestartAlt
} from '@mui/icons-material';
import { getLeads, createLead, updateLead, deleteLead, getCompanies } from '../services/api';

const statusColors = {
  New: 'info',
  Contacted: 'success',
  Lost: 'error',
  Qualified: 'secondary'
};

const emptyLeadForm = {
  name: '',
  email: '',
  phone: '',
  status: 'New',
  assignedTo: 'admin@gmail.com',
  companyName: ''
};

const LeadsPage = () => {
  const [leads, setLeads] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [assigneeFilter, setAssigneeFilter] = useState('All');
  const [companyFilter, setCompanyFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [alert, setAlert] = useState({ show: false, message: '', severity: 'info' });

  // Modal State
  const [openModal, setOpenModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(emptyLeadForm);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const res = await getLeads(page, 5, search, statusFilter);
      if (res.success) {
        setLeads(res.data);
        setTotalPages(res.pagination.totalPages);
      }
    } catch (err) {
      setAlert({ show: true, message: 'Failed to load leads from backend.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanyList = async () => {
    try {
      const res = await getCompanies();
      if (res.success) {
        setCompanies(res.data);
      }
    } catch (e) {}
  };

  useEffect(() => {
    fetchLeads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, statusFilter]);

  useEffect(() => {
    fetchCompanyList();
  }, []);

  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter') {
      setPage(1);
      fetchLeads();
    }
  };

  const handleClearFilters = () => {
    setSearch('');
    setStatusFilter('All');
    setAssigneeFilter('All');
    setCompanyFilter('All');
    setPage(1);
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      ...emptyLeadForm,
      companyName: companies[0]?.name || 'ABC Corp'
    });
    setOpenModal(true);
  };

  const handleOpenEdit = (lead) => {
    setEditingId(lead._id);
    setFormData({
      name: lead.name,
      email: lead.email,
      phone: lead.phone || '',
      status: lead.status || 'New',
      assignedTo: lead.assignedTo || 'admin@gmail.com',
      companyName: lead.companyName || (typeof lead.company === 'object' ? lead.company?.name : '') || ''
    });
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditingId(null);
    setFormData(emptyLeadForm);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.email) return;

    try {
      if (editingId) {
        await updateLead(editingId, formData);
        setAlert({ show: true, message: 'Lead updated successfully!', severity: 'success' });
      } else {
        await createLead(formData);
        setAlert({ show: true, message: 'Lead created successfully!', severity: 'success' });
      }
      handleCloseModal();
      fetchLeads();
    } catch (err) {
      setAlert({
        show: true,
        message: err.response?.data?.message || 'Error saving lead.',
        severity: 'error'
      });
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteLead(id);
      setAlert({ show: true, message: 'Lead soft-deleted (hidden from active queries).', severity: 'info' });
      fetchLeads();
    } catch (err) {
      setAlert({ show: true, message: 'Failed to delete lead.', severity: 'error' });
    }
  };

  // Additional client-side assignee & company filtering on loaded page set
  const filteredLeads = leads.filter((lead) => {
    const matchesAssignee = assigneeFilter === 'All' || lead.assignedTo === assigneeFilter;
    const leadComp = lead.companyName || (typeof lead.company === 'object' ? lead.company?.name : '');
    const matchesCompany = companyFilter === 'All' || leadComp === companyFilter;
    return matchesAssignee && matchesCompany;
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
        {/* Title Header with Action Button aligned to the right (like other pages) */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h5" fontWeight={700} sx={{ color: '#0f172a', letterSpacing: '-0.02em' }}>
              Leads
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>
              View, filter, and manage your inbound customer leads. Soft-deleted leads are excluded.
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleOpenAdd}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: 2,
              minWidth: 160,
              py: 1
            }}
          >
            + Add Lead
          </Button>
        </Box>

        {alert.show && (
          <Alert severity={alert.severity} onClose={() => setAlert({ ...alert, show: false })} sx={{ mb: 3, borderRadius: 2 }}>
            {alert.message}
          </Alert>
        )}

        {/* Toolbar: Single line Search & Filters (Equal size, fully covering line) */}
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
          {/* 1. Search Input */}
          <TextField
            size="small"
            placeholder="Search leads..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleSearchSubmit}
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
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            sx={{
              width: '100%',
              bgcolor: '#ffffff',
              '& .MuiOutlinedInput-root': { borderRadius: 2 }
            }}
          >
            <MenuItem value="All">All Statuses</MenuItem>
            <MenuItem value="New">New</MenuItem>
            <MenuItem value="Contacted">Contacted</MenuItem>
            <MenuItem value="Qualified">Qualified</MenuItem>
            <MenuItem value="Lost">Lost</MenuItem>
          </TextField>

          {/* 3. Assignee Filter */}
          <TextField
            select
            size="small"
            label="Assignee"
            value={assigneeFilter}
            onChange={(e) => setAssigneeFilter(e.target.value)}
            sx={{
              width: '100%',
              bgcolor: '#ffffff',
              '& .MuiOutlinedInput-root': { borderRadius: 2 }
            }}
          >
            <MenuItem value="All">All Assignees</MenuItem>
            <MenuItem value="admin@gmail.com">admin@gmail.com</MenuItem>
            <MenuItem value="alex@company.com">alex@company.com</MenuItem>
            <MenuItem value="emma@company.com">emma@company.com</MenuItem>
          </TextField>

          {/* 4. Company Filter */}
          <TextField
            select
            size="small"
            label="Company"
            value={companyFilter}
            onChange={(e) => setCompanyFilter(e.target.value)}
            sx={{
              width: '100%',
              bgcolor: '#ffffff',
              '& .MuiOutlinedInput-root': { borderRadius: 2 }
            }}
          >
            <MenuItem value="All">All Companies</MenuItem>
            {companies.map((comp) => (
              <MenuItem key={comp._id} value={comp.name}>
                {comp.name}
              </MenuItem>
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

        {/* Leads Table */}
        <TableContainer sx={{ border: '1px solid #e2e8f0', borderRadius: 2.5, overflow: 'hidden' }}>
          <Table>
            <TableHead sx={{ bgcolor: '#f8fafc' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, color: '#475569', py: 1.8 }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#475569', py: 1.8 }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#475569', py: 1.8 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#475569', py: 1.8 }}>Assigned To</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600, color: '#475569', py: 1.8 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                    <CircularProgress size={28} />
                  </TableCell>
                </TableRow>
              ) : filteredLeads.length > 0 ? (
                filteredLeads.map((row) => (
                  <TableRow key={row._id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell sx={{ fontWeight: 600, color: '#0f172a' }}>
                      {row.name}
                    </TableCell>
                    <TableCell sx={{ color: '#475569' }}>
                      {row.email}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={row.status}
                        color={statusColors[row.status] || 'default'}
                        size="small"
                        variant="outlined"
                        sx={{ fontWeight: 600, borderRadius: 1.5 }}
                      />
                    </TableCell>
                    <TableCell sx={{ color: '#334155' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Person fontSize="small" sx={{ color: '#64748b' }} />
                        <Typography variant="body2">{row.assignedTo}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Edit">
                        <IconButton
                          size="small"
                          onClick={() => handleOpenEdit(row)}
                          sx={{ color: '#64748b', '&:hover': { color: '#2563eb' } }}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete (Soft)">
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(row._id)}
                          sx={{ color: '#64748b', '&:hover': { color: '#ef4444' } }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 6, color: '#64748b' }}>
                    No leads found matching your criteria.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination Section: < 1 2 3 > */}
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 3 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(e, val) => setPage(val)}
            color="primary"
            shape="rounded"
          />
        </Box>
      </Paper>

      {/* Add / Edit Lead Dialog Modal */}
      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>
          {editingId ? 'Edit Lead' : 'Add Lead'}
        </DialogTitle>
        <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 2.5 }}>
          <TextField
            label="Name"
            size="small"
            required
            fullWidth
            placeholder="John Doe"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          <TextField
            label="Email"
            type="email"
            size="small"
            required
            fullWidth
            placeholder="john@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />

          <TextField
            label="Phone"
            size="small"
            fullWidth
            placeholder="+1 (555) 000-0000"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />

          <TextField
            select
            label="Status"
            size="small"
            fullWidth
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          >
            <MenuItem value="New">New</MenuItem>
            <MenuItem value="Contacted">Contacted</MenuItem>
            <MenuItem value="Qualified">Qualified</MenuItem>
            <MenuItem value="Lost">Lost</MenuItem>
          </TextField>

          <TextField
            label="Assigned To [ User Dropdown ]"
            size="small"
            select
            fullWidth
            value={formData.assignedTo}
            onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
          >
            <MenuItem value="admin@gmail.com">admin@gmail.com (You)</MenuItem>
            <MenuItem value="alex@company.com">alex@company.com</MenuItem>
            <MenuItem value="emma@company.com">emma@company.com</MenuItem>
          </TextField>

          <TextField
            select
            label="Company [ Company Dropdown ]"
            size="small"
            fullWidth
            value={formData.companyName}
            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
          >
            {companies.map((comp) => (
              <MenuItem key={comp._id} value={comp.name}>
                {comp.name} ({comp.location})
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>

        <DialogActions sx={{ p: 2.5, gap: 1 }}>
          <Button
            onClick={handleCloseModal}
            variant="outlined"
            color="inherit"
            sx={{ textTransform: 'none', borderRadius: 2, px: 2.5 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            color="primary"
            sx={{ textTransform: 'none', borderRadius: 2, px: 3, fontWeight: 600 }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LeadsPage;
