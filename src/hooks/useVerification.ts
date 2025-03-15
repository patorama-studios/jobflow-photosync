
import { useState, useRef, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface VerificationParams {
  email: string | null;
  token: string;
  type: string;
}

export const useVerification = ({ email, token, type }: VerificationParams) => {
  const { verifyEmail } = useAuth();
  const { toast } = useToast();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying your email...');
  const verificationAttempted = useRef(false);

  const performVerification = useCallback(async () => {
    if (!email) {
      setStatus('error');
      setMessage('Missing email parameter. Please check your verification link or contact support.');
      toast({
        title: "Verification Error",
        description: "Missing email parameter in verification link",
        variant: "destructive"
      });
      return;
    }

    try {
      verificationAttempted.current = true;
      console.log(`Verifying email: ${email}, token: ${token}, type: ${type}`);
      
      const { success, error } = await verifyEmail(email, token, type);
      
      if (success) {
        setStatus('success');
        setMessage('Your email has been verified successfully!');
        toast({
          title: "Verification Successful",
          description: "Your email has been verified",
          variant: "default"
        });
      } else {
        setStatus('error');
        setMessage(error || 'Failed to verify email. Please try again or contact support.');
        toast({
          title: "Verification Failed",
          description: error || "Failed to verify email",
          variant: "destructive"
        });
      }
    } catch (err) {
      console.error('Verification error:', err);
      setStatus('error');
      setMessage('An unexpected error occurred during verification. Please try again later or contact support.');
      toast({
        title: "Verification Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    }
  }, [email, token, type, verifyEmail, toast]);

  const retryVerification = async () => {
    if (!email) return;
    
    setStatus('loading');
    setMessage('Retrying verification...');
    verificationAttempted.current = false;
    
    try {
      const { success, error } = await verifyEmail(email, token, type);
      
      if (success) {
        setStatus('success');
        setMessage('Your email has been verified successfully!');
        toast({
          title: "Verification Successful",
          description: "Your email has been verified",
          variant: "default"
        });
      } else {
        setStatus('error');
        setMessage(error || 'Failed to verify email. Please try again or contact support.');
        toast({
          title: "Verification Failed",
          description: error || "Failed to verify email",
          variant: "destructive"
        });
      }
    } catch (err) {
      console.error('Retry verification error:', err);
      setStatus('error');
      setMessage('An unexpected error occurred during verification. Please try again later or contact support.');
      toast({
        title: "Verification Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    }
  };

  return {
    status,
    message,
    verificationAttempted,
    performVerification,
    retryVerification
  };
};
