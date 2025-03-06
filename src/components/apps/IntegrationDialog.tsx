
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { createBoxIntegration } from "@/lib/box-integration";
import { useIsMobile } from "@/hooks/use-mobile";

// Import the integration components
import { IntegrationHeader } from './integrations/IntegrationHeader';
import { BoxConnectForm } from './integrations/BoxConnectForm';
import { StripeConnectForm } from './integrations/StripeConnectForm';
import { GenericConnectForm } from './integrations/GenericConnectForm';
import { StripeConnectedView } from './integrations/StripeConnectedView';
import { BoxConnectedView } from './integrations/BoxConnectedView';
import { GenericConnectedView } from './integrations/GenericConnectedView';
import { ModalFooterActions } from './integrations/ModalFooterActions';
import { isConnectDisabled } from './integrations/utils';
import { Integration } from './types';

interface IntegrationDialogProps {
  integration: Integration;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function IntegrationDialog({ integration, open, onOpenChange }: IntegrationDialogProps) {
  const { name, id, connected, icon, status, lastSynced } = integration;
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
        <IntegrationHeader name={name} icon={icon} />
        
        <div className="space-y-5 py-4">
          {isConnected ? (
            // Connected view
            <>
              {id === 'stripe' && (
                <StripeConnectedView 
                  mode={mode}
                  setMode={setMode}
                  lastSynced={lastSynced}
                  isSync={isSync}
                  setIsSync={setIsSync}
                  webhookSecret={webhookSecret}
                  setWebhookSecret={setWebhookSecret}
                  isSyncLoading={isSyncLoading}
                  handleSync={handleSync}
                  handleOpenStripe={handleOpenStripe}
                />
              )}
              
              {id === 'box' && (
                <BoxConnectedView 
                  lastSynced={lastSynced}
                  isSync={isSync}
                  setIsSync={setIsSync}
                  isSyncLoading={isSyncLoading}
                  handleSync={handleSync}
                  handleOpenBox={handleOpenBox}
                />
              )}
              
              {id !== 'stripe' && id !== 'box' && (
                <GenericConnectedView 
                  id={id}
                  lastSynced={lastSynced}
                  isSync={isSync}
                  setIsSync={setIsSync}
                  webhookUrl={webhookUrl}
                  setWebhookUrl={setWebhookUrl}
                  isSyncLoading={isSyncLoading}
                  handleSync={handleSync}
                />
              )}
            </>
          ) : (
            // Not connected view
            <>
              {id === 'box' ? (
                <BoxConnectForm 
                  masterFolderId={masterFolderId}
                  setMasterFolderId={setMasterFolderId}
                />
              ) : id === 'stripe' ? (
                <StripeConnectForm 
                  mode={mode}
                  setMode={setMode}
                  apiKey={apiKey}
                  setApiKey={setApiKey}
                  secretKey={secretKey}
                  setSecretKey={setSecretKey}
                  webhookSecret={webhookSecret}
                  setWebhookSecret={setWebhookSecret}
                />
              ) : (
                <GenericConnectForm 
                  id={id}
                  name={name}
                  apiKey={apiKey}
                  setApiKey={setApiKey}
                  webhookUrl={webhookUrl}
                  setWebhookUrl={setWebhookUrl}
                />
              )}
            </>
          )}
        </div>
        
        <ModalFooterActions 
          isConnected={isConnected}
          isDeleteOpen={isDeleteOpen}
          setIsDeleteOpen={setIsDeleteOpen}
          handleDisconnect={handleDisconnect}
          onOpenChange={onOpenChange}
          handleConnect={handleConnect}
          name={name}
          isConnectDisabled={isConnectDisabled(id, masterFolderId, apiKey, secretKey)}
          isMobile={isMobile}
        />
      </DialogContent>
    </Dialog>
  );
}
