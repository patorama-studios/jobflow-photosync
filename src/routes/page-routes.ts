
import { lazy } from 'react';

// Define page routes
export const pageRoutes = [
  {
    path: '/pages/company-details/:companyId',
    component: lazy(() => import('@/pages/CompanyDetails')),
    exact: true,
    auth: true,
  },
  {
    path: '/pages/customer-details/:customerId',
    component: lazy(() => import('@/pages/CustomerDetails')),
    exact: true,
    auth: true,
  },
];

export default pageRoutes;
