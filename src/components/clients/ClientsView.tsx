
import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Plus, 
  Download, 
  Upload, 
  Building,
  LayoutGrid,
  LayoutList
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ClientTable } from "@/components/clients/ClientTable";
import { CompanyList } from "@/components/clients/CompanyList";
import { AddClientDialog } from "@/components/clients/AddClientDialog";
import { AddCompanyDialog } from "@/components/clients/AddCompanyDialog";
import { useClients } from "@/hooks/use-clients";
import { useCompanies } from "@/hooks/use-companies";
import { exportToCSV } from "@/utils/csv-export";
import { toast } from "sonner";

export function ClientsView() {
  const [activeTab, setActiveTab] = useState("clients");
  const [companyViewMode, setCompanyViewMode] = useState<'table' | 'card'>('table');
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Clients</h1>
          <p className="text-muted-foreground mt-1">
            Manage all your clients, teams and companies
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm" onClick={handleImport}>
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button 
            size="sm" 
            onClick={() => activeTab === "clients" ? null : setAddCompanyOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            {activeTab === "clients" ? "Add Client" : "Add Company"}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="clients" className="flex items-center gap-2">
            <span>Clients</span>
          </TabsTrigger>
          <TabsTrigger value="companies" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            <span>Companies</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="clients">
          <ClientTable />
        </TabsContent>
        
        <TabsContent value="companies">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle>Company Management</CardTitle>
                <div className="flex gap-2">
                  <Button 
                    variant={companyViewMode === 'table' ? 'default' : 'outline'} 
                    size="icon"
                    onClick={() => setCompanyViewMode('table')}
                  >
                    <LayoutList className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant={companyViewMode === 'card' ? 'default' : 'outline'} 
                    size="icon"
                    onClick={() => setCompanyViewMode('card')}
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CompanyList viewMode={companyViewMode} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <AddCompanyDialog 
        open={addCompanyOpen} 
        onOpenChange={setAddCompanyOpen} 
        onCompanyAdded={handleAddCompany} 
      />
    </div>
  );
}
