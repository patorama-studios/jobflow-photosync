
import React from 'react';
import { Navigate } from 'react-router-dom';
import { pageRoutes } from './page-routes';
import { companyRoutes } from './company-routes';
import { dashboardRoutes } from './dashboard-routes';
import { orderRoutes } from './order-routes';
import { diagnosticRoutes } from './diagnostic-routes';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export const routes = [
  ...pageRoutes,
  ...companyRoutes,
  ...dashboardRoutes,
  ...orderRoutes,
  ...diagnosticRoutes,
  {
    path: '*',
    element: <Navigate to="/404" replace />,
  },
];
