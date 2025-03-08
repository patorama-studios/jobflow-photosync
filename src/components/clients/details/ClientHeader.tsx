
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Key, Upload } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useNavigate, useLocation } from "react-router-dom";

interface ClientHeaderProps {
  client: any;
  contentLocked?: boolean;
  navigate: ReturnType<typeof useNavigate>;
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
  const location = useLocation();
  
  const handleBack = () => {
    // Check if we have state to go back to
    if (location.state?.from) {
      navigate(location.state.from);
    } else {
      // Default fallback is the clients or customers list
      navigate('/customers');
    }
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6">
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex gap-1 items-center p-2"
          onClick={handleBack}
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </Button>
        
        <h1 className="text-2xl font-bold">
          {client?.name || "Client Details"}
        </h1>
        
        {client?.status && (
          <Badge variant={client.status === "active" ? "success" : "secondary"}>
            {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
          </Badge>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2">
        {onPhotoUpload && (
          <Button variant="outline" size="sm" onClick={onPhotoUpload}>
            <Upload className="mr-2 h-4 w-4" />
            Update Photo
          </Button>
        )}
        
        {onClientUpdated && (
          <Button variant="outline" size="sm" onClick={onClientUpdated}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
        )}
        
        {onResetPassword && (
          <Button variant="outline" size="sm" onClick={onResetPassword}>
            <Key className="mr-2 h-4 w-4" />
            Reset Password
          </Button>
        )}
      </div>
    </div>
  );
}
