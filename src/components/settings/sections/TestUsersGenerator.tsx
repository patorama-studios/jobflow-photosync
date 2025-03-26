
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon, AlertTriangleIcon, UserPlusIcon, LoaderIcon } from "lucide-react";
import { generateTestUsers } from '@/utils/generate-test-users';

export function TestUsersGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<{
    success: number;
    failures: number;
    generatedAt?: Date;
  } | null>(null);

  const handleGenerateUsers = async () => {
    if (isGenerating) return;
    
    setIsGenerating(true);
    try {
      const result = await generateTestUsers();
      setResult({
        success: result.success,
        failures: result.failures,
        generatedAt: new Date()
      });
    } catch (error) {
      console.error("Failed to generate test users:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Test Users</CardTitle>
        <CardDescription>
          Generate test users with different roles for testing
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Alert className="mb-4">
          <InfoIcon className="h-4 w-4" />
          <AlertTitle>Information</AlertTitle>
          <AlertDescription>
            This will create the following test users:
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong>Admin:</strong> admin@example.com</li>
              <li><strong>Photographer:</strong> photographer@example.com</li>
              <li><strong>Editor:</strong> editor@example.com</li>
              <li><strong>Finance:</strong> finance@example.com</li>
              <li><strong>Regular User:</strong> user@example.com</li>
            </ul>
            <p className="mt-2">All users have the password: <code>Password123!</code></p>
          </AlertDescription>
        </Alert>

        {result && (
          <Alert className={result.failures > 0 ? "mb-4 bg-amber-50" : "mb-4 bg-green-50"}>
            {result.failures > 0 ? <AlertTriangleIcon className="h-4 w-4 text-amber-600" /> : <InfoIcon className="h-4 w-4 text-green-600" />}
            <AlertTitle>Generation Results</AlertTitle>
            <AlertDescription>
              <p>{result.success} users created successfully.</p>
              {result.failures > 0 && (
                <p className="text-amber-600">{result.failures} users failed to create (they may already exist).</p>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                Generated at: {result.generatedAt?.toLocaleTimeString()}
              </p>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleGenerateUsers}
          disabled={isGenerating}
          className="w-full"
        >
          {isGenerating ? (
            <>
              <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
              Generating Users...
            </>
          ) : (
            <>
              <UserPlusIcon className="mr-2 h-4 w-4" />
              Generate Test Users
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
