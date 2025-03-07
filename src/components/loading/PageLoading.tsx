
import React, { useState, useEffect } from 'react';
import { Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

type PageLoadingProps = {
  forceRefreshAfter?: number; // Seconds after which to force refresh
};

export const PageLoading: React.FC<PageLoadingProps> = ({ forceRefreshAfter = 15 }) => {
  const [loadingTime, setLoadingTime] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingTime(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Force refresh after specified time
  useEffect(() => {
    if (loadingTime >= forceRefreshAfter && !isRefreshing) {
      console.log(`Loading timeout reached (${forceRefreshAfter}s), refreshing page...`);
      setIsRefreshing(true);
      // Small delay before refreshing to show the refreshing state
      const timeoutId = setTimeout(() => {
        window.location.reload();
      }, 1500);
      
      return () => clearTimeout(timeoutId);
    }
  }, [loadingTime, forceRefreshAfter, isRefreshing]);
  
  const handleManualRefresh = () => {
    setIsRefreshing(true);
    window.location.reload();
  };
  
  // Different display states based on loading time
  let statusMessage = "Loading content...";
  let detailMessage = "Please wait while we prepare your experience";
  
  if (isRefreshing) {
    statusMessage = "Refreshing page...";
    detailMessage = "This will only take a moment";
  } else if (loadingTime > 10) {
    statusMessage = "Still loading...";
    detailMessage = "This is taking longer than expected";
  } else if (loadingTime > 5) {
    statusMessage = "Loading your dashboard...";
    detailMessage = "Almost there";
  }
  
  return (
    <div className="flex flex-col h-screen w-full items-center justify-center">
      {isRefreshing ? (
        <RefreshCw className="h-10 w-10 text-primary animate-spin mb-4" />
      ) : (
        <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
      )}
      
      <p className="text-lg font-medium">{statusMessage}</p>
      <p className="text-sm text-muted-foreground mt-2">
        {detailMessage}
        {loadingTime > 2 && !isRefreshing && <span> ({loadingTime}s)</span>}
      </p>
      
      {loadingTime > 4 && !isRefreshing && (
        <Button 
          onClick={handleManualRefresh}
          className="mt-4"
          variant="outline"
        >
          Refresh Page
        </Button>
      )}
      
      {loadingTime > 8 && !isRefreshing && (
        <div className="mt-6 max-w-md p-4 bg-muted/50 rounded-lg text-sm">
          <p className="font-medium mb-2">Having trouble?</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Check your internet connection</li>
            <li>Try opening the app in a private/incognito window</li>
            <li>Clear your browser cache</li>
            <li>If this persists, try logging in again from the <a href="/login" className="text-primary underline">login page</a></li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default PageLoading;
