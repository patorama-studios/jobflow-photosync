
/**
 * Image optimization utilities to improve site performance
 */

/**
 * Lazily load an image with optional blur-up effect
 * @param src The image source URL
 * @param placeholder Optional placeholder for blur-up effect
 * @returns A promise that resolves when the image is loaded
 */
export function lazyLoadImage(src: string, placeholder?: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    
    // If we have a placeholder, load it first for blur-up effect
    if (placeholder) {
      const tempImg = new Image();
      tempImg.src = placeholder;
      tempImg.onload = () => {
        // After placeholder loads, load the main image
        img.src = src;
      };
    } else {
      img.src = src;
    }
  });
}

/**
 * Generate responsive image srcSet for different screen sizes
 * @param baseSrc Base image source
 * @param widths Array of widths for srcSet
 * @returns srcSet string for use in img or picture elements
 */
export function generateSrcSet(baseSrc: string, widths: number[] = [640, 768, 1024, 1280, 1536]): string {
  // For CDN-based images that support width parameters
  if (baseSrc.includes('placeholder.com') || baseSrc.includes('unsplash.com')) {
    return widths.map(width => `${baseSrc.replace('{width}', width.toString())} ${width}w`).join(', ');
  }
  
  // For local images, simply return the original
  return baseSrc;
}

/**
 * Preload critical images for faster display
 * @param images Array of image URLs to preload
 */
export function preloadCriticalImages(images: string[]): void {
  // Run in idle time to avoid blocking the main thread
  if ('requestIdleCallback' in window) {
    (window as any).requestIdleCallback(() => {
      images.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
      });
    });
  } else {
    // Fallback to setTimeout
    setTimeout(() => {
      images.forEach(src => {
        const img = new Image();
        img.src = src;
      });
    }, 300);
  }
}

/**
 * Create a blur hash placeholder for an image
 * Simple version that returns a translucent gray background
 * @returns CSS background style
 */
export function createPlaceholder(): string {
  return 'background-color: rgba(200, 200, 200, 0.5); backdrop-filter: blur(10px);';
}

/**
 * Optimize image loading in the DOM
 * Call this to automatically optimize all images on the page
 */
export function optimizePageImages(): void {
  if (typeof document === 'undefined') return;
  
  // Use Intersection Observer for lazy loading
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            observer.unobserve(img);
          }
        }
      });
    },
    { rootMargin: '200px 0px' } // Start loading when within 200px
  );
  
  // Find all images with data-src attribute
  const lazyImages = document.querySelectorAll('img[data-src]');
  lazyImages.forEach(img => observer.observe(img));
}
