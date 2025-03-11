
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useCompanies } from '@/hooks/use-companies';
import { CompanyOverviewContent } from '@/components/clients/company-details/CompanyOverviewContent';
import { CompanyHeader } from '@/components/clients/company-details/CompanyHeader';
import { CompanyDetailsLoading } from '@/components/clients/company-details/CompanyDetailsLoading';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface CompanyDetailsViewProps {
  companyId: string;
}

export const CompanyDetailsView: React.FC<CompanyDetailsViewProps> = ({ companyId }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [company, setCompany] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { companies, refetch } = useCompanies();
  
  useEffect(() => {
    const fetchCompany = async () => {
      try {
        setIsLoading(true);
        
        // Fetch the company by ID from Supabase
        const { data, error } = await supabase
          .from('companies')
          .select('*')
          .eq('id', companyId)
          .single();
          
        if (error) throw error;
        
        if (data) {
          setCompany(data);
        } else {
          // If not found, try to find in the local companies array
          const companyFromCache = companies.find(c => c.id === companyId);
          if (companyFromCache) {
            setCompany(companyFromCache);
          } else {
            throw new Error('Company not found');
          }
        }
      } catch (err) {
        console.error('Error fetching company:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch company details'));
        toast.error("Failed to load company details");
      } finally {
        setIsLoading(false);
      }
    };
    
    if (companyId) {
      fetchCompany();
    }
  }, [companyId, companies]);
  
  if (isLoading) {
    return <CompanyDetailsLoading />;
  }
  
  if (error || !company) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-700">
          <h2 className="text-lg font-semibold">Error Loading Company</h2>
          <p>{error?.message || 'Company not found'}</p>
          <Button 
            variant="outline" 
            className="mt-2"
            onClick={() => window.history.back()}
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <CompanyHeader company={company} />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 w-full max-w-md">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="clients">Clients</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-6">
          <CompanyOverviewContent company={company} />
        </TabsContent>
        
        <TabsContent value="clients" className="mt-6">
          <div className="rounded-md border p-6">
            <h3 className="text-lg font-medium">Clients</h3>
            <p className="text-muted-foreground">
              This company has no clients yet.
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="billing" className="mt-6">
          <div className="rounded-md border p-6">
            <h3 className="text-lg font-medium">Billing Information</h3>
            <p className="text-muted-foreground">
              No billing information available.
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="settings" className="mt-6">
          <div className="rounded-md border p-6">
            <h3 className="text-lg font-medium">Company Settings</h3>
            <p className="text-muted-foreground">
              Settings will appear here.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
