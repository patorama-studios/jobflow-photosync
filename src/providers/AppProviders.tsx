
import React from 'react';
import { ThemeProvider } from '../components/theme-provider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { AIAssistantProvider } from '../contexts/AIAssistantContext';
import { AuthProvider } from '../contexts/AuthContext';
import { NotificationsProvider } from '../contexts/NotificationsContext';

interface AppProvidersProps {
  children: React.ReactNode;
  queryClient: QueryClient;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children, queryClient }) => {
  // Configure query client for better error handling
  queryClient.setDefaultOptions({
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      // In tanstack/react-query v5, error handling is moved inside meta
      meta: {
        onError: (error: Error) => {
          console.error('Query error:', error);
        }
      }
    },
  });

  return (
    <ErrorBoundary fallback={({ error, resetErrorBoundary }) => (
      <div className="m-4 p-4 bg-red-50 border border-red-200 rounded-md">
        <h2 className="text-red-700 text-lg font-semibold mb-2">Provider Error</h2>
        <p className="text-red-600 mb-4">{error?.message || "An unknown error occurred in AppProviders"}</p>
        <button 
          onClick={resetErrorBoundary}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    )}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="light" storageKey="patorama-theme">
          <ErrorBoundary>
            <AuthProvider>
              <NotificationsProvider>
                <AIAssistantProvider>
                  <React.Suspense fallback={
                    <div className="flex items-center justify-center min-h-screen">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                        <p>Loading application...</p>
                      </div>
                    </div>
                  }>
                    <ErrorBoundary>
                      {children}
                    </ErrorBoundary>
                  </React.Suspense>
                </AIAssistantProvider>
              </NotificationsProvider>
            </AuthProvider>
          </ErrorBoundary>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};
