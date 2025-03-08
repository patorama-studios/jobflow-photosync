
import React from 'react';
import { RouteObject } from 'react-router-dom';

// Pages
import Home from '@/pages/Home';
import NotFound from '@/pages/NotFound';
import Dashboard from '@/pages/Dashboard';
import Calendar from '@/pages/Calendar';
import Orders from '@/pages/Orders';
import OrderDetails from '@/pages/OrderDetails';
import OrderSinglePage from '@/pages/OrderSinglePage';
import Login from '@/pages/Login';
import Settings from '@/pages/Settings';
import ClientDetails from '@/pages/ClientDetails';
import { ClientsView } from '@/components/clients/ClientsView';
import CompanyDetails from '@/pages/CompanyDetails';
import Verify from '@/pages/Verify';
import Production from '@/pages/Production';
import ProductionBoard from '@/pages/ProductionBoard';
import ProductionOrderDetails from '@/pages/ProductionOrderDetails';
import ProductionUpload from '@/pages/ProductionUpload';
import NotificationsCenter from '@/pages/NotificationsCenter';
import PropertyWebsite from '@/pages/PropertyWebsite';
import ProductDelivery from '@/pages/ProductDelivery';
import FileDownloads from '@/pages/FileDownloads';
import Products from '@/pages/Products'; // Import the new Products page

// Components
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import Customers from '@/pages/Customers';
import CustomerDetails from '@/pages/CustomerDetails';
import GenerateData from '@/pages/GenerateData';
import Debug from '@/pages/Debug';

// Define the routes configuration
export const routes: RouteObject[] = [
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
    element: <ProtectedRoute><Dashboard /></ProtectedRoute>,
  },
  {
    path: '/calendar',
    element: <ProtectedRoute><Calendar /></ProtectedRoute>,
  },
  {
    path: '/orders',
    element: <ProtectedRoute><Orders /></ProtectedRoute>,
  },
  {
    path: '/orders/:id',
    element: <ProtectedRoute><OrderSinglePage /></ProtectedRoute>,
  },
  {
    path: '/orders/details/:id',
    element: <ProtectedRoute><OrderDetails /></ProtectedRoute>,
  },
  {
    path: '/clients',
    element: <ProtectedRoute><ClientsView /></ProtectedRoute>,
  },
  {
    path: '/clients/:id',
    element: <ProtectedRoute><ClientDetails /></ProtectedRoute>,
  },
  {
    path: '/companies/:id',
    element: <ProtectedRoute><CompanyDetails /></ProtectedRoute>,
  },
  {
    path: '/customers',
    element: <ProtectedRoute><Customers /></ProtectedRoute>,
  },
  {
    path: '/customers/:id',
    element: <ProtectedRoute><CustomerDetails /></ProtectedRoute>,
  },
  {
    path: '/settings',
    element: <ProtectedRoute><Settings /></ProtectedRoute>,
  },
  {
    path: '/products',
    element: <ProtectedRoute><Products /></ProtectedRoute>,
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
    path: '/production/order/:orderId',
    element: <ProtectedRoute><ProductionOrderDetails /></ProtectedRoute>,
  },
  {
    path: '/production/upload/:orderId',
    element: <ProtectedRoute><ProductionUpload /></ProtectedRoute>,
  },
  {
    path: '/notifications',
    element: <ProtectedRoute><NotificationsCenter /></ProtectedRoute>,
  },
  {
    path: '/delivery/:id',
    element: <ProtectedRoute><ProductDelivery /></ProtectedRoute>,
  },
  {
    path: '/property-website/:id',
    element: <ProtectedRoute><PropertyWebsite /></ProtectedRoute>,
  },
  {
    path: '/downloads',
    element: <ProtectedRoute><FileDownloads /></ProtectedRoute>,
  },
  {
    path: '/generate-data',
    element: <ProtectedRoute><GenerateData /></ProtectedRoute>,
  },
  {
    path: '/debug',
    element: <Debug />,
  },
  {
    path: '*',
    element: <NotFound />,
  }
];
