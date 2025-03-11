import React, { useEffect, useState } from 'react';
import { useCompanies } from '@/hooks/use-companies';
import { CompanyCard } from './CompanyCard';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export const CompanyList: React.FC = () => {
  const { companies, isLoading, error, refetch } = useCompanies();
  const { toast } = useToast();
  const [filteredCompanies, setFilteredCompanies] = useState(companies || []);

  useEffect(() => {
    if (companies) {
      setFilteredCompanies(companies);
    }
  }, [companies]);

  const handleRefresh = () => {
    toast({
      title: "Refreshing companies",
      description: "Getting the latest company data...",
    });
    refetch();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Companies</h2>
        <Button onClick={handleRefresh} variant="outline" size="sm">
          Refresh
        </Button>
      </div>

      {error && (
        <div className="text-red-500 p-4 border border-red-200 rounded-md">
          {error.message || "An error occurred loading companies"}
        </div>
      )}

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCompanies.map((company) => (
            <CompanyCard key={company.id} company={company} />
          ))}
        </div>
      )}

      <Button variant="primary" className="flex items-center gap-2">
        <Plus className="h-4 w-4" />
        New Company
      </Button>
    </div>
  );
};
