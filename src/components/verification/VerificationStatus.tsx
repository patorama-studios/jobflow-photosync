
import React from 'react';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VerificationStatusProps {
  status: 'loading' | 'success' | 'error';
  message: string;
  onRetry?: () => void;
  onGoToLogin: () => void;
  onGoToSignup: () => void;
}

export const VerificationStatus: React.FC<VerificationStatusProps> = ({
  status,
  message,
  onRetry,
  onGoToLogin,
  onGoToSignup,
}) => {
  return (
    <>
      {status === 'loading' && (
        <div className="flex flex-col items-center justify-center gap-4">
          <Loader2 className="h-16 w-16 text-primary animate-spin" />
          <p className="text-gray-600">{message}</p>
        </div>
      )}
      
      {status === 'success' && (
        <div className="flex flex-col items-center justify-center gap-4">
          <CheckCircle className="h-16 w-16 text-green-500" />
          <p className="text-gray-600">{message}</p>
          <Button className="mt-4 w-full" onClick={onGoToLogin}>
            Sign In Now
          </Button>
        </div>
      )}
      
      {status === 'error' && (
        <div className="flex flex-col items-center justify-center gap-4">
          <XCircle className="h-16 w-16 text-red-500" />
          <p className="text-gray-600">{message}</p>
          <div className="flex flex-col sm:flex-row gap-3 w-full mt-4">
            {onRetry && (
              <Button variant="outline" className="w-full" onClick={onRetry}>
                Retry Verification
              </Button>
            )}
            <Button variant="outline" className="w-full" onClick={onGoToSignup}>
              Try Again
            </Button>
            <Button className="w-full" onClick={onGoToLogin}>
              Go to Login
            </Button>
          </div>
        </div>
      )}
    </>
  );
};
