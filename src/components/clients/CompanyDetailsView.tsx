
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Building2, 
  Users, 
  CreditCard, 
  Package, 
  Settings, 
  Globe, 
  MapPin, 
  Phone, 
  Mail 
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useCompanies } from "@/hooks/use-companies";
import { useClients } from "@/hooks/use-clients";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface CompanyDetailsViewProps {
  companyId?: string;
}

export function CompanyDetailsView({ companyId }: CompanyDetailsViewProps) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [company, setCompany] = useState<any>(null);
  const [companyClients, setCompanyClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [clientsLoading, setClientsLoading] = useState(true);
  
  // Fetch company data from Supabase
  const fetchCompanyData = async () => {
    if (!companyId) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("companies")
        .select("*")
        .eq("id", companyId)
        .single();

      if (error) {
        console.error("Error fetching company:", error);
        toast.error("Failed to load company data");
        navigate("/customers");
        return;
      }

      if (data) {
        setCompany(data);
      } else {
        navigate("/customers");
      }
    } catch (err) {
      console.error("Error in fetchCompanyData:", err);
      toast.error("An error occurred while loading company data");
    } finally {
      setLoading(false);
    }
  };

  // Fetch clients belonging to this company
  const fetchCompanyClients = async () => {
    if (!companyId) return;
    
    try {
      setClientsLoading(true);
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .eq("company_id", companyId);

      if (error) {
        throw error;
      }

      setCompanyClients(data || []);
    } catch (err) {
      console.error("Error fetching company clients:", err);
    } finally {
      setClientsLoading(false);
    }
  };

  // Fetch data when companyId changes
  useEffect(() => {
    fetchCompanyData();
    fetchCompanyClients();
  }, [companyId]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          </CardContent>
        </Card>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!company) {
    return (
      <div className="flex items-center justify-center h-40">
        <p>Company not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Company header */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold">{company.name}</h1>
          <p className="text-muted-foreground">{company.industry} company</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate("/customers")}>
            Back to Companies
          </Button>
          <Button variant="default">
            Edit Company
          </Button>
        </div>
      </div>

      {/* Company Overview Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Company Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col space-y-1">
              <div className="text-sm font-medium text-muted-foreground">Contact</div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{company.email || 'No email provided'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{company.phone || 'No phone provided'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <span>{company.website || 'No website provided'}</span>
              </div>
            </div>

            <div className="flex flex-col space-y-1">
              <div className="text-sm font-medium text-muted-foreground">Location</div>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                <span>
                  {company.address ? (
                    <>
                      {company.address}<br />
                      {company.city && company.state ? 
                        `${company.city}, ${company.state} ${company.zip || ''}` : 
                        (company.city || company.state || 'No city/state provided')}
                    </>
                  ) : (
                    'No address provided'
                  )}
                </span>
              </div>
            </div>

            <div className="flex flex-col space-y-1">
              <div className="text-sm font-medium text-muted-foreground">Stats</div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-2xl font-bold">{company.total_jobs || 0}</div>
                  <div className="text-sm text-muted-foreground">Total Jobs</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{company.open_jobs || 0}</div>
                  <div className="text-sm text-muted-foreground">Open Jobs</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">${company.total_revenue?.toFixed(2) || '0.00'}</div>
                  <div className="text-sm text-muted-foreground">Total Revenue</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">${company.outstanding_amount?.toFixed(2) || '0.00'}</div>
                  <div className="text-sm text-muted-foreground">Outstanding</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for additional company information */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="clients" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Clients</span>
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            <span className="hidden sm:inline">Billing</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Company Details</CardTitle>
              <CardDescription>
                Additional information about {company.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">Status</h3>
                  <p className="mt-1">
                    <Badge variant={company.status === 'active' ? 'default' : 'secondary'}>
                      {company.status}
                    </Badge>
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium">Created</h3>
                  <p className="mt-1 text-muted-foreground">
                    {new Date(company.created_at).toLocaleDateString()}
                  </p>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-lg font-medium">About</h3>
                  <p className="mt-1 text-muted-foreground">
                    {company.description || 'No company description available.'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="clients">
          <Card>
            <CardHeader>
              <CardTitle>Company Clients</CardTitle>
              <CardDescription>
                Clients associated with {company.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {clientsLoading ? (
                <div className="space-y-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : companyClients.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Projects</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {companyClients.map((client) => (
                      <TableRow 
                        key={client.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => navigate(`/customer/${client.id}`)}
                      >
                        <TableCell>
                          <div className="flex items-center">
                            <Avatar className="h-8 w-8 mr-2">
                              {client.photo_url ? (
                                <img src={client.photo_url} alt={client.name} />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center bg-primary/10 text-primary">
                                  {client.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                </div>
                              )}
                            </Avatar>
                            <span>{client.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{client.email}</TableCell>
                        <TableCell>{client.phone || 'N/A'}</TableCell>
                        <TableCell>
                          <Badge variant={client.status === 'active' ? 'default' : 'secondary'}>
                            {client.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{client.total_jobs || 0}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  No clients found for this company
                </div>
              )}
              
              <div className="mt-4">
                <Button onClick={() => navigate('/customers', { state: { activeTab: 'customers' } })}>
                  <Users className="mr-2 h-4 w-4" />
                  Add Client
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="billing">
          <Card>
            <CardHeader>
              <CardTitle>Billing & Payments</CardTitle>
              <CardDescription>
                Financial information for {company.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium">Payment Summary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-2xl font-bold">${company.total_revenue?.toFixed(2) || '0.00'}</div>
                        <p className="text-sm text-muted-foreground">Total Revenue</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-2xl font-bold">${company.outstanding_amount?.toFixed(2) || '0.00'}</div>
                        <p className="text-sm text-muted-foreground">Outstanding Amount</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-2xl font-bold">30 days</div>
                        <p className="text-sm text-muted-foreground">Payment Terms</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-lg font-medium">Recent Invoices</h3>
                  <div className="mt-2 rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Invoice #</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                            No invoices found
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
