
import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/config/queryClient';
import { AppProviders } from './providers/AppProviders';
import { PageLoading } from '@/components/loading/PageLoading';
import { ErrorBoundary } from '@/components/ErrorBoundary';

// Eager loaded components
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Debug from './pages/Debug';
import Login from './pages/Login';
import Verify from './pages/Verify';
import Auth from './pages/Auth';

// Lazy loaded pages with preloadable chunks
const Dashboard = lazy(() => {
  // Preload critical dashboard components
  import('./components/dashboard/StatsCards');
  return import('./pages/Dashboard');
});

const Settings = lazy(() => import('./pages/Settings'));
const Calendar = lazy(() => import('./pages/Calendar'));
const Orders = lazy(() => import('./pages/Orders'));
const OrderDetails = lazy(() => import('./pages/OrderDetails'));
const Products = lazy(() => import('./pages/Products'));
const Customers = lazy(() => import('./pages/Customers'));
const CompanyDetails = lazy(() => import('./pages/CompanyDetails'));

function App() {
  return (
    <AppProviders queryClient={queryClient}>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/register" element={<Auth defaultTab="register" />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/dashboard" element={
          <React.Suspense fallback={<PageLoading message="Loading Dashboard..." />}>
            <Dashboard />
          </React.Suspense>
        } />
        <Route path="/calendar/*" element={
          <React.Suspense fallback={<PageLoading message="Loading Calendar..." />}>
            <Calendar />
          </React.Suspense>
        } />
        <Route path="/orders" element={
          <React.Suspense fallback={<PageLoading message="Loading Orders..." />}>
            <Orders />
          </React.Suspense>
        } />
        <Route path="/orders/:orderId" element={
          <React.Suspense fallback={<PageLoading message="Loading Order Details..." />}>
            <OrderDetails />
          </React.Suspense>
        } />
        <Route path="/products" element={
          <React.Suspense fallback={<PageLoading message="Loading Products..." />}>
            <Products />
          </React.Suspense>
        } />
        <Route path="/customers" element={
          <React.Suspense fallback={<PageLoading message="Loading Customers..." />}>
            <Customers />
          </React.Suspense>
        } />
        <Route path="/companies/:companyId" element={
          <React.Suspense fallback={<PageLoading message="Loading Company Details..." />}>
            <CompanyDetails />
          </React.Suspense>
        } />
        <Route path="/settings/*" element={
          <React.Suspense fallback={<PageLoading message="Loading Settings..." />}>
            <Settings />
          </React.Suspense>
        } />
        <Route path="/debug" element={<Debug />} />
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </AppProviders>
  );
}

export default App;
