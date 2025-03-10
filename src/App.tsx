
import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

// Eager loaded components
import Home from './pages/Home';
import NotFound from './pages/NotFound';

// Lazy loaded pages for better performance
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Settings = lazy(() => import('./pages/Settings'));
const Calendar = lazy(() => import('./pages/Calendar'));
const Orders = lazy(() => import('./pages/Orders'));
const OrderDetails = lazy(() => import('./pages/OrderDetails'));
const Clients = lazy(() => import('./pages/Clients'));
const Reports = lazy(() => import('./pages/Reports'));
const Integrations = lazy(() => import('./pages/Integrations'));

// Fallback loading component
const PageLoading = () => (
  <div className="flex items-center justify-center min-h-screen">
    <Loader2 className="h-10 w-10 animate-spin text-primary" />
  </div>
);

function App() {
  return (
    <Suspense fallback={<PageLoading />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/calendar/*" element={<Calendar />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/orders/:orderId" element={<OrderDetails />} />
        <Route path="/clients/*" element={<Clients />} />
        <Route path="/reports/*" element={<Reports />} />
        <Route path="/settings/*" element={<Settings />} />
        <Route path="/integrations/*" element={<Integrations />} />
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </Suspense>
  );
}

export default App;
