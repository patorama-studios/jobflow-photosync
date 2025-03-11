
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building, Users } from "lucide-react";

interface CustomerTabNavigationProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  children: React.ReactNode;
}

export function CustomerTabNavigation({ 
  activeTab, 
  onTabChange,
  children
}: CustomerTabNavigationProps) {
  return (
    <Tabs defaultValue="clients" onValueChange={onTabChange}>
      <div className="flex mb-4">
        <TabsList>
          <TabsTrigger value="clients" className="flex items-center">
            <Users className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Clients</span>
          </TabsTrigger>
          <TabsTrigger value="companies" className="flex items-center">
            <Building className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Companies</span>
          </TabsTrigger>
        </TabsList>
      </div>
      
      <div className="mb-4">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All {activeTab === "clients" ? "Clients" : "Companies"}</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="new">New</TabsTrigger>
          <TabsTrigger value="outstanding">Outstanding Balance</TabsTrigger>
        </TabsList>
      </div>
      
      {children}
    </Tabs>
  );
}
