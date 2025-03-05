
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  ChevronLeft, 
  User, 
  Users, 
  CreditCard, 
  Package, 
  Settings, 
  FileText, 
  ShoppingCart,
  AtSign,
  Phone,
  Building,
  Calendar,
  Pencil,
  KeyRound,
  MessageSquare,
  Lock,
  Unlock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { mockCustomers, mockCompanies } from "@/components/clients/mock-data";
import { ClientOverview } from "@/components/clients/tabs/ClientOverview";
import { ClientTeams } from "@/components/clients/tabs/ClientTeams";
import { ClientBilling } from "@/components/clients/tabs/ClientBilling";
import { ClientOrders } from "@/components/clients/tabs/ClientOrders";
import { ContentDownloadSettings } from "@/components/clients/ContentDownloadSettings";
import { Badge } from "@/components/ui/badge";

interface ClientDetailsViewProps {
  clientId?: string;
}

export function ClientDetailsView({ clientId }: ClientDetailsViewProps) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [client, setClient] = useState(mockCustomers[0]);
  
  // Default settings (would normally come from the database)
  const [downloadSettings, setDownloadSettings] = useState({
    contentLocked: true,
    enableCreditLimit: false,
    creditLimit: "1000",
    paymentTerms: "onDelivery" as "onDelivery" | "14days" | "30days",
  });

  useEffect(() => {
    if (clientId) {
      const foundClient = mockCustomers.find(c => c.id === clientId);
      if (foundClient) {
        setClient(foundClient);
      } else {
        navigate("/clients");
      }
    }
  }, [clientId, navigate]);

  // Get company info if the client has a company
  const getCompanyInfo = () => {
    if (client.company) {
      const company = mockCompanies.find(c => c.name === client.company);
      return company;
    }
    return null;
  };
  
  const company = getCompanyInfo();

  const handleSaveDownloadSettings = (values: any) => {
    console.log("Saving client download settings:", values);
    setDownloadSettings(values);
    // Here you would update the client settings in your data store
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
              <AvatarImage src={client.photoUrl} alt={client.name} />
              <AvatarFallback className="text-lg">{client.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">{client.name}</h1>
                <Badge variant={downloadSettings.contentLocked ? "destructive" : "success"} className="ml-2">
                  {downloadSettings.contentLocked ? (
                    <>
                      <Lock className="h-3 w-3 mr-1" />
                      Content Locked
                    </>
                  ) : (
                    <>
                      <Unlock className="h-3 w-3 mr-1" />
                      Content Unlocked
                    </>
                  )}
                </Badge>
              </div>
              {client.company && (
                <Link 
                  to={`/companies/${company?.id}`} 
                  className="text-muted-foreground hover:text-primary flex items-center"
                >
                  <Building className="h-3 w-3 mr-1" />
                  {client.company}
                </Link>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm">
            <Pencil className="h-4 w-4 mr-2" />
            Edit Details
          </Button>
          <Button variant="outline" size="sm">
            <KeyRound className="h-4 w-4 mr-2" />
            Reset Password
          </Button>
          <Button variant="outline" size="sm">
            <MessageSquare className="h-4 w-4 mr-2" />
            Add Note
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-4">
              <Phone className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Phone</p>
                <p className="text-sm text-muted-foreground">{client.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <AtSign className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm text-muted-foreground">{client.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Building className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Company</p>
                <p className="text-sm text-muted-foreground">{client.company || "Not assigned"}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Client Since</p>
                <p className="text-sm text-muted-foreground">{client.createdDate}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="teams" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Teams</span>
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            <span className="hidden sm:inline">Billing</span>
          </TabsTrigger>
          <TabsTrigger value="orders" className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" />
            <span className="hidden sm:inline">Orders</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Settings</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <ClientOverview client={client} />
        </TabsContent>
        
        <TabsContent value="teams">
          <ClientTeams client={client} />
        </TabsContent>
        
        <TabsContent value="billing">
          <ClientBilling client={client} />
        </TabsContent>
        
        <TabsContent value="orders">
          <ClientOrders client={client} />
        </TabsContent>
        
        <TabsContent value="settings">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage client account preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">General settings form would go here</p>
              </CardContent>
            </Card>
            
            <ContentDownloadSettings 
              entityType="client" 
              initialValues={downloadSettings}
              onSave={handleSaveDownloadSettings}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
