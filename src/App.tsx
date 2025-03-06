
import React, { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './components/theme-provider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './App.css';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Toaster } from './components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { HeaderSettingsProvider } from './hooks/useHeaderSettings';
import { resourceMonitor } from './utils/resource-monitor';
import { initAutoPrefetch } from './utils/resource-prefetcher';

// Lazy load non-critical components and pages
const Debug = lazy(() => import('./pages/Debug'));

// Create a client with optimized settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      gcTime: 5 * 60 * 1000, // 5 minutes (replaces cacheTime)
      retry: 1,
      refetchOnWindowFocus: import.meta.env.PROD, // Only in production
    },
  },
});

// Import all critical paths eagerly
import Home from './pages/Home';
import Login from './pages/Login';
import NotFound from './pages/NotFound';

// Lazy load less critical paths
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Calendar = lazy(() => import('./pages/Calendar'));
const Orders = lazy(() => import('./pages/Orders'));
const OrderDetails = lazy(() => import('./pages/OrderDetails'));
const Customers = lazy(() => import('./pages/Customers'));
const CustomerDetails = lazy(() => import('./pages/CustomerDetails'));
const CompanyDetails = lazy(() => import('./pages/CompanyDetails'));
const Settings = lazy(() => import('./pages/Settings'));
const Production = lazy(() => import('./pages/Production'));
const ProductionBoard = lazy(() => import('./pages/ProductionBoard'));
const ProductionOrderDetails = lazy(() => import('./pages/ProductionOrderDetails'));
const ProductionUpload = lazy(() => import('./pages/ProductionUpload'));
const Learning = lazy(() => import('./pages/Learning'));
const NotificationsCenter = lazy(() => import('./pages/NotificationsCenter'));

// Loading fallback for lazy-loaded components
const PageLoading = () => (
  <div className="flex h-screen w-full items-center justify-center">
    <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
  </div>
);

function App() {
  // Initialize performance monitoring
  useEffect(() => {
    // Initialize performance monitoring
    resourceMonitor.init();
    
    // Initialize automatic prefetching of resources for visible links
    const cleanupPrefetch = initAutoPrefetch();
    
    // Log performance metrics after page is fully loaded
    window.addEventListener('load', () => {
      // Schedule metrics logging during idle time
      if ('requestIdleCallback' in window) {
        (window as any).requestIdleCallback(() => {
          resourceMonitor.logMetrics();
        });
      } else {
        setTimeout(() => {
          resourceMonitor.logMetrics();
        }, 1000);
      }
    });
    
    return () => {
      cleanupPrefetch();
    };
  }, []);

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
                
                {/* Protected routes with loading state */}
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <Suspense fallback={<PageLoading />}>
                        <Dashboard />
                      </Suspense>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/calendar" 
                  element={
                    <ProtectedRoute>
                      <Suspense fallback={<PageLoading />}>
                        <Calendar />
                      </Suspense>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/orders" 
                  element={
                    <ProtectedRoute>
                      <Suspense fallback={<PageLoading />}>
                        <Orders />
                      </Suspense>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/orders/:id" 
                  element={
                    <ProtectedRoute>
                      <Suspense fallback={<PageLoading />}>
                        <OrderDetails />
                      </Suspense>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/customers" 
                  element={
                    <ProtectedRoute>
                      <Suspense fallback={<PageLoading />}>
                        <Customers />
                      </Suspense>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/customers/:id" 
                  element={
                    <ProtectedRoute>
                      <Suspense fallback={<PageLoading />}>
                        <CustomerDetails />
                      </Suspense>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/companies/:id" 
                  element={
                    <ProtectedRoute>
                      <Suspense fallback={<PageLoading />}>
                        <CompanyDetails />
                      </Suspense>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/production" 
                  element={
                    <ProtectedRoute>
                      <Suspense fallback={<PageLoading />}>
                        <Production />
                      </Suspense>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/production/board" 
                  element={
                    <ProtectedRoute>
                      <Suspense fallback={<PageLoading />}>
                        <ProductionBoard />
                      </Suspense>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/production/order/:id" 
                  element={
                    <ProtectedRoute>
                      <Suspense fallback={<PageLoading />}>
                        <ProductionOrderDetails />
                      </Suspense>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/production/upload/:id" 
                  element={
                    <ProtectedRoute>
                      <Suspense fallback={<PageLoading />}>
                        <ProductionUpload />
                      </Suspense>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/learning" 
                  element={
                    <ProtectedRoute>
                      <Suspense fallback={<PageLoading />}>
                        <Learning />
                      </Suspense>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/notifications" 
                  element={
                    <ProtectedRoute>
                      <Suspense fallback={<PageLoading />}>
                        <NotificationsCenter />
                      </Suspense>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/settings" 
                  element={
                    <ProtectedRoute>
                      <Suspense fallback={<PageLoading />}>
                        <Settings />
                      </Suspense>
                    </ProtectedRoute>
                  } 
                />
                
                {/* Debug route - only available in development */}
                {import.meta.env.DEV && (
                  <Route 
                    path="/debug" 
                    element={
                      <Suspense fallback={<PageLoading />}>
                        <Debug />
                      </Suspense>
                    } 
                  />
                )}
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
