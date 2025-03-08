
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useCompanies } from "@/hooks/use-companies";
import { PlusCircle, Search, FileDown, FileUp, Building2 } from "lucide-react";
import { AddCompanyDialog } from "./AddCompanyDialog";
import { toast } from "sonner";
import { exportToCSV } from "@/utils/csv-export";

interface CompanyListProps {
  viewMode?: 'table' | 'card';
}

export function CompanyList({ viewMode = 'table' }: CompanyListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [addCompanyOpen, setAddCompanyOpen] = useState(false);
  const navigate = useNavigate();
  
  const { companies, isLoading, error, addCompany } = useCompanies();
  
  const filteredCompanies = companies.filter(
    company => 
      company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (company.email || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRowClick = (companyId: string) => {
    navigate(`/company/${companyId}`);
  };

  const handleAddCompany = async (company) => {
    try {
      const newCompany = await addCompany(company);
      toast.success("Company added successfully");
      
      if (newCompany && newCompany.id) {
        setTimeout(() => {
          navigate(`/company/${newCompany.id}`);
        }, 200);
      }
      
      return true;
    } catch (error) {
      console.error("Error adding company:", error);
      return false;
    }
  };

  const handleExport = () => {
    if (filteredCompanies.length === 0) {
      toast.info("No companies to export");
      return;
    }
    
    const exportData = filteredCompanies.map(company => ({
      ID: company.id,
      Name: company.name,
      Email: company.email || '',
      Phone: company.phone || '',
      Industry: company.industry,
      'Created Date': new Date(company.created_at).toLocaleDateString(),
      Status: company.status,
      'Total Jobs': company.total_jobs,
      'Open Jobs': company.open_jobs,
      'Outstanding Amount': company.outstanding_amount,
      'Total Revenue': company.total_revenue
    }));
    
    exportToCSV(exportData, 'companies-export');
    toast.success(`Exported ${exportData.length} companies`);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';
    
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      if (!target.files || target.files.length === 0) return;
      
      const file = target.files[0];
      const reader = new FileReader();
      
      reader.onload = async (event) => {
        try {
          const csvData = event.target?.result as string;
          toast.success(`Import started: ${file.name} (${Math.round(file.size / 1024)} KB)`);
          toast.info("CSV import functionality would process the data here");
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

  if (error) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Company Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-red-500">
            Error loading companies: {error}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Use the viewMode prop to determine how to display the companies
  if (viewMode === 'card') {
    // Card view implementation could go here
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Company Management (Card View)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-40 w-full" />
              ))
            ) : filteredCompanies.length === 0 ? (
              <div className="col-span-full text-center py-4 text-muted-foreground">
                No companies found
              </div>
            ) : (
              filteredCompanies.map(company => (
                <Card 
                  key={company.id} 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleRowClick(company.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Building2 className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{company.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {company.email || 'No email'}
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>Industry: {company.industry}</div>
                      <div>Status: <Badge variant={company.status === 'active' ? 'default' : 'secondary'}>{company.status}</Badge></div>
                      <div>Open Jobs: {company.open_jobs}</div>
                      <div>Outstanding: ${company.outstanding_amount.toFixed(2)}</div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Default table view
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Company Management</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Search and Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search companies..."
              className="pl-8 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2 w-full sm:w-auto">
            <Button 
              variant="default" 
              onClick={() => setAddCompanyOpen(true)}
              className="w-full sm:w-auto"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Company
            </Button>
            <Button 
              variant="outline" 
              onClick={handleExport}
              className="w-full sm:w-auto"
            >
              <FileDown className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button 
              variant="outline" 
              onClick={handleImport}
              className="w-full sm:w-auto"
            >
              <FileUp className="h-4 w-4 mr-2" />
              Import
            </Button>
          </div>
        </div>
        
        {/* Companies Table */}
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : (
          <>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Company</TableHead>
                    <TableHead>Industry</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Open Jobs</TableHead>
                    <TableHead className="text-right">Outstanding</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCompanies.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                        No companies found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCompanies.map((company) => (
                      <TableRow 
                        key={company.id} 
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => handleRowClick(company.id)}
                      >
                        <TableCell>
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                              <Building2 className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <div className="font-medium">{company.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {company.email || 'No email'}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{company.industry}</TableCell>
                        <TableCell>
                          <Badge variant={company.status === 'active' ? 'default' : 'secondary'}>
                            {company.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{company.open_jobs}</TableCell>
                        <TableCell className="text-right">
                          ${company.outstanding_amount.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              Showing {filteredCompanies.length} of {companies.length} companies
            </div>
          </>
        )}
        
        {/* Add Company Dialog */}
        <AddCompanyDialog 
          open={addCompanyOpen} 
          onOpenChange={setAddCompanyOpen} 
          onCompanyAdded={handleAddCompany} 
        />
      </CardContent>
    </Card>
  );
}
