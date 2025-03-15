
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { VerificationStatus } from './VerificationStatus';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

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
  // Get the document title based on status
  const getTitle = () => {
    switch (status) {
      case 'loading':
        return 'Verifying Email';
      case 'success':
        return 'Email Verified';
      case 'error':
        return 'Verification Failed';
      default:
        return 'Email Verification';
    }
  };

  // Get the description based on status
  const getDescription = () => {
    switch (status) {
      case 'loading':
        return 'Processing your verification request';
      case 'success':
        return 'Your account is now active';
      case 'error':
        return 'There was a problem with verification';
      default:
        return '';
    }
  };

  return (
    <Card className="w-full max-w-md shadow-lg border border-gray-200 dark:border-gray-800">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">{getTitle()}</CardTitle>
        <CardDescription>{getDescription()}</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4 text-center py-6">
        {status === 'error' && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4 mr-2" />
            <AlertDescription>
              This verification link is invalid or has expired. Please try again or request a new link.
            </AlertDescription>
          </Alert>
        )}
        
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
