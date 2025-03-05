
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from './components/ui/toaster';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Loader2 } from 'lucide-react';

// Lazy load pages
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Login = lazy(() => import('./pages/Login'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Verify = lazy(() => import('./pages/Verify'));
const Learning = lazy(() => import('./pages/Learning'));
const Calendar = lazy(() => import('./pages/Calendar'));
const Orders = lazy(() => import('./pages/Orders'));
const Customers = lazy(() => import('./pages/Customers'));
const CustomerDetails = lazy(() => import('./pages/CustomerDetails'));
const ProductionBoard = lazy(() => import('./pages/ProductionBoard'));
const ProductionOrderDetails = lazy(() => import('./pages/ProductionOrderDetails'));
const ProductionUpload = lazy(() => import('./pages/ProductionUpload'));
const Apps = lazy(() => import('./pages/Apps'));

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex flex-col items-center justify-center min-h-screen">
    <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
    <span className="text-lg font-medium">Loading page...</span>
  </div>
);

function App() {
  return (
    <div className="app">
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <Suspense fallback={<LoadingFallback />}>
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
                
                <Route path="/customers/:customerId/*" element={
                  <ProtectedRoute>
                    <CustomerDetails />
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
            </Suspense>
          </Router>
          <Toaster />
        </AuthProvider>
      </ThemeProvider>
    </div>
  );
}

export default App;
