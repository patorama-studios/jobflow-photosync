import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate
} from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import OrderDetails from './pages/OrderDetails';
import Clients from './pages/Clients';
import Companies from './pages/Companies';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Toaster } from '@/components/ui/toaster';
import MainLayout from '@/components/layout/MainLayout';
import { ErrorBoundary } from './components/ErrorBoundary';
import { HeaderSettingsProvider } from '@/hooks/useHeaderSettings';

function App() {
  useEffect(() => {
    // Initialize storage buckets
    const initializeStorage = async () => {
      try {
        await supabase.functions.invoke('initialize-storage');
        console.log('Storage buckets initialized');
      } catch (error) {
        console.error('Error initializing storage buckets:', error);
      }
    };

    initializeStorage();
  }, []);

  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppRoutes />
        <Toaster />
      </AuthProvider>
    </ErrorBoundary>
  );
}

// Separate component for routes to access auth context
function AppRoutes() {
  const { user, isLoading } = useAuth();

  // Show a simple loading state while auth state is being determined
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <Router>
      <HeaderSettingsProvider>
        <Routes>
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" replace />} />
          <Route
            path="/dashboard"
            element={
              user ? (
                <MainLayout>
                  <Dashboard />
                </MainLayout>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/orders"
            element={
              user ? (
                <MainLayout>
                  <Orders />
                </MainLayout>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/orders/:id"
            element={
              user ? (
                <MainLayout>
                  <OrderDetails />
                </MainLayout>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/clients"
            element={
              user ? (
                <MainLayout>
                  <Clients />
                </MainLayout>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/companies"
            element={
              user ? (
                <MainLayout>
                  <Companies />
                </MainLayout>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          {/* Default route - redirect to login by default */}
          <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
          {/* Catch all route - redirect to login or dashboard based on auth state */}
          <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
        </Routes>
      </HeaderSettingsProvider>
    </Router>
  );
}

export default App;
