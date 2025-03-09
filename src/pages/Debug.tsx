
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import MainLayout from '@/components/layout/MainLayout';

export default function Debug() {
  const [environment, setEnvironment] = useState('');
  const [routes, setRoutes] = useState<string[]>([]);
  const [loadedModules, setLoadedModules] = useState<string[]>([]);
  
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
                    console.log('React loaded:', !!React);
                    
                    // Check Router
                    console.log('Router routes:', routes);
                    
                    // Check error counts
                    console.log('Console errors:', window.__CONSOLE_ERROR_COUNT__ || 0);
                    
                    alert('Diagnostics logged to console');
                  }}
                >
                  Run Diagnostics
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
