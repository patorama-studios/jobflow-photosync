
import { resourceMonitor } from './resource-monitor';
import { initAutoPrefetch } from './resource-prefetcher';

/**
 * Initialize application performance monitoring and optimization
 * @returns Cleanup function
 */
export const initializePerformance = () => {
  // Initialize performance monitoring
  resourceMonitor.init();
  
  // Initialize automatic prefetching of resources for visible links
  const cleanupPrefetch = initAutoPrefetch();
  
  // Log performance metrics after page is fully loaded
  window.addEventListener('load', () => {
    // Schedule metrics logging during idle time
    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(() => {
        resourceMonitor.logMetrics();
      });
    } else {
      setTimeout(() => {
        resourceMonitor.logMetrics();
      }, 1000);
    }
  });
  
  return cleanupPrefetch;
};
