
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, LogIn } from "lucide-react";

export function ErrorState() {
  const navigate = useNavigate();
  
  return (
    <div className="text-center p-8 space-y-4">
      <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500" />
      <h3 className="text-lg font-medium">Profile Not Available</h3>
      <p className="text-muted-foreground mb-4">
        Your profile information couldn't be loaded. This may be because you're not logged in 
        or your profile hasn't been created yet.
      </p>
      <div className="flex justify-center gap-3">
        <Button 
          onClick={() => navigate('/login', { state: { from: '/settings' } })}
          variant="default"
        >
          <LogIn className="mr-2 h-4 w-4" />
          Log In
        </Button>
        <Button 
          onClick={() => window.location.reload()}
          variant="outline"
        >
          Try Again
        </Button>
      </div>
    </div>
  );
}
