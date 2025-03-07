
import React from "react";
import { Link, NavigateFunction } from "react-router-dom";
import { 
  ChevronLeft, 
  Building, 
  Pencil, 
  KeyRound, 
  MessageSquare,
  Lock,
  Unlock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Customer } from "@/components/clients/mock-data";
import { mockCompanies } from "@/components/clients/mock-data";
import { useDialog } from "@/hooks/use-dialog";
import { EditClientDialog } from "@/components/clients/details/EditClientDialog";

interface ClientHeaderProps {
  client: Customer;
  contentLocked: boolean;
  navigate: NavigateFunction;
  onClientUpdated?: () => void;
  onResetPassword?: () => void;
  onPhotoUpload?: () => void;
}

export function ClientHeader({ 
  client, 
  contentLocked, 
  navigate, 
  onClientUpdated,
  onResetPassword,
  onPhotoUpload
}: ClientHeaderProps) {
  const { open, setOpen } = useDialog();
  
  // Get company info if the client has a company
  const getCompanyInfo = () => {
    if (client.company) {
      const company = mockCompanies.find(c => c.name === client.company);
      return company;
    }
    return null;
  };
  
  const company = getCompanyInfo();

  const handleBackClick = () => {
    navigate("/clients");
  };

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={handleBackClick}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-4">
          <Avatar 
            className="h-16 w-16 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={onPhotoUpload}
          >
            <AvatarImage src={client.photoUrl} alt={client.name} />
            <AvatarFallback className="text-lg">{client.name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{client.name}</h1>
              <Badge variant={contentLocked ? "destructive" : "outline"} className={contentLocked ? "" : "bg-green-100 text-green-700"}>
                {contentLocked ? (
                  <>
                    <Lock className="h-3 w-3 mr-1" />
                    Content Locked
                  </>
                ) : (
                  <>
                    <Unlock className="h-3 w-3 mr-1" />
                    Content Unlocked
                  </>
                )}
              </Badge>
            </div>
            {client.company && (
              <Link 
                to={`/companies/${company?.id}`} 
                className="text-muted-foreground hover:text-primary flex items-center"
              >
                <Building className="h-3 w-3 mr-1" />
                {client.company}
              </Link>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
          <Pencil className="h-4 w-4 mr-2" />
          Edit Details
        </Button>
        {onResetPassword && (
          <Button variant="outline" size="sm" onClick={onResetPassword}>
            <KeyRound className="h-4 w-4 mr-2" />
            Reset Password
          </Button>
        )}
      </div>
      
      <EditClientDialog 
        open={open} 
        onOpenChange={setOpen} 
        client={client} 
        onClientUpdated={onClientUpdated}
      />
    </div>
  );
}
