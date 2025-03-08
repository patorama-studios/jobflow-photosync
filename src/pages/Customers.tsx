
import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageTransition } from "@/components/layout/PageTransition";
import { ClientsView } from "@/components/clients/ClientsView";
import { CompanyList } from "@/components/clients/CompanyList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Building2 } from "lucide-react";

const Customers = () => {
  const [activeTab, setActiveTab] = useState("customers");

  return (
    <MainLayout>
      <PageTransition>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight mb-2">Customers & Companies</h1>
            <p className="text-muted-foreground">
              Manage your customers and business relationships
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="customers" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>Customers</span>
              </TabsTrigger>
              <TabsTrigger value="companies" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                <span>Companies</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="customers">
              <ClientsView />
            </TabsContent>
            
            <TabsContent value="companies">
              <CompanyList />
            </TabsContent>
          </Tabs>
        </div>
      </PageTransition>
    </MainLayout>
  );
};

export default Customers;
