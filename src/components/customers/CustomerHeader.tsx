
import React from "react";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

interface CustomerHeaderProps {
  activeTab: string;
  onAddClick: () => void;
}

export function CustomerHeader({ activeTab, onAddClick }: CustomerHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-semibold">Customers</h2>
      <Button className="flex items-center" onClick={onAddClick}>
        <UserPlus className="h-4 w-4 mr-2" />
        {activeTab === "clients" ? "Add Customer" : "Add Company"}
      </Button>
    </div>
  );
}
