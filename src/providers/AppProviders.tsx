
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
  // Wrap each provider in its own ErrorBoundary to prevent cascade failures
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="light" storageKey="patorama-theme">
          <Router>
            <AuthProvider>
              <NotificationsProvider>
                <AIAssistantProvider>
                  <React.Suspense fallback={<div>Loading application...</div>}>
                    <HeaderSettingsProvider>
                      {children}
                    </HeaderSettingsProvider>
                  </React.Suspense>
                </AIAssistantProvider>
              </NotificationsProvider>
            </AuthProvider>
          </Router>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};
