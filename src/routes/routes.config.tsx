import React from 'react';
import { Navigate } from 'react-router-dom';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import MainLayout from '@/components/layout/MainLayout';

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

export const routes = [
  // Root path handled by Home component which redirects to the appropriate page
  {
    path: "/",
    element: (
      <React.Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
        <Home />
      </React.Suspense>
    ),
  },
  // Login page is not protected
  {
    path: "/login",
    element: (
      <React.Suspense fallback={<div className="p-8 text-center">Loading login...</div>}>
        <Login />
      </React.Suspense>
    ),
  },
  // All other routes are protected and use the MainLayout
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <MainLayout>
          <React.Suspense fallback={<div className="p-8 text-center">Loading dashboard...</div>}>
            <Dashboard />
          </React.Suspense>
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/orders",
    element: (
      <ProtectedRoute>
        <MainLayout>
          <React.Suspense fallback={<div className="p-8 text-center">Loading orders...</div>}>
            <Orders />
          </React.Suspense>
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/orders/:orderId",
    element: (
      <ProtectedRoute>
        <MainLayout>
          <React.Suspense fallback={<div className="p-8 text-center">Loading order details...</div>}>
            <OrderDetails />
          </React.Suspense>
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/calendar",
    element: (
      <ProtectedRoute>
        <MainLayout showCalendarSubmenu={true}>
          <React.Suspense fallback={<div className="p-8 text-center">Loading calendar...</div>}>
            <Calendar />
          </React.Suspense>
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/settings",
    element: (
      <ProtectedRoute>
        <MainLayout>
          <React.Suspense fallback={<div className="p-8 text-center">Loading settings...</div>}>
            <Settings />
          </React.Suspense>
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/production",
    element: (
      <ProtectedRoute>
        <MainLayout>
          <React.Suspense fallback={<div className="p-8 text-center">Loading production board...</div>}>
            <Production />
          </React.Suspense>
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/customers",
    element: (
      <ProtectedRoute>
        <MainLayout>
          <React.Suspense fallback={<div className="p-8 text-center">Loading customers...</div>}>
            <Customers />
          </React.Suspense>
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/customers/:customerId",
    element: (
      <ProtectedRoute>
        <MainLayout>
          <React.Suspense fallback={<div className="p-8 text-center">Loading customer details...</div>}>
            <CustomerDetails />
          </React.Suspense>
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/product-delivery",
    element: (
      <ProtectedRoute>
        <MainLayout>
          <React.Suspense fallback={<div className="p-8 text-center">Loading product delivery...</div>}>
            <ProductDelivery />
          </React.Suspense>
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/notifications",
    element: (
      <ProtectedRoute>
        <MainLayout>
          <React.Suspense fallback={<div className="p-8 text-center">Loading notifications...</div>}>
            <NotificationsCenter />
          </React.Suspense>
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/learning-hub",
    element: (
      <ProtectedRoute>
        <MainLayout>
          <React.Suspense fallback={<div className="p-8 text-center">Loading learning hub...</div>}>
            <LearningHub />
          </React.Suspense>
        </MainLayout>
      </ProtectedRoute>
    ),
  },
    {
    path: "/products",
    element: (
      <ProtectedRoute>
        <MainLayout>
          <React.Suspense fallback={<div className="p-8 text-center">Loading products...</div>}>
            <Products />
          </React.Suspense>
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  // Catch-all route for 404 Not Found
  {
    path: "*",
    element: (
      <MainLayout>
        <React.Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
          <NotFound />
        </React.Suspense>
      </MainLayout>
    ),
  },
];
