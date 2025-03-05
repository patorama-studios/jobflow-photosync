
import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Search, 
  Filter, 
  Building,
  Calendar,
  DollarSign,
  ChevronRight
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
import { mockCompanies } from "@/components/clients/mock-data";

interface CompanyListProps {
  viewMode: 'table' | 'card';
}

export function CompanyList({ viewMode }: CompanyListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredCompanies = mockCompanies.filter(
    company => 
      company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.industry.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Button size="sm">
            <Building className="h-4 w-4 mr-2" />
            Add Company
          </Button>
        </div>
      </div>
      
      {viewMode === 'table' ? (
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
                      <AvatarImage src={company.logoUrl} alt={company.name} />
                      <AvatarFallback>{company.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium">{company.name}</p>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm text-muted-foreground">{company.industry}</p>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="font-medium">{company.openJobs}</span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="font-medium">{company.totalJobs}</span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="font-medium text-amber-600">${company.outstandingAmount}</span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="font-medium text-green-600">${company.totalRevenue}</span>
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
                    <AvatarImage src={company.logoUrl} alt={company.name} />
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
                    <p className="font-bold">{company.openJobs}</p>
                  </div>
                  <div className="flex flex-col items-center p-2 bg-muted rounded-md">
                    <Calendar className="h-5 w-5 text-muted-foreground mb-1" />
                    <p className="text-xs text-muted-foreground">All Jobs</p>
                    <p className="font-bold">{company.totalJobs}</p>
                  </div>
                  <div className="flex flex-col items-center p-2 bg-muted rounded-md">
                    <DollarSign className="h-5 w-5 text-muted-foreground mb-1" />
                    <p className="text-xs text-muted-foreground">Outstanding</p>
                    <p className="font-bold text-amber-600">${company.outstandingAmount}</p>
                  </div>
                  <div className="flex flex-col items-center p-2 bg-muted rounded-md">
                    <DollarSign className="h-5 w-5 text-muted-foreground mb-1" />
                    <p className="text-xs text-muted-foreground">Total Revenue</p>
                    <p className="font-bold text-green-600">${company.totalRevenue}</p>
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
    </div>
  );
}
