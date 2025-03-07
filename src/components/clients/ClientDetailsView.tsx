
import { useState, useEffect } from "react";
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
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ClientDetailsViewProps {
  clientId?: string;
}

export function ClientDetailsView({ clientId }: ClientDetailsViewProps) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [client, setClient] = useState(mockCustomers[0]);
  const [loading, setLoading] = useState(true);
  
  const { downloadSettings, handleSaveDownloadSettings } = useClientDownloadSettings();

  // Fetch client data from Supabase
  const fetchClientData = async () => {
    if (!clientId) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .eq("id", clientId)
        .single();

      if (error) {
        console.error("Error fetching client:", error);
        toast.error("Failed to load client data");
        navigate("/clients");
        return;
      }

      if (data) {
        // Convert Supabase data to the format expected by our components
        const clientData = {
          id: data.id,
          name: data.name,
          email: data.email,
          phone: data.phone || "",
          company: data.company || "",
          status: data.status,
          photoUrl: data.photo_url || "",
          createdDate: new Date(data.created_at).toLocaleDateString(),
          totalJobs: data.total_jobs || 0,
          outstandingJobs: data.outstanding_jobs || 0,
          outstandingPayment: data.outstanding_payment || 0
        };
        
        setClient(clientData);
      } else {
        navigate("/clients");
      }
    } catch (err) {
      console.error("Error in fetchClientData:", err);
      toast.error("An error occurred while loading client data");
    } finally {
      setLoading(false);
    }
  };

  // Fetch client when clientId changes
  useEffect(() => {
    fetchClientData();
  }, [clientId]);

  if (loading) {
    return <div className="flex items-center justify-center h-40">Loading client data...</div>;
  }

  return (
    <div className="space-y-6">
      <ClientHeader 
        client={client} 
        contentLocked={downloadSettings.contentLocked}
        navigate={navigate}
        onClientUpdated={fetchClientData}
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
