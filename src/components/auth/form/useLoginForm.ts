
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useFormValidation } from '@/hooks/useFormValidation';
import { useAuth } from '@/contexts/AuthContext';

interface LoginFormValues {
  email: string;
  password: string;
}

export const useLoginForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const { checkSession } = useAuth();
  
  const from = location.state?.from?.pathname || "/dashboard";
  
  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateAllFields,
    resetForm
  } = useFormValidation<LoginFormValues>(
    { email: '', password: '' },
    {
      email: { required: true, email: true },
      password: { required: true }
    }
  );
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateAllFields()) {
      toast.error('Please fix the errors in the form', {
        description: 'Make sure all fields are filled correctly'
      });
      return;
    }
    
    setLoading(true);
    
    try {
      console.log('Attempting login with:', values.email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      toast.success('Login successful', {
        description: 'Welcome back!'
      });
      
      // Force check session after successful login
      const success = await checkSession();
      
      if (data.user && success) {
        console.log('Login successful, redirecting to:', from);
        // Add a longer delay to make sure state updates
        setTimeout(() => {
          navigate(from, { replace: true });
        }, 1500); // Increased delay to ensure state is fully updated
      } else {
        console.error('Login succeeded but session check failed');
        toast.error('Session verification failed', { 
          description: 'Please try refreshing the page'
        });
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error('Login failed', {
        description: error.message || 'Something went wrong'
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    email: values.email,
    password: values.password,
    errors,
    touched,
    loading,
    handleChange,
    handleBlur,
    handleLogin
  };
};
