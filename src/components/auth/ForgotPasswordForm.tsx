
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Loader2, AlertCircle } from "lucide-react";
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useFormValidation } from '@/hooks/useFormValidation';

interface ForgotPasswordFormValues {
  email: string;
}

export const ForgotPasswordForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const {
    values: { email },
    errors,
    touched,
    handleChange,
    handleBlur,
    validateAllFields
  } = useFormValidation<ForgotPasswordFormValues>(
    { email: '' },
    { email: { required: true, email: true } }
  );
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateAllFields()) {
      toast.error('Please provide a valid email address');
      return;
    }
    
    setLoading(true);
    
    try {
      const { error } = await supabase.functions.invoke('reset-password', {
        body: { email }
      });
      
      if (error) {
        throw new Error(error.message || 'Error sending password reset email');
      }
      
      setSubmitted(true);
      toast.success('Password reset email sent', {
        description: 'Check your inbox for instructions'
      });
    } catch (error: any) {
      console.error('Password reset error:', error);
      toast.error('Failed to send reset email', {
        description: error.message || 'Please try again later'
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="space-y-4 p-6 pt-0">
      {!submitted ? (
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-4">
                Enter your email address and we'll send you a link to reset your password.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reset-email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                <Input 
                  id="reset-email"
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
            <div className="flex justify-end space-x-2 pt-2">
              <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </Button>
            </div>
          </div>
        </form>
      ) : (
        <div className="text-center py-4">
          <h3 className="text-lg font-medium mb-2">Email Sent</h3>
          <p className="text-sm text-muted-foreground mb-4">
            If an account exists with {email}, you'll receive a password reset link shortly.
          </p>
          <Button onClick={onClose}>Close</Button>
        </div>
      )}
    </div>
  );
};
