
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from '../components/theme-provider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HeaderSettingsProvider } from '../hooks/useHeaderSettings';
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
      meta: {
        onError: (error: Error) => {
          console.error('Query error:', error);
        }
      }
    },
  });

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Router>
          <ThemeProvider defaultTheme="light" storageKey="patorama-theme">
            <ErrorBoundary>
              <AuthProvider>
                <NotificationsProvider>
                  <AIAssistantProvider>
                    <React.Suspense fallback={<div className="p-4">Loading application...</div>}>
                      <HeaderSettingsProvider>
                        <ErrorBoundary>
                          {children}
                        </ErrorBoundary>
                      </HeaderSettingsProvider>
                    </React.Suspense>
                  </AIAssistantProvider>
                </NotificationsProvider>
              </AuthProvider>
            </ErrorBoundary>
          </ThemeProvider>
        </Router>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};
