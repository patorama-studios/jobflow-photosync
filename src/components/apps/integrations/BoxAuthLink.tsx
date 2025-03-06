
import React from 'react';
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BoxAuthLinkProps {
  setIsAuthenticated: (isAuthenticated: boolean) => void;
}

export function BoxAuthLink({ setIsAuthenticated }: BoxAuthLinkProps) {
  const { toast } = useToast();

  // In a real implementation, this would redirect to the Box OAuth endpoint
  const handleAuth = async () => {
    try {
      // Simulate successful Box authentication
      localStorage.setItem('box_access_token', 'simulated_box_auth_token');
      localStorage.setItem('box_auth_time', new Date().toISOString());
      
      setIsAuthenticated(true);
      
      toast({
        title: "Box Authentication Successful",
        description: "Your Box account has been connected successfully.",
      });
    } catch (error) {
      console.error("Box authentication error:", error);
      toast({
        title: "Authentication Failed",
        description: "Unable to authenticate with Box. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Button 
      className="w-full"
      onClick={handleAuth}
    >
      <ExternalLink className="h-4 w-4 mr-2" />
      Authenticate with Box
    </Button>
  );
}
