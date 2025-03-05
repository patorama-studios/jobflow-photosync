
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { mockCustomers } from "@/components/clients/mock-data";
import { ClientOverview } from "@/components/clients/tabs/ClientOverview";
import { ClientTeams } from "@/components/clients/tabs/ClientTeams";
import { ClientBilling } from "@/components/clients/tabs/ClientBilling";
import { ClientOrders } from "@/components/clients/tabs/ClientOrders";

interface ClientDetailsViewProps {
  clientId?: string;
}

export function ClientDetailsView({ clientId }: ClientDetailsViewProps) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [client, setClient] = useState(mockCustomers[0]);

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
              <h1 className="text-2xl font-bold">{client.name}</h1>
              <p className="text-muted-foreground">{client.company}</p>
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
                <p className="text-sm text-muted-foreground">{client.company}</p>
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
        <TabsList className="grid w-full grid-cols-4">
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
            <span className="hidden sm:inline">All Orders</span>
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
      </Tabs>
    </div>
  );
}
