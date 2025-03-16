
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CardContent } from "@/components/ui/card";
import { AuthInput } from './form/AuthInput';
import { ForgotPasswordDialog } from './form/ForgotPasswordDialog';
import { useLoginForm } from './form/useLoginForm';

export const LoginForm: React.FC = () => {
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  
  const {
    email,
    password,
    errors,
    touched,
    loading,
    handleChange,
    handleBlur,
    handleLogin
  } = useLoginForm();
  
  return (
    <CardContent className="space-y-4">
      <form onSubmit={handleLogin}>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <AuthInput
              id="email"
              name="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.email}
              touched={touched.email}
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
              }
            />
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
            <AuthInput
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.password}
              touched={touched.password}
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 18v3c0 .6.4 1 1 1h4v-3h3v-3h2l1.4-1.4a6.5 6.5 0 1 0-4-4Z" />
                  <circle cx="16.5" cy="7.5" r=".5" />
                </svg>
              }
            />
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
      
      <ForgotPasswordDialog 
        open={forgotPasswordOpen} 
        onOpenChange={setForgotPasswordOpen} 
      />
    </CardContent>
  );
};
