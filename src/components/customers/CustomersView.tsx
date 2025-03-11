
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { PageTransition } from '@/components/layout/PageTransition';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CustomerHeader } from './CustomerHeader';
import { CompaniesTab } from './tabs/CompaniesTab';
import { ClientsTab } from './tabs/ClientsTab';
import { OtherTabsContent } from './tabs/OtherTabsContent';
import { AddCompanyDialog } from './AddCompanyDialog';
import { AddClientDialog } from '@/components/calendar/appointment/components/AddClientDialog';
import { Client } from '@/hooks/use-clients';
import { useCompanies } from '@/hooks/use-companies';
import { useClients } from '@/hooks/use-clients';
import { useNavigate } from 'react-router-dom';

export function CustomersView() {
  const [activeTab, setActiveTab] = useState('companies');
  const [isAddCompanyOpen, setIsAddCompanyOpen] = useState(false);
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  
  const { companies, isLoading: isLoadingCompanies, error: companiesError } = useCompanies();
  const { clients, isLoading: isLoadingClients, error: clientsError } = useClients();
  
  const handleAddClientClick = () => {
    setIsAddClientOpen(true);
  };
  
  const handleAddCompanyClick = () => {
    setIsAddCompanyOpen(true);
  };
  
  const handleCompanyCreated = (company: any) => {
    console.log('Company created:', company);
    // Here you would typically refresh the companies list
  };
  
  const handleClientCreated = (client: Client) => {
    console.log('Client created:', client);
    // Here you would typically refresh the clients list
  };
  
  const handleCompanyClick = (companyId: string) => {
    navigate(`/customers/company/${companyId}`);
  };
  
  const handleClientClick = (clientId: string) => {
    navigate(`/customers/client/${clientId}`);
  };
  
  return (
    <MainLayout>
      <PageTransition>
        <div className="container p-6 mx-auto space-y-6">
          <CustomerHeader 
            activeTab={activeTab}
            onAddClick={() => {
              if (activeTab === 'companies') {
                handleAddCompanyClick();
              } else if (activeTab === 'clients') {
                handleAddClientClick();
              }
            }}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
          
          <Tabs 
            defaultValue="companies" 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="space-y-4"
          >
            <TabsList className="grid w-full grid-cols-3 md:w-auto md:inline-flex">
              <TabsTrigger value="companies">Companies</TabsTrigger>
              <TabsTrigger value="clients">Clients</TabsTrigger>
              <TabsTrigger value="teams">Teams</TabsTrigger>
            </TabsList>
            
            <TabsContent value="companies" className="space-y-4">
              <CompaniesTab 
                companies={companies}
                isLoading={isLoadingCompanies}
                error={companiesError}
                searchQuery={searchQuery}
                handleCompanyClick={handleCompanyClick}
              />
            </TabsContent>
            
            <TabsContent value="clients" className="space-y-4">
              <ClientsTab 
                clients={clients}
                isLoading={isLoadingClients}
                error={clientsError}
                searchQuery={searchQuery}
                handleClientClick={handleClientClick}
              />
            </TabsContent>
            
            <TabsContent value="teams" className="space-y-4">
              <OtherTabsContent title="Teams" activeTab={activeTab} tabValue="teams" />
            </TabsContent>
          </Tabs>
          
          {isAddCompanyOpen && (
            <AddCompanyDialog 
              isOpen={isAddCompanyOpen} 
              onClose={() => setIsAddCompanyOpen(false)} 
              onCompanyCreated={handleCompanyCreated}
            />
          )}
          
          {isAddClientOpen && (
            <AddClientDialog 
              open={isAddClientOpen} 
              onClose={() => setIsAddClientOpen(false)} 
              onClientCreated={handleClientCreated}
            />
          )}
        </div>
      </PageTransition>
    </MainLayout>
  );
}
