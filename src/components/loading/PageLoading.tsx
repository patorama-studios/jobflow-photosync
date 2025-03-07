
import React from 'react';
import { Loader2 } from 'lucide-react';

export const PageLoading = () => (
  <div className="flex flex-col h-screen w-full items-center justify-center">
    <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
    <p className="text-lg font-medium">Loading content...</p>
    <p className="text-sm text-muted-foreground mt-2">Please wait while we prepare your experience</p>
  </div>
);

export default PageLoading;
