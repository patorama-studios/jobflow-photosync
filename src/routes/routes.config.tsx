
import React, { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import diagnosticRoutes from './diagnostic-routes';

// Lazy-loaded components
const Home = lazy(() => import('../pages/Home'));
const Dashboard = lazy(() => import('../pages/Dashboard'));
const Orders = lazy(() => import('../pages/Orders'));
const OrderDetails = lazy(() => import('../pages/OrderDetails'));
const OrderSinglePage = lazy(() => import('../pages/OrderSinglePage'));
const Clients = lazy(() => import('../pages/Client'));
const Settings = lazy(() => import('../pages/Settings'));
const NotFound = lazy(() => import('../pages/NotFound'));
const Debug = lazy(() => import('../pages/Debug'));

// Main routes configuration
const routes: RouteObject[] = [
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/dashboard',
    element: <Dashboard />
  },
  {
    path: '/orders',
    element: <Orders />
  },
  {
    path: '/orders/:orderId',
    element: <OrderSinglePage />
  },
  {
    path: '/order-details/:orderId',
    element: <OrderDetails />
  },
  {
    path: '/clients',
    element: <Clients />
  },
  {
    path: '/settings',
    element: <Settings />
  },
  {
    path: '/settings/:section',
    element: <Settings />
  },
  {
    path: '/debug',
    element: <Debug />
  },
  ...diagnosticRoutes, // Include diagnostic routes
  {
    path: '*',
    element: <NotFound />
  }
];

export default routes;
