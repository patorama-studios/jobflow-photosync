
import { lazy } from 'react';

// Define order routes
export const orderRoutes = [
  {
    path: '/orders',
    component: lazy(() => import('@/pages/Orders')),
    exact: true,
    auth: true,
  },
  {
    path: '/orders/:orderId',
    component: lazy(() => import('@/pages/OrderDetails')),
    exact: true,
    auth: true,
  },
];

export default orderRoutes;
