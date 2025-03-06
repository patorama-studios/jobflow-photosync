import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { createBoxIntegration } from "@/lib/box-integration";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";

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
  const [mode, setMode] = useState<'test' | 'live'>('live'); // Changed to 'live' from 'test'
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const { user } = useAuth();
  
  useEffect(() => {
    // Reset state when the dialog opens with a different integration
    setIsConnected(connected);
    setApiKey("");
    setSecretKey("");
    setWebhookSecret("");
    setWebhookUrl("");
    setMasterFolderId("");
    setIsDeleteOpen(false);
    
    // Load existing integration settings from localStorage
    if (connected && id === 'box') {
      const savedMasterFolderId = localStorage.getItem('box_master_folder_id');
      if (savedMasterFolderId) {
        setMasterFolderId(savedMasterFolderId);
      }
    }
  }, [id, connected, open]);

  const handleConnect = async () => {
    // Check if user is authenticated
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to connect integrations.",
        variant: "destructive",
      });
      return;
    }
    
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
        // Check if authenticated with Box
        const boxToken = localStorage.getItem('box_access_token');
        if (!boxToken) {
          toast({
            title: "Box Authentication Required",
            description: "Please authenticate with Box before connecting.",
            variant: "destructive",
          });
          return;
        }
        
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
        
        // Save the master folder ID
        localStorage.setItem('box_master_folder_id', masterFolderId);
        boxIntegration.setMasterFolder(masterFolderId);
        
        // In a real implementation, we would test the connection by getting folder info
        // await boxIntegration.getFolderInfo(masterFolderId);
        
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
    if (id === 'box') {
      // Clear Box-related data from localStorage
      localStorage.removeItem('box_master_folder_id');
      // Don't remove the auth token - that's separate from disconnecting the integration
    }
    
    // In a real app, we would delete the integration from the database
    // await supabase.from('user_integrations').delete().eq('user_id', user.id).eq('integration_id', id);
    
    setIsConnected(false);
    setIsDeleteOpen(false);
    
    // Reset form values
    setApiKey("");
    setSecretKey("");
    setWebhookSecret("");
    setWebhookUrl("");
    setMasterFolderId("");
    
    toast({
      title: "Integration disconnected",
      description: `${name} has been disconnected.`,
    });
  };

  const handleSync = () => {
    // In a real app, we would sync the integration data
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
                  masterFolderId={masterFolderId}
                  setMasterFolderId={setMasterFolderId}
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
