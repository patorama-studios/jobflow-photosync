
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { GoogleMapsProvider } from './contexts/GoogleMapsContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { CalendarSkeleton } from './components/dashboard/calendar/CalendarSkeleton';

// Lazy load pages for better performance
const ProductionUpload = lazy(() => import('./pages/ProductionUpload'));
const Orders = lazy(() => import('./pages/Orders'));
const CalendarPage = lazy(() => import('./pages/CalendarPage'));
const SettingsPage = lazy(() => import('./pages/Settings'));
const PropertyWebsite = lazy(() => import('./pages/PropertyWebsite'));
const FileDownloads = lazy(() => import('./pages/FileDownloads'));

// Loading fallback component
const PageLoader = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="space-y-4 w-full max-w-md">
      <CalendarSkeleton />
    </div>
  </div>
);

function App() {
  // Google Maps API key - use environment variable or fallback
  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "YOUR_GOOGLE_MAPS_API_KEY";
  
  return (
    <GoogleMapsProvider apiKey={googleMapsApiKey}>
      <Router>
        <ErrorBoundary>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/production/:orderId" element={<ProductionUpload />} />
              <Route path="/orders/*" element={<Orders />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/property-website/:orderId" element={<PropertyWebsite />} />
              <Route path="/files/:orderId" element={<FileDownloads />} />
              {/* Add a default route to redirect to calendar */}
              <Route path="/" element={<CalendarPage />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
        <Toaster />
      </Router>
    </GoogleMapsProvider>
  );
}

export default App;
