
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Company {
  id: string;
  name: string;
  industry: string;
  email?: string;
  phone?: string;
  total_jobs?: number;
  open_jobs?: number;
}

interface CompanyCardProps {
  company: Company;
}

export function CompanyCard({ company }: CompanyCardProps) {
  const navigate = useNavigate();
  
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="flex flex-col">
            <h3 className="text-lg font-semibold">{company.name}</h3>
            <p className="text-sm text-muted-foreground">{company.industry}</p>
            {company.email && (
              <p className="text-sm mt-2">{company.email}</p>
            )}
            {company.phone && (
              <p className="text-sm">{company.phone}</p>
            )}
          </div>
          <div className="bg-primary/10 p-2 rounded-full">
            <Building2 className="h-5 w-5 text-primary" />
          </div>
        </div>
        
        {(company.total_jobs !== undefined || company.open_jobs !== undefined) && (
          <div className="flex items-center gap-4 mt-4">
            {company.total_jobs !== undefined && (
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{company.total_jobs} Total Jobs</span>
              </div>
            )}
            {company.open_jobs !== undefined && company.open_jobs > 0 && (
              <div className="text-sm text-amber-600">
                {company.open_jobs} Open
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t p-4">
        <Button 
          variant="outline"
          className="w-full" 
          onClick={() => navigate(`/companies/${company.id}`)}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}
