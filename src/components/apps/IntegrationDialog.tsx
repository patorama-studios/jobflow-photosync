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
import { Badge } from "@/components/ui/badge";
import { AlertCircle, RefreshCw, Trash2, ExternalLink, CreditCard } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { createBoxIntegration } from "@/lib/box-integration";
import { useIsMobile } from "@/hooks/use-mobile";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  const [secretKey, setSecretKey] = useState("");
  const [webhookSecret, setWebhookSecret] = useState("");
  const [webhookUrl, setWebhookUrl] = useState("");
  const [isSync, setIsSync] = useState(true);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isSyncLoading, setIsSyncLoading] = useState(false);
  const [masterFolderId, setMasterFolderId] = useState("");
  const [mode, setMode] = useState<'test' | 'live'>('test');
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const handleConnect = async () => {
    // For Stripe integration
    if (id === 'stripe') {
      try {
        if (!apiKey || !secretKey) {
          toast({
            title: "API Keys Required",
            description: "Please enter both publishable and secret keys to connect with Stripe.",
            variant: "destructive",
          });
          return;
        }
        
        // Simulate verifying the API keys
        // In a real implementation, we would make a request to the Stripe API to verify the keys
        
        setIsConnected(true);
        toast({
          title: "Stripe connected",
          description: `Your Stripe account has been successfully connected in ${mode} mode.`,
        });
      } catch (error) {
        console.error("Stripe connection error:", error);
        toast({
          title: "Connection failed",
          description: `Failed to connect to Stripe. Please check your credentials.`,
          variant: "destructive",
        });
        return;
      }
    } else if (id === 'box') {
      try {
        // Create a Box integration instance
        const boxIntegration = createBoxIntegration();
        
        if (!masterFolderId) {
          toast({
            title: "Master Folder ID Required",
            description: "Please enter a master folder ID to connect with Box.",
            variant: "destructive",
          });
          return;
        }
        
        // Test the connection by trying to get folder info
        boxIntegration.setMasterFolder(masterFolderId);
        await boxIntegration.initializeAutoFolder();
        
        setIsConnected(true);
        toast({
          title: "Integration connected",
          description: `${name} has been successfully connected.`,
        });
      } catch (error) {
        console.error("Box connection error:", error);
        toast({
          title: "Connection failed",
          description: `Failed to connect to ${name}. Please check your credentials.`,
          variant: "destructive",
        });
        return;
      }
    } else {
      // For other integrations
      setIsConnected(true);
      toast({
        title: "Integration connected",
        description: `${name} has been successfully connected.`,
      });
    }
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

  const handleOpenStripe = () => {
    window.open('https://dashboard.stripe.com', '_blank');
  };

  const handleOpenBox = () => {
    window.open('https://app.box.com', '_blank');
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
              
              {id === 'stripe' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="mode">Mode</Label>
                    <Badge variant={mode === 'test' ? 'outline' : 'default'}>
                      {mode === 'test' ? 'TEST MODE' : 'LIVE MODE'}
                    </Badge>
                  </div>
                  <Select 
                    value={mode} 
                    onValueChange={(value) => setMode(value as 'test' | 'live')}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="test">Test Mode</SelectItem>
                      <SelectItem value="live">Live Mode</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              
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
                
                {id === 'stripe' && (
                  <div className="space-y-2">
                    <Label htmlFor="webhook-secret">Webhook Secret</Label>
                    <Input 
                      id="webhook-secret"
                      type="password"
                      value={webhookSecret}
                      onChange={(e) => setWebhookSecret(e.target.value)} 
                      placeholder="whsec_..."
                    />
                    <p className="text-xs text-muted-foreground">
                      Enter your Stripe webhook secret to verify events
                    </p>
                  </div>
                )}
              </div>
              
              <div className="pt-2 space-y-2">
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
                
                {id === 'box' && (
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={handleOpenBox}
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Open Box.com
                  </Button>
                )}
                
                {id === 'stripe' && (
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={handleOpenStripe}
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Open Stripe Dashboard
                  </Button>
                )}
              </div>
            </>
          ) : (
            // Not connected view
            <>
              {id === 'box' ? (
                <div className="space-y-4">
                  <div className="p-3 bg-primary/10 rounded-md">
                    <p className="text-sm">
                      Developer token is already set up. Just enter your master folder ID to connect.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="master-folder">Master Folder ID</Label>
                    <Input 
                      id="master-folder"
                      value={masterFolderId}
                      onChange={(e) => setMasterFolderId(e.target.value)} 
                      placeholder="Enter your Box folder ID"
                    />
                    <p className="text-xs text-muted-foreground">
                      Find your folder ID in the URL when viewing a folder in Box
                    </p>
                  </div>
                </div>
              ) : id === 'stripe' ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="mode">Mode</Label>
                    <Badge variant={mode === 'test' ? 'outline' : 'default'}>
                      {mode === 'test' ? 'TEST MODE' : 'LIVE MODE'}
                    </Badge>
                  </div>
                  <Select 
                    value={mode} 
                    onValueChange={(value) => setMode(value as 'test' | 'live')}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="test">Test Mode</SelectItem>
                      <SelectItem value="live">Live Mode</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <div className="space-y-2">
                    <Label htmlFor="publishable-key">Publishable Key</Label>
                    <Input 
                      id="publishable-key"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)} 
                      placeholder={mode === 'test' ? "pk_test_..." : "pk_live_..."}
                    />
                    <p className="text-xs text-muted-foreground">
                      Your Stripe publishable key for client-side operations
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="secret-key">Secret Key</Label>
                    <Input 
                      id="secret-key"
                      type="password"
                      value={secretKey}
                      onChange={(e) => setSecretKey(e.target.value)} 
                      placeholder={mode === 'test' ? "sk_test_..." : "sk_live_..."}
                    />
                    <p className="text-xs text-muted-foreground">
                      Your Stripe secret key (stored securely for server operations)
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="webhook-secret">Webhook Secret (Optional)</Label>
                    <Input 
                      id="webhook-secret"
                      type="password"
                      value={webhookSecret}
                      onChange={(e) => setWebhookSecret(e.target.value)} 
                      placeholder="whsec_..."
                    />
                    <p className="text-xs text-muted-foreground">
                      Used to verify incoming webhook events from Stripe
                    </p>
                  </div>
                  
                  <div className="p-3 bg-amber-50 rounded-md border border-amber-200">
                    <p className="text-sm flex items-start gap-2">
                      <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                      <span>
                        Your secret key must be kept confidential and should only be stored in secure environments. 
                        It will be saved on the server side only.
                      </span>
                    </p>
                  </div>
                </div>
              ) : (
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
                </>
              )}
              
              {id !== 'box' && id !== 'stripe' && (
                <div className="flex items-start space-x-2 text-amber-600">
                  <AlertCircle className="h-5 w-5 mt-0.5" />
                  <p className="text-sm">
                    Make sure to keep your API keys secure. Never share them with others.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
        
        <DialogFooter className={isMobile ? "flex-col" : "flex justify-between items-center"}>
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
                disabled={
                  (id === 'box' && !masterFolderId) || 
                  (id === 'stripe' && (!apiKey || !secretKey)) ||
                  (id !== 'box' && id !== 'stripe' && !apiKey)
                }
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
