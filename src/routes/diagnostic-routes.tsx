
import React from 'react';
import { RouteObject } from 'react-router-dom';
import IconTest from '@/pages/IconTest';

const diagnosticRoutes: RouteObject[] = [
  {
    path: '/debug/icons',
    element: <IconTest />
  }
];

export default diagnosticRoutes;
