
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ClientDetailsView } from '@/components/clients/ClientDetailsView';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { PageTransition } from '@/components/layout/PageTransition';

const ClientPage = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [clientData, setClientData] = useState(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // In a real application, this would fetch client data
    // For now, we'll simulate a successful fetch after a delay
    const timer = setTimeout(() => {
      if (clientId) {
        setClientData({
          id: clientId,
          name: 'John Doe',
          email: 'john.doe@example.com',
          phone: '(555) 123-4567',
          company: 'Example Realty',
          createdAt: new Date().toISOString(),
          status: 'active'
        });
        setIsLoading(false);
      } else {
        setError('Client ID not found');
        setIsLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [clientId]);

  if (error) {
    return (
      <PageTransition>
        <div className="container mx-auto py-6">
          <div className="flex items-center mb-6">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1 mr-4"
              onClick={() => navigate('/customers')}
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Clients
            </Button>
            <h1 className="text-3xl font-semibold">Error</h1>
          </div>
          <div className="bg-destructive/10 text-destructive p-4 rounded-md">
            {error}
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="container mx-auto py-6">
        <div className="flex items-center mb-6">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1 mr-4"
            onClick={() => navigate('/customers')}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Clients
          </Button>
          <h1 className="text-3xl font-semibold">{isLoading ? 'Loading...' : clientData?.name}</h1>
        </div>
        
        {isLoading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-muted rounded-md"></div>
            <div className="h-64 bg-muted rounded-md"></div>
            <div className="h-64 bg-muted rounded-md"></div>
          </div>
        ) : (
          <ClientDetailsView client={clientData} />
        )}
      </div>
    </PageTransition>
  );
};

export default ClientPage;
