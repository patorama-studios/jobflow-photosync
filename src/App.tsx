
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './components/theme-provider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './App.css';

import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Calendar from './pages/Calendar';
import Orders from './pages/Orders';
import OrderDetails from './pages/OrderDetails';
import Customers from './pages/Customers';
import CustomerDetails from './pages/CustomerDetails';
import CompanyDetails from './pages/CompanyDetails';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import Production from './pages/Production';
import ProductionBoard from './pages/ProductionBoard';
import ProductionOrderDetails from './pages/ProductionOrderDetails';
import ProductionUpload from './pages/ProductionUpload';
import Learning from './pages/Learning';
import NotificationsCenter from './pages/NotificationsCenter';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Toaster } from './components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { HeaderSettingsProvider } from './hooks/useHeaderSettings';

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="light" storageKey="patorama-theme">
          <Router>
            <HeaderSettingsProvider>
              <Routes>
                {/* Explicit index route that redirects to Calendar */}
                <Route index element={<Navigate to="/calendar" replace />} />
                <Route path="/" element={<Navigate to="/calendar" replace />} />
                <Route path="/login" element={<Login />} />
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/calendar" 
                  element={
                    <ProtectedRoute>
                      <Calendar />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/orders" 
                  element={
                    <ProtectedRoute>
                      <Orders />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/orders/:id" 
                  element={
                    <ProtectedRoute>
                      <OrderDetails />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/customers" 
                  element={
                    <ProtectedRoute>
                      <Customers />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/customers/:id" 
                  element={
                    <ProtectedRoute>
                      <CustomerDetails />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/companies/:id" 
                  element={
                    <ProtectedRoute>
                      <CompanyDetails />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/production" 
                  element={
                    <ProtectedRoute>
                      <Production />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/production/board" 
                  element={
                    <ProtectedRoute>
                      <ProductionBoard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/production/order/:id" 
                  element={
                    <ProtectedRoute>
                      <ProductionOrderDetails />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/production/upload/:id" 
                  element={
                    <ProtectedRoute>
                      <ProductionUpload />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/learning" 
                  element={
                    <ProtectedRoute>
                      <Learning />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/notifications" 
                  element={
                    <ProtectedRoute>
                      <NotificationsCenter />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/settings" 
                  element={
                    <ProtectedRoute>
                      <Settings />
                    </ProtectedRoute>
                  } 
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Toaster />
              <Sonner />
            </HeaderSettingsProvider>
          </Router>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
