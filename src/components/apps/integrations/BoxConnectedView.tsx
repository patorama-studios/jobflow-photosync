
import React from 'react';
import { Separator } from "@/components/ui/separator";
import { IntegrationStatus } from './IntegrationStatus';
import { WebhookSection } from './WebhookSection';
import { IntegrationControls } from './IntegrationControls';
import { Card } from "@/components/ui/card";
import { Folder } from "lucide-react";

interface BoxConnectedViewProps {
  lastSynced?: string;
  isSync: boolean;
  setIsSync: (isSync: boolean) => void;
  isSyncLoading: boolean;
  handleSync: () => void;
  handleOpenBox: () => void;
  masterFolderId?: string;
}

export function BoxConnectedView({
  lastSynced,
  isSync,
  setIsSync,
  isSyncLoading,
  handleSync,
  handleOpenBox,
  masterFolderId
}: BoxConnectedViewProps) {
  return (
    <>
      <IntegrationStatus lastSynced={lastSynced} />
      
      <Separator />
      
      {masterFolderId && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Connected Folder</h3>
          <Card className="p-3 flex items-center space-x-2">
            <Folder className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Master Folder</p>
              <p className="text-xs text-muted-foreground">ID: {masterFolderId}</p>
            </div>
          </Card>
        </div>
      )}
      
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
