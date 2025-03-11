
import React from "react";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface CustomerHeaderProps {
  activeTab: string;
  onAddClick: () => void;
  title?: string;
  searchQuery?: string;
  setSearchQuery?: React.Dispatch<React.SetStateAction<string>>;
  onCreateNewClick?: () => void;
}

export function CustomerHeader({ 
  activeTab, 
  onAddClick, 
  title = "Customers",
  searchQuery = "",
  setSearchQuery,
  onCreateNewClick
}: CustomerHeaderProps) {
  const handleAddClick = onCreateNewClick || onAddClick;
  
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
      <h2 className="text-2xl font-semibold">{title}</h2>
      
      <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
        {setSearchQuery && (
          <div className="relative w-full sm:w-[300px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              type="search"
              placeholder="Search customers..."
              className="w-full pl-8 pr-4"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        )}
        
        <Button 
          className="flex items-center w-full sm:w-auto" 
          onClick={handleAddClick}
        >
          <UserPlus className="h-4 w-4 mr-2" />
          {activeTab === "clients" ? "Add Customer" : "Add Company"}
        </Button>
      </div>
    </div>
  );
}
