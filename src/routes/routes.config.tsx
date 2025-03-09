import React from 'react';
import { Navigate } from 'react-router-dom';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

// Direct import for pages to ensure they're loaded correctly
const Home = React.lazy(() => import('@/pages/Home'));
const Login = React.lazy(() => import('@/pages/Login'));
const Dashboard = React.lazy(() => import('@/pages/Dashboard'));
const CalendarPage = React.lazy(() => import('@/pages/CalendarPage'));
const Orders = React.lazy(() => import('@/pages/Orders'));
const OrderSinglePage = React.lazy(() => import('@/pages/OrderSinglePage'));
const OrderDetails = React.lazy(() => import('@/pages/OrderDetails'));
const Clients = React.lazy(() => import('@/pages/Client'));
const ClientDetails = React.lazy(() => import('@/pages/ClientDetails'));
const CompanyDetails = React.lazy(() => import('@/pages/CompanyDetails'));
const Customers = React.lazy(() => import('@/pages/Customers'));
const CustomerDetails = React.lazy(() => import('@/pages/CustomerDetails'));
const Production = React.lazy(() => import('@/pages/Production'));
const ProductionBoard = React.lazy(() => import('@/pages/ProductionBoard'));
const ProductionOrderDetails = React.lazy(() => import('@/pages/ProductionOrderDetails'));
const ProductionUpload = React.lazy(() => import('@/pages/ProductionUpload'));
const Settings = React.lazy(() => import('@/pages/Settings'));
const NotFound = React.lazy(() => import('@/pages/NotFound'));
const LearningHub = React.lazy(() => import('@/pages/LearningHub'));
const NotificationsCenter = React.lazy(() => import('@/pages/NotificationsCenter'));
const Products = React.lazy(() => import('@/pages/Products'));
const PropertyWebsite = React.lazy(() => import('@/pages/PropertyWebsite'));
const ProductDelivery = React.lazy(() => import('@/pages/ProductDelivery'));
const Verify = React.lazy(() => import('@/pages/Verify'));
const FileDownloads = React.lazy(() => import('@/pages/FileDownloads'));
const GenerateData = React.lazy(() => import('@/pages/GenerateData'));
const Debug = React.lazy(() => import('@/pages/Debug'));

// Page loader with suspense
const PageLoader = ({ children }: { children: React.ReactNode }) => (
  <React.Suspense fallback={
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading page...</p>
      </div>
    </div>
  }>
    {children}
  </React.Suspense>
);

const routes = [
  {
    path: '/',
    element: <PageLoader><Home /></PageLoader>,
  },
  {
    path: '/login',
    element: <PageLoader><Login /></PageLoader>,
  },
  {
    path: '/verify',
    element: <PageLoader><Verify /></PageLoader>,
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <PageLoader><Dashboard /></PageLoader>
      </ProtectedRoute>
    ),
  },
  {
    path: '/calendar',
    element: (
      <ProtectedRoute>
        <PageLoader><CalendarPage /></PageLoader>
      </ProtectedRoute>
    ),
  },
  {
    path: '/orders',
    element: (
      <ProtectedRoute>
        <PageLoader><Orders /></PageLoader>
      </ProtectedRoute>
    ),
  },
  {
    path: '/orders/:orderId',
    element: (
      <ProtectedRoute>
        <PageLoader><OrderSinglePage /></PageLoader>
      </ProtectedRoute>
    ),
  },
  {
    path: '/orders/:orderId/:tab',
    element: (
      <ProtectedRoute>
        <PageLoader><OrderSinglePage /></PageLoader>
      </ProtectedRoute>
    ),
  },
  {
    path: '/orders/:orderId/edit',
    element: (
      <ProtectedRoute>
        <PageLoader><OrderDetails /></PageLoader>
      </ProtectedRoute>
    ),
  },
  {
    path: '/clients',
    element: (
      <ProtectedRoute>
        <PageLoader><Clients /></PageLoader>
      </ProtectedRoute>
    ),
  },
  {
    path: '/clients/:clientId',
    element: (
      <ProtectedRoute>
        <PageLoader><ClientDetails /></PageLoader>
      </ProtectedRoute>
    ),
  },
  {
    path: '/companies/:companyId',
    element: (
      <ProtectedRoute>
        <PageLoader><CompanyDetails /></PageLoader>
      </ProtectedRoute>
    ),
  },
  {
    path: '/customers',
    element: (
      <ProtectedRoute>
        <PageLoader><Customers /></PageLoader>
      </ProtectedRoute>
    ),
  },
  {
    path: '/customers/:customerId',
    element: (
      <ProtectedRoute>
        <PageLoader><CustomerDetails /></PageLoader>
      </ProtectedRoute>
    ),
  },
  {
    path: '/production',
    element: (
      <ProtectedRoute>
        <PageLoader><Production /></PageLoader>
      </ProtectedRoute>
    ),
  },
  {
    path: '/production/board',
    element: (
      <ProtectedRoute>
        <PageLoader><ProductionBoard /></PageLoader>
      </ProtectedRoute>
    ),
  },
  {
    path: '/production/order/:orderId',
    element: (
      <ProtectedRoute>
        <PageLoader><ProductionOrderDetails /></PageLoader>
      </ProtectedRoute>
    ),
  },
  {
    path: '/production/upload/:orderId?',
    element: (
      <ProtectedRoute>
        <PageLoader><ProductionUpload /></PageLoader>
      </ProtectedRoute>
    ),
  },
  {
    path: '/settings/*',
    element: (
      <ProtectedRoute>
        <PageLoader><Settings /></PageLoader>
      </ProtectedRoute>
    ),
  },
  {
    path: '/learning',
    element: (
      <ProtectedRoute>
        <PageLoader><LearningHub /></PageLoader>
      </ProtectedRoute>
    ),
  },
  {
    path: '/notifications',
    element: (
      <ProtectedRoute>
        <PageLoader><NotificationsCenter /></PageLoader>
      </ProtectedRoute>
    ),
  },
  {
    path: '/products',
    element: (
      <ProtectedRoute>
        <PageLoader><Products /></PageLoader>
      </ProtectedRoute>
    ),
  },
  {
    path: '/property-website/:orderId',
    element: <PageLoader><PropertyWebsite /></PageLoader>,
  },
  {
    path: '/delivery/:orderId',
    element: <PageLoader><ProductDelivery /></PageLoader>,
  },
  {
    path: '/download/:orderId',
    element: <PageLoader><FileDownloads /></PageLoader>,
  },
  {
    path: '/generate-data',
    element: (
      <ProtectedRoute>
        <PageLoader><GenerateData /></PageLoader>
      </ProtectedRoute>
    ),
  },
  {
    path: '/debug',
    element: (
      <ProtectedRoute>
        <PageLoader><Debug /></PageLoader>
      </ProtectedRoute>
    ),
  },
  {
    path: '*',
    element: <PageLoader><NotFound /></PageLoader>,
  },
];

export default routes;
