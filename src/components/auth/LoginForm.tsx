
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CardContent } from "@/components/ui/card";
import { Mail, Key, Loader2, AlertCircle } from "lucide-react";
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
        // Add a slight delay to make sure state updates
        setTimeout(() => {
          navigate(from, { replace: true });
        }, 300);
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
              <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
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
                  <AlertCircle className="h-4 w-4 mr-1" />
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
              <Key className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
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
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.password}
                </div>
              )}
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Logging in...
              </>
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
