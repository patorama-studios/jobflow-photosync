
import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Search, 
  Filter, 
  Building,
  Calendar,
  DollarSign,
  ChevronRight,
  Plus,
  Download
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useCompanies } from "@/hooks/use-companies";
import { AddCompanyDialog } from "@/components/clients/AddCompanyDialog";
import { exportToCSV } from "@/utils/csv-export";
import { Skeleton } from "@/components/ui/skeleton";

interface CompanyListProps {
  viewMode: 'table' | 'card';
}

export function CompanyList({ viewMode }: CompanyListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [addCompanyOpen, setAddCompanyOpen] = useState(false);
  
  const { companies, isLoading, error, addCompany } = useCompanies();
  
  const filteredCompanies = companies.filter(
    company => 
      company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (company.industry || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleExport = () => {
    // Filter the data to export
    const exportData = filteredCompanies.map(company => ({
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
  };

  const handleAddCompany = async (company: any) => {
    await addCompany(company);
    setAddCompanyOpen(false);
  };

  if (error) {
    return (
      <div className="space-y-4">
        <div className="text-center py-4 text-red-500">
          Error loading companies: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            className="pl-10" 
            placeholder="Search companies..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Button size="sm" onClick={() => setAddCompanyOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Company
          </Button>
        </div>
      </div>
      
      {isLoading ? (
        // Loading skeleton based on view mode
        viewMode === 'table' ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Logo</TableHead>
                  <TableHead>Company Name</TableHead>
                  <TableHead>Industry</TableHead>
                  <TableHead className="text-center">Open Jobs</TableHead>
                  <TableHead className="text-center">All Jobs</TableHead>
                  <TableHead className="text-center">Outstanding</TableHead>
                  <TableHead className="text-center">All-time Revenue</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={`skeleton-${i}`}>
                    <TableCell><Skeleton className="h-10 w-10 rounded-full" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-28" /></TableCell>
                    <TableCell className="text-center"><Skeleton className="h-5 w-8 mx-auto" /></TableCell>
                    <TableCell className="text-center"><Skeleton className="h-5 w-8 mx-auto" /></TableCell>
                    <TableCell className="text-center"><Skeleton className="h-5 w-16 mx-auto" /></TableCell>
                    <TableCell className="text-center"><Skeleton className="h-5 w-20 mx-auto" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-9 w-16 ml-auto" /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={`skeleton-${i}`}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    {Array.from({ length: 4 }).map((_, j) => (
                      <Skeleton key={j} className="h-20 rounded-md" />
                    ))}
                  </div>
                  <Skeleton className="h-9 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        )
      ) : filteredCompanies.length === 0 ? (
        <div className="text-center py-6 text-muted-foreground bg-muted rounded-md">
          No companies found. Try adjusting your search or add a new company.
        </div>
      ) : viewMode === 'table' ? (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Logo</TableHead>
                <TableHead>Company Name</TableHead>
                <TableHead>Industry</TableHead>
                <TableHead className="text-center">Open Jobs</TableHead>
                <TableHead className="text-center">All Jobs</TableHead>
                <TableHead className="text-center">Outstanding</TableHead>
                <TableHead className="text-center">All-time Revenue</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCompanies.map((company) => (
                <TableRow key={company.id}>
                  <TableCell>
                    <Avatar>
                      <AvatarImage src={company.logo_url} alt={company.name} />
                      <AvatarFallback>
                        <Building className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium">{company.name}</p>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm text-muted-foreground">{company.industry}</p>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="font-medium">{company.open_jobs}</span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="font-medium">{company.total_jobs}</span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="font-medium text-amber-600">${company.outstanding_amount}</span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="font-medium text-green-600">${company.total_revenue}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/companies/${company.id}`}>
                        View <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCompanies.map((company) => (
            <Card key={company.id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={company.logo_url} alt={company.name} />
                    <AvatarFallback>{company.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-bold">{company.name}</p>
                    <p className="text-sm text-muted-foreground">{company.industry}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex flex-col items-center p-2 bg-muted rounded-md">
                    <Calendar className="h-5 w-5 text-muted-foreground mb-1" />
                    <p className="text-xs text-muted-foreground">Open Jobs</p>
                    <p className="font-bold">{company.open_jobs}</p>
                  </div>
                  <div className="flex flex-col items-center p-2 bg-muted rounded-md">
                    <Calendar className="h-5 w-5 text-muted-foreground mb-1" />
                    <p className="text-xs text-muted-foreground">All Jobs</p>
                    <p className="font-bold">{company.total_jobs}</p>
                  </div>
                  <div className="flex flex-col items-center p-2 bg-muted rounded-md">
                    <DollarSign className="h-5 w-5 text-muted-foreground mb-1" />
                    <p className="text-xs text-muted-foreground">Outstanding</p>
                    <p className="font-bold text-amber-600">${company.outstanding_amount}</p>
                  </div>
                  <div className="flex flex-col items-center p-2 bg-muted rounded-md">
                    <DollarSign className="h-5 w-5 text-muted-foreground mb-1" />
                    <p className="text-xs text-muted-foreground">Total Revenue</p>
                    <p className="font-bold text-green-600">${company.total_revenue}</p>
                  </div>
                </div>
                
                <Button variant="outline" className="w-full" asChild>
                  <Link to={`/companies/${company.id}`}>
                    View Details <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AddCompanyDialog 
        open={addCompanyOpen} 
        onOpenChange={setAddCompanyOpen} 
        onCompanyAdded={handleAddCompany} 
      />
    </div>
  );
}
