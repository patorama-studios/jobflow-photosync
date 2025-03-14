
import React from 'react';
import { Loader2, AlertCircle, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useNotificationTemplates } from '@/contexts/NotificationTemplateContext';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export const LoadingState: React.FC<{ isAuthenticated?: boolean | null }> = ({ isAuthenticated }) => {
  const { loadRetry, refreshTemplates } = useNotificationTemplates();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Handle different states clearly
  
  // Still determining auth status
  if (isAuthenticated === null) {
    return (
      <div className="flex flex-col justify-center items-center h-64 space-y-4">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p>Checking authentication status...</p>
      </div>
    );
  }
  
  // If not authenticated, show login message with button
  if (!user && isAuthenticated === false) {
    return (
      <div className="flex flex-col justify-center items-center h-64 space-y-4">
        <AlertCircle className="h-8 w-8 text-amber-500" />
        <p>Please log in to view notification templates</p>
        <p className="text-sm text-muted-foreground">Settings are only available for authenticated users</p>
        <Button 
          onClick={() => navigate('/login', { state: { from: '/settings' } })}
          variant="default"
          className="mt-2"
        >
          <LogIn className="mr-2 h-4 w-4" />
          Log In
        </Button>
        {import.meta.env.DEV && (
          <div className="mt-2 p-2 border rounded bg-muted/50">
            <p className="text-xs text-muted-foreground">DEV MODE: Settings are still accessible in development environment</p>
          </div>
        )}
      </div>
    );
  }
  
  // Normal loading state with retry button if needed
  return (
    <div className="flex flex-col justify-center items-center h-64 space-y-4">
      <Loader2 className="h-8 w-8 animate-spin" />
      <p>Loading notification templates...</p>
      {loadRetry > 1 && (
        <Button variant="outline" size="sm" onClick={refreshTemplates}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Retry Loading
        </Button>
      )}
      {loadRetry >= 3 && (
        <p className="text-sm text-muted-foreground">
          Having trouble loading templates. Please try again later.
        </p>
      )}
    </div>
  );
};
