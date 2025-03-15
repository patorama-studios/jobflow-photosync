
import { useState, useRef, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface VerificationParams {
  email: string | null;
  token: string;
  type: string;
}

export const useVerification = ({ email, token, type }: VerificationParams) => {
  const { verifyEmail } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying your email...');
  const verificationAttempted = useRef(false);

  const performVerification = useCallback(async () => {
    if (!email) {
      setStatus('error');
      setMessage('Missing email parameter. Unable to verify.');
      return;
    }

    try {
      verificationAttempted.current = true;
      console.log(`Verifying email: ${email}, token: ${token}, type: ${type}`);
      const { success, error } = await verifyEmail(email, token, type);
      
      if (success) {
        setStatus('success');
        setMessage('Your email has been verified successfully!');
      } else {
        setStatus('error');
        setMessage(error || 'Failed to verify email. Please try again.');
      }
    } catch (err) {
      console.error('Verification error:', err);
      setStatus('error');
      setMessage('An unexpected error occurred during verification.');
    }
  }, [email, token, type, verifyEmail]);

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
      } else {
        setStatus('error');
        setMessage(error || 'Failed to verify email. Please try again.');
      }
    } catch (err) {
      console.error('Retry verification error:', err);
      setStatus('error');
      setMessage('An unexpected error occurred during verification.');
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
