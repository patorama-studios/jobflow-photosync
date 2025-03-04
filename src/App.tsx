
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from './components/ui/toaster';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

// Pages
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import Verify from './pages/Verify';
import Learning from './pages/Learning';
import Calendar from './pages/Calendar';

function App() {
  return (
    <div className="app">
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/login" element={<Login />} />
              <Route path="/verify" element={<Verify />} />
              
              {/* Protected Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/calendar" element={
                <ProtectedRoute>
                  <Calendar />
                </ProtectedRoute>
              } />
              
              <Route path="/orders" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/customers" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/production" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/learning" element={
                <ProtectedRoute>
                  <Learning />
                </ProtectedRoute>
              } />
              
              <Route path="/settings" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
          <Toaster />
        </AuthProvider>
      </ThemeProvider>
    </div>
  );
}

export default App;
