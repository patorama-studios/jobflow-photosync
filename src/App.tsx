
import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/config/queryClient';
import { useHeaderSettings, HeaderSettingsProvider } from '@/hooks/useHeaderSettings';
import { AIAssistantProvider } from '@/contexts/AIAssistantContext';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import PageLoading from '@/components/loading/PageLoading';
import { ProtectedRoute } from '@/components/ProtectedRoute';

// Eager loaded components
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Debug from './pages/Debug';

// Lazy loaded pages for better performance
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Settings = lazy(() => import('./pages/Settings'));
const Calendar = lazy(() => import('./pages/Calendar'));
const Orders = lazy(() => import('./pages/Orders'));
const OrderDetails = lazy(() => import('./pages/OrderDetails'));
const Products = lazy(() => import('./pages/Products'));
const Customers = lazy(() => import('./pages/Customers'));
const CompanyDetails = lazy(() => import('./pages/CompanyDetails'));

// Fallback loading component
const AppLoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen p-4 bg-white dark:bg-gray-950">
    <div className="text-center">
      <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
      <p className="text-muted-foreground">Loading application...</p>
    </div>
  </div>
);

// Fallback error component
const PageError = ({ error, resetErrorBoundary }) => (
  <div className="flex flex-col items-center justify-center min-h-screen p-4">
    <h2 className="text-xl font-semibold text-red-500 mb-2">Page Load Error</h2>
    <p className="text-gray-600 mb-4">Something went wrong loading this page</p>
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
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <HeaderSettingsProvider>
          <AIAssistantProvider>
            <Suspense fallback={<AppLoadingFallback />}>
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={
                  <ErrorBoundary fallback={PageError}>
                    <ProtectedRoute>
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
                    <ProtectedRoute>
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
