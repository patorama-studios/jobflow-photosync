
import { useState } from "react";
import { ClientsHeader } from "@/components/clients/header/ClientsHeader";
import { ClientsTabContent } from "@/components/clients/tabs/ClientsTabContent";
import { AddCompanyDialog } from "@/components/clients/AddCompanyDialog";
import { useCompanies } from "@/hooks/use-companies";
import { useClients } from "@/hooks/use-clients";
import { exportToCSV } from "@/utils/csv-export";
import { toast } from "sonner";

export function ClientsView() {
  const [activeTab, setActiveTab] = useState("clients");
  const [addCompanyOpen, setAddCompanyOpen] = useState(false);
  
  const { clients } = useClients();
  const { companies, addCompany } = useCompanies();

  const handleAddCompany = async (company: any) => {
    await addCompany(company);
    setAddCompanyOpen(false);
  };

  const handleExport = () => {
    if (activeTab === "clients") {
      // Export clients
      if (clients.length === 0) {
        toast.info("No clients to export");
        return;
      }
      
      const exportData = clients.map(client => ({
        ID: client.id,
        Name: client.name,
        Email: client.email,
        Phone: client.phone || '',
        Company: client.company || '',
        'Created Date': new Date(client.created_at).toLocaleDateString(),
        Status: client.status,
        'Total Jobs': client.total_jobs,
        'Outstanding Jobs': client.outstanding_jobs,
        'Outstanding Payment': client.outstanding_payment
      }));
      exportToCSV(exportData, 'clients-export');
      toast.success(`Exported ${exportData.length} clients`);
    } else {
      // Export companies
      if (companies.length === 0) {
        toast.info("No companies to export");
        return;
      }
      
      const exportData = companies.map(company => ({
        ID: company.id,
        Name: company.name,
        Email: company.email || '',
        Phone: company.phone || '',
        Website: company.website || '',
        Industry: company.industry || '',
        Address: [company.address, company.city, company.state, company.zip].filter(Boolean).join(', '),
        'Created Date': new Date(company.created_at).toLocaleDateString(),
        Status: company.status,
        'Open Jobs': company.open_jobs,
        'Total Jobs': company.total_jobs,
        'Outstanding Amount': company.outstanding_amount,
        'Total Revenue': company.total_revenue
      }));
      exportToCSV(exportData, 'companies-export');
      toast.success(`Exported ${exportData.length} companies`);
    }
  };

  const handleImport = () => {
    // Create a file input element
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';
    
    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (!target.files || target.files.length === 0) return;
      
      const file = target.files[0];
      const reader = new FileReader();
      
      reader.onload = async (event) => {
        try {
          const csvData = event.target?.result as string;
          // For demonstration, just show a toast with the file name
          toast.success(`Import started: ${file.name} (${Math.round(file.size / 1024)} KB)`);
          toast.info(`Importing ${activeTab === "clients" ? "clients" : "companies"} from CSV`);
          console.log("CSV data to process:", csvData.substring(0, 100) + "...");
        } catch (error: any) {
          toast.error(`Import failed: ${error.message || 'Unknown error'}`);
        }
      };
      
      reader.onerror = () => {
        toast.error("Failed to read the file");
      };
      
      reader.readAsText(file);
    };
    
    input.click();
  };
  
  return (
    <div className="space-y-6">
      <ClientsHeader 
        activeTab={activeTab}
        onImport={handleImport}
        onExport={handleExport}
        onAddCompany={() => setAddCompanyOpen(true)}
      />

      <ClientsTabContent 
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      
      <AddCompanyDialog 
        open={addCompanyOpen} 
        onOpenChange={setAddCompanyOpen} 
        onCompanyAdded={handleAddCompany} 
      />
    </div>
  );
}
