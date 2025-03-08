
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CompanyDetailsView } from '@/components/clients/CompanyDetailsView';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { PageTransition } from '@/components/layout/PageTransition';
import { MainLayout } from '@/components/layout/MainLayout';

const CompanyDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  return (
    <MainLayout>
      <PageTransition>
        <div className="container mx-auto py-6">
          <CompanyDetailsView companyId={id} />
        </div>
      </PageTransition>
    </MainLayout>
  );
};

export default CompanyDetails;
