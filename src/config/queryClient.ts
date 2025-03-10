
import { QueryClient } from '@tanstack/react-query';

// Create a client with optimized settings
export const createQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      gcTime: 5 * 60 * 1000, // 5 minutes (replaces cacheTime)
      retry: 1,
      refetchOnWindowFocus: import.meta.env.PROD, // Only in production
    },
  },
});

// Create and export a queryClient instance
export const queryClient = createQueryClient();
