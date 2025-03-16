
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { useFormValidation } from '@/hooks/useFormValidation';
import { useAuth } from '@/contexts/AuthContext';
import { supabaseService } from '@/services/api/supabase-service';

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
      const result = await supabaseService.loginUser(values.email, values.password);
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      toast.success('Login successful', {
        description: 'Welcome back!'
      });
      
      // Force check session after successful login
      const success = await checkSession();
      
      if (result.data.user && success) {
        console.log('Login successful, redirecting to:', from);
        navigate(from, { replace: true });
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
