
import React, { useEffect, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
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

function App() {
  const location = useLocation();
  
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
    console.log("Current location:", location);
    console.log("Current routes config:", routes);
    
    return () => {
      cleanupPerformance();
    };
  }, [location]);

  return (
    <ErrorBoundary fallback={
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h2 className="text-xl font-semibold text-red-500 mb-2">Critical Error</h2>
        <p className="text-gray-600 mb-4">The application encountered a fatal error</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Refresh Page
        </button>
      </div>
    }>
      <AppProviders queryClient={queryClient}>
        <div className="app-container">
          <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading application...</div>}>
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
                  <p className="text-gray-600 mb-4">Current path: {location.pathname}</p>
                  <button 
                    onClick={() => window.location.href = '/'}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                  >
                    Go to Home
                  </button>
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
