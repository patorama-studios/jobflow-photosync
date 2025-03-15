
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CardContent } from "@/components/ui/card";
import { Mail, Key, Loader2, AlertCircle, User } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useFormValidation } from '@/hooks/useFormValidation';

interface RegisterFormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const RegisterForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  
  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateAllFields,
    resetForm
  } = useFormValidation<RegisterFormValues>(
    {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: ''
    },
    {
      firstName: { required: true },
      lastName: { required: true },
      email: { required: true, email: true },
      password: { required: true, minLength: 6 },
      confirmPassword: { required: true, match: 'password' }
    }
  );
  
  const { firstName, lastName, email, password, confirmPassword } = values;
  
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateAllFields()) {
      toast.error('Please fix the errors in the form', {
        description: 'Make sure all fields are filled correctly'
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            full_name: `${firstName} ${lastName}`.trim()
          }
        }
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      toast.success('Registration successful', {
        description: 'Account created! Please check your email for verification instructions.'
      });
      
      // Clear registration form
      resetForm();
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error('Registration failed', {
        description: error.message || 'Something went wrong'
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <CardContent>
      <form onSubmit={handleRegister}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                <Input 
                  id="firstName"
                  name="firstName"
                  type="text" 
                  placeholder="John" 
                  value={firstName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`pl-10 ${errors.firstName && touched.firstName ? 'border-destructive' : ''}`}
                />
                {errors.firstName && touched.firstName && (
                  <div className="flex items-center mt-1 text-destructive text-sm">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.firstName}
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                <Input 
                  id="lastName"
                  name="lastName"
                  type="text" 
                  placeholder="Doe" 
                  value={lastName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`pl-10 ${errors.lastName && touched.lastName ? 'border-destructive' : ''}`}
                />
                {errors.lastName && touched.lastName && (
                  <div className="flex items-center mt-1 text-destructive text-sm">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.lastName}
                  </div>
                )}
              </div>
            </div>
          </div>
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
            <Label htmlFor="password">Password</Label>
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
              />
              {errors.password && touched.password && (
                <div className="flex items-center mt-1 text-destructive text-sm">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.password}
                </div>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Key className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              <Input 
                id="confirmPassword"
                name="confirmPassword"
                type="password" 
                value={confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`pl-10 ${errors.confirmPassword && touched.confirmPassword ? 'border-destructive' : ''}`}
              />
              {errors.confirmPassword && touched.confirmPassword && (
                <div className="flex items-center mt-1 text-destructive text-sm">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.confirmPassword}
                </div>
              )}
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Account...
              </>
            ) : (
              "Create Account"
            )}
          </Button>
        </div>
      </form>
    </CardContent>
  );
};
