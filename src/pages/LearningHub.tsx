
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageTransition } from '@/components/layout/PageTransition';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const LearningHub = () => {
  return (
    <MainLayout>
      <PageTransition>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">Learning Hub</h1>
          
          <Card>
            <CardHeader>
              <CardTitle>Welcome to the Learning Hub</CardTitle>
              <CardDescription>Discover resources to help you get the most out of our platform</CardDescription>
            </CardHeader>
            <CardContent>
              <p>The learning hub content will be available here soon.</p>
            </CardContent>
          </Card>
        </div>
      </PageTransition>
    </MainLayout>
  );
};

export default LearningHub;
