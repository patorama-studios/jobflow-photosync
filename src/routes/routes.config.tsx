
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
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Customers } from '@/pages/Customers';
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
    element: <ProtectedRoute element={<Dashboard />} />,
  },
  {
    path: '/calendar',
    element: <ProtectedRoute element={<Calendar />} />,
  },
  {
    path: '/orders',
    element: <ProtectedRoute element={<Orders />} />,
  },
  {
    path: '/orders/:id',
    element: <ProtectedRoute element={<OrderSinglePage />} />,
  },
  {
    path: '/orders/details/:id',
    element: <ProtectedRoute element={<OrderDetails />} />,
  },
  {
    path: '/clients',
    element: <ProtectedRoute element={<ClientsView />} />,
  },
  {
    path: '/clients/:id',
    element: <ProtectedRoute element={<ClientDetails />} />,
  },
  {
    path: '/companies/:id',
    element: <ProtectedRoute element={<CompanyDetails />} />,
  },
  {
    path: '/customers',
    element: <ProtectedRoute element={<Customers />} />,
  },
  {
    path: '/customers/:id',
    element: <ProtectedRoute element={<CustomerDetails />} />,
  },
  {
    path: '/settings',
    element: <ProtectedRoute element={<Settings />} />,
  },
  {
    path: '/products',
    element: <ProtectedRoute element={<Products />} />,
  },
  {
    path: '/production',
    element: <ProtectedRoute element={<Production />} />,
  },
  {
    path: '/production/board',
    element: <ProtectedRoute element={<ProductionBoard />} />,
  },
  {
    path: '/production/order/:orderId',
    element: <ProtectedRoute element={<ProductionOrderDetails />} />,
  },
  {
    path: '/production/upload/:orderId',
    element: <ProtectedRoute element={<ProductionUpload />} />,
  },
  {
    path: '/notifications',
    element: <ProtectedRoute element={<NotificationsCenter />} />,
  },
  {
    path: '/delivery/:id',
    element: <ProtectedRoute element={<ProductDelivery />} />,
  },
  {
    path: '/property-website/:id',
    element: <ProtectedRoute element={<PropertyWebsite />} />,
  },
  {
    path: '/downloads',
    element: <ProtectedRoute element={<FileDownloads />} />,
  },
  {
    path: '/generate-data',
    element: <ProtectedRoute element={<GenerateData />} />,
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
