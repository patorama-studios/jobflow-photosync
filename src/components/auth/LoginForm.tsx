
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CardContent } from "@/components/ui/card";
import { Loader2, AlertCircle } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ForgotPasswordForm } from './ForgotPasswordForm';
import { useFormValidation } from '@/hooks/useFormValidation';
import { useAuth } from '@/contexts/AuthContext';

interface LoginFormValues {
  email: string;
  password: string;
}

export const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const { checkSession } = useAuth();
  
  const from = location.state?.from?.pathname || "/dashboard";
  
  const {
    values: { email, password },
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
      console.log('Attempting login with:', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      toast.success('Login successful', {
        description: 'Welcome back!'
      });
      
      // Force check session after successful login
      await checkSession();
      
      if (data.user) {
        // Add a longer delay to make sure state updates
        setTimeout(() => {
          navigate(from, { replace: true });
        }, 1000); // Increased delay to ensure state is fully updated
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
  
  return (
    <CardContent className="space-y-4">
      <form onSubmit={handleLogin}>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <div className="absolute left-3 top-2.5 text-muted-foreground">
                <div className="h-5 w-5">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </div>
              </div>
              <Input 
                id="email" 
                name="email"
                type="email" 
                placeholder="name@example.com" 
                value={email}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`pl-10 ${errors.email && touched.email ? 'border-destructive' : ''}`}
                aria-invalid={!!errors.email && touched.email}
              />
              {errors.email && touched.email && (
                <div className="flex items-center mt-1 text-destructive text-sm">
                  <div className="h-4 w-4 mr-1">
                    <AlertCircle className="h-4 w-4" />
                  </div>
                  {errors.email}
                </div>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Button 
                variant="link" 
                className="px-0 text-xs" 
                size="sm" 
                type="button"
                onClick={() => setForgotPasswordOpen(true)}
              >
                Forgot password?
              </Button>
            </div>
            <div className="relative">
              <div className="absolute left-3 top-2.5 text-muted-foreground">
                <div className="h-5 w-5">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 18v3c0 .6.4 1 1 1h4v-3h3v-3h2l1.4-1.4a6.5 6.5 0 1 0-4-4Z" />
                    <circle cx="16.5" cy="7.5" r=".5" />
                  </svg>
                </div>
              </div>
              <Input 
                id="password" 
                name="password"
                type="password" 
                value={password}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`pl-10 ${errors.password && touched.password ? 'border-destructive' : ''}`}
                aria-invalid={!!errors.password && touched.password}
              />
              {errors.password && touched.password && (
                <div className="flex items-center mt-1 text-destructive text-sm">
                  <div className="h-4 w-4 mr-1">
                    <AlertCircle className="h-4 w-4" />
                  </div>
                  {errors.password}
                </div>
              )}
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <div className="flex items-center">
                <div className="mr-2 h-4 w-4 animate-spin">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                </div>
                Logging in...
              </div>
            ) : (
              "Login"
            )}
          </Button>
        </div>
      </form>
      
      <Dialog open={forgotPasswordOpen} onOpenChange={setForgotPasswordOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reset your password</DialogTitle>
          </DialogHeader>
          <ForgotPasswordForm onClose={() => setForgotPasswordOpen(false)} />
        </DialogContent>
      </Dialog>
    </CardContent>
  );
};
