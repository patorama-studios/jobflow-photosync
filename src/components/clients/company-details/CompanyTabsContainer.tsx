
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, Users, CreditCard } from "lucide-react";
import { CompanyOverviewContent } from "./CompanyOverviewContent";
import { CompanyClientsTab } from "./CompanyClientsTab";
import { CompanyBillingTab } from "./CompanyBillingTab";

interface CompanyTabsContainerProps {
  company: any;
  companyClients: any[];
  clientsLoading: boolean;
}

export function CompanyTabsContainer({ company, companyClients, clientsLoading }: CompanyTabsContainerProps) {
  const [activeTab, setActiveTab] = useState("overview");

  return (
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
        <CompanyOverviewContent company={company} />
      </TabsContent>
      
      <TabsContent value="clients">
        <CompanyClientsTab 
          companyClients={companyClients} 
          clientsLoading={clientsLoading} 
          company={company} 
        />
      </TabsContent>
      
      <TabsContent value="billing">
        <CompanyBillingTab company={company} />
      </TabsContent>
    </Tabs>
  );
}
