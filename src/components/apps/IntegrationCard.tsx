
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Integration = {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  connected: boolean;
  status?: 'active' | 'pending' | 'error';
  lastSynced?: string;
};

interface IntegrationCardProps {
  integration: Integration;
  onClick: () => void;
}

export function IntegrationCard({ integration, onClick }: IntegrationCardProps) {
  const { name, description, icon: Icon, connected, status, lastSynced } = integration;

  return (
    <Card className={cn(
      "overflow-hidden transition-all duration-200 cursor-pointer hover:shadow-md",
      connected ? "border-l-4 border-l-primary" : ""
    )}
    onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="p-2 bg-primary/10 rounded-md">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          {connected && (
            <Badge variant={status === 'error' ? 'destructive' : 'default'}>
              {status === 'active' ? 'Connected' : status === 'pending' ? 'Pending' : 'Error'}
            </Badge>
          )}
        </div>
        <CardTitle className="mt-2">{name}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {connected && lastSynced && (
          <p className="text-xs text-muted-foreground">Last synced: {lastSynced}</p>
        )}
      </CardContent>
      <CardFooter className="pt-0">
        <Button 
          variant={connected ? "outline" : "default"} 
          size="sm" 
          className="w-full"
        >
          {connected ? 'Manage' : 'Connect'}
        </Button>
      </CardFooter>
    </Card>
  );
}
