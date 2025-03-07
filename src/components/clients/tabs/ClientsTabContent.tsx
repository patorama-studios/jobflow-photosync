
import { useState } from "react";
import { 
  Building,
  LayoutGrid,
  LayoutList
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ClientTable } from "@/components/clients/ClientTable";
import { CompanyList } from "@/components/clients/CompanyList";

interface ClientsTabContentProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}

export function ClientsTabContent({ activeTab, onTabChange }: ClientsTabContentProps) {
  const [companyViewMode, setCompanyViewMode] = useState<'table' | 'card'>('table');
  
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="space-y-4">
      <TabsList>
        <TabsTrigger value="clients" className="flex items-center gap-2">
          <span>Clients</span>
        </TabsTrigger>
        <TabsTrigger value="companies" className="flex items-center gap-2">
          <Building className="h-4 w-4" />
          <span>Companies</span>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="clients">
        <ClientTable />
      </TabsContent>
      
      <TabsContent value="companies">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle>Company Management</CardTitle>
              <div className="flex gap-2">
                <Button 
                  variant={companyViewMode === 'table' ? 'default' : 'outline'} 
                  size="icon"
                  onClick={() => setCompanyViewMode('table')}
                >
                  <LayoutList className="h-4 w-4" />
                </Button>
                <Button 
                  variant={companyViewMode === 'card' ? 'default' : 'outline'} 
                  size="icon"
                  onClick={() => setCompanyViewMode('card')}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <CompanyList viewMode={companyViewMode} />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
