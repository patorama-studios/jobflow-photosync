
import React from 'react';
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

interface BoxAuthLinkProps {
  setIsAuthenticated: (isAuthenticated: boolean) => void;
}

export function BoxAuthLink({ setIsAuthenticated }: BoxAuthLinkProps) {
  const handleAuth = async () => {
    // In a real implementation, this would redirect to Box OAuth
    // For demo purposes, we'll simulate authentication by setting a token directly
    
    // Production code would use something like this:
    // const clientId = process.env.BOX_CLIENT_ID;
    // const redirectUri = window.location.origin + window.location.pathname;
    // const state = generateRandomString(); // For CSRF protection
    // window.location.href = `https://account.box.com/api/oauth2/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&state=${state}`;
    
    // For demo purposes, simulate successful authentication:
    localStorage.setItem('box_access_token', 'simulated_demo_token');
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
