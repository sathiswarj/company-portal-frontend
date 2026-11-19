import React, { useEffect, useMemo, useState } from 'react';
import {
    Alert,
    Box,
    Button,
    Chip,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    InputAdornment,
    Paper,
    Snackbar,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography
} from '@mui/material';
import { Add as AddIcon, SearchOutlined } from '@mui/icons-material';
import { getUsers, onboardUser } from '../services/api';

const emptyUser = { name: '', email: '', password: '' };

const UsersDirectory = ({ currentUser }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [openModal, setOpenModal] = useState(false);
    const [newUser, setNewUser] = useState(emptyUser);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const isAdmin = currentUser?.role === 'admin';

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await getUsers();
                setUsers(Array.isArray(data) ? data : []);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load users.');
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const filteredUsers = useMemo(() => {
        const query = search.trim().toLowerCase();
        if (!query) return users;
        return users.filter((user) =>
            `${user.name} ${user.email} ${user.role}`.toLowerCase().includes(query)
        );
    }, [search, users]);

    const handleOnboard = async (event) => {
        event.preventDefault();
        setSaving(true);
        try {
            const payload = { ...newUser };
            if (!payload.password) delete payload.password;
            const result = await onboardUser(payload);
            setUsers((currentUsers) => [result.user, ...currentUsers]);
            setNewUser(emptyUser);
            setOpenModal(false);
            setSnackbar({ open: true, message: result.message || 'User onboarded successfully.', severity: 'success' });
        } catch (err) {
            setSnackbar({
                open: true,
                message: err.response?.data?.message || 'Failed to onboard user.',
                severity: 'error'
            });
        } finally {
            setSaving(false);
        }
    };

    return (
        <Box>
            <Paper elevation={0} sx={{ p: { xs: 2.5, sm: 3.5 }, borderRadius: 3, border: '1px solid #e2e8f0' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2, mb: 3, flexWrap: 'wrap' }}>
                    <Box>
                        <Typography variant="h5" fontWeight={700} sx={{ color: '#0f172a' }}>
                            Users
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>
                            Manage your organization’s user accounts and access roles.
                        </Typography>
                    </Box>
                    {isAdmin && (
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => setOpenModal(true)}
                            sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2 }}
                        >
                            Onboard user
                        </Button>
                    )}
                </Box>

                <TextField
                    size="small"
                    placeholder="Search users..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    sx={{ width: { xs: '100%', sm: 360 }, mb: 2.5, bgcolor: '#fff' }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchOutlined fontSize="small" sx={{ color: '#94a3b8' }} />
                            </InputAdornment>
                        )
                    }}
                />

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                <TableContainer sx={{ border: '1px solid #e2e8f0', borderRadius: 2.5, overflowX: 'auto' }}>
                    <Table>
                        <TableHead sx={{ bgcolor: '#f8fafc' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Name</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Email</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Role</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Joined</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={4} align="center" sx={{ py: 6 }}><CircularProgress size={28} /></TableCell>
                                </TableRow>
                            ) : filteredUsers.length ? (
                                filteredUsers.map((user) => (
                                    <TableRow key={user._id || user.id} hover>
                                        <TableCell sx={{ fontWeight: 600, color: '#0f172a' }}>{user.name}</TableCell>
                                        <TableCell sx={{ color: '#475569' }}>{user.email}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={user.role}
                                                size="small"
                                                color={user.role === 'admin' ? 'primary' : 'default'}
                                                sx={{ textTransform: 'capitalize', fontWeight: 600 }}
                                            />
                                        </TableCell>
                                        <TableCell sx={{ color: '#64748b' }}>
                                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} align="center" sx={{ py: 6, color: '#64748b' }}>
                                        {search ? 'No users match your search.' : 'No users found.'}
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            <Dialog open={openModal} onClose={() => !saving && setOpenModal(false)} maxWidth="xs" fullWidth>
                <Box component="form" onSubmit={handleOnboard}>
                    <DialogTitle sx={{ fontWeight: 700 }}>Onboard user</DialogTitle>
                    <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 2 }}>
                        <TextField
                            label="Full name"
                            required
                            fullWidth
                            autoFocus
                            value={newUser.name}
                            onChange={(event) => setNewUser({ ...newUser, name: event.target.value })}
                        />
                        <TextField
                            label="Email address"
                            type="email"
                            required
                            fullWidth
                            value={newUser.email}
                            onChange={(event) => setNewUser({ ...newUser, email: event.target.value })}
                        />
                        <TextField
                            label="Password"
                            type="password"
                            fullWidth
                            helperText="Optional. Leave blank to use the default password."
                            value={newUser.password}
                            inputProps={{ minLength: 6 }}
                            onChange={(event) => setNewUser({ ...newUser, password: event.target.value })}
                        />
                    </DialogContent>
                    <DialogActions sx={{ p: 2 }}>
                        <Button onClick={() => setOpenModal(false)} disabled={saving} sx={{ textTransform: 'none' }}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="contained" disabled={saving} sx={{ textTransform: 'none', fontWeight: 600 }}>
                            {saving ? 'Creating...' : 'Create user'}
                        </Button>
                    </DialogActions>
                </Box>
            </Dialog>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar((current) => ({ ...current, open: false }))}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => setSnackbar((current) => ({ ...current, open: false }))}
                    severity={snackbar.severity}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default UsersDirectory;