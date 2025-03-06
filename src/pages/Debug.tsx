
import React, { useEffect, useState, lazy, Suspense } from 'react';
import { useHeaderSettings } from '../hooks/useHeaderSettings';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { CheckCircle, AlertCircle, Info, Gauge, Cpu, Clock, Database } from 'lucide-react';
import { Button } from '../components/ui/button';

// Lazy-load the CodeVerifier component for better initial loading
const CodeVerifier = lazy(() => 
  import('../components/dev/CodeVerifier').then(module => ({ default: module.CodeVerifier }))
);

// Performance measurement types
interface PerformanceMetrics {
  dcl: number; // DOMContentLoaded
  load: number; // Load
  fcp: number; // First Contentful Paint
  lcp: number | null; // Largest Contentful Paint
  fid: number | null; // First Input Delay
  cls: number | null; // Cumulative Layout Shift
  memoryUsage: number | null; // Memory usage if available
}

export default function Debug() {
  const { setTitle } = useHeaderSettings();
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    dcl: 0,
    load: 0,
    fcp: 0,
    lcp: null,
    fid: null,
    cls: null,
    memoryUsage: null
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [resourceStats, setResourceStats] = useState({ 
    total: 0, 
    js: 0, 
    css: 0, 
    img: 0, 
    other: 0 
  });
  
  // Add runtime verification on page load with performance metrics
  useEffect(() => {
    setTitle('Debug & Performance Tools');
    
    // Add a global error handler to catch React errors
    const originalOnError = window.onerror;
    const originalConsoleError = console.error;
    const newErrors: string[] = [];
    
    window.onerror = function(message, source, lineno, colno, error) {
      const errorInfo = { message, source, lineno, colno, error };
      console.error('[Debug Page] Detected global error:', errorInfo);
      newErrors.push(`Global error: ${message}`);
      setErrors(prev => [...prev, `Global error: ${message}`]);
      
      if (typeof originalOnError === 'function') {
        return originalOnError(message, source, lineno, colno, error);
      }
      return false;
    };
    
    console.error = function(...args) {
      if (args[0] && typeof args[0] === 'string') {
        // Check for common React errors
        if (args[0].includes('Invalid hook call') || 
            args[0].includes('Context.Provider') ||
            args[0].includes('useNavigate()') ||
            args[0].includes('useLocation()')) {
          console.warn('[Debug Page] React error detected:', args[0]);
          newErrors.push(`React error: ${args[0].substring(0, 100)}...`);
          setErrors(prev => [...prev, `React error: ${args[0].substring(0, 100)}...`]);
        }
      }
      originalConsoleError.apply(console, args);
    };
    
    // Collect performance metrics
    const collectPerformanceMetrics = () => {
      const perfData = window.performance;
      if (!perfData) return;
      
      // Basic timing
      const timingData = perfData.timing;
      const dcl = timingData?.domContentLoadedEventEnd - timingData?.navigationStart || 0;
      const load = timingData?.loadEventEnd - timingData?.navigationStart || 0;
      
      // Get First Contentful Paint if available
      let fcp = 0;
      const paintEntries = perfData.getEntriesByType('paint');
      const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint');
      if (fcpEntry) {
        fcp = fcpEntry.startTime;
      }
      
      // Get memory usage if available
      let memoryUsage = null;
      if ((performance as any).memory) {
        memoryUsage = Math.round((performance as any).memory.usedJSHeapSize / (1024 * 1024));
      }
      
      // Resource counting
      const resources = perfData.getEntriesByType('resource');
      const counts = {
        total: resources.length,
        js: resources.filter(r => r.name.endsWith('.js')).length,
        css: resources.filter(r => r.name.endsWith('.css')).length,
        img: resources.filter(r => r.name.endsWith('.png') || r.name.endsWith('.jpg') || r.name.endsWith('.jpeg') || r.name.endsWith('.gif') || r.name.endsWith('.svg')).length,
        other: 0
      };
      counts.other = counts.total - counts.js - counts.css - counts.img;
      
      setResourceStats(counts);
      
      // Set initial metrics
      setMetrics({
        dcl,
        load,
        fcp,
        lcp: null,
        fid: null,
        cls: null,
        memoryUsage
      });
      
      // Try to get Web Vitals if available
      try {
        if ('PerformanceObserver' in window) {
          // LCP measurement
          new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            const lastEntry = entries[entries.length - 1];
            setMetrics(prev => ({ ...prev, lcp: lastEntry?.startTime || null }));
          }).observe({ type: 'largest-contentful-paint', buffered: true });
          
          // FID measurement
          new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            entries.forEach(entry => {
              if (entry.name === 'first-input') {
                setMetrics(prev => ({ 
                  ...prev, 
                  fid: (entry as PerformanceEventTiming).processingStart - entry.startTime 
                }));
              }
            });
          }).observe({ type: 'first-input', buffered: true });
          
          // CLS measurement
          let clsValue = 0;
          let clsEntries: any[] = [];
          
          new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            
            entries.forEach(entry => {
              // Only count layout shifts without recent user input
              if (!(entry as any).hadRecentInput) {
                const currentEntry = entry as any;
                clsValue += currentEntry.value;
                clsEntries.push(currentEntry);
                setMetrics(prev => ({ ...prev, cls: clsValue }));
              }
            });
          }).observe({ type: 'layout-shift', buffered: true });
        }
      } catch (e) {
        console.warn('Web Vitals measurement failed:', e);
      }
    };
    
    // Run performance metrics collection
    setTimeout(collectPerformanceMetrics, 500);
    
    // Run diagnostics
    console.log('[Debug Page] Running diagnostics...');
    console.log('[Debug Page] React Router available:', Boolean(window.__REACT_ROUTER_HISTORY__));
    console.log('[Debug Page] Window location:', window.location.pathname);
    
    // Clean up
    return () => {
      window.onerror = originalOnError;
      console.error = originalConsoleError;
    };
  }, [setTitle]);
  
  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6">Performance & Debug Tools</h1>
      
      {/* Performance Metrics */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Gauge className="mr-2 h-5 w-5" />
            Performance Metrics
          </CardTitle>
          <CardDescription>
            Core Web Vitals and page load metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-primary/5 p-4 rounded-lg flex items-center">
              <Clock className="h-8 w-8 mr-4 text-primary" />
              <div>
                <div className="text-sm font-medium text-muted-foreground">Page Load</div>
                <div className="text-2xl font-bold">{metrics.load}ms</div>
              </div>
            </div>
            
            <div className="bg-primary/5 p-4 rounded-lg flex items-center">
              <Cpu className="h-8 w-8 mr-4 text-primary" />
              <div>
                <div className="text-sm font-medium text-muted-foreground">First Paint</div>
                <div className="text-2xl font-bold">{Math.round(metrics.fcp)}ms</div>
              </div>
            </div>
            
            <div className="bg-primary/5 p-4 rounded-lg flex items-center">
              <Database className="h-8 w-8 mr-4 text-primary" />
              <div>
                <div className="text-sm font-medium text-muted-foreground">Memory Usage</div>
                <div className="text-2xl font-bold">
                  {metrics.memoryUsage !== null ? `${metrics.memoryUsage}MB` : 'N/A'}
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 space-y-3">
            <div className="text-sm">
              <span className="font-medium">Dom Content Loaded:</span> {metrics.dcl}ms
            </div>
            <div className="text-sm">
              <span className="font-medium">Largest Contentful Paint:</span> {metrics.lcp ? `${Math.round(metrics.lcp)}ms` : 'Measuring...'}
            </div>
            <div className="text-sm">
              <span className="font-medium">First Input Delay:</span> {metrics.fid ? `${Math.round(metrics.fid)}ms` : 'Waiting for interaction...'}
            </div>
            <div className="text-sm">
              <span className="font-medium">Cumulative Layout Shift:</span> {metrics.cls !== null ? metrics.cls.toFixed(3) : 'Measuring...'}
            </div>
          </div>
          
          <Separator className="my-4" />
          
          <div>
            <h4 className="text-sm font-medium mb-2">Resource Breakdown</h4>
            <div className="text-sm space-y-1">
              <div><span className="font-medium">Total Resources:</span> {resourceStats.total}</div>
              <div><span className="font-medium">JavaScript:</span> {resourceStats.js}</div>
              <div><span className="font-medium">CSS:</span> {resourceStats.css}</div>
              <div><span className="font-medium">Images:</span> {resourceStats.img}</div>
              <div><span className="font-medium">Other:</span> {resourceStats.other}</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Debug Information */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Info className="mr-2 h-5 w-5" />
            Debug Information
          </CardTitle>
          <CardDescription>
            System information to help with debugging
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div><strong>Environment:</strong> {import.meta.env.MODE}</div>
            <div><strong>React Version:</strong> {React.version}</div>
            <div><strong>Current Path:</strong> {window.location.pathname}</div>
            <div><strong>User Agent:</strong> {navigator.userAgent}</div>
          </div>
          
          {errors.length > 0 && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Detected Errors</AlertTitle>
              <AlertDescription>
                <ul className="list-disc pl-5 mt-2">
                  {errors.map((error, i) => (
                    <li key={i}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}
          
          {errors.length === 0 && (
            <Alert variant="default" className="mt-4 bg-green-50 border-green-200 text-green-800">
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>No Errors Detected</AlertTitle>
              <AlertDescription>
                No React errors or exceptions have been detected on this page.
              </AlertDescription>
            </Alert>
          )}
          
          <Alert variant="default" className="mt-4 bg-blue-50 border-blue-200 text-blue-800">
            <Info className="h-4 w-4" />
            <AlertTitle>Debugging Tips</AlertTitle>
            <AlertDescription>
              <ul className="list-disc pl-5 mt-2">
                <li>Check the console for detailed error messages</li>
                <li>Use the Code Verifier to check component code for issues</li>
                <li>Verify that all context providers are properly nested</li>
                <li>Ensure Router components are used correctly</li>
              </ul>
            </AlertDescription>
          </Alert>
          
          <div className="mt-4 flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => {
                localStorage.clear();
                sessionStorage.clear();
                alert('Local storage and session storage have been cleared');
              }}
            >
              Clear Storage
            </Button>
            <Button 
              variant="outline" 
              onClick={() => {
                window.location.reload();
              }}
            >
              Reload Page
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="code-verifier">
        <TabsList>
          <TabsTrigger value="code-verifier">Code Verifier</TabsTrigger>
        </TabsList>
        
        <TabsContent value="code-verifier" className="mt-6">
          <Suspense fallback={<div className="p-8 text-center">Loading Code Verifier...</div>}>
            <CodeVerifier />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Helper Separator component
const Separator = ({ className }: { className?: string }) => (
  <div className={`h-px bg-border ${className || ''}`} />
);

/**
 * Declare global namespace for React Router history
 */
declare global {
  interface Window {
    __REACT_ROUTER_HISTORY__?: unknown;
  }
}
