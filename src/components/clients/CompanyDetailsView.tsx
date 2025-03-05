
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ChevronLeft, 
  Building, 
  Users, 
  CreditCard, 
  Package, 
  Settings, 
  Phone,
  Mail,
  Globe,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  FileText,
  Pencil,
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockCompanies } from "@/components/clients/mock-data";
import { ContentDownloadSettings } from "@/components/clients/ContentDownloadSettings";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface CompanyDetailsViewProps {
  companyId?: string;
}

export function CompanyDetailsView({ companyId }: CompanyDetailsViewProps) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [company, setCompany] = useState(mockCompanies[0]);

  useEffect(() => {
    if (companyId) {
      const foundCompany = mockCompanies.find(c => c.id === companyId);
      if (foundCompany) {
        setCompany(foundCompany);
      } else {
        navigate("/clients");
      }
    }
  }, [companyId, navigate]);

  const handleSaveDownloadSettings = (values: any) => {
    console.log("Saving company download settings:", values);
    // Here you would update the company settings in your data store
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate("/clients")}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={company.logoUrl} alt={company.name} />
              <AvatarFallback className="bg-primary/10">
                <Building className="h-8 w-8 text-primary" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">{company.name}</h1>
              <p className="text-muted-foreground">{company.industry}</p>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm">
            <Pencil className="h-4 w-4 mr-2" />
            Edit Details
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center gap-4">
              <Phone className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Phone</p>
                <p className="text-sm text-muted-foreground">{company.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm text-muted-foreground">{company.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Globe className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Website</p>
                <p className="text-sm text-muted-foreground">{company.website || "N/A"}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Location</p>
                <p className="text-sm text-muted-foreground">{company.location}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-5">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="clients" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Clients</span>
          </TabsTrigger>
          <TabsTrigger value="teams" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Teams</span>
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            <span className="hidden sm:inline">Billing</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Settings</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Company Overview</CardTitle>
                <CardDescription>Key information about {company.name}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium">About</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {company.description || "No company description available."}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium">Industry</h3>
                    <p className="text-sm text-muted-foreground mt-1">{company.industry}</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Social Media</h3>
                    <div className="flex gap-2 mt-2">
                      {company.social?.facebook && (
                        <Button variant="outline" size="icon" asChild>
                          <a href={company.social.facebook} target="_blank" rel="noopener noreferrer">
                            <Facebook className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                      {company.social?.twitter && (
                        <Button variant="outline" size="icon" asChild>
                          <a href={company.social.twitter} target="_blank" rel="noopener noreferrer">
                            <Twitter className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                      {company.social?.instagram && (
                        <Button variant="outline" size="icon" asChild>
                          <a href={company.social.instagram} target="_blank" rel="noopener noreferrer">
                            <Instagram className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                      {company.social?.linkedin && (
                        <Button variant="outline" size="icon" asChild>
                          <a href={company.social.linkedin} target="_blank" rel="noopener noreferrer">
                            <Linkedin className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Business Metrics</CardTitle>
                <CardDescription>Performance summary</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="border rounded-md p-4">
                      <p className="text-sm text-muted-foreground">Active Orders</p>
                      <p className="text-2xl font-bold mt-1">{company.activeOrders || 0}</p>
                    </div>
                    <div className="border rounded-md p-4">
                      <p className="text-sm text-muted-foreground">Total Orders</p>
                      <p className="text-2xl font-bold mt-1">{company.totalOrders || 0}</p>
                    </div>
                    <div className="border rounded-md p-4">
                      <p className="text-sm text-muted-foreground">Outstanding</p>
                      <p className="text-2xl font-bold mt-1 text-amber-600">${company.outstandingAmount || 0}</p>
                    </div>
                    <div className="border rounded-md p-4">
                      <p className="text-sm text-muted-foreground">Total Revenue</p>
                      <p className="text-2xl font-bold mt-1 text-green-600">${company.totalRevenue || 0}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="clients">
          <Card>
            <CardHeader>
              <CardTitle>Associated Clients</CardTitle>
              <CardDescription>Clients associated with this company</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Client list would go here */}
              <p className="text-muted-foreground text-center py-6">Client listing component to be implemented</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="teams">
          <Card>
            <CardHeader>
              <CardTitle>Company Teams</CardTitle>
              <CardDescription>Manage teams within this company</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Teams management would go here */}
              <p className="text-muted-foreground text-center py-6">Teams management component to be implemented</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="billing">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Financial Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border rounded-md p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <span className="font-medium">Invoices (YTD)</span>
                    </div>
                    <p className="text-2xl font-bold">{company.invoiceCount || 0}</p>
                    <p className="text-sm text-muted-foreground mt-1">Total invoices issued</p>
                  </div>
                  <div className="border rounded-md p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CreditCard className="h-5 w-5 text-muted-foreground" />
                      <span className="font-medium">Outstanding</span>
                    </div>
                    <p className="text-2xl font-bold text-amber-600">${company.outstandingAmount || 0}</p>
                    <p className="text-sm text-muted-foreground mt-1">Payment pending</p>
                  </div>
                  <div className="border rounded-md p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Package className="h-5 w-5 text-muted-foreground" />
                      <span className="font-medium">Completed Orders</span>
                    </div>
                    <p className="text-2xl font-bold text-green-600">{(company.totalOrders || 0) - (company.activeOrders || 0)}</p>
                    <p className="text-sm text-muted-foreground mt-1">Orders delivered</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <ContentDownloadSettings 
              entityType="company" 
              initialValues={{
                contentLocked: true,
                enableCreditLimit: true,
                creditLimit: "5000",
                paymentTerms: "30days"
              }}
              onSave={handleSaveDownloadSettings}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="settings">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Company Settings</CardTitle>
                <CardDescription>Manage company preferences and settings</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">General settings form would go here</p>
              </CardContent>
            </Card>
            
            <ContentDownloadSettings 
              entityType="company" 
              initialValues={{
                contentLocked: true,
                enableCreditLimit: true,
                creditLimit: "5000",
                paymentTerms: "30days"
              }}
              onSave={handleSaveDownloadSettings}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
