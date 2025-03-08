
import React from 'react';
import { Navigate } from 'react-router-dom';
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import OrderSinglePage from '@/pages/OrderSinglePage';
import Orders from '@/pages/Orders';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import Settings from '@/pages/Settings';
import NotFound from '@/pages/NotFound';
import ProductionOrderDetails from '@/pages/ProductionOrderDetails';
import Debug from '@/pages/Debug';
import ProductionBoard from '@/pages/ProductionBoard';
import ProductionUpload from '@/pages/ProductionUpload';
import Customers from '@/pages/Customers';
import CustomerDetails from '@/pages/CustomerDetails';
import Verify from '@/pages/Verify';
import Index from '@/pages/Index';
import NotificationsCenter from '@/pages/NotificationsCenter';
import CalendarPage from '@/pages/CalendarPage';
import ProductDelivery from '@/pages/ProductDelivery';
import PropertyWebsite from '@/pages/PropertyWebsite';
import CompanyDetails from '@/pages/CompanyDetails';
import FileDownloads from '@/pages/FileDownloads';
import Learning from '@/pages/Learning';
import Production from '@/pages/Production';

export const routes = [
  // Public routes
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
    path: '/index',
    element: <Index />,
  },
  
  // Protected routes
  {
    path: '/dashboard',
    element: <ProtectedRoute><Dashboard /></ProtectedRoute>,
  },
  {
    path: '/orders/*',
    element: <ProtectedRoute><Orders /></ProtectedRoute>,
  },
  {
    path: '/order/:id',
    element: <ProtectedRoute><OrderSinglePage /></ProtectedRoute>,
  },
  {
    path: '/settings/*',
    element: <ProtectedRoute><Settings /></ProtectedRoute>,
  },
  {
    path: '/production',
    element: <ProtectedRoute><Production /></ProtectedRoute>,
  },
  {
    path: '/production/board',
    element: <ProtectedRoute><ProductionBoard /></ProtectedRoute>,
  },
  {
    path: '/production/upload/:orderId',
    element: <ProtectedRoute><ProductionUpload /></ProtectedRoute>,
  },
  {
    path: '/production/order/:orderId',
    element: <ProtectedRoute><ProductionOrderDetails /></ProtectedRoute>,
  },
  {
    path: '/calendar/:date',
    element: <ProtectedRoute><CalendarPage /></ProtectedRoute>,
  },
  {
    path: '/calendar',
    element: <ProtectedRoute><CalendarPage /></ProtectedRoute>,
  },
  {
    path: '/customers',
    element: <ProtectedRoute><Customers /></ProtectedRoute>,
  },
  {
    path: '/customer/:id',
    element: <ProtectedRoute><CustomerDetails /></ProtectedRoute>,
  },
  {
    path: '/company/:id',
    element: <ProtectedRoute><CompanyDetails /></ProtectedRoute>,
  },
  {
    path: '/notifications',
    element: <ProtectedRoute><NotificationsCenter /></ProtectedRoute>,
  },
  {
    path: '/delivery/:orderId',
    element: <ProductDelivery />,
  },
  {
    path: '/property/:orderId',
    element: <PropertyWebsite />,
  },
  {
    path: '/downloads',
    element: <ProtectedRoute><FileDownloads /></ProtectedRoute>,
  },
  {
    path: '/learning',
    element: <ProtectedRoute><Learning /></ProtectedRoute>,
  },
  {
    path: '/debug',
    element: <Debug />,
  },
  
  // 404 and redirects
  {
    path: '/404',
    element: <NotFound />,
  },
  {
    path: '*',
    element: <Navigate to="/404" replace />,
  },
];
