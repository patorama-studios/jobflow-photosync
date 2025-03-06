
import React, { useState } from 'react';
import { verifyRouterNesting, verifyProviderNesting } from '../../utils/code-verification';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface VerificationResult {
  valid: boolean;
  issues: string[];
}

export function CodeVerifier() {
  const [code, setCode] = useState('');
  const [results, setResults] = useState<{ router: VerificationResult; provider: VerificationResult } | null>(null);

  const verifyCode = () => {
    const routerCheck = verifyRouterNesting(code);
    const providerCheck = verifyProviderNesting(code);
    setResults({ router: routerCheck, provider: providerCheck });
  };

  const allValid = results && results.router.valid && results.provider.valid;

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Code Verifier</CardTitle>
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
              </>
            )}
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
