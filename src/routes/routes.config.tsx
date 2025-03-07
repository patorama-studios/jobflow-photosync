
import React, { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import NotFound from '../pages/NotFound';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import PageLoading from '../components/loading/PageLoading';

// Lazy load less critical paths
const Dashboard = lazy(() => import('../pages/Dashboard'));
const Calendar = lazy(() => import('../pages/Calendar'));
const Orders = lazy(() => import('../pages/Orders'));
const OrderDetails = lazy(() => import('../pages/OrderDetails'));
const Customers = lazy(() => import('../pages/Customers'));
const CustomerDetails = lazy(() => import('../pages/CustomerDetails'));
const CompanyDetails = lazy(() => import('../pages/CompanyDetails'));
const Settings = lazy(() => import('../pages/Settings'));
const Production = lazy(() => import('../pages/Production'));
const ProductionBoard = lazy(() => import('../pages/ProductionBoard'));
const ProductionOrderDetails = lazy(() => import('../pages/ProductionOrderDetails'));
const ProductionUpload = lazy(() => import('../pages/ProductionUpload'));
const Learning = lazy(() => import('../pages/Learning'));
const NotificationsCenter = lazy(() => import('../pages/NotificationsCenter'));
const Debug = lazy(() => import('../pages/Debug'));
const ClientDetails = lazy(() => import('../pages/ClientDetails'));

// Simplified public route wrapper with no auth check
const PublicRoute = ({ element }: { element: React.ReactNode }) => (
  <React.Suspense fallback={<PageLoading />}>
    {element}
  </React.Suspense>
);

// Protected route wrapper with Suspense
const ProtectedSuspenseRoute = ({ element }: { element: React.ReactNode }) => (
  <ProtectedRoute>
    <React.Suspense fallback={<PageLoading />}>
      {element}
    </React.Suspense>
  </ProtectedRoute>
);

// Routes configuration - public routes first, then protected
export const routes = [
  // Public routes - these should not check auth state
  { path: '/login', element: <PublicRoute element={<Login />} /> },
  { path: '/', element: <Home /> },
  { path: '/index', element: <Home /> },
  
  // Protected routes
  { path: '/dashboard', element: <ProtectedSuspenseRoute element={<Dashboard />} /> },
  { path: '/calendar', element: <ProtectedSuspenseRoute element={<Calendar />} /> },
  { path: '/orders', element: <ProtectedSuspenseRoute element={<Orders />} /> },
  { path: '/orders/:id', element: <ProtectedSuspenseRoute element={<OrderDetails />} /> },
  { path: '/customers', element: <ProtectedSuspenseRoute element={<Customers />} /> },
  { path: '/customers/:clientId', element: <ProtectedSuspenseRoute element={<CustomerDetails />} /> },
  { path: '/clients/:clientId', element: <ProtectedSuspenseRoute element={<ClientDetails />} /> },
  { path: '/companies/:id', element: <ProtectedSuspenseRoute element={<CompanyDetails />} /> },
  { path: '/production', element: <ProtectedSuspenseRoute element={<Production />} /> },
  { path: '/production/board', element: <ProtectedSuspenseRoute element={<ProductionBoard />} /> },
  { path: '/production/order/:id', element: <ProtectedSuspenseRoute element={<ProductionOrderDetails />} /> },
  { path: '/production/upload/:id', element: <ProtectedSuspenseRoute element={<ProductionUpload />} /> },
  { path: '/learning', element: <ProtectedSuspenseRoute element={<Learning />} /> },
  { path: '/notifications', element: <ProtectedSuspenseRoute element={<NotificationsCenter />} /> },
  { path: '/settings', element: <ProtectedSuspenseRoute element={<Settings />} /> },
  
  // Debug route (development only)
  ...(import.meta.env.DEV ? [
    { path: '/debug', element: <PublicRoute element={<Debug />} /> }
  ] : []),
  
  // 404 route - must be last
  { path: '*', element: <NotFound /> }
];
