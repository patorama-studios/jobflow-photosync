
import React, { useState, useEffect } from 'react';
import { verifyRouterNesting, verifyProviderNesting, verifyComponentUsage } from '../../utils/code-verification';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { CheckCircle, AlertCircle, FileCode, LayoutDashboard, RefreshCcw } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

// Define our own version of VerificationResult to match the expected structure
interface FileIssue {
  message: string;
  line?: number;
  severity: string;
}

interface FileIssues {
  file: string;
  issues: FileIssue[];
}

interface LocalVerificationResult {
  valid: boolean;
  issues: string[];
}

// New component to check the current page for issues
const PageChecker: React.FC = () => {
  const [pageIssues, setPageIssues] = useState<string[]>([]);
  const [checking, setChecking] = useState(false);
  
  const checkCurrentPage = () => {
    setChecking(true);
    
    try {
      // Get the page's HTML
      const html = document.documentElement.outerHTML;
      
      // Run verifications
      const routerCheck = verifyRouterNesting();
      const providerCheck = verifyProviderNesting();
      const componentCheck = verifyComponentUsage();
      
      // Combine issues
      const allIssues = [
        ...routerCheck.issues.flatMap(issue => issue.issues.map(i => `${issue.file}: ${i.message}`)),
        ...providerCheck.issues.flatMap(issue => issue.issues.map(i => `${issue.file}: ${i.message}`)),
        ...componentCheck.issues.flatMap(issue => issue.issues.map(i => `${issue.file}: ${i.message}`))
      ];
      
      setPageIssues(allIssues);
    } catch (error) {
      console.error('Error checking page:', error);
      setPageIssues(['Error checking page: ' + (error instanceof Error ? error.message : String(error))]);
    } finally {
      setChecking(false);
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <LayoutDashboard className="mr-2 h-5 w-5" />
          Current Page Check
        </CardTitle>
        <CardDescription>
          Check the current page for potential issues
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button 
          onClick={checkCurrentPage} 
          disabled={checking}
          className="mb-4"
        >
          {checking ? (
            <>
              <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
              Checking...
            </>
          ) : (
            <>
              <RefreshCcw className="mr-2 h-4 w-4" />
              Check Current Page
            </>
          )}
        </Button>
        
        {pageIssues.length > 0 ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Page Issues</AlertTitle>
            <AlertDescription>
              <ul className="list-disc pl-5 mt-2">
                {pageIssues.map((issue, i) => (
                  <li key={i}>{issue}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        ) : pageIssues.length === 0 && checking === false ? (
          <Alert variant="default" className="bg-green-50 border-green-200 text-green-800">
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>No issues detected</AlertTitle>
            <AlertDescription>The current page looks good!</AlertDescription>
          </Alert>
        ) : null}
      </CardContent>
    </Card>
  );
};

// Code verifier component
export function CodeVerifier() {
  const [code, setCode] = useState('');
  const [results, setResults] = useState<{ 
    router: LocalVerificationResult; 
    provider: LocalVerificationResult;
    component: LocalVerificationResult;
  } | null>(null);

  const verifyCode = () => {
    // Convert the complex verification results to our simplified format
    const simplifyResults = (result: any): LocalVerificationResult => {
      return {
        valid: result.valid,
        issues: result.issues.flatMap((issue: any) => 
          issue.issues.map((i: any) => `${issue.file}: ${i.message}`)
        )
      };
    };
    
    const routerCheck = verifyRouterNesting();
    const providerCheck = verifyProviderNesting();
    const componentCheck = verifyComponentUsage();
    
    setResults({ 
      router: simplifyResults(routerCheck), 
      provider: simplifyResults(providerCheck), 
      component: simplifyResults(componentCheck) 
    });
  };

  const allValid = results && 
    results.router.valid && 
    results.provider.valid && 
    results.component.valid;

  // Auto-verification on component mount
  useEffect(() => {
    console.log('[CodeVerifier] Running automated verification on page load...');
    
    try {
      // Get the page's HTML for basic checks
      const html = document.documentElement.outerHTML;
      
      const routerCheck = verifyRouterNesting();
      const providerCheck = verifyProviderNesting();
      
      if (!routerCheck.valid) {
        console.warn('[CodeVerifier] Router issues detected:', routerCheck.issues);
      }
      
      if (!providerCheck.valid) {
        console.warn('[CodeVerifier] Provider issues detected:', providerCheck.issues);
      }
      
      // Advanced runtime checks
      if (typeof window !== 'undefined') {
        // Check for React Router context
        console.log('[CodeVerifier] Checking React Router context...');
        
        // Monitor for console errors
        const originalConsoleError = console.error;
        console.error = function(...args) {
          if (args[0] && typeof args[0] === 'string') {
            if (args[0].includes('useNavigate()') || 
                args[0].includes('useLocation()') || 
                args[0].includes('useParams()')) {
              console.warn('[CodeVerifier] React Router hook used outside Router context detected!');
            }
            
            if (args[0].includes('Context.Provider')) {
              console.warn('[CodeVerifier] Potential Context issue detected!');
            }
          }
          originalConsoleError.apply(console, args);
        };
        
        // Restore original after 5 seconds
        setTimeout(() => {
          console.error = originalConsoleError;
          console.log('[CodeVerifier] Error monitoring completed');
        }, 5000);
      }
    } catch (error) {
      console.error('[CodeVerifier] Error running automated verification:', error);
    }
  }, []);

  return (
    <Tabs defaultValue="code-checker" className="w-full max-w-4xl mx-auto">
      <TabsList className="mb-4">
        <TabsTrigger value="code-checker">Code Checker</TabsTrigger>
        <TabsTrigger value="page-checker">Page Checker</TabsTrigger>
      </TabsList>
      
      <TabsContent value="code-checker">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileCode className="mr-2 h-5 w-5" />
              Code Verifier
            </CardTitle>
            <CardDescription>
              Paste your code to check for common React, Router, and Provider issues
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea 
              value={code} 
              onChange={(e) => setCode(e.target.value)}
              placeholder="Paste your TSX/JSX code here..."
              className="min-h-[300px] font-mono text-sm"
            />
          </CardContent>
          <CardFooter className="flex flex-col items-start gap-4">
            <Button onClick={verifyCode}>Verify Code</Button>
            
            {results && (
              <div className="w-full space-y-4">
                {allValid ? (
                  <Alert variant="default" className="bg-green-50 border-green-200 text-green-800">
                    <CheckCircle className="h-4 w-4" />
                    <AlertTitle>All checks passed!</AlertTitle>
                    <AlertDescription>No issues detected in your code.</AlertDescription>
                  </Alert>
                ) : (
                  <>
                    {!results.router.valid && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Router Issues</AlertTitle>
                        <AlertDescription>
                          <ul className="list-disc pl-5 mt-2">
                            {results.router.issues.map((issue, i) => (
                              <li key={i}>{issue}</li>
                            ))}
                          </ul>
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    {!results.provider.valid && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Provider Issues</AlertTitle>
                        <AlertDescription>
                          <ul className="list-disc pl-5 mt-2">
                            {results.provider.issues.map((issue, i) => (
                              <li key={i}>{issue}</li>
                            ))}
                          </ul>
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    {!results.component.valid && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Component Issues</AlertTitle>
                        <AlertDescription>
                          <ul className="list-disc pl-5 mt-2">
                            {results.component.issues.map((issue, i) => (
                              <li key={i}>{issue}</li>
                            ))}
                          </ul>
                        </AlertDescription>
                      </Alert>
                    )}
                  </>
                )}
              </div>
            )}
          </CardFooter>
        </Card>
      </TabsContent>
      
      <TabsContent value="page-checker">
        <PageChecker />
      </TabsContent>
    </Tabs>
  );
}
