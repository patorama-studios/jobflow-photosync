export type ClientStatus = 'active' | 'inactive';

export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  status: ClientStatus;
  company?: string;
  company_id?: string;
  photo_url?: string;
  created_at?: string;
  outstanding_jobs?: number;
  outstanding_payment?: number;
  total_jobs?: number;
}

// Simulated MySQL database storage using localStorage for persistence
class ClientService {
  private getStorageKey(): string {
    return 'mysql_clients';
  }

  private getSampleClients(): Client[] {
    return [
      {
        id: 'client-1',
        name: 'Sarah Johnson',
        email: 'sarah.johnson@sydneyrealestate.com.au',
        phone: '+61 2 9876 5432',
        status: 'active',
        company: 'Sydney Real Estate Co.',
        company_id: 'company-1',
        total_jobs: 12,
        outstanding_jobs: 3,
        outstanding_payment: 4500,
        created_at: '2024-01-15T00:00:00Z'
      },
      {
        id: 'client-2',
        name: 'Michael Chen',
        email: 'michael.chen@melbourneprops.com.au',
        phone: '+61 3 9876 5432',
        status: 'active',
        company: 'Melbourne Properties Ltd',
        company_id: 'company-2',
        total_jobs: 8,
        outstanding_jobs: 2,
        outstanding_payment: 2800,
        created_at: '2024-02-10T00:00:00Z'
      },
      {
        id: 'client-3',
        name: 'Lisa Williams',
        email: 'lisa.williams@brisbanedevelopments.com.au',
        phone: '+61 7 9876 5432',
        status: 'active',
        company: 'Brisbane Developments',
        company_id: 'company-3',
        total_jobs: 15,
        outstanding_jobs: 5,
        outstanding_payment: 7200,
        created_at: '2024-03-05T00:00:00Z'
      },
      {
        id: 'client-4',
        name: 'David Thompson',
        email: 'david.thompson@gmail.com',
        phone: '+61 4 9876 5432',
        status: 'active',
        total_jobs: 6,
        outstanding_jobs: 1,
        outstanding_payment: 1200,
        created_at: '2024-04-12T00:00:00Z'
      },
      {
        id: 'client-5',
        name: 'Emma Roberts',
        email: 'emma.roberts@perthproperty.com.au',
        phone: '+61 8 9876 5432',
        status: 'active',
        company: 'Perth Property Solutions',
        company_id: 'company-4',
        total_jobs: 10,
        outstanding_jobs: 4,
        outstanding_payment: 3600,
        created_at: '2024-05-18T00:00:00Z'
      }
    ];
  }

  async getAllClients(): Promise<Client[]> {
    try {
      console.log('🔧 ClientService: Fetching all clients from MySQL');
      
      const stored = localStorage.getItem(this.getStorageKey());
      if (stored) {
        const clients = JSON.parse(stored);
        console.log('🔧 ClientService: Found stored clients:', clients.length);
        return clients.filter((c: Client) => c.status === 'active');
      }
      
      console.log('🔧 ClientService: No stored clients, creating sample data');
      const sampleClients = this.getSampleClients();
      await this.saveClients(sampleClients);
      return sampleClients;
    } catch (error) {
      console.error('🔧 ClientService: Error fetching clients:', error);
      return this.getSampleClients();
    }
  }

  async getClientById(id: string): Promise<Client | null> {
    try {
      console.log('🔧 ClientService: Fetching client by ID:', id);
      const clients = await this.getAllClients();
      const client = clients.find(c => c.id === id);
      return client || null;
    } catch (error) {
      console.error('🔧 ClientService: Error fetching client by ID:', error);
      return null;
    }
  }

  async addClient(clientData: Omit<Client, 'id'>): Promise<Client | null> {
    try {
      console.log('🔧 ClientService: Adding new client:', clientData);
      
      const newClient: Client = {
        ...clientData,
        id: `client-${Date.now()}`,
        created_at: new Date().toISOString(),
        status: clientData.status || 'active',
        outstanding_jobs: 0,
        outstanding_payment: 0,
        total_jobs: 0
      };

      const clients = await this.getAllClients();
      clients.push(newClient);
      
      const success = await this.saveClients(clients);
      if (success) {
        console.log('🔧 ClientService: Client added successfully:', newClient.id);
        return newClient;
      }
      
      return null;
    } catch (error) {
      console.error('🔧 ClientService: Error adding client:', error);
      return null;
    }
  }

  async updateClient(id: string, updates: Partial<Client>): Promise<Client | null> {
    try {
      console.log('🔧 ClientService: Updating client:', { id, updates });
      
      const clients = await this.getAllClients();
      const clientIndex = clients.findIndex(c => c.id === id);
      
      if (clientIndex === -1) {
        console.error('🔧 ClientService: Client not found for update:', id);
        return null;
      }

      clients[clientIndex] = {
        ...clients[clientIndex],
        ...updates
      };

      const success = await this.saveClients(clients);
      if (success) {
        console.log('🔧 ClientService: Client updated successfully');
        return clients[clientIndex];
      }
      
      return null;
    } catch (error) {
      console.error('🔧 ClientService: Error updating client:', error);
      return null;
    }
  }

  async searchClients(query: string): Promise<Client[]> {
    try {
      console.log('🔧 ClientService: Searching clients:', query);
      
      if (!query || query.length < 2) return [];
      
      const clients = await this.getAllClients();
      const searchTerm = query.toLowerCase();
      
      const results = clients.filter(client => 
        client.name.toLowerCase().includes(searchTerm) ||
        client.email.toLowerCase().includes(searchTerm) ||
        (client.company && client.company.toLowerCase().includes(searchTerm))
      ).slice(0, 10); // Limit to 10 results
      
      console.log('🔧 ClientService: Search results:', results.length);
      return results;
    } catch (error) {
      console.error('🔧 ClientService: Error searching clients:', error);
      return [];
    }
  }

  async deleteClient(id: string): Promise<boolean> {
    try {
      console.log('🔧 ClientService: Deleting client:', id);
      
      const clients = await this.getAllClients();
      const clientIndex = clients.findIndex(c => c.id === id);
      
      if (clientIndex !== -1) {
        // Soft delete by marking as inactive
        clients[clientIndex].status = 'inactive';
        
        const success = await this.saveClients(clients);
        if (success) {
          console.log('🔧 ClientService: Client deleted successfully');
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error('🔧 ClientService: Error deleting client:', error);
      return false;
    }
  }

  private async saveClients(clients: Client[]): Promise<boolean> {
    try {
      // Simulate database save with a delay
      await new Promise(resolve => setTimeout(resolve, 200));
      
      localStorage.setItem(this.getStorageKey(), JSON.stringify(clients));
      return true;
    } catch (error) {
      console.error('🔧 ClientService: Error saving clients:', error);
      return false;
    }
  }
}

export const clientService = new ClientService();