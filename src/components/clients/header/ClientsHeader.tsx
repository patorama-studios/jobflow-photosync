
import { Download, Upload, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ClientsHeaderProps {
  activeTab: string;
  onImport: () => void;
  onExport: () => void;
  onAddCompany: () => void;
}

export function ClientsHeader({ 
  activeTab, 
  onImport, 
  onExport, 
  onAddCompany 
}: ClientsHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-3xl font-semibold">Clients</h1>
        <p className="text-muted-foreground mt-1">
          Manage all your clients, teams and companies
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={onExport}>
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
        <Button variant="outline" size="sm" onClick={onImport}>
          <Upload className="h-4 w-4 mr-2" />
          Import
        </Button>
        {activeTab === "companies" && (
          <Button size="sm" onClick={onAddCompany}>
            <Plus className="h-4 w-4 mr-2" />
            Add Company
          </Button>
        )}
      </div>
    </div>
  );
}
