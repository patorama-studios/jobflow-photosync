
import React, { useState, useEffect } from 'react';
import { Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

type PageLoadingProps = {
  forceRefreshAfter?: number; // Seconds after which to force refresh
  message?: string;
};

export const PageLoading: React.FC<PageLoadingProps> = ({ 
  forceRefreshAfter = 10,
  message
}) => {
  const [loadingTime, setLoadingTime] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  // Track refresh attempts to prevent loops
  const [refreshAttempts, setRefreshAttempts] = useState(() => {
    const stored = sessionStorage.getItem('refreshAttempts');
    return stored ? parseInt(stored, 10) : 0;
  });
  
  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingTime(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Store refresh attempts in session storage
  useEffect(() => {
    sessionStorage.setItem('refreshAttempts', refreshAttempts.toString());
  }, [refreshAttempts]);

  // Handle force refresh logic
  useEffect(() => {
    // Only auto-refresh if we haven't tried too many times
    if (loadingTime >= forceRefreshAfter && !isRefreshing && refreshAttempts < 2) {
      console.log(`Loading timeout reached (${forceRefreshAfter}s), refreshing page...`);
      setIsRefreshing(true);
      
      // Small delay before refreshing to show the refreshing state
      const timeoutId = setTimeout(() => {
        setRefreshAttempts(prev => prev + 1);
        // Try to recover more gracefully first by clearing session storage
        // This can help with stuck auth states
        if (refreshAttempts === 0) {
          const authToken = localStorage.getItem('supabase.auth.token');
          console.log('First refresh attempt, caching auth token');
          localStorage.setItem('auth.token.backup', authToken || '');
          localStorage.removeItem('supabase.auth.token');
          window.location.href = '/dashboard'; // Direct navigation instead of reload
        } else {
          // On second attempt, try to restore from backup if possible
          const backupToken = localStorage.getItem('auth.token.backup');
          if (backupToken && backupToken !== 'undefined' && backupToken !== '') {
            console.log('Restoring auth token from backup');
            localStorage.setItem('supabase.auth.token', backupToken);
          }
          window.location.reload();
        }
      }, 1500);
      
      return () => clearTimeout(timeoutId);
    }
  }, [loadingTime, forceRefreshAfter, isRefreshing, refreshAttempts]);
  
  const handleManualRefresh = () => {
    setIsRefreshing(true);
    setRefreshAttempts(prev => prev + 1);
    window.location.reload();
  };

  // Break refresh loop and redirect
  const handleBreakLoop = () => {
    sessionStorage.removeItem('refreshAttempts');
    localStorage.removeItem('supabase.auth.token');
    window.location.href = '/dashboard';
  };
  
  // Different display states based on loading time and refresh attempts
  let statusMessage = message || "Loading content...";
  let detailMessage = "Please wait while we prepare your experience";
  
  if (isRefreshing) {
    statusMessage = "Refreshing page...";
    detailMessage = "This will only take a moment";
  } else if (refreshAttempts >= 2) {
    statusMessage = "Having trouble loading...";
    detailMessage = "We're experiencing some difficulties";
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
      
      {/* Don't show refresh button if we're in a refresh loop */}
      {loadingTime > 4 && !isRefreshing && refreshAttempts < 2 && (
        <Button 
          onClick={handleManualRefresh}
          className="mt-4"
          variant="outline"
        >
          Refresh Page
        </Button>
      )}
      
      {/* Show break loop button if we've refreshed too many times */}
      {refreshAttempts >= 2 && (
        <Button 
          onClick={handleBreakLoop}
          className="mt-4"
          variant="destructive"
        >
          Go to Dashboard
        </Button>
      )}
      
      {(loadingTime > 8 || refreshAttempts >= 2) && (
        <div className="mt-6 max-w-md p-4 bg-muted/50 rounded-lg text-sm">
          <p className="font-medium mb-2">Having trouble?</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Check your internet connection</li>
            <li>Try opening the app in a private/incognito window</li>
            <li>Clear your browser cache</li>
            <li>If this persists, try going directly to the <a href="/dashboard" className="text-primary underline">dashboard</a></li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default PageLoading;
