export type CompanyStatus = 'active' | 'inactive';

export interface Company {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  status: CompanyStatus;
  industry: string;
  logo_url?: string;
  website?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  total_jobs?: number;
  open_jobs?: number;
  total_revenue?: number;
  outstanding_amount?: number;
  created_at: string;
}

// Simulated MySQL database storage using localStorage for persistence
class CompanyService {
  private getStorageKey(): string {
    return 'mysql_companies';
  }

  private getSampleCompanies(): Company[] {
    return [
      {
        id: 'company-1',
        name: 'Sydney Real Estate Co.',
        email: 'contact@sydneyrealestate.com.au',
        phone: '+61 2 9876 5432',
        status: 'active',
        industry: 'Real Estate',
        website: 'https://sydneyrealestate.com.au',
        address: '123 George Street',
        city: 'Sydney',
        state: 'NSW',
        zip: '2000',
        total_jobs: 45,
        open_jobs: 8,
        total_revenue: 125000,
        outstanding_amount: 15000,
        created_at: '2024-01-15T00:00:00Z'
      },
      {
        id: 'company-2',
        name: 'Melbourne Properties Ltd',
        email: 'info@melbourneprops.com.au',
        phone: '+61 3 9876 5432',
        status: 'active',
        industry: 'Real Estate',
        website: 'https://melbourneprops.com.au',
        address: '456 Collins Street',
        city: 'Melbourne',
        state: 'VIC',
        zip: '3000',
        total_jobs: 32,
        open_jobs: 5,
        total_revenue: 89000,
        outstanding_amount: 8500,
        created_at: '2024-02-10T00:00:00Z'
      },
      {
        id: 'company-3',
        name: 'Brisbane Developments',
        email: 'hello@brisbanedevelopments.com.au',
        phone: '+61 7 9876 5432',
        status: 'active',
        industry: 'Construction',
        address: '789 Queen Street',
        city: 'Brisbane',
        state: 'QLD',
        zip: '4000',
        total_jobs: 28,
        open_jobs: 12,
        total_revenue: 156000,
        outstanding_amount: 22000,
        created_at: '2024-03-05T00:00:00Z'
      },
      {
        id: 'company-4',
        name: 'Perth Property Solutions',
        email: 'contact@perthproperty.com.au',
        phone: '+61 8 9876 5432',
        status: 'active',
        industry: 'Real Estate',
        website: 'https://perthproperty.com.au',
        address: '321 Wellington Street',
        city: 'Perth',
        state: 'WA',
        zip: '6000',
        total_jobs: 19,
        open_jobs: 6,
        total_revenue: 67000,
        outstanding_amount: 9200,
        created_at: '2024-04-20T00:00:00Z'
      }
    ];
  }

  async getAllCompanies(): Promise<Company[]> {
    try {
      console.log('🔧 CompanyService: Fetching all companies from MySQL');
      
      const stored = localStorage.getItem(this.getStorageKey());
      if (stored) {
        const companies = JSON.parse(stored);
        console.log('🔧 CompanyService: Found stored companies:', companies.length);
        return companies.filter((c: Company) => c.status === 'active');
      }
      
      console.log('🔧 CompanyService: No stored companies, creating sample data');
      const sampleCompanies = this.getSampleCompanies();
      await this.saveCompanies(sampleCompanies);
      return sampleCompanies;
    } catch (error) {
      console.error('🔧 CompanyService: Error fetching companies:', error);
      return this.getSampleCompanies();
    }
  }

  async getCompanyById(id: string): Promise<Company | null> {
    try {
      console.log('🔧 CompanyService: Fetching company by ID:', id);
      const companies = await this.getAllCompanies();
      const company = companies.find(c => c.id === id);
      return company || null;
    } catch (error) {
      console.error('🔧 CompanyService: Error fetching company by ID:', error);
      return null;
    }
  }

  async addCompany(companyData: Omit<Company, 'id' | 'created_at'>): Promise<Company | null> {
    try {
      console.log('🔧 CompanyService: Adding new company:', companyData);
      
      const newCompany: Company = {
        ...companyData,
        id: `company-${Date.now()}`,
        created_at: new Date().toISOString(),
        status: companyData.status || 'active',
        total_jobs: 0,
        open_jobs: 0,
        total_revenue: 0,
        outstanding_amount: 0
      };

      const companies = await this.getAllCompanies();
      companies.push(newCompany);
      
      const success = await this.saveCompanies(companies);
      if (success) {
        console.log('🔧 CompanyService: Company added successfully:', newCompany.id);
        return newCompany;
      }
      
      return null;
    } catch (error) {
      console.error('🔧 CompanyService: Error adding company:', error);
      return null;
    }
  }

  async updateCompany(id: string, updates: Partial<Company>): Promise<Company | null> {
    try {
      console.log('🔧 CompanyService: Updating company:', { id, updates });
      
      const companies = await this.getAllCompanies();
      const companyIndex = companies.findIndex(c => c.id === id);
      
      if (companyIndex === -1) {
        console.error('🔧 CompanyService: Company not found for update:', id);
        return null;
      }

      companies[companyIndex] = {
        ...companies[companyIndex],
        ...updates
      };

      const success = await this.saveCompanies(companies);
      if (success) {
        console.log('🔧 CompanyService: Company updated successfully');
        return companies[companyIndex];
      }
      
      return null;
    } catch (error) {
      console.error('🔧 CompanyService: Error updating company:', error);
      return null;
    }
  }

  async searchCompanies(query: string): Promise<Company[]> {
    try {
      console.log('🔧 CompanyService: Searching companies:', query);
      
      if (!query || query.length < 2) return [];
      
      const companies = await this.getAllCompanies();
      const searchTerm = query.toLowerCase();
      
      const results = companies.filter(company => 
        company.name.toLowerCase().includes(searchTerm) ||
        (company.email && company.email.toLowerCase().includes(searchTerm)) ||
        company.industry.toLowerCase().includes(searchTerm)
      ).slice(0, 10); // Limit to 10 results
      
      console.log('🔧 CompanyService: Search results:', results.length);
      return results;
    } catch (error) {
      console.error('🔧 CompanyService: Error searching companies:', error);
      return [];
    }
  }

  async deleteCompany(id: string): Promise<boolean> {
    try {
      console.log('🔧 CompanyService: Deleting company:', id);
      
      const companies = await this.getAllCompanies();
      const companyIndex = companies.findIndex(c => c.id === id);
      
      if (companyIndex !== -1) {
        // Soft delete by marking as inactive
        companies[companyIndex].status = 'inactive';
        
        const success = await this.saveCompanies(companies);
        if (success) {
          console.log('🔧 CompanyService: Company deleted successfully');
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error('🔧 CompanyService: Error deleting company:', error);
      return false;
    }
  }

  private async saveCompanies(companies: Company[]): Promise<boolean> {
    try {
      // Simulate database save with a delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      localStorage.setItem(this.getStorageKey(), JSON.stringify(companies));
      return true;
    } catch (error) {
      console.error('🔧 CompanyService: Error saving companies:', error);
      return false;
    }
  }
}

export const companyService = new CompanyService();