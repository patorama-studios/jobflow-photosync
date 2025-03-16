
import React from 'react';
import { AuthPage } from '@/components/auth/AuthPage';
import { useLocation } from 'react-router-dom';

const Auth = () => {
  const location = useLocation();
  const defaultTab = location.state?.tab || 'login';
  
  return <AuthPage defaultTab={defaultTab} />;
};

export default Auth;
