
import React from 'react';
import { Button } from '@/components/ui/button';
import { CompanyCard } from './CompanyCard';
import { Building2, Grid, ListFilter, Plus, Table } from 'lucide-react';

interface Company {
  id: string;
  name: string;
  industry: string;
  email?: string;
  phone?: string;
  total_jobs?: number;
  open_jobs?: number;
}

interface CompanyListProps {
  companies: Company[];
  isLoading?: boolean;
  onAddCompany?: () => void;
}

export function CompanyList({ companies, isLoading, onAddCompany }: CompanyListProps) {
  const [viewMode, setViewMode] = React.useState<'table' | 'card'>('card');
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading companies...</p>
      </div>
    );
  }
  
  if (companies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 border rounded-lg">
        <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Companies Yet</h3>
        <p className="text-muted-foreground mb-4">Get started by adding your first company</p>
        {onAddCompany && (
          <Button onClick={onAddCompany}>
            <Plus className="mr-2 h-4 w-4" />
            Add Company
          </Button>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Companies ({companies.length})</h2>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setViewMode('table')}
            className={viewMode === 'table' ? 'bg-muted' : ''}
          >
            <Table className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline"
            size="sm" 
            onClick={() => setViewMode('card')}
            className={viewMode === 'card' ? 'bg-muted' : ''}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm">
            <ListFilter className="h-4 w-4" />
          </Button>
          {onAddCompany && (
            <Button size="sm" onClick={onAddCompany}>
              <Plus className="mr-2 h-4 w-4" />
              Add Company
            </Button>
          )}
        </div>
      </div>
      
      {viewMode === 'card' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {companies.map((company) => (
            <CompanyCard key={company.id} company={company} />
          ))}
        </div>
      ) : (
        <div className="border rounded-md">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-3 font-medium">Name</th>
                <th className="text-left p-3 font-medium">Industry</th>
                <th className="text-left p-3 font-medium">Jobs</th>
                <th className="text-left p-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {companies.map((company) => (
                <tr key={company.id} className="border-t">
                  <td className="p-3">{company.name}</td>
                  <td className="p-3">{company.industry}</td>
                  <td className="p-3">{company.total_jobs || 0} ({company.open_jobs || 0} open)</td>
                  <td className="p-3">
                    <Button variant="link" size="sm">View</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
