
import React, { useState } from 'react';
import { Separator } from "@/components/ui/separator";
import { IntegrationStatus } from './IntegrationStatus';
import { WebhookSection } from './WebhookSection';
import { IntegrationControls } from './IntegrationControls';
import { Card } from "@/components/ui/card";
import { Folder, Edit2, Check, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createBoxIntegration } from "@/lib/box-integration";
import { useToast } from "@/hooks/use-toast";

interface BoxConnectedViewProps {
  lastSynced?: string;
  isSync: boolean;
  setIsSync: (isSync: boolean) => void;
  isSyncLoading: boolean;
  handleSync: () => void;
  handleOpenBox: () => void;
  masterFolderId: string;
  setMasterFolderId: (id: string) => void;
  handleDisconnect: () => void;
}

export function BoxConnectedView({
  lastSynced,
  isSync,
  setIsSync,
  isSyncLoading,
  handleSync,
  handleOpenBox,
  masterFolderId,
  setMasterFolderId,
  handleDisconnect
}: BoxConnectedViewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempFolderId, setTempFolderId] = useState(masterFolderId || "");
  const { toast } = useToast();
  
  // Get authentication time
  const authTime = localStorage.getItem('box_auth_time');
  const formattedAuthTime = authTime 
    ? new Date(authTime).toLocaleString() 
    : 'Unknown';
  
  const handleStartEditing = () => {
    setTempFolderId(masterFolderId || "");
    setIsEditing(true);
  };
  
  const handleCancelEditing = () => {
    setIsEditing(false);
  };
  
  const handleSaveFolder = async () => {
    try {
      if (!tempFolderId) {
        toast({
          title: "Validation Error",
          description: "Master folder ID cannot be empty.",
          variant: "destructive",
        });
        return;
      }
      
      // Save the folder ID to localStorage
      localStorage.setItem('box_master_folder_id', tempFolderId);
      
      // Initialize Box integration with the new folder ID
      const boxIntegration = createBoxIntegration();
      boxIntegration.setMasterFolder(tempFolderId);
      
      // Update state
      setMasterFolderId(tempFolderId);
      setIsEditing(false);
      
      toast({
        title: "Folder updated",
        description: "Master folder has been successfully updated.",
      });
    } catch (error) {
      console.error("Failed to save folder:", error);
      toast({
        title: "Update failed",
        description: "Failed to update master folder. Please check the folder ID.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <>
      <IntegrationStatus lastSynced={lastSynced} />
      
      <div className="p-3 bg-green-50 border border-green-200 rounded-md mb-4">
        <p className="text-sm text-green-800">
          <span className="font-medium">Authentication status:</span> Connected
        </p>
        <p className="text-xs text-green-600">
          Last authenticated: {formattedAuthTime}
        </p>
      </div>
      
      <Separator />
      
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Connected Folder</h3>
        <Card className="p-3">
          {isEditing ? (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Folder className="h-5 w-5 text-muted-foreground" />
                <Input 
                  value={tempFolderId}
                  onChange={(e) => setTempFolderId(e.target.value)}
                  placeholder="Enter Box folder ID"
                  className="flex-1"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleCancelEditing}
                >
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
                <Button 
                  size="sm" 
                  onClick={handleSaveFolder}
                >
                  <Check className="h-4 w-4 mr-1" />
                  Save
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Folder className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Master Folder</p>
                  <p className="text-xs text-muted-foreground">ID: {masterFolderId || "Not set"}</p>
                </div>
              </div>
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={handleStartEditing}
              >
                <Edit2 className="h-4 w-4 mr-1" />
                Edit
              </Button>
            </div>
          )}
        </Card>
      </div>
      
      <WebhookSection 
        id="box"
        isSync={isSync}
        setIsSync={setIsSync}
        webhookUrl=""
        setWebhookUrl={() => {}}
        webhookSecret=""
        setWebhookSecret={() => {}}
      />
      
      <IntegrationControls
        id="box"
        isSyncLoading={isSyncLoading}
        handleSync={handleSync}
        handleOpenService={handleOpenBox}
      />
      
      <div className="mt-4">
        <Button 
          variant="outline" 
          className="w-full text-red-500 hover:text-red-700 hover:bg-red-50"
          onClick={handleDisconnect}
        >
          Disconnect Box Integration
        </Button>
      </div>
    </>
  );
}
