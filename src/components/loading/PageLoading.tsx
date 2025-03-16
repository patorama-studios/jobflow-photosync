
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

type PageLoadingProps = {
  forceRefreshAfter?: number; // Seconds after which to force refresh
  message?: string;
};

export const PageLoading: React.FC<PageLoadingProps> = ({ 
  forceRefreshAfter = 10,
  message = "Loading content..."
}) => {
  const [loadingTime, setLoadingTime] = useState(0);
  const [hasRefreshed, setHasRefreshed] = useState(false);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingTime(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Only refresh once after timeout if we haven't refreshed already
  useEffect(() => {
    if (loadingTime >= forceRefreshAfter && !hasRefreshed) {
      console.log(`Loading timeout reached (${forceRefreshAfter}s), attempting to continue...`);
      
      setHasRefreshed(true);
      
      // Only attempt to redirect to dashboard as a last resort after a small delay
      const timeoutId = setTimeout(() => {
        // Try to clear any potential loop by redirecting to login
        window.location.href = '/login';
      }, 2000);
      
      return () => clearTimeout(timeoutId);
    }
  }, [loadingTime, forceRefreshAfter, hasRefreshed]);
  
  const handleManualRefresh = () => {
    window.location.reload();
  };

  const handleGoToLogin = () => {
    window.location.href = '/login';
  };
  
  return (
    <div className="flex flex-col h-screen w-full items-center justify-center bg-background">
      <div className="h-10 w-10 text-primary animate-spin mb-4">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
      </div>
      
      <p className="text-lg font-medium">{message}</p>
      <p className="text-sm text-muted-foreground mt-2">
        Please wait while we prepare your experience
        {loadingTime > 2 && <span> ({loadingTime}s)</span>}
      </p>
      
      {loadingTime > 3 && (
        <div className="flex gap-2 mt-4">
          <Button 
            onClick={handleManualRefresh}
            variant="outline"
          >
            Refresh Page
          </Button>
          
          <Button 
            onClick={handleGoToLogin}
          >
            Go to Login
          </Button>
        </div>
      )}
      
      {loadingTime > 6 && (
        <div className="mt-6 max-w-md p-4 bg-muted/50 rounded-lg text-sm">
          <p className="font-medium mb-2">Taking longer than expected?</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Try clearing your browser cache</li>
            <li>Check your internet connection</li>
            <li>Go directly to the <a href="/login" className="text-primary underline">login page</a></li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default PageLoading;
