
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from '../components/theme-provider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HeaderSettingsProvider } from '../hooks/useHeaderSettings';
import { ErrorBoundary } from '../components/ErrorBoundary';

interface AppProvidersProps {
  children: React.ReactNode;
  queryClient: QueryClient;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children, queryClient }) => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="light" storageKey="patorama-theme">
          <Router>
            <HeaderSettingsProvider>
              {children}
            </HeaderSettingsProvider>
          </Router>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};
