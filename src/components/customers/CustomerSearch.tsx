
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";

interface CustomerSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function CustomerSearch({ searchQuery, setSearchQuery }: CustomerSearchProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="relative flex-grow">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input 
          placeholder="Search..." 
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <Button variant="outline" className="flex items-center">
        <Filter className="h-4 w-4 mr-2" />
        Filters
      </Button>
    </div>
  );
}
