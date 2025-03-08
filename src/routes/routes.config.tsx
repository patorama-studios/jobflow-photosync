
import React from 'react';
import { Navigate } from 'react-router-dom';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

// Lazy-loaded components for better performance
const Dashboard = React.lazy(() => import('@/pages/Dashboard'));
const Orders = React.lazy(() => import('@/pages/Orders'));
const Calendar = React.lazy(() => import('@/pages/Calendar'));
const Settings = React.lazy(() => import('@/pages/Settings'));
const Login = React.lazy(() => import('@/pages/Login'));
const OrderDetails = React.lazy(() => import('@/pages/OrderDetails'));
const Production = React.lazy(() => import('@/pages/Production'));
const Customers = React.lazy(() => import('@/pages/Customers'));
const CustomerDetails = React.lazy(() => import('@/pages/CustomerDetails'));
const NotFound = React.lazy(() => import('@/pages/NotFound'));
const Home = React.lazy(() => import('@/pages/Home'));
const ProductDelivery = React.lazy(() => import('@/pages/ProductDelivery'));
const NotificationsCenter = React.lazy(() => import('@/pages/NotificationsCenter'));
const LearningHub = React.lazy(() => import('@/pages/LearningHub'));
const Products = React.lazy(() => import('@/pages/Products'));

// Common loading fallback component
const PageLoadingFallback = () => (
  <div className="flex items-center justify-center h-[40vh]">
    <div className="animate-pulse flex flex-col items-center">
      <div className="w-12 h-12 rounded-full bg-primary/20 mb-3"></div>
      <div className="h-4 w-32 bg-primary/20 rounded"></div>
    </div>
  </div>
);

export const routes = [
  // Root path handled by Home component which redirects to the appropriate page
  {
    path: "/",
    element: (
      <React.Suspense fallback={<PageLoadingFallback />}>
        <Home />
      </React.Suspense>
    ),
  },
  // Login page is not protected
  {
    path: "/login",
    element: (
      <React.Suspense fallback={<PageLoadingFallback />}>
        <Login />
      </React.Suspense>
    ),
  },
  // All other routes are protected - note that MainLayout is inside each component now
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <React.Suspense fallback={<PageLoadingFallback />}>
          <Dashboard />
        </React.Suspense>
      </ProtectedRoute>
    ),
  },
  {
    path: "/orders",
    element: (
      <ProtectedRoute>
        <React.Suspense fallback={<PageLoadingFallback />}>
          <Orders />
        </React.Suspense>
      </ProtectedRoute>
    ),
  },
  {
    path: "/orders/:orderId",
    element: (
      <ProtectedRoute>
        <React.Suspense fallback={<PageLoadingFallback />}>
          <OrderDetails />
        </React.Suspense>
      </ProtectedRoute>
    ),
  },
  {
    path: "/calendar",
    element: (
      <ProtectedRoute>
        <React.Suspense fallback={<PageLoadingFallback />}>
          <Calendar />
        </React.Suspense>
      </ProtectedRoute>
    ),
  },
  {
    path: "/settings",
    element: (
      <ProtectedRoute>
        <React.Suspense fallback={<PageLoadingFallback />}>
          <Settings />
        </React.Suspense>
      </ProtectedRoute>
    ),
  },
  {
    path: "/production",
    element: (
      <ProtectedRoute>
        <React.Suspense fallback={<PageLoadingFallback />}>
          <Production />
        </React.Suspense>
      </ProtectedRoute>
    ),
  },
  {
    path: "/customers",
    element: (
      <ProtectedRoute>
        <React.Suspense fallback={<PageLoadingFallback />}>
          <Customers />
        </React.Suspense>
      </ProtectedRoute>
    ),
  },
  {
    path: "/customers/:clientId",
    element: (
      <ProtectedRoute>
        <React.Suspense fallback={<PageLoadingFallback />}>
          <CustomerDetails />
        </React.Suspense>
      </ProtectedRoute>
    ),
  },
  {
    path: "/product-delivery",
    element: (
      <ProtectedRoute>
        <React.Suspense fallback={<PageLoadingFallback />}>
          <ProductDelivery />
        </React.Suspense>
      </ProtectedRoute>
    ),
  },
  {
    path: "/notifications",
    element: (
      <ProtectedRoute>
        <React.Suspense fallback={<PageLoadingFallback />}>
          <NotificationsCenter />
        </React.Suspense>
      </ProtectedRoute>
    ),
  },
  {
    path: "/learning-hub",
    element: (
      <ProtectedRoute>
        <React.Suspense fallback={<PageLoadingFallback />}>
          <LearningHub />
        </React.Suspense>
      </ProtectedRoute>
    ),
  },
  {
    path: "/products",
    element: (
      <ProtectedRoute>
        <React.Suspense fallback={<PageLoadingFallback />}>
          <Products />
        </React.Suspense>
      </ProtectedRoute>
    ),
  },
  // Catch-all route for 404 Not Found
  {
    path: "*",
    element: (
      <ProtectedRoute>
        <React.Suspense fallback={<PageLoadingFallback />}>
          <NotFound />
        </React.Suspense>
      </ProtectedRoute>
    ),
  },
];
