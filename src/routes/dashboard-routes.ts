
import { lazy } from 'react';

// Define dashboard routes
export const dashboardRoutes = [
  {
    path: '/dashboard',
    component: lazy(() => import('@/pages/Dashboard')),
    exact: true,
    auth: true,
  },
  {
    path: '/calendar',
    component: lazy(() => import('@/pages/Calendar')),
    exact: true,
    auth: true,
  },
];

export default dashboardRoutes;
