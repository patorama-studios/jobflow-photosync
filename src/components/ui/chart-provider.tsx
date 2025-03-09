
import React, { Suspense } from 'react';
import { Skeleton } from './skeleton';

interface ChartProviderProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  height?: string | number;
}

export const ChartProvider: React.FC<ChartProviderProps> = ({
  children,
  fallback,
  height = '250px'
}) => {
  const defaultFallback = (
    <div style={{ height }} className="flex items-center justify-center">
      <Skeleton className="h-full w-full" />
    </div>
  );

  return (
    <Suspense fallback={fallback || defaultFallback}>
      <ErrorBoundary fallback={<div className="text-red-500 p-4">Chart failed to load. Please try refreshing the page.</div>}>
        {children}
      </ErrorBoundary>
    </Suspense>
  );
};

// Simple error boundary component
class ErrorBoundary extends React.Component<{
  fallback: React.ReactNode;
  children: React.ReactNode;
}> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('Chart error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}
