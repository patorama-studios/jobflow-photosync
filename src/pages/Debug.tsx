
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import MainLayout from '@/components/layout/MainLayout';
import { Separator } from '@/components/ui/separator';
import { SafeIcon } from '@/utils/icon-loader';
// Import lodash properly
import lodash from 'lodash';

export default function Debug() {
  const [environment, setEnvironment] = useState('');
  const [routes, setRoutes] = useState<string[]>([]);
  const [loadedModules, setLoadedModules] = useState<string[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [dependencies, setDependencies] = useState<Record<string, string>>({});
  
  useEffect(() => {
    // Collect environment information
    setEnvironment(import.meta.env.MODE);
    
    // Get all routes from the window location
    try {
      const allRoutes = Object.keys(window).filter(key => 
        key.startsWith('__REACT_ROUTER')
      );
      setRoutes(allRoutes);
    } catch (e) {
      console.error('Error getting routes:', e);
    }
    
    // Try to detect loaded modules
    try {
      const moduleNames = Object.keys(window)
        .filter(key => key.includes('Module') || key.includes('Chunk'))
        .slice(0, 20);
      setLoadedModules(moduleNames);
    } catch (e) {
      console.error('Error detecting modules:', e);
    }
    
    // Check for global errors
    setErrors([
      `Console errors: ${window.__CONSOLE_ERROR_COUNT__ || 0}`,
      window.__LAST_ERROR ? `Last error: ${window.__LAST_ERROR}` : ''
    ].filter(Boolean));
    
    // Test icon rendering
    try {
      console.log('Testing icon rendering...');
      const testIcons = ['Home', 'Settings', 'User', 'Calendar'];
      testIcons.forEach(iconName => {
        try {
          const IconComponent = require('lucide-react')[iconName];
          console.log(`Icon ${iconName} loaded:`, !!IconComponent);
        } catch (error) {
          console.error(`Failed to load icon ${iconName}:`, error);
        }
      });
    } catch (e) {
      console.error('Error testing icons:', e);
    }
    
    // Check for dependencies
    try {
      const deps: Record<string, string> = {};
      
      // Check React
      if (React) deps['React'] = React.version || 'Unknown';
      
      // Check lodash - using proper import now
      deps['lodash'] = lodash ? 'Available via import' : 'Not available';
      
      // Check Recharts
      deps['Recharts'] = window.Recharts ? 'Available globally' : 'Not loaded';
      
      setDependencies(deps);
    } catch (e) {
      console.error('Error checking dependencies:', e);
    }
  }, []);

  return (
    <MainLayout>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-6">Debug Information</h1>
        
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Environment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <strong>Mode:</strong> {environment}
                </div>
                <div>
                  <strong>URL:</strong> {window.location.href}
                </div>
                <div>
                  <strong>User Agent:</strong> {navigator.userAgent}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Icon Testing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p>Testing icon rendering with our safe wrapper:</p>
                
                <div className="flex flex-wrap gap-4">
                  {['Home', 'Settings', 'User', 'Calendar', 'Check', 'X'].map(iconName => (
                    <div key={iconName} className="flex flex-col items-center">
                      <div className="p-2 border rounded">
                        <SafeIcon name={iconName} size={24} />
                      </div>
                      <span className="text-xs mt-1">{iconName}</span>
                    </div>
                  ))}
                </div>
                
                <Separator />
                
                <p>Dependencies detected:</p>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(dependencies).map(([name, status]) => (
                    <div key={name} className="text-sm">
                      <strong>{name}:</strong> {status}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Application State</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button 
                  onClick={() => {
                    localStorage.clear();
                    sessionStorage.clear();
                    alert('Storage cleared. Page will reload.');
                    window.location.reload();
                  }}
                  variant="destructive"
                >
                  Clear Local & Session Storage
                </Button>
                
                <Button 
                  onClick={() => {
                    window.location.href = '/';
                  }}
                >
                  Go to Home Page
                </Button>
                
                <Separator />
                
                <div>
                  <h3 className="font-semibold mb-2">Errors detected:</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {errors.map((err, i) => (
                      <li key={i} className="text-sm text-red-600">{err}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Diagnostics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button 
                  onClick={() => {
                    console.log('Running diagnostics...');
                    
                    // Check React
                    console.log('React loaded:', !!React, 'version:', React.version);
                    
                    // Check Router
                    console.log('Router routes:', routes);
                    
                    // Check error counts
                    console.log('Console errors:', window.__CONSOLE_ERROR_COUNT__ || 0);
                    
                    // Test lodash access - using proper import
                    console.log('Lodash available:', !!lodash);
                    
                    // Create error for testing
                    try {
                      window.__LAST_ERROR = null;
                      const testError = new Error('Test diagnostic error');
                      console.error('Test error:', testError);
                      window.__LAST_ERROR = testError.message;
                    } catch (e) {
                      console.error('Error creating test error:', e);
                    }
                    
                    alert('Diagnostics logged to console');
                    
                    // Force reload the page to update the error count
                    setTimeout(() => {
                      window.location.reload();
                    }, 1000);
                  }}
                >
                  Run Diagnostics
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => {
                    // Force update to React
                    console.log('Force updating React components...');
                    window.location.href = '/dashboard';
                  }}
                >
                  Force Navigation to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}

// Update global interface to include __LAST_ERROR
declare global {
  interface Window {
    __LAST_ERROR?: string | null;
    Recharts?: any;
  }
}
