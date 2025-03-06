
import React from 'react';
import { Search, Download, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ClientTableHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onAddClient: () => void;
  onExport: () => void;
}

export function ClientTableHeader({ 
  searchQuery, 
  setSearchQuery, 
  onAddClient, 
  onExport 
}: ClientTableHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
      <div className="relative w-full md:w-96">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          className="pl-10" 
          placeholder="Search clients..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={onExport}>
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
        <Button size="sm" onClick={onAddClient}>
          <UserPlus className="h-4 w-4 mr-2" />
          Add Client
        </Button>
      </div>
    </div>
  );
}
