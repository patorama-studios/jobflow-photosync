
import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import { Toaster } from './components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { routes } from './routes/routes.config';
import { initializePerformance } from './utils/performance';
import { AppProviders } from './providers/AppProviders';
import { createQueryClient } from './config/queryClient';

// Create the query client
const queryClient = createQueryClient();

function App() {
  // Initialize performance monitoring
  useEffect(() => {
    const cleanupPerformance = initializePerformance();
    return () => {
      cleanupPerformance();
    };
  }, []);

  return (
    <AppProviders queryClient={queryClient}>
      <Routes>
        {routes.map((route, index) => (
          <Route key={index} path={route.path} element={route.element} />
        ))}
      </Routes>
      <Toaster />
      <Sonner />
    </AppProviders>
  );
}

export default App;
