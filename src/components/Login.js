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
  Fade,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  EmailOutlined,
  LockPersonOutlined,
  ArrowForward,
} from '@mui/icons-material';
import { login } from '../services/api';

const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleTogglePassword = () => setShowPassword((prev) => !prev);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email.trim() || !password) {
      setError('Please enter both your email address and password.');
      return;
    }

    try {
      setLoading(true);
      const data = await login(email.trim(), password);

      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }

      setSuccess('Authentication successful! Directing to dashboard...');
      setTimeout(() => {
        if (onLoginSuccess) onLoginSuccess(data.user);
      }, 500);
    } catch (err) {
      const msg =
        err.response?.data?.message || err.message || 'Invalid email or password.';
      setError(msg);
    } finally {
      setLoading(false);
    }
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
        px: 2,
      }}
    >
      <Container sx={{ maxWidth: '480px !important' }}>
        <Card
          elevation={4}
          sx={{
            borderRadius: 3,
            overflow: 'hidden',
            border: '1px solid #e2e8f0',
            bgcolor: '#ffffff',
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
              alignItems: 'center',
            }}
          >
            <Avatar
              sx={{
                bgcolor: 'primary.main',
                width: 48,
                height: 48,
                mb: 1.5,
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.4)',
              }}
            >
              <LockPersonOutlined sx={{ fontSize: 28 }} />
            </Avatar>
            <Typography variant="h5" fontWeight={700} sx={{ letterSpacing: '-0.02em' }}>
              MINI CRM
            </Typography>
            <Typography variant="body2" sx={{ color: '#94a3b8', mt: 0.5 }}>
              Sign in to continue
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
              {/* Email */}
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
                placeholder="john@mail.com"
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
                slotProps={{
                  input: {

                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                          onClick={handleTogglePassword}
                          onMouseDown={(e) => e.preventDefault()}
                          edge="end"
                        >
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
                sx={{
                  mb: 3,
                  '& input::-ms-reveal, & input::-ms-clear': { display: 'none' },
                }}
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
                    boxShadow: '0 6px 20px rgba(37, 99, 235, 0.4)',
                  },
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
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default Login;