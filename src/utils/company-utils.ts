
import { Company, CompanyResponse } from '@/types/company-types';

// Convert database response to Company type
export function mapCompanyResponse(company: CompanyResponse): Company {
  return {
    id: company.id,
    name: company.name,
    email: company.email || undefined,
    phone: company.phone || undefined,
    address: company.address || undefined,
    city: company.city || undefined,
    state: company.state || undefined,
    zip: company.zip || undefined,
    website: company.website || undefined,
    industry: company.industry,
    logo_url: company.logo_url || undefined,
    created_at: company.created_at,
    status: (company.status === 'active' || company.status === 'inactive') 
      ? company.status 
      : 'active',
    open_jobs: company.open_jobs || 0,
    total_jobs: company.total_jobs || 0,
    outstanding_amount: company.outstanding_amount || 0,
    total_revenue: company.total_revenue || 0
  };
}
