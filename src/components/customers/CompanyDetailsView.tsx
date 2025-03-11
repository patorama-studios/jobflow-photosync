
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building, Users, CreditCard, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Company } from "@/hooks/use-companies";

export function CompanyDetailsView() {
  const { companyId } = useParams<{ companyId: string }>();
  const navigate = useNavigate();
  
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [companyClients, setCompanyClients] = useState<any[]>([]);
  const [companyTeams, setCompanyTeams] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("overview");
  
  // Fetch company data
  useEffect(() => {
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
          return;
        }
        
        if (data) {
          setCompany(data as Company);
        } else {
          toast.error("Company not found");
          navigate("/customers");
        }
      } catch (err) {
        console.error("Error fetching company:", err);
        toast.error("An error occurred while loading company data");
      } finally {
        setLoading(false);
      }
    };
    
    // Fetch clients associated with this company
    const fetchCompanyClients = async () => {
      if (!companyId) return;
      
      try {
        const { data, error } = await supabase
          .from("clients")
          .select("*")
          .eq("company_id", companyId);
          
        if (error) {
          console.error("Error fetching company clients:", error);
          return;
        }
        
        setCompanyClients(data || []);
      } catch (err) {
        console.error("Error fetching company clients:", err);
      }
    };
    
    fetchCompanyData();
    fetchCompanyClients();
  }, [companyId, navigate]);
  
  const handleBackClick = () => {
    navigate("/customers");
  };
  
  if (loading) {
    return <CompanyDetailsLoading />;
  }
  
  if (!company) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Company Not Found</h2>
            <Button onClick={handleBackClick}>Back to Companies</Button>
          </div>
          <p>The requested company could not be found.</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardContent className="p-6">
        <CompanyHeader company={company} onBackClick={handleBackClick} />
        <CompanyOverview company={company} />
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center">
              <Building className="h-4 w-4 mr-2" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="clients" className="flex items-center">
              <Users className="h-4 w-4 mr-2" />
              <span>Clients</span>
            </TabsTrigger>
            <TabsTrigger value="billing" className="flex items-center">
              <CreditCard className="h-4 w-4 mr-2" />
              <span>Billing</span>
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              <span>Orders</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-6">
            <CompanyOverviewTab company={company} />
          </TabsContent>
          
          <TabsContent value="clients" className="mt-6">
            <CompanyClientsTab clients={companyClients} />
          </TabsContent>
          
          <TabsContent value="billing" className="mt-6">
            <CompanyBillingTab company={company} />
          </TabsContent>
          
          <TabsContent value="orders" className="mt-6">
            <CompanyOrdersTab companyId={company.id} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

// Helper components
function CompanyDetailsLoading() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-10 w-24" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
        <Skeleton className="h-10 w-full mb-6" />
        <div className="space-y-4">
          <Skeleton className="h-64 w-full" />
        </div>
      </CardContent>
    </Card>
  );
}

function CompanyHeader({ company, onBackClick }: { company: Company, onBackClick: () => void }) {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h2 className="text-2xl font-bold">{company.name}</h2>
        <p className="text-muted-foreground">{company.industry}</p>
      </div>
      <Button onClick={onBackClick}>Back to Companies</Button>
    </div>
  );
}

function CompanyOverview({ company }: { company: Company }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardContent className="p-4">
          <h3 className="text-sm font-medium text-muted-foreground mb-1">Total Jobs</h3>
          <p className="text-2xl font-bold">{company.total_jobs || 0}</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <h3 className="text-sm font-medium text-muted-foreground mb-1">Open Jobs</h3>
          <p className="text-2xl font-bold">{company.open_jobs || 0}</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <h3 className="text-sm font-medium text-muted-foreground mb-1">Total Revenue</h3>
          <p className="text-2xl font-bold">${company.total_revenue?.toFixed(2) || '0.00'}</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <h3 className="text-sm font-medium text-muted-foreground mb-1">Outstanding</h3>
          <p className="text-2xl font-bold">${company.outstanding_amount?.toFixed(2) || '0.00'}</p>
        </CardContent>
      </Card>
    </div>
  );
}

function CompanyOverviewTab({ company }: { company: Company }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-4">
          <h3 className="text-lg font-medium mb-4">Company Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Contact Information</h4>
              <p className="mt-1"><strong>Email:</strong> {company.email || 'Not provided'}</p>
              <p><strong>Phone:</strong> {company.phone || 'Not provided'}</p>
              <p><strong>Website:</strong> {company.website || 'Not provided'}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Address</h4>
              <p className="mt-1">{company.address || 'Not provided'}</p>
              <p>
                {company.city || ''} {company.state || ''} {company.zip || ''}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <h3 className="text-lg font-medium mb-4">Company Teams</h3>
          <p className="text-muted-foreground">No teams found for this company.</p>
        </CardContent>
      </Card>
    </div>
  );
}

function CompanyClientsTab({ clients }: { clients: any[] }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Clients ({clients.length})</h3>
      
      {clients.length === 0 ? (
        <p className="text-muted-foreground">No clients found for this company.</p>
      ) : (
        <div className="space-y-2">
          {clients.map((client) => (
            <Card key={client.id}>
              <CardContent className="p-4 flex justify-between items-center">
                <div>
                  <h4 className="font-medium">{client.name}</h4>
                  <p className="text-sm text-muted-foreground">{client.email}</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => window.location.href = `/customers/${client.id}`}>
                  View
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function CompanyBillingTab({ company }: { company: Company }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Billing Summary</h3>
      
      <Card>
        <CardContent className="p-4">
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Revenue:</span>
              <span className="font-medium">${company.total_revenue?.toFixed(2) || '0.00'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Outstanding Amount:</span>
              <span className="font-medium">${company.outstanding_amount?.toFixed(2) || '0.00'}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <h3 className="text-lg font-medium mt-6">Payment History</h3>
      <p className="text-muted-foreground">No payment records found.</p>
    </div>
  );
}

function CompanyOrdersTab({ companyId }: { companyId: string }) {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data, error } = await supabase
          .from("orders")
          .select("*")
          .eq("company_id", companyId);
          
        if (error) {
          console.error("Error fetching company orders:", error);
          return;
        }
        
        setOrders(data || []);
      } catch (err) {
        console.error("Error fetching company orders:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, [companyId]);
  
  if (loading) {
    return <Skeleton className="h-64 w-full" />;
  }
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Orders ({orders.length})</h3>
      
      {orders.length === 0 ? (
        <p className="text-muted-foreground">No orders found for this company.</p>
      ) : (
        <div className="space-y-2">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardContent className="p-4 flex justify-between items-center">
                <div>
                  <h4 className="font-medium">{order.order_number}</h4>
                  <p className="text-sm text-muted-foreground">
                    {new Date(order.scheduled_date).toLocaleDateString()} - ${order.price}
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={() => window.location.href = `/orders/${order.id}`}>
                  View
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
