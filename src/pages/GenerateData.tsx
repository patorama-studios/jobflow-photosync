
import React from 'react';
import { PageTransition } from '@/components/layout/PageTransition';
import MainLayout from '@/components/layout/MainLayout';

const GenerateData = () => {
  return (
    <MainLayout>
      <PageTransition>
        <div className="container py-8">
          <h1 className="text-3xl font-bold mb-6">Generate Test Data</h1>
          <p className="text-muted-foreground mb-8">
            Use this page to generate test data for development purposes.
          </p>
          
          {/* Data generation controls would go here */}
          <div className="bg-card rounded-lg p-6 shadow-sm border">
            <p>Data generation controls will be implemented here.</p>
          </div>
        </div>
      </PageTransition>
    </MainLayout>
  );
};

export default GenerateData;
