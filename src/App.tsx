
import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/config/queryClient';
import { useHeaderSettings, HeaderSettingsProvider } from '@/hooks/useHeaderSettings';
import { AIAssistantProvider } from '@/contexts/AIAssistantContext';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import PageLoading from '@/components/loading/PageLoading';

// Eager loaded components
import Home from './pages/Home';
import NotFound from './pages/NotFound';

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
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen p-4">
    <Loader2 className="h-10 w-10 animate-spin text-primary" />
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
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={
                  <ErrorBoundary fallback={PageError}>
                    <Dashboard />
                  </ErrorBoundary>
                } />
                <Route path="/calendar/*" element={
                  <ErrorBoundary fallback={PageError}>
                    <Calendar />
                  </ErrorBoundary>
                } />
                <Route path="/orders" element={
                  <ErrorBoundary fallback={PageError}>
                    <Orders />
                  </ErrorBoundary>
                } />
                <Route path="/orders/:orderId" element={
                  <ErrorBoundary fallback={PageError}>
                    <OrderDetails />
                  </ErrorBoundary>
                } />
                <Route path="/products" element={
                  <ErrorBoundary fallback={PageError}>
                    <Products />
                  </ErrorBoundary>
                } />
                <Route path="/customers" element={
                  <ErrorBoundary fallback={PageError}>
                    <Customers />
                  </ErrorBoundary>
                } />
                <Route path="/companies/:companyId" element={
                  <ErrorBoundary fallback={PageError}>
                    <CompanyDetails />
                  </ErrorBoundary>
                } />
                <Route path="/settings/*" element={
                  <ErrorBoundary fallback={PageError}>
                    <Settings />
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
