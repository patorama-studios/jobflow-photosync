
import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export const PageLoading = () => {
  const [loadingTime, setLoadingTime] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingTime(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="flex flex-col h-screen w-full items-center justify-center">
      <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
      <p className="text-lg font-medium">Loading content...</p>
      <p className="text-sm text-muted-foreground mt-2">
        Please wait while we prepare your experience
        {loadingTime > 3 && <span> ({loadingTime}s)</span>}
      </p>
      
      {loadingTime > 5 && (
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          Refresh Page
        </button>
      )}
    </div>
  );
};

export default PageLoading;
