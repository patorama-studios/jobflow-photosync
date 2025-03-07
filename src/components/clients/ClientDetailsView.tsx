
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Users, CreditCard, Package, Settings, ShoppingCart } from "lucide-react";
import { ClientHeader } from "@/components/clients/details/ClientHeader";
import { ClientInfoCard } from "@/components/clients/details/ClientInfoCard";
import { useClientDownloadSettings } from "@/components/clients/hooks/useClientDownloadSettings";
import { mockCustomers } from "@/components/clients/mock-data";
import { ClientOverview } from "@/components/clients/tabs/ClientOverview";
import { ClientTeams } from "@/components/clients/tabs/ClientTeams";
import { ClientBilling } from "@/components/clients/tabs/ClientBilling";
import { ClientOrders } from "@/components/clients/tabs/ClientOrders";
import { ClientSettings } from "@/components/clients/details/ClientSettings";

interface ClientDetailsViewProps {
  clientId?: string;
}

export function ClientDetailsView({ clientId }: ClientDetailsViewProps) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [client, setClient] = useState(mockCustomers[0]);
  
  const { downloadSettings, handleSaveDownloadSettings } = useClientDownloadSettings();

  // Fetch client data when clientId changes
  useState(() => {
    if (clientId) {
      const foundClient = mockCustomers.find(c => c.id === clientId);
      if (foundClient) {
        setClient(foundClient);
      } else {
        navigate("/clients");
      }
    }
  });

  return (
    <div className="space-y-6">
      <ClientHeader 
        client={client} 
        contentLocked={downloadSettings.contentLocked}
        navigate={navigate}
      />

      <ClientInfoCard client={client} />

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
          <ClientSettings 
            downloadSettings={downloadSettings}
            onSaveDownloadSettings={handleSaveDownloadSettings}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
