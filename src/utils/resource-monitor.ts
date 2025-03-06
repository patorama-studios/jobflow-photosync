
/**
 * Resource Monitor Utility
 * Tracks and logs performance metrics and resource usage
 */

export interface ResourceMetrics {
  memory: {
    used: number;
    limit: number;
    percentage: number;
  } | null;
  performance: {
    domComplete: number;
    domInteractive: number;
    loadEvent: number;
    firstContentfulPaint: number | null;
    largestContentfulPaint: number | null;
  };
  resources: {
    total: number;
    js: number;
    css: number;
    img: number;
    other: number;
    totalSize: number;
  };
}

class ResourceMonitor {
  private isInitialized: boolean = false;
  private metrics: ResourceMetrics = {
    memory: null,
    performance: {
      domComplete: 0,
      domInteractive: 0,
      loadEvent: 0,
      firstContentfulPaint: null,
      largestContentfulPaint: null
    },
    resources: {
      total: 0,
      js: 0,
      css: 0,
      img: 0,
      other: 0,
      totalSize: 0
    }
  };

  /**
   * Initialize the performance monitor
   */
  public init(): void {
    if (typeof window === 'undefined' || this.isInitialized) {
      return;
    }

    this.isInitialized = true;
    
    // Wait for the page to fully load before measuring
    window.addEventListener('load', () => {
      // Use requestIdleCallback to avoid blocking the main thread
      this.scheduleUpdate();
    });
    
    // Set up observers for web vitals
    this.observeWebVitals();
  }

  /**
   * Update metrics when the browser is idle
   */
  private scheduleUpdate(): void {
    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(() => this.updateMetrics());
    } else {
      setTimeout(() => this.updateMetrics(), 100);
    }
  }

  /**
   * Set up observers for Web Vitals metrics
   */
  private observeWebVitals(): void {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
      return;
    }

    try {
      // Observe FCP
      const fcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        if (entries.length > 0) {
          const fcp = entries[0];
          this.metrics.performance.firstContentfulPaint = fcp.startTime;
          fcpObserver.disconnect();
        }
      });
      fcpObserver.observe({ type: 'paint', buffered: true });

      // Observe LCP
      const lcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        if (entries.length > 0) {
          const lcp = entries[entries.length - 1];
          this.metrics.performance.largestContentfulPaint = lcp.startTime;
        }
      });
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
      
    } catch (err) {
      console.warn('Web Vitals observation failed:', err);
    }
  }

  /**
   * Update all metrics
   */
  private updateMetrics(): void {
    this.updateMemoryMetrics();
    this.updatePerformanceMetrics();
    this.updateResourceMetrics();
  }

  /**
   * Update memory usage metrics if available
   */
  private updateMemoryMetrics(): void {
    if ((performance as any).memory) {
      const memory = (performance as any).memory;
      this.metrics.memory = {
        used: Math.round(memory.usedJSHeapSize / (1024 * 1024)),
        limit: Math.round(memory.jsHeapSizeLimit / (1024 * 1024)),
        percentage: Math.round((memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100)
      };
    }
  }

  /**
   * Update performance timing metrics
   */
  private updatePerformanceMetrics(): void {
    const timing = performance.timing;
    
    if (timing) {
      this.metrics.performance.domComplete = timing.domComplete - timing.navigationStart;
      this.metrics.performance.domInteractive = timing.domInteractive - timing.navigationStart;
      this.metrics.performance.loadEvent = timing.loadEventEnd - timing.navigationStart;
    }
  }

  /**
   * Update resource usage metrics
   */
  private updateResourceMetrics(): void {
    const resources = performance.getEntriesByType('resource');
    
    // Reset counters
    const resourceMetrics = {
      total: resources.length,
      js: 0,
      css: 0,
      img: 0,
      other: 0,
      totalSize: 0
    };
    
    // Count resources by type
    resources.forEach(resource => {
      const url = (resource as PerformanceResourceTiming).name;
      let size = (resource as PerformanceResourceTiming).transferSize;
      
      if (size === 0) {
        // For cached resources, use decodedBodySize
        size = (resource as PerformanceResourceTiming).decodedBodySize;
      }
      
      // Add to total size
      resourceMetrics.totalSize += size;
      
      // Count by type
      if (url.endsWith('.js')) {
        resourceMetrics.js++;
      } else if (url.endsWith('.css')) {
        resourceMetrics.css++;
      } else if (url.match(/\.(png|jpg|jpeg|gif|svg|webp)$/)) {
        resourceMetrics.img++;
      } else {
        resourceMetrics.other++;
      }
    });
    
    // Convert total size to MB
    resourceMetrics.totalSize = Math.round(resourceMetrics.totalSize / (1024 * 1024) * 100) / 100;
    
    this.metrics.resources = resourceMetrics;
  }

  /**
   * Get the current metrics
   */
  public getMetrics(): ResourceMetrics {
    return this.metrics;
  }

  /**
   * Log all performance metrics to console
   */
  public logMetrics(): void {
    if (!this.isInitialized) {
      this.init();
      setTimeout(() => this.logMetricsToConsole(), 100);
    } else {
      this.logMetricsToConsole();
    }
  }

  /**
   * Actually log the metrics to console
   */
  private logMetricsToConsole(): void {
    console.group('📊 Performance Metrics');
    
    console.log('⏱️ Timing:');
    console.log(`  DOM Interactive: ${this.metrics.performance.domInteractive}ms`);
    console.log(`  DOM Complete: ${this.metrics.performance.domComplete}ms`);
    console.log(`  Load Event: ${this.metrics.performance.loadEvent}ms`);
    
    if (this.metrics.performance.firstContentfulPaint) {
      console.log(`  First Contentful Paint: ${Math.round(this.metrics.performance.firstContentfulPaint)}ms`);
    }
    
    if (this.metrics.performance.largestContentfulPaint) {
      console.log(`  Largest Contentful Paint: ${Math.round(this.metrics.performance.largestContentfulPaint)}ms`);
    }
    
    console.log('🧩 Resources:');
    console.log(`  Total: ${this.metrics.resources.total} (${this.metrics.resources.totalSize}MB)`);
    console.log(`  JavaScript: ${this.metrics.resources.js}`);
    console.log(`  CSS: ${this.metrics.resources.css}`);
    console.log(`  Images: ${this.metrics.resources.img}`);
    console.log(`  Other: ${this.metrics.resources.other}`);
    
    if (this.metrics.memory) {
      console.log('💾 Memory:');
      console.log(`  Used: ${this.metrics.memory.used}MB / ${this.metrics.memory.limit}MB (${this.metrics.memory.percentage}%)`);
    }
    
    console.groupEnd();
  }
}

// Create a singleton instance
export const resourceMonitor = new ResourceMonitor();

// Initialize automatically in development mode
if (import.meta.env.DEV) {
  if (typeof window !== 'undefined') {
    window.addEventListener('load', () => {
      resourceMonitor.init();
      
      // Log metrics after 2 seconds to ensure most resources are loaded
      setTimeout(() => {
        resourceMonitor.logMetrics();
      }, 2000);
    });
  }
}

// Add to window for debugging
if (typeof window !== 'undefined') {
  (window as any).__RESOURCE_MONITOR__ = resourceMonitor;
}

// Declare global window property
declare global {
  interface Window {
    __RESOURCE_MONITOR__?: typeof resourceMonitor;
  }
}
