
import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/config/queryClient';
import { HeaderSettingsProvider } from '@/hooks/useHeaderSettings';
import { AIAssistantProvider } from '@/contexts/AIAssistantContext';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import ProtectedRoute from '@/components/ProtectedRoute';
import { PageLoading } from '@/components/loading/PageLoading';
import { initializePerformance } from '@/utils/performance';

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

// Optimized loading fallback with configurable timeout
const AppLoadingFallback = () => (
  <PageLoading forceRefreshAfter={8} message="Loading application..." />
);

// Optimized error component
const PageError = ({ error, resetErrorBoundary }: { error: Error, resetErrorBoundary: () => void }) => (
  <div className="flex flex-col items-center justify-center min-h-screen p-4">
    <h2 className="text-xl font-semibold text-red-500 mb-2">Page Load Error</h2>
    <p className="text-gray-600 mb-4">{error?.message || "Something went wrong loading this page"}</p>
    <div className="flex gap-2">
      <button 
        onClick={resetErrorBoundary} 
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        Try Again
      </button>
      <button 
        onClick={() => window.location.href = "/dashboard"} 
        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
      >
        Go to Dashboard
      </button>
    </div>
  </div>
);

function App() {
  // Initialize performance monitoring
  React.useEffect(() => {
    const cleanup = initializePerformance();
    return cleanup;
  }, []);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <HeaderSettingsProvider>
          <AIAssistantProvider>
            <Suspense fallback={<AppLoadingFallback />}>
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/login" element={<Auth />} />
                <Route path="/register" element={<Auth defaultTab="register" />} />
                <Route path="/verify" element={<Verify />} />
                <Route path="/dashboard" element={
                  <ErrorBoundary fallback={PageError}>
                    <ProtectedRoute requireAuth={true}>
                      <Dashboard />
                    </ProtectedRoute>
                  </ErrorBoundary>
                } />
                <Route path="/calendar/*" element={
                  <ErrorBoundary fallback={PageError}>
                    <ProtectedRoute>
                      <Calendar />
                    </ProtectedRoute>
                  </ErrorBoundary>
                } />
                <Route path="/orders" element={
                  <ErrorBoundary fallback={PageError}>
                    <ProtectedRoute>
                      <Orders />
                    </ProtectedRoute>
                  </ErrorBoundary>
                } />
                <Route path="/orders/:orderId" element={
                  <ErrorBoundary fallback={PageError}>
                    <ProtectedRoute>
                      <OrderDetails />
                    </ProtectedRoute>
                  </ErrorBoundary>
                } />
                <Route path="/products" element={
                  <ErrorBoundary fallback={PageError}>
                    <ProtectedRoute>
                      <Products />
                    </ProtectedRoute>
                  </ErrorBoundary>
                } />
                <Route path="/customers" element={
                  <ErrorBoundary fallback={PageError}>
                    <ProtectedRoute>
                      <Customers />
                    </ProtectedRoute>
                  </ErrorBoundary>
                } />
                <Route path="/companies/:companyId" element={
                  <ErrorBoundary fallback={PageError}>
                    <ProtectedRoute>
                      <CompanyDetails />
                    </ProtectedRoute>
                  </ErrorBoundary>
                } />
                <Route path="/settings/*" element={
                  <ErrorBoundary fallback={PageError}>
                    <ProtectedRoute requireAuth={true}>
                      <Settings />
                    </ProtectedRoute>
                  </ErrorBoundary>
                } />
                <Route path="/debug" element={
                  <ErrorBoundary fallback={PageError}>
                    <Debug />
                  </ErrorBoundary>
                } />
                <Route path="/404" element={<NotFound />} />
                <Route path="*" element={<Navigate to="/404" replace />} />
              </Routes>
            </Suspense>
          </AIAssistantProvider>
        </HeaderSettingsProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
