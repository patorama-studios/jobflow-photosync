
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { PageTransition } from '@/components/layout/PageTransition';
import MainLayout from '@/components/layout/MainLayout';

// This page is being deprecated in favor of the Customers page
const Client = () => {
  const navigate = useNavigate();
  
  // Redirect to the new customers page
  React.useEffect(() => {
    navigate('/customers');
  }, [navigate]);
  
  return (
    <MainLayout>
      <PageTransition>
        <div className="container mx-auto py-6">
          <div className="flex items-center mb-6">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1 mr-4"
              onClick={() => navigate('/dashboard')}
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
            <h1 className="text-3xl font-semibold">Redirecting to Customers...</h1>
          </div>
          <p>You're being redirected to the new Customers page.</p>
          <Button 
            className="mt-4" 
            onClick={() => navigate('/customers')}
          >
            Go to Customers
          </Button>
        </div>
      </PageTransition>
    </MainLayout>
  );
};

export default Client;
