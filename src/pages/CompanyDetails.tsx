
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CompanyDetailsView } from '@/components/clients/CompanyDetailsView';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { PageTransition } from '@/components/layout/PageTransition';

const CompanyDetailsPage = () => {
  const { companyId } = useParams<{ companyId: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [companyData, setCompanyData] = useState(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // In a real application, this would fetch company data from an API
    // For now, we'll simulate a successful fetch after a delay
    const timer = setTimeout(() => {
      if (companyId) {
        setCompanyData({
          id: companyId,
          name: 'Acme Real Estate',
          email: 'info@acme-realty.com',
          phone: '(555) 987-6543',
          address: '123 Main St, Suite 100',
          city: 'Austin',
          state: 'TX',
          zip: '78701',
          website: 'https://acme-realty.com',
          createdAt: new Date().toISOString(),
          status: 'active',
          totalOrders: 24,
          activeOrders: 5
        });
        setIsLoading(false);
      } else {
        setError('Company ID not found');
        setIsLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [companyId]);

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
              Back to Companies
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
            Back to Companies
          </Button>
          <h1 className="text-3xl font-semibold">{isLoading ? 'Loading...' : companyData?.name}</h1>
        </div>
        
        {isLoading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-muted rounded-md"></div>
            <div className="h-64 bg-muted rounded-md"></div>
            <div className="h-64 bg-muted rounded-md"></div>
          </div>
        ) : (
          <CompanyDetailsView company={companyData} />
        )}
      </div>
    </PageTransition>
  );
};

export default CompanyDetailsPage;
