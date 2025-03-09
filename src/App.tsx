
import React, { useEffect, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { Toaster } from './components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import routes from './routes/routes.config';
import { initializePerformance } from './utils/performance';
import { AppProviders } from './providers/AppProviders';
import { ErrorBoundary } from './components/ErrorBoundary';
import { createQueryClient } from './config/queryClient';

// Create the query client
const queryClient = createQueryClient();

// Simple fallback component to show when routes are loading
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
      <p className="text-gray-600">Loading application...</p>
    </div>
  </div>
);

// Error fallback component
const ErrorFallback = ({ error, resetErrorBoundary }: { error: any; resetErrorBoundary: () => void }) => (
  <div className="flex flex-col items-center justify-center min-h-screen p-4">
    <h2 className="text-xl font-semibold text-red-500 mb-2">Critical Error</h2>
    <p className="text-gray-600 mb-2">The application encountered a fatal error</p>
    <p className="text-sm text-gray-500 mb-4">{error?.message || "Unknown error"}</p>
    <div className="flex space-x-3">
      <button 
        onClick={() => window.location.reload()} 
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        Refresh Page
      </button>
      <button 
        onClick={() => {
          resetErrorBoundary();
          window.location.href = '/dashboard';
        }} 
        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
      >
        Go to Dashboard
      </button>
    </div>
  </div>
);

function App() {
  // Initialize performance monitoring
  useEffect(() => {
    console.log("App component mounted");
    console.log("App environment:", {
      isDev: import.meta.env.DEV,
      mode: import.meta.env.MODE,
      version: import.meta.env.VITE_APP_VERSION || 'unknown'
    });
    
    const cleanupPerformance = initializePerformance();
    
    // Debug current route
    console.log("Current path:", window.location.pathname);
    
    // In development, redirect to dashboard by default if we're at root
    if (import.meta.env.DEV && window.location.pathname === '/') {
      console.log('DEV mode: Redirecting from root to /dashboard');
      window.location.href = '/dashboard';
    }
    
    return () => {
      cleanupPerformance();
    };
  }, []);

  // If we're at the root path, redirect to dashboard in development
  if (import.meta.env.DEV && window.location.pathname === '/') {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <ErrorBoundary fallback={
      ({ error, resetErrorBoundary }) => (
        <ErrorFallback error={error} resetErrorBoundary={resetErrorBoundary} />
      )
    }>
      <AppProviders queryClient={queryClient}>
        <div className="app-container">
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              {routes.map((route, index) => (
                <Route key={index} path={route.path} element={
                  <ErrorBoundary>
                    {route.element}
                  </ErrorBoundary>
                } />
              ))}
              {/* Add a catch-all route for debugging */}
              <Route path="*" element={
                <div className="flex flex-col items-center justify-center min-h-screen p-4">
                  <h2 className="text-xl font-semibold mb-2">Route Not Found</h2>
                  <p className="text-gray-600 mb-4">Current path: {window.location.pathname}</p>
                  <div className="flex flex-wrap gap-2">
                    <button 
                      onClick={() => window.location.href = '/'}
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                    >
                      Go to Home
                    </button>
                    <button 
                      onClick={() => window.location.href = '/dashboard'}
                      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                    >
                      Go to Dashboard
                    </button>
                    <button 
                      onClick={() => window.location.href = '/debug'}
                      className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
                    >
                      Debug
                    </button>
                  </div>
                </div>
              } />
            </Routes>
          </Suspense>
          <Toaster />
          <Sonner />
        </div>
      </AppProviders>
    </ErrorBoundary>
  );
}

export default App;
