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
  Divider,
  Avatar,
  TextField,
  InputAdornment,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  MenuItem
} from '@mui/material';
import {
  Business,
  ArrowBack,
  LocationOnOutlined,
  CategoryOutlined,
  LanguageOutlined,
  EmailOutlined,
  PhoneOutlined,
  SearchOutlined,
  Add as AddIcon,
  RestartAlt
} from '@mui/icons-material';
import { getCompanies, getCompanyById, createCompany } from '../services/api';

const statusColors = {
  New: 'info',
  Contacted: 'success',
  Lost: 'error',
  Qualified: 'secondary'
};

const CompaniesPage = () => {
  const [companies, setCompanies] = useState([]);
  const [selectedCompanyDetail, setSelectedCompanyDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [industryFilter, setIndustryFilter] = useState('All');
  const [locationFilter, setLocationFilter] = useState('All');
  const [openAddModal, setOpenAddModal] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', severity: 'info' });

  const [newCompany, setNewCompany] = useState({
    name: '',
    industry: '',
    location: '',
    website: '',
    email: '',
    phone: '',
    description: ''
  });

  const fetchCompaniesList = async () => {
    try {
      setLoading(true);
      const res = await getCompanies(search);
      if (res.success) {
        setCompanies(res.data);
      }
    } catch (err) {
      setAlert({ show: true, message: 'Failed to fetch companies.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompaniesList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter') {
      fetchCompaniesList();
    }
  };

  const handleClearFilters = () => {
    setSearch('');
    setIndustryFilter('All');
    setLocationFilter('All');
  };

  const handleViewDetails = async (company) => {
    try {
      const res = await getCompanyById(company._id);
      if (res.success) {
        setSelectedCompanyDetail(res.data);
      }
    } catch (err) {
      setAlert({ show: true, message: 'Failed to load company detail.', severity: 'error' });
    }
  };

  const handleCreateCompany = async () => {
    if (!newCompany.name || !newCompany.industry || !newCompany.location) return;

    try {
      const res = await createCompany(newCompany);
      if (res.success) {
        setAlert({ show: true, message: 'Company created successfully!', severity: 'success' });
        setOpenAddModal(false);
        setNewCompany({ name: '', industry: '', location: '', website: '', email: '', phone: '', description: '' });
        fetchCompaniesList();
      }
    } catch (err) {
      setAlert({ show: true, message: err.response?.data?.message || 'Error creating company.', severity: 'error' });
    }
  };

  // Extract unique industries and locations for dynamic filters
  const industries = ['All', ...new Set(companies.map((c) => c.industry).filter(Boolean))];
  const locations = ['All', ...new Set(companies.map((c) => c.location).filter(Boolean))];

  // Filter companies by search, industry, and location
  const filteredCompanies = companies.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.industry.toLowerCase().includes(search.toLowerCase()) ||
      c.location.toLowerCase().includes(search.toLowerCase());
    const matchesIndustry = industryFilter === 'All' || c.industry === industryFilter;
    const matchesLocation = locationFilter === 'All' || c.location === locationFilter;
    return matchesSearch && matchesIndustry && matchesLocation;
  });

  // Detail View
  if (selectedCompanyDetail) {
    const { company, associatedLeads } = selectedCompanyDetail;

    return (
      <Box>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => setSelectedCompanyDetail(null)}
          sx={{ mb: 2.5, textTransform: 'none', fontWeight: 600, color: '#475569' }}
        >
          Back to Companies List
        </Button>

        {/* Company Info Card */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, sm: 4 },
            borderRadius: 3,
            border: '1px solid #e2e8f0',
            bgcolor: '#ffffff',
            mb: 3
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, mb: 3 }}>
            <Avatar
              sx={{
                bgcolor: '#eff6ff',
                color: '#2563eb',
                width: 60,
                height: 60,
                borderRadius: 2.5,
                border: '1px solid #bfdbfe'
              }}
            >
              <Business sx={{ fontSize: 34 }} />
            </Avatar>
            <Box>
              <Typography variant="h5" fontWeight={800} sx={{ color: '#0f172a' }}>
                {company.name}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 0.5, flexWrap: 'wrap' }}>
                <Chip
                  icon={<CategoryOutlined sx={{ fontSize: '1rem !important' }} />}
                  label={company.industry}
                  size="small"
                  sx={{ bgcolor: '#f1f5f9', fontWeight: 600, color: '#334155' }}
                />
                <Chip
                  icon={<LocationOnOutlined sx={{ fontSize: '1rem !important' }} />}
                  label={company.location}
                  size="small"
                  sx={{ bgcolor: '#f1f5f9', fontWeight: 600, color: '#334155' }}
                />
              </Box>
            </Box>
          </Box>

          <Typography variant="body2" sx={{ color: '#475569', lineHeight: 1.7, mb: 3 }}>
            {company.description || 'Enterprise company profile and accounts info.'}
          </Typography>

          <Divider sx={{ mb: 3 }} />

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
              gap: 2.5
            }}
          >
            <Box>
              <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
                Website
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                <LanguageOutlined fontSize="small" sx={{ color: '#64748b' }} />
                <Typography variant="body2" sx={{ color: '#2563eb', fontWeight: 500 }}>
                  {company.website || 'N/A'}
                </Typography>
              </Box>
            </Box>

            <Box>
              <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
                Email
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                <EmailOutlined fontSize="small" sx={{ color: '#64748b' }} />
                <Typography variant="body2" sx={{ color: '#0f172a' }}>
                  {company.email || 'N/A'}
                </Typography>
              </Box>
            </Box>

            <Box>
              <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
                Phone
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                <PhoneOutlined fontSize="small" sx={{ color: '#64748b' }} />
                <Typography variant="body2" sx={{ color: '#0f172a' }}>
                  {company.phone || 'N/A'}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Paper>

        {/* Associated Leads List */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2.5, sm: 3.5 },
            borderRadius: 3,
            border: '1px solid #e2e8f0',
            bgcolor: '#ffffff'
          }}
        >
          <Typography variant="h6" fontWeight={700} sx={{ color: '#0f172a', mb: 2 }}>
            Associated Leads ({associatedLeads?.length || 0})
          </Typography>

          <TableContainer sx={{ border: '1px solid #e2e8f0', borderRadius: 2, overflow: 'hidden' }}>
            <Table size="small">
              <TableHead sx={{ bgcolor: '#f8fafc' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, color: '#475569', py: 1.5 }}>Lead Name</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#475569', py: 1.5 }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#475569', py: 1.5 }}>Phone</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#475569', py: 1.5 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#475569', py: 1.5 }}>Assigned Rep</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {associatedLeads && associatedLeads.length > 0 ? (
                  associatedLeads.map((lead) => (
                    <TableRow key={lead._id} hover>
                      <TableCell sx={{ fontWeight: 600, color: '#0f172a' }}>{lead.name}</TableCell>
                      <TableCell sx={{ color: '#475569' }}>{lead.email}</TableCell>
                      <TableCell sx={{ color: '#475569' }}>{lead.phone || '-'}</TableCell>
                      <TableCell>
                        <Chip
                          label={lead.status}
                          color={statusColors[lead.status] || 'default'}
                          size="small"
                          variant="outlined"
                          sx={{ fontWeight: 600, borderRadius: 1.5 }}
                        />
                      </TableCell>
                      <TableCell sx={{ color: '#334155' }}>{lead.assignedTo}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 4, color: '#64748b' }}>
                      No associated leads registered for this company yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    );
  }

  // List View (Default)
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
        {/* Title Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h5" fontWeight={700} sx={{ color: '#0f172a', letterSpacing: '-0.02em' }}>
              Companies
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>
              Directory of enterprise accounts and company information.
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setOpenAddModal(true)}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: 2,
              minWidth: 170,
              py: 1
            }}
          >
            Create Company
          </Button>
        </Box>

        {alert.show && (
          <Alert severity={alert.severity} onClose={() => setAlert({ ...alert, show: false })} sx={{ mb: 3, borderRadius: 2 }}>
            {alert.message}
          </Alert>
        )}

        {/* Toolbar: Single line Search + Industry + Location + Clear (Equal size, fully covering line) */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
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
            placeholder="Search companies... (Press Enter)"
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

          {/* 2. Industry Filter */}
          <TextField
            select
            size="small"
            label="Industry"
            value={industryFilter}
            onChange={(e) => setIndustryFilter(e.target.value)}
            sx={{
              width: '100%',
              bgcolor: '#ffffff',
              '& .MuiOutlinedInput-root': { borderRadius: 2 }
            }}
          >
            {industries.map((ind) => (
              <MenuItem key={ind} value={ind}>
                {ind}
              </MenuItem>
            ))}
          </TextField>

          {/* 3. Location Filter */}
          <TextField
            select
            size="small"
            label="Location"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            sx={{
              width: '100%',
              bgcolor: '#ffffff',
              '& .MuiOutlinedInput-root': { borderRadius: 2 }
            }}
          >
            {locations.map((loc) => (
              <MenuItem key={loc} value={loc}>
                {loc}
              </MenuItem>
            ))}
          </TextField>

          {/* 4. Clear Filters Button */}
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

        {/* Companies Table */}
        <TableContainer sx={{ border: '1px solid #e2e8f0', borderRadius: 2.5, overflow: 'hidden' }}>
          <Table>
            <TableHead sx={{ bgcolor: '#f8fafc' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, color: '#475569', py: 1.8 }}>Company Name</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#475569', py: 1.8 }}>Industry</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#475569', py: 1.8 }}>Location</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600, color: '#475569', py: 1.8 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 6 }}>
                    <CircularProgress size={28} />
                  </TableCell>
                </TableRow>
              ) : filteredCompanies.length > 0 ? (
                filteredCompanies.map((comp) => (
                  <TableRow
                    key={comp._id}
                    hover
                    onClick={() => handleViewDetails(comp)}
                    sx={{
                      cursor: 'pointer',
                      '&:last-child td, &:last-child th': { border: 0 }
                    }}
                  >
                    <TableCell sx={{ fontWeight: 600, color: '#0f172a' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar sx={{ bgcolor: '#eff6ff', color: '#2563eb', width: 32, height: 32 }}>
                          <Business sx={{ fontSize: 18 }} />
                        </Avatar>
                        <Typography variant="body2" fontWeight={600} sx={{ color: '#0f172a' }}>
                          {comp.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ color: '#475569' }}>
                      {comp.industry}
                    </TableCell>
                    <TableCell sx={{ color: '#475569' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <LocationOnOutlined fontSize="small" sx={{ color: '#94a3b8' }} />
                        <span>{comp.location}</span>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewDetails(comp);
                        }}
                        sx={{ textTransform: 'none', borderRadius: 2 }}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 6, color: '#64748b' }}>
                    No companies found matching your filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Create Company Modal */}
      <Dialog open={openAddModal} onClose={() => setOpenAddModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Create Company</DialogTitle>
        <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          <TextField
            label="Company Name"
            size="small"
            required
            fullWidth
            placeholder="e.g. ABC Corp"
            value={newCompany.name}
            onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })}
          />
          <TextField
            label="Industry"
            size="small"
            required
            fullWidth
            placeholder="e.g. IT"
            value={newCompany.industry}
            onChange={(e) => setNewCompany({ ...newCompany, industry: e.target.value })}
          />
          <TextField
            label="Location"
            size="small"
            required
            fullWidth
            placeholder="e.g. Chennai"
            value={newCompany.location}
            onChange={(e) => setNewCompany({ ...newCompany, location: e.target.value })}
          />
          <TextField
            label="Website"
            size="small"
            fullWidth
            placeholder="https://example.com"
            value={newCompany.website}
            onChange={(e) => setNewCompany({ ...newCompany, website: e.target.value })}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenAddModal(false)} sx={{ textTransform: 'none' }}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleCreateCompany} sx={{ textTransform: 'none', fontWeight: 600 }}>
            Save Company
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CompaniesPage;
