import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';

import Login from './components/Login';
import MainLayout from './components/MainLayout';
import DashboardPage from './components/DashboardPage';
import LeadsPage from './components/LeadsPage';
import CompaniesPage from './components/CompaniesPage';
import TasksPage from './components/TasksPage';
import UsersPage from './components/UsersDirectory';
function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    return saved && token ? JSON.parse(saved) : null;
  });

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentUser(null);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Public Login Route */}
          <Route
            path="/login"
            element={
              currentUser ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Login onLoginSuccess={(user) => setCurrentUser(user)} />
              )
            }
          />

          {/* Protected Routes inside MainLayout with persistent sidebar */}
          <Route
            path="/"
            element={
              currentUser ? (
                <MainLayout user={currentUser} onLogout={handleLogout} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="leads" element={<LeadsPage />} />
            <Route path="companies" element={<CompaniesPage />} />
            <Route path="users" element={<UsersPage currentUser={currentUser} />} />
            <Route path="tasks" element={<TasksPage currentUser={currentUser} />} />
          </Route>

          {/* Fallback Catch-all */}
          <Route path="*" element={<Navigate to={currentUser ? '/dashboard' : '/login'} replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
