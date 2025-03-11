
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Client, useClients } from "@/hooks/use-clients";
import { Company, useCompanies } from "@/hooks/use-companies";
import { AddClientDialog } from "@/components/calendar/appointment/components/AddClientDialog";
import { AddCompanyDialog } from "@/components/customers/AddCompanyDialog";
import { useNavigate } from "react-router-dom";
import { CustomerHeader } from "./CustomerHeader";
import { CustomerSearch } from "./CustomerSearch";
import { CustomerTabNavigation } from "./CustomerTabNavigation";
import { ClientsTab } from "./tabs/ClientsTab";
import { CompaniesTab } from "./tabs/CompaniesTab";
import { OtherTabsContent } from "./tabs/OtherTabsContent";
import { TabsContent } from "@/components/ui/tabs";

export function CustomersView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("clients");
  const [isAddClientDialogOpen, setIsAddClientDialogOpen] = useState(false);
  const [isAddCompanyDialogOpen, setIsAddCompanyDialogOpen] = useState(false);
  const navigate = useNavigate();
  
  const { clients, isLoading: isClientsLoading, error: clientsError, refetch: refetchClients } = useClients();
  const { companies, isLoading: isCompaniesLoading, error: companiesError, refetch: refetchCompanies } = useCompanies();
  
  const handleAddClick = () => {
    if (activeTab === "clients") {
      setIsAddClientDialogOpen(true);
    } else {
      setIsAddCompanyDialogOpen(true);
    }
  };

  const handleClientCreated = (client: Client) => {
    refetchClients();
  };

  const handleCompanyCreated = (company: Company) => {
    refetchCompanies();
  };

  const handleClientClick = (clientId: string) => {
    navigate(`/customers/${clientId}`);
  };

  const handleCompanyClick = (companyId: string) => {
    navigate(`/companies/${companyId}`);
  };

  return (
    <Card>
      <CardContent className="p-6">
        <CustomerHeader activeTab={activeTab} onAddClick={handleAddClick} />
        <CustomerSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        
        <CustomerTabNavigation activeTab={activeTab} onTabChange={setActiveTab}>
          <TabsContent value="clients" className="space-y-4">
            <ClientsTab
              clients={clients}
              isLoading={isClientsLoading}
              error={clientsError}
              searchQuery={searchQuery}
              handleClientClick={handleClientClick}
            />
          </TabsContent>
          
          <TabsContent value="companies" className="space-y-4">
            <CompaniesTab
              companies={companies}
              isLoading={isCompaniesLoading}
              error={companiesError}
              searchQuery={searchQuery}
              handleCompanyClick={handleCompanyClick}
            />
          </TabsContent>
          
          <TabsContent value="active">
            <OtherTabsContent activeTab={activeTab} tabValue="active" title="Active" />
          </TabsContent>
          
          <TabsContent value="new">
            <OtherTabsContent activeTab={activeTab} tabValue="new" title="New" />
          </TabsContent>
          
          <TabsContent value="outstanding">
            <OtherTabsContent activeTab={activeTab} tabValue="outstanding" title="With outstanding balance" />
          </TabsContent>
        </CustomerTabNavigation>
      </CardContent>
      
      <AddClientDialog 
        isOpen={isAddClientDialogOpen} 
        onClose={() => setIsAddClientDialogOpen(false)}
        onClientCreated={handleClientCreated}
      />
      
      <AddCompanyDialog 
        isOpen={isAddCompanyDialogOpen} 
        onClose={() => setIsAddCompanyDialogOpen(false)}
        onCompanyCreated={handleCompanyCreated}
      />
    </Card>
  );
}
