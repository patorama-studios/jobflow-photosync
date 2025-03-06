
import React, { useEffect } from 'react';
import { CodeVerifier } from '../components/dev/CodeVerifier';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useHeaderSettings } from '../hooks/useHeaderSettings';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import { CheckCircle, AlertCircle, Info } from 'lucide-react';

export default function Debug() {
  const { setTitle } = useHeaderSettings();
  
  // Add runtime verification on page load
  useEffect(() => {
    setTitle('Debug Tools');
    
    // Add a global error handler to catch React errors
    const originalOnError = window.onerror;
    window.onerror = function(message, source, lineno, colno, error) {
      console.error('[Debug Page] Detected global error:', { message, source, lineno, colno, error });
      if (typeof originalOnError === 'function') {
        return originalOnError(message, source, lineno, colno, error);
      }
      return false;
    };
    
    // Monitor React errors specifically
    const originalConsoleError = console.error;
    console.error = function(...args) {
      if (args[0] && typeof args[0] === 'string') {
        // Check for common React errors
        if (args[0].includes('Invalid hook call') || 
            args[0].includes('Context.Provider') ||
            args[0].includes('useNavigate()') ||
            args[0].includes('useLocation()')) {
          console.warn('[Debug Page] React error detected:', args[0]);
        }
      }
      originalConsoleError.apply(console, args);
    };
    
    // Run some basic diagnostics
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
      <h1 className="text-2xl font-bold mb-6">Development Debug Tools</h1>
      
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
        </CardContent>
      </Card>
      
      <Tabs defaultValue="code-verifier">
        <TabsList>
          <TabsTrigger value="code-verifier">Code Verifier</TabsTrigger>
        </TabsList>
        
        <TabsContent value="code-verifier" className="mt-6">
          <CodeVerifier />
        </TabsContent>
      </Tabs>
    </div>
  );
}

/**
 * Declare global namespace for React Router history
 */
declare global {
  interface Window {
    __REACT_ROUTER_HISTORY__?: unknown;
  }
}
