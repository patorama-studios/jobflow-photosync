
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ClientDetailsView } from '@/components/clients/ClientDetailsView';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { PageTransition } from '@/components/layout/PageTransition';
import { useClients, Client as ClientType } from '@/hooks/use-clients';
import { Skeleton } from '@/components/ui/skeleton';

const ClientPage = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { clients } = useClients();

  // Find the client data from the clients hook instead of mocking it
  const clientData = clients.find(client => client.id === clientId);

  useEffect(() => {
    // Set loading state based on whether we found the client
    if (clientId) {
      if (clients.length > 0) {
        setIsLoading(false);
        if (!clientData) {
          setError('Client not found');
        }
      }
    } else {
      setError('Client ID not provided');
      setIsLoading(false);
    }
  }, [clientId, clients, clientData]);

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
          <h1 className="text-3xl font-semibold">
            {isLoading ? 'Loading...' : clientData?.name}
          </h1>
        </div>
        
        {isLoading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-muted rounded-md"></div>
            <div className="h-64 bg-muted rounded-md"></div>
            <div className="h-64 bg-muted rounded-md"></div>
          </div>
        ) : (
          <ClientDetailsView clientId={clientId} />
        )}
      </div>
    </PageTransition>
  );
};

export default ClientPage;
