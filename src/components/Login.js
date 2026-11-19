import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  Container,
  Avatar,
  Divider,
  Fade,
  Chip
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  EmailOutlined,
  LockOutlined,
  LockPersonOutlined,
  ArrowForward,
  VpnKeyOutlined
} from '@mui/icons-material';
import { login } from '../services/api';

const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email || !password) {
      setError('Please enter both your email address and password.');
      return;
    }

    try {
      setLoading(true);
      const data = await login(email, password);
      setSuccess('Authentication successful! Directing to dashboard...');
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      setTimeout(() => {
        if (onLoginSuccess) {
          onLoginSuccess(data.user);
        }
      }, 500);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Invalid email or password.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleFillAdmin = () => {
    setEmail('admin@gmail.com');
    setPassword('admin@123');
    setError('');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#f1f5f9',
        py: 6,
        px: 2
      }}
    >
      <Container sx={{ maxWidth: '480px !important' }}>
        <Card
          elevation={4}
          sx={{
            borderRadius: 3,
            overflow: 'hidden',
            border: '1px solid #e2e8f0',
            bgcolor: '#ffffff'
          }}
        >
          {/* Header Bar */}
          <Box
            sx={{
              bgcolor: '#1e293b',
              color: '#ffffff',
              py: 3.5,
              px: 4,
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <Avatar
              sx={{
                bgcolor: 'primary.main',
                width: 48,
                height: 48,
                mb: 1.5,
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.4)'
              }}
            >
              <LockPersonOutlined sx={{ fontSize: 28 }} />
            </Avatar>
            <Typography variant="h5" fontWeight={700} sx={{ letterSpacing: '-0.02em' }}>
              Portal Sign In
            </Typography>
            <Typography variant="body2" sx={{ color: '#94a3b8', mt: 0.5 }}>
              Enter your corporate credentials to continue
            </Typography>
          </Box>

          <CardContent sx={{ p: { xs: 3, sm: 4.5 } }}>
            {error && (
              <Fade in={Boolean(error)}>
                <Alert severity="error" variant="filled" sx={{ mb: 3, borderRadius: 2 }}>
                  {error}
                </Alert>
              </Fade>
            )}

            {success && (
              <Fade in={Boolean(success)}>
                <Alert severity="success" variant="filled" sx={{ mb: 3, borderRadius: 2 }}>
                  {success}
                </Alert>
              </Fade>
            )}

            <Box component="form" onSubmit={handleSubmit} noValidate>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@gmail.com"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailOutlined color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />

              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlined color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 3 }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                endIcon={!loading && <ArrowForward />}
                sx={{
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 600,
                  borderRadius: 2,
                  boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)',
                  '&:hover': {
                    boxShadow: '0 6px 20px rgba(37, 99, 235, 0.4)'
                  }
                }}
              >
                {loading ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <CircularProgress size={22} color="inherit" thickness={4} />
                    <span>Signing in...</span>
                  </Box>
                ) : (
                  'Sign In'
                )}
              </Button>

              <Divider sx={{ my: 3.5 }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', px: 1 }}>
                  CREDENTIALS ASSISTANCE
                </Typography>
              </Divider>

              {/* Demo Fill Section */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  p: 2,
                  borderRadius: 2,
                  bgcolor: '#f8fafc',
                  border: '1px dashed #cbd5e1'
                }}
              >
                <Box>
                  <Typography variant="caption" display="block" color="text.secondary" fontWeight={500}>
                    Default Admin Account:
                  </Typography>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 600, color: '#1e293b' }}>
                    admin@gmail.com / admin@123
                  </Typography>
                </Box>
                <Chip
                  icon={<VpnKeyOutlined sx={{ fontSize: '1rem !important' }} />}
                  label="Fill Form"
                  color="primary"
                  variant="outlined"
                  size="small"
                  clickable
                  onClick={handleFillAdmin}
                  sx={{ fontWeight: 600, borderRadius: 1.5 }}
                />
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default Login;
