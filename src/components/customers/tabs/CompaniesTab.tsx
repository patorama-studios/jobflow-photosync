
import React from "react";
import { Company } from "@/hooks/use-companies";

interface CompaniesTabProps {
  companies: Company[];
  isLoading: boolean;
  error: Error | null;
  searchQuery: string;
  handleCompanyClick: (companyId: string) => void;
}

export function CompaniesTab({
  companies,
  isLoading,
  error,
  searchQuery,
  handleCompanyClick
}: CompaniesTabProps) {
  // Filter companies based on search query
  const filteredCompanies = companies.filter(company => 
    company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (company.industry && company.industry.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (company.email && company.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            <th className="text-left px-4 py-3">Company</th>
            <th className="text-left px-4 py-3">Contact</th>
            <th className="text-left px-4 py-3">Industry</th>
            <th className="text-right px-4 py-3">Total Jobs</th>
            <th className="text-right px-4 py-3">Open Jobs</th>
            <th className="text-right px-4 py-3">Revenue</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={6} className="text-center py-8">Loading companies...</td>
            </tr>
          ) : error ? (
            <tr>
              <td colSpan={6} className="text-center py-8 text-red-500">Error loading companies</td>
            </tr>
          ) : filteredCompanies.length > 0 ? (
            filteredCompanies.map((company) => (
              <tr 
                key={company.id} 
                className="border-b hover:bg-muted/50 cursor-pointer"
                onClick={() => handleCompanyClick(company.id)}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden">
                      {company.logo_url && (
                        <img 
                          src={company.logo_url} 
                          alt={company.name}
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>
                    <span className="font-medium">{company.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div>
                    <div>{company.email || '-'}</div>
                    <div className="text-sm text-muted-foreground">{company.phone || '-'}</div>
                  </div>
                </td>
                <td className="px-4 py-3">{company.industry || 'Real Estate'}</td>
                <td className="px-4 py-3 text-right">{company.total_jobs || 0}</td>
                <td className="px-4 py-3 text-right">{company.open_jobs || 0}</td>
                <td className="px-4 py-3 text-right">${(company.total_revenue || 0).toLocaleString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="text-center py-8">
                <p className="text-muted-foreground">No companies found. Try adjusting your search.</p>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
