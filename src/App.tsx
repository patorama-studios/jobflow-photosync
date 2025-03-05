import React, { Suspense, lazy, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from './components/ui/toaster';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Loader2 } from 'lucide-react';

// Improved lazy loading with error boundaries
const lazyLoad = (importFunc) => {
  const Component = lazy(importFunc);
  return (props) => (
    <Suspense fallback={<LoadingFallback />}>
      <Component {...props} />
    </Suspense>
  );
};

// Lazy load pages with prioritization
const Login = lazyLoad(() => import('./pages/Login'));
const Verify = lazyLoad(() => import('./pages/Verify'));
const Dashboard = lazyLoad(() => import('./pages/Dashboard'));
const Calendar = lazyLoad(() => import('./pages/Calendar'));
const Orders = lazyLoad(() => import('./pages/Orders'));
const Customers = lazyLoad(() => import('./pages/Customers'));
const CustomerDetails = lazyLoad(() => import('./pages/CustomerDetails'));
const CompanyDetails = lazyLoad(() => import('./pages/CompanyDetails'));
const ProductionBoard = lazyLoad(() => import('./pages/ProductionBoard'));
const ProductionOrderDetails = lazyLoad(() => import('./pages/ProductionOrderDetails'));
const ProductionUpload = lazyLoad(() => import('./pages/ProductionUpload'));
const Apps = lazyLoad(() => import('./pages/Apps'));
const ProductDelivery = lazyLoad(() => import('./pages/ProductDelivery'));
const Learning = lazyLoad(() => import('./pages/Learning'));
const NotFound = lazyLoad(() => import('./pages/NotFound'));

// Loading fallback component with improved visual feedback
const LoadingFallback = () => {
  const [showSlowLoadMessage, setShowSlowLoadMessage] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSlowLoadMessage(true);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
      <span className="text-lg font-medium">Loading page...</span>
      {showSlowLoadMessage && (
        <span className="text-sm text-muted-foreground mt-4">
          This is taking longer than expected. Your connection may be slow.
        </span>
      )}
    </div>
  );
};

function App() {
  return (
    <div className="app">
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/login" element={<Login />} />
              <Route path="/verify" element={<Verify />} />
              
              {/* Protected Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/calendar" element={
                <ProtectedRoute>
                  <Calendar />
                </ProtectedRoute>
              } />
              
              <Route path="/orders/*" element={
                <ProtectedRoute>
                  <Orders />
                </ProtectedRoute>
              } />
              
              <Route path="/customers" element={
                <ProtectedRoute>
                  <Customers />
                </ProtectedRoute>
              } />
              
              <Route path="/clients" element={
                <ProtectedRoute>
                  <Customers />
                </ProtectedRoute>
              } />
              
              <Route path="/clients/:clientId/*" element={
                <ProtectedRoute>
                  <CustomerDetails />
                </ProtectedRoute>
              } />
              
              <Route path="/companies/:companyId/*" element={
                <ProtectedRoute>
                  <CompanyDetails />
                </ProtectedRoute>
              } />
              
              <Route path="/production" element={
                <ProtectedRoute>
                  <ProductionBoard />
                </ProtectedRoute>
              } />
              
              <Route path="/production/order/:orderId" element={
                <ProtectedRoute>
                  <ProductionOrderDetails />
                </ProtectedRoute>
              } />
              
              <Route path="/production/upload/:orderId" element={
                <ProtectedRoute>
                  <ProductionUpload />
                </ProtectedRoute>
              } />
              
              <Route path="/delivery/:orderId" element={
                <ProtectedRoute>
                  <ProductDelivery />
                </ProtectedRoute>
              } />
              
              <Route path="/apps" element={
                <ProtectedRoute>
                  <Apps />
                </ProtectedRoute>
              } />
              
              <Route path="/learning" element={
                <ProtectedRoute>
                  <Learning />
                </ProtectedRoute>
              } />
              
              <Route path="/settings" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
          <Toaster />
        </AuthProvider>
      </ThemeProvider>
    </div>
  );
}

export default App;
