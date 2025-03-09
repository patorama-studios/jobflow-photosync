
import React from 'react';
import { Navigate } from 'react-router-dom';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

// Layouts
import MainLayout from '@/components/layout/MainLayout';

// Pages
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import CalendarPage from '@/pages/CalendarPage';
import Orders from '@/pages/Orders';
import OrderSinglePage from '@/pages/OrderSinglePage';
import OrderDetails from '@/pages/OrderDetails';
import Clients from '@/pages/Client';
import ClientDetails from '@/pages/ClientDetails';
import CompanyDetails from '@/pages/CompanyDetails';
import Customers from '@/pages/Customers';
import CustomerDetails from '@/pages/CustomerDetails';
import Production from '@/pages/Production';
import ProductionBoard from '@/pages/ProductionBoard';
import ProductionOrderDetails from '@/pages/ProductionOrderDetails';
import ProductionUpload from '@/pages/ProductionUpload';
import Settings from '@/pages/Settings';
import NotFound from '@/pages/NotFound';
import LearningHub from '@/pages/LearningHub';
import NotificationsCenter from '@/pages/NotificationsCenter';
import Products from '@/pages/Products';
import PropertyWebsite from '@/pages/PropertyWebsite';
import ProductDelivery from '@/pages/ProductDelivery';
import Verify from '@/pages/Verify';
import FileDownloads from '@/pages/FileDownloads';
import GenerateData from '@/pages/GenerateData';
import Debug from '@/pages/Debug';

const routes = [
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/verify',
    element: <Verify />,
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/calendar',
    element: (
      <ProtectedRoute>
        <CalendarPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/orders',
    element: (
      <ProtectedRoute>
        <Orders />
      </ProtectedRoute>
    ),
  },
  {
    path: '/orders/:orderId',
    element: (
      <ProtectedRoute>
        <OrderSinglePage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/orders/:orderId/edit',
    element: (
      <ProtectedRoute>
        <OrderDetails />
      </ProtectedRoute>
    ),
  },
  {
    path: '/clients',
    element: (
      <ProtectedRoute>
        <Clients />
      </ProtectedRoute>
    ),
  },
  {
    path: '/clients/:clientId',
    element: (
      <ProtectedRoute>
        <ClientDetails />
      </ProtectedRoute>
    ),
  },
  {
    path: '/companies/:companyId',
    element: (
      <ProtectedRoute>
        <CompanyDetails />
      </ProtectedRoute>
    ),
  },
  {
    path: '/customers',
    element: (
      <ProtectedRoute>
        <Customers />
      </ProtectedRoute>
    ),
  },
  {
    path: '/customers/:customerId',
    element: (
      <ProtectedRoute>
        <CustomerDetails />
      </ProtectedRoute>
    ),
  },
  {
    path: '/production',
    element: (
      <ProtectedRoute>
        <Production />
      </ProtectedRoute>
    ),
  },
  {
    path: '/production/board',
    element: (
      <ProtectedRoute>
        <ProductionBoard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/production/order/:orderId',
    element: (
      <ProtectedRoute>
        <ProductionOrderDetails />
      </ProtectedRoute>
    ),
  },
  {
    path: '/production/upload/:orderId?',
    element: (
      <ProtectedRoute>
        <ProductionUpload />
      </ProtectedRoute>
    ),
  },
  {
    path: '/settings/*',
    element: (
      <ProtectedRoute>
        <Settings />
      </ProtectedRoute>
    ),
  },
  {
    path: '/learning',
    element: (
      <ProtectedRoute>
        <LearningHub />
      </ProtectedRoute>
    ),
  },
  {
    path: '/notifications',
    element: (
      <ProtectedRoute>
        <NotificationsCenter />
      </ProtectedRoute>
    ),
  },
  {
    path: '/products',
    element: (
      <ProtectedRoute>
        <Products />
      </ProtectedRoute>
    ),
  },
  {
    path: '/property-website/:orderId',
    element: <PropertyWebsite />,
  },
  {
    path: '/delivery/:orderId',
    element: <ProductDelivery />,
  },
  {
    path: '/download/:orderId',
    element: <FileDownloads />,
  },
  {
    path: '/generate-data',
    element: (
      <ProtectedRoute adminOnly>
        <GenerateData />
      </ProtectedRoute>
    ),
  },
  {
    path: '/debug',
    element: (
      <ProtectedRoute>
        <Debug />
      </ProtectedRoute>
    ),
  },
  {
    path: '*',
    element: <NotFound />,
  },
];

export default routes;
