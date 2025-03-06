
import React from 'react';
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

interface BoxAuthLinkProps {
  setIsAuthenticated: (isAuthenticated: boolean) => void;
}

export function BoxAuthLink({ setIsAuthenticated }: BoxAuthLinkProps) {
  const handleAuth = async () => {
    // In a real implementation, this would redirect to Box OAuth
    // For this demo, we're simulating authentication with localStorage
    
    // Simulate the Box OAuth process by setting a token directly
    localStorage.setItem('box_access_token', 'simulated_box_auth_token');
    setIsAuthenticated(true);
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
