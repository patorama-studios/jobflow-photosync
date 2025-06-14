import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/config/queryClient';
import { AppProviders } from './providers/AppProviders';
import { PageLoading } from '@/components/loading/PageLoading';
import { ErrorBoundary } from '@/components/ErrorBoundary';

// Eager loaded components
import NotFound from './pages/NotFound';
import Debug from './pages/Debug';
import Auth from './pages/Auth';
import Verify from './pages/Verify';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { RootRedirect } from './components/auth/RootRedirect';

// Import Dashboard directly to fix dynamic import error
import Dashboard from './pages/Dashboard';

const Settings = lazy(() => import('./pages/Settings'));
const Calendar = lazy(() => import('./pages/Calendar'));
const Orders = lazy(() => import('./pages/Orders'));
const OrderDetails = lazy(() => import('./pages/OrderDetails'));
const Products = lazy(() => import('./pages/Products'));
const Customers = lazy(() => import('./pages/Customers'));
const CompanyDetails = lazy(() => import('./pages/CompanyDetails'));
const CustomerDetails = lazy(() => import('./pages/CustomerDetails'));
const ClientDetails = lazy(() => import('./pages/ClientDetails'));
const OrderSinglePage = lazy(() => import('./pages/OrderSinglePageNew'));
const CalendarPage = lazy(() => import('./pages/CalendarPage'));
const ProductionBoard = lazy(() => import('./pages/ProductionBoard'));
const Production = lazy(() => import('./pages/Production'));
const ProductionUpload = lazy(() => import('./pages/ProductionUpload'));
const ProductionOrderDetails = lazy(() => import('./pages/ProductionOrderDetails'));
const ProductDelivery = lazy(() => import('./pages/ProductDelivery'));
const NotificationsCenter = lazy(() => import('./pages/NotificationsCenter'));

function App() {
  return (
    <AppProviders queryClient={queryClient}>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/register" element={<Navigate to="/auth" state={{ tab: "register" }} replace />} />
        <Route path="/verify" element={<Verify />} />
        
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/calendar/*" element={
          <ProtectedRoute>
            <React.Suspense fallback={<PageLoading message="Loading Calendar..." />}>
              <Calendar />
            </React.Suspense>
          </ProtectedRoute>
        } />
        
        <Route path="/calendar-page" element={
          <ProtectedRoute>
            <React.Suspense fallback={<PageLoading message="Loading Calendar..." />}>
              <CalendarPage />
            </React.Suspense>
          </ProtectedRoute>
        } />
        
        <Route path="/orders" element={
          <ProtectedRoute>
            <React.Suspense fallback={<PageLoading message="Loading Orders..." />}>
              <Orders />
            </React.Suspense>
          </ProtectedRoute>
        } />
        
        <Route path="/orders/:id" element={
          <ProtectedRoute>
            <React.Suspense fallback={<PageLoading message="Loading Order Details..." />}>
              <OrderSinglePage />
            </React.Suspense>
          </ProtectedRoute>
        } />
        
        <Route path="/order/:id" element={
          <ProtectedRoute>
            <React.Suspense fallback={<PageLoading message="Loading Order..." />}>
              <OrderSinglePage />
            </React.Suspense>
          </ProtectedRoute>
        } />
        
        <Route path="/products" element={
          <ProtectedRoute>
            <React.Suspense fallback={<PageLoading message="Loading Products..." />}>
              <Products />
            </React.Suspense>
          </ProtectedRoute>
        } />
        
        <Route path="/customers" element={
          <ProtectedRoute>
            <React.Suspense fallback={<PageLoading message="Loading Customers..." />}>
              <Customers />
            </React.Suspense>
          </ProtectedRoute>
        } />
        
        <Route path="/customers/:id" element={
          <ProtectedRoute>
            <React.Suspense fallback={<PageLoading message="Loading Customer Details..." />}>
              <CustomerDetails />
            </React.Suspense>
          </ProtectedRoute>
        } />
        
        <Route path="/customers/companies/:id" element={
          <ProtectedRoute>
            <React.Suspense fallback={<PageLoading message="Loading Company Details..." />}>
              <CompanyDetails />
            </React.Suspense>
          </ProtectedRoute>
        } />
        
        <Route path="/clients/:id" element={
          <ProtectedRoute>
            <React.Suspense fallback={<PageLoading message="Loading Client Details..." />}>
              <ClientDetails />
            </React.Suspense>
          </ProtectedRoute>
        } />
        
        <Route path="/production" element={
          <ProtectedRoute>
            <React.Suspense fallback={<PageLoading message="Loading Production..." />}>
              <Production />
            </React.Suspense>
          </ProtectedRoute>
        } />
        
        <Route path="/production/board" element={
          <ProtectedRoute>
            <React.Suspense fallback={<PageLoading message="Loading Production Board..." />}>
              <ProductionBoard />
            </React.Suspense>
          </ProtectedRoute>
        } />
        
        <Route path="/production/upload" element={
          <ProtectedRoute>
            <React.Suspense fallback={<PageLoading message="Loading Upload..." />}>
              <ProductionUpload />
            </React.Suspense>
          </ProtectedRoute>
        } />
        
        <Route path="/production/orders/:id" element={
          <ProtectedRoute>
            <React.Suspense fallback={<PageLoading message="Loading Production Order..." />}>
              <ProductionOrderDetails />
            </React.Suspense>
          </ProtectedRoute>
        } />
        
        <Route path="/delivery/:id" element={
          <ProtectedRoute>
            <React.Suspense fallback={<PageLoading message="Loading Product Delivery..." />}>
              <ProductDelivery />
            </React.Suspense>
          </ProtectedRoute>
        } />
        
        <Route path="/notifications" element={
          <ProtectedRoute>
            <React.Suspense fallback={<PageLoading message="Loading Notifications..." />}>
              <NotificationsCenter />
            </React.Suspense>
          </ProtectedRoute>
        } />
        
        <Route path="/settings" element={
          <ProtectedRoute>
            <React.Suspense fallback={<PageLoading message="Loading Settings..." />}>
              <Settings />
            </React.Suspense>
          </ProtectedRoute>
        } />
        
        <Route path="/debug" element={<Debug />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AppProviders>
  );
}

export default App;