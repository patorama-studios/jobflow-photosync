
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { AlertCircle, RefreshCw, Trash2 } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";

type Integration = {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  connected: boolean;
  status?: 'active' | 'pending' | 'error';
  lastSynced?: string;
};

interface IntegrationDialogProps {
  integration: Integration;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function IntegrationDialog({ integration, open, onOpenChange }: IntegrationDialogProps) {
  const { name, id, connected, icon: Icon } = integration;
  const [isConnected, setIsConnected] = useState(connected);
  const [apiKey, setApiKey] = useState("");
  const [webhookUrl, setWebhookUrl] = useState("");
  const [isSync, setIsSync] = useState(true);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isSyncLoading, setIsSyncLoading] = useState(false);
  const { toast } = useToast();

  const handleConnect = () => {
    // This would be an API call in a real app
    setIsConnected(true);
    
    toast({
      title: "Integration connected",
      description: `${name} has been successfully connected.`,
    });
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setIsDeleteOpen(false);
    
    toast({
      title: "Integration disconnected",
      description: `${name} has been disconnected.`,
    });
  };

  const handleSync = () => {
    setIsSyncLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSyncLoading(false);
      toast({
        title: "Synchronization complete",
        description: `${name} data has been synchronized.`,
      });
    }, 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[475px]">
        <DialogHeader>
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-primary/10 rounded-md">
              <Icon className="h-6 w-6 text-primary" />
            </div>
            <DialogTitle>{name} Integration</DialogTitle>
          </div>
          <DialogDescription>
            Configure your connection with {name}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-5 py-4">
          {isConnected ? (
            // Connected view
            <>
              <div className="flex justify-between items-center">
                <Label htmlFor="connection-status">Connection</Label>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-green-600 font-medium">Active</span>
                  <div className="h-2 w-2 rounded-full bg-green-600"></div>
                </div>
              </div>
              
              <div className="space-y-1">
                <Label>Last synchronized</Label>
                <p className="text-sm text-muted-foreground">
                  {integration.lastSynced || 'Never'}
                </p>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-sync</Label>
                    <p className="text-xs text-muted-foreground">Sync every hour</p>
                  </div>
                  <Switch 
                    checked={isSync} 
                    onCheckedChange={setIsSync} 
                  />
                </div>
                
                {id === 'zapier' && (
                  <div className="space-y-2">
                    <Label htmlFor="webhook-url">Webhook URL</Label>
                    <Input 
                      id="webhook-url"
                      value={webhookUrl}
                      onChange={(e) => setWebhookUrl(e.target.value)} 
                      placeholder="https://hooks.zapier.com/hooks/catch/..."
                    />
                    <p className="text-xs text-muted-foreground">
                      Enter your Zapier webhook URL to trigger automations
                    </p>
                  </div>
                )}
              </div>
              
              <div className="pt-2">
                <Button 
                  className="w-full"
                  onClick={handleSync}
                  disabled={isSyncLoading}
                >
                  {isSyncLoading ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Syncing...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Sync Now
                    </>
                  )}
                </Button>
              </div>
            </>
          ) : (
            // Not connected view
            <>
              <div className="space-y-2">
                <Label htmlFor="api-key">API Key</Label>
                <Input 
                  id="api-key"
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)} 
                  placeholder="Enter your API key"
                />
                <p className="text-xs text-muted-foreground">
                  You can find your API key in your {name} account settings
                </p>
              </div>
              
              {id === 'zapier' && (
                <div className="space-y-2">
                  <Label htmlFor="webhook-url">Webhook URL</Label>
                  <Input 
                    id="webhook-url"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)} 
                    placeholder="https://hooks.zapier.com/hooks/catch/..."
                  />
                </div>
              )}
              
              <div className="flex items-start space-x-2 text-amber-600">
                <AlertCircle className="h-5 w-5 mt-0.5" />
                <p className="text-sm">
                  Make sure to keep your API keys secure. Never share them with others.
                </p>
              </div>
            </>
          )}
        </div>
        
        <DialogFooter className="flex justify-between items-center">
          {isConnected ? (
            <>
              <Popover open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Disconnect
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-medium">Disconnect Integration</h4>
                      <p className="text-sm text-muted-foreground">
                        Are you sure you want to disconnect {name}? This action cannot be undone.
                      </p>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setIsDeleteOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={handleDisconnect}
                      >
                        Disconnect
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              <Button onClick={() => onOpenChange(false)}>
                Done
              </Button>
            </>
          ) : (
            <>
              <Button 
                variant="outline" 
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleConnect}
                disabled={!apiKey}
              >
                Connect
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
