
import React from 'react';
import { CodeVerifier } from '../components/dev/CodeVerifier';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useHeaderSettings } from '../hooks/useHeaderSettings';

export default function Debug() {
  const { setTitle } = useHeaderSettings();
  
  React.useEffect(() => {
    setTitle('Debug Tools');
  }, [setTitle]);
  
  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6">Development Debug Tools</h1>
      
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
