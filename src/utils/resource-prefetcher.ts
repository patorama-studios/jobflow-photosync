
/**
 * Resource Prefetcher Utility
 * Helps optimize page loading by prefetching resources ahead of time
 */

export type PrefetchType = 'image' | 'js' | 'css' | 'font' | 'page';

interface PrefetchOptions {
  priority?: 'high' | 'low';
  as?: string;
  type?: string;
  crossOrigin?: 'anonymous' | 'use-credentials';
}

/**
 * Prefetch a resource and return a promise that resolves when it's loaded
 */
export function prefetchResource(
  url: string, 
  type: PrefetchType,
  options: PrefetchOptions = {}
): Promise<boolean> {
  return new Promise((resolve) => {
    if (!url || typeof window === 'undefined') {
      resolve(false);
      return;
    }
    
    // Check if already cached or prefetched
    if (isPrefetched(url)) {
      resolve(true);
      return;
    }
    
    // Configure resource hints based on type
    const link = document.createElement('link');
    
    switch (type) {
      case 'image':
        link.rel = 'prefetch';
        link.as = 'image';
        break;
      case 'js':
        link.rel = options.priority === 'high' ? 'preload' : 'prefetch';
        link.as = 'script';
        break;
      case 'css':
        link.rel = options.priority === 'high' ? 'preload' : 'prefetch';
        link.as = 'style';
        break;
      case 'font':
        link.rel = 'preload';
        link.as = 'font';
        link.crossOrigin = options.crossOrigin || 'anonymous';
        if (options.type) {
          link.type = options.type;
        }
        break;
      case 'page':
        link.rel = 'prefetch';
        link.as = 'document';
        break;
    }
    
    link.href = url;
    
    // Handle successful load
    link.onload = () => {
      // Mark as prefetched in sessionStorage
      markAsPrefetched(url);
      resolve(true);
    };
    
    // Handle failed load
    link.onerror = () => {
      // Clean up bad link
      document.head.removeChild(link);
      console.warn(`Failed to prefetch: ${url}`);
      resolve(false);
    };
    
    // Add link to head
    document.head.appendChild(link);
  });
}

/**
 * Check if a resource has already been prefetched
 */
function isPrefetched(url: string): boolean {
  // Check sessionStorage first
  try {
    const prefetched = sessionStorage.getItem('prefetched');
    if (prefetched) {
      const urls = JSON.parse(prefetched);
      if (urls.includes(url)) {
        return true;
      }
    }
  } catch (e) {
    // Ignore storage errors
  }
  
  // Check if already in DOM
  const links = document.querySelectorAll('link');
  for (let i = 0; i < links.length; i++) {
    if (links[i].href === url && 
        (links[i].rel === 'prefetch' || 
         links[i].rel === 'preload')) {
      return true;
    }
  }
  
  return false;
}

/**
 * Mark a URL as prefetched in sessionStorage
 */
function markAsPrefetched(url: string): void {
  try {
    const prefetched = sessionStorage.getItem('prefetched');
    const urls = prefetched ? JSON.parse(prefetched) : [];
    if (!urls.includes(url)) {
      urls.push(url);
      sessionStorage.setItem('prefetched', JSON.stringify(urls));
    }
  } catch (e) {
    // Ignore storage errors
  }
}

/**
 * Prefetch multiple resources at once
 */
export function prefetchResources(
  resources: { url: string; type: PrefetchType; options?: PrefetchOptions }[]
): Promise<boolean[]> {
  return Promise.all(resources.map(r => prefetchResource(r.url, r.type, r.options)));
}

/**
 * Prefetch resources for a route ahead of time
 */
export function prefetchRoute(route: string): Promise<boolean[]> {
  const resources: { url: string; type: PrefetchType; options?: PrefetchOptions }[] = [
    { url: route, type: 'page' },
  ];
  
  // Common resources used across all pages
  // Detect if we're in production and use hashed filenames
  const isProduction = import.meta.env.PROD;
  
  if (isProduction) {
    // In production, we'd add specific versioned assets
    // This is a simplified example
    resources.push(
      { url: '/assets/index.js', type: 'js', options: { priority: 'high' } },
      { url: '/assets/index.css', type: 'css', options: { priority: 'high' } }
    );
  }
  
  return prefetchResources(resources);
}

/**
 * Automatically prefetch resources for visible links
 * Call this function once on the main page component
 */
export function initAutoPrefetch(): () => void {
  if (typeof window === 'undefined') {
    return () => {};
  }
  
  // Use Intersection Observer to detect links entering viewport
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const link = entry.target as HTMLAnchorElement;
        if (link.href && link.href.startsWith(window.location.origin)) {
          const route = link.pathname;
          prefetchRoute(route).catch(() => {
            // Silently fail - prefetching is an optimization only
          });
          // Stop observing this link once we've prefetched its route
          observer.unobserve(link);
        }
      }
    });
  }, { rootMargin: '200px' });
  
  // Find all internal links and observe them
  const links = document.querySelectorAll('a[href^="/"], a[href^="' + window.location.origin + '"]');
  links.forEach(link => {
    observer.observe(link);
  });
  
  // Return a cleanup function
  return () => {
    observer.disconnect();
  };
}
