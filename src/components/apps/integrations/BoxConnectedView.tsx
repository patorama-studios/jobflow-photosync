
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
  masterFolderId?: string;
  setMasterFolderId: (id: string) => void;
}

export function BoxConnectedView({
  lastSynced,
  isSync,
  setIsSync,
  isSyncLoading,
  handleSync,
  handleOpenBox,
  masterFolderId,
  setMasterFolderId
}: BoxConnectedViewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempFolderId, setTempFolderId] = useState(masterFolderId || "");
  const { toast } = useToast();
  
  const handleStartEditing = () => {
    setTempFolderId(masterFolderId || "");
    setIsEditing(true);
  };
  
  const handleCancelEditing = () => {
    setIsEditing(false);
  };
  
  const handleSaveFolder = async () => {
    try {
      // Validate the new folder ID first
      const boxIntegration = createBoxIntegration();
      boxIntegration.setMasterFolder(tempFolderId);
      
      // In a real implementation, we would verify the folder exists:
      // const folderInfo = await boxIntegration.getFolderInfo(tempFolderId);
      // For now we'll just assume it worked
      
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
                  <p className="text-xs text-muted-foreground">ID: {masterFolderId}</p>
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
    </>
  );
}
