
import { lazy } from 'react';
import CustomersPage from '@/pages/Customers';
import CustomerDetails from '@/pages/CustomerDetails';
import CompanyDetails from '@/pages/CompanyDetails';

export const companyRoutes = [
  { path: '/customers', element: CustomersPage },
  { path: '/customers/:id', element: CustomerDetails },
  { path: '/companies/:id', element: CompanyDetails },
];
