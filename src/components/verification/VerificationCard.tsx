
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { VerificationStatus } from './VerificationStatus';

interface VerificationCardProps {
  status: 'loading' | 'success' | 'error';
  message: string;
  onRetry?: () => void;
  onGoToLogin: () => void;
  onGoToSignup: () => void;
}

export const VerificationCard: React.FC<VerificationCardProps> = ({
  status,
  message,
  onRetry,
  onGoToLogin,
  onGoToSignup,
}) => {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Email Verification</CardTitle>
        <CardDescription>
          {status === 'loading' ? 'Processing your verification request' : 
           status === 'success' ? 'Your account is now active' : 
           'There was a problem with verification'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 text-center py-6">
        <VerificationStatus
          status={status}
          message={message}
          onRetry={onRetry}
          onGoToLogin={onGoToLogin}
          onGoToSignup={onGoToSignup}
        />
      </CardContent>
    </Card>
  );
};
