
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CompanyDetailsView } from '@/components/clients/CompanyDetailsView';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { PageTransition } from '@/components/layout/PageTransition';
import MainLayout from '@/components/layout/MainLayout';

const CompanyDetails = () => {
  const { companyId } = useParams<{ companyId: string }>();
  const navigate = useNavigate();
  
  return (
    <MainLayout>
      <PageTransition>
        <div className="container mx-auto py-6 space-y-6">
          <Button
            variant="ghost"
            size="sm"
            className="mb-4 flex items-center gap-2"
            onClick={() => navigate('/customers')}
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Customers</span>
          </Button>
        
          <CompanyDetailsView companyId={companyId} />
        </div>
      </PageTransition>
    </MainLayout>
  );
};

export default CompanyDetails;
