
import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import pageRoutes from './page-routes';
import Home from '@/pages/Home';
import Index from '@/pages/Index';
import dashboardRoutes from './dashboard-routes';
import orderRoutes from './order-routes';
import diagnosticRoutes from './diagnostic-routes';

// Generate all routes configuration
const allRoutes: RouteObject[] = [
  {
    path: '/',
    element: <Index />,
  },
  {
    path: '/dashboard',
    element: <Home />,
  },
  ...pageRoutes,
  ...dashboardRoutes,
  ...orderRoutes,
  ...diagnosticRoutes,
];

export default allRoutes;
