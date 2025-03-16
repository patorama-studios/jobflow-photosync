
import React from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CardContent } from "@/components/ui/card";
import { Loader2, User, Mail, Key } from "lucide-react";
import { AuthInput } from './form/AuthInput';
import { useRegisterForm } from './form/useRegisterForm';

export const RegisterForm: React.FC = () => {
  const {
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    errors,
    touched,
    loading,
    handleChange,
    handleBlur,
    handleRegister
  } = useRegisterForm();
  
  return (
    <CardContent>
      <form onSubmit={handleRegister}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <AuthInput 
                id="firstName"
                name="firstName"
                type="text" 
                placeholder="John" 
                value={firstName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.firstName}
                touched={touched.firstName}
                icon={<User className="h-5 w-5" />}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <AuthInput 
                id="lastName"
                name="lastName"
                type="text" 
                placeholder="Doe" 
                value={lastName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.lastName}
                touched={touched.lastName}
                icon={<User className="h-5 w-5" />}
              />
            </div>
          </div>
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
              icon={<Mail className="h-5 w-5" />}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <AuthInput 
              id="password"
              name="password"
              type="password" 
              placeholder="Enter your password" 
              value={password}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.password}
              touched={touched.password}
              icon={<Key className="h-5 w-5" />}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <AuthInput 
              id="confirmPassword"
              name="confirmPassword"
              type="password" 
              placeholder="Confirm your password" 
              value={confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.confirmPassword}
              touched={touched.confirmPassword}
              icon={<Key className="h-5 w-5" />}
            />
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
