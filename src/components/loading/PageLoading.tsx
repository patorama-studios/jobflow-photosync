
import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
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
  
  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingTime(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Simple refresh logic - only refresh once after timeout
  useEffect(() => {
    if (loadingTime >= forceRefreshAfter) {
      console.log(`Loading timeout reached (${forceRefreshAfter}s), refreshing page...`);
      
      // Simple timeout approach - just reload the page after our timeout
      const timeoutId = setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1000);
      
      return () => clearTimeout(timeoutId);
    }
  }, [loadingTime, forceRefreshAfter]);
  
  const handleManualRefresh = () => {
    window.location.reload();
  };
  
  return (
    <div className="flex flex-col h-screen w-full items-center justify-center bg-background">
      <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
      
      <p className="text-lg font-medium">{message}</p>
      <p className="text-sm text-muted-foreground mt-2">
        Please wait while we prepare your experience
        {loadingTime > 2 && <span> ({loadingTime}s)</span>}
      </p>
      
      {loadingTime > 4 && (
        <Button 
          onClick={handleManualRefresh}
          className="mt-4"
          variant="outline"
        >
          Refresh Page
        </Button>
      )}
      
      {loadingTime > 8 && (
        <div className="mt-6 max-w-md p-4 bg-muted/50 rounded-lg text-sm">
          <p className="font-medium mb-2">Taking longer than expected?</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Check your internet connection</li>
            <li>Try going directly to the <a href="/dashboard" className="text-primary underline">dashboard</a></li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default PageLoading;
