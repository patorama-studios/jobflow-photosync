
import React from 'react';
import { Separator } from "@/components/ui/separator";
import { IntegrationStatus } from './IntegrationStatus';
import { WebhookSection } from './WebhookSection';
import { IntegrationControls } from './IntegrationControls';

interface BoxConnectedViewProps {
  lastSynced?: string;
  isSync: boolean;
  setIsSync: (isSync: boolean) => void;
  isSyncLoading: boolean;
  handleSync: () => void;
  handleOpenBox: () => void;
}

export function BoxConnectedView({
  lastSynced,
  isSync,
  setIsSync,
  isSyncLoading,
  handleSync,
  handleOpenBox
}: BoxConnectedViewProps) {
  return (
    <>
      <IntegrationStatus lastSynced={lastSynced} />
      
      <Separator />
      
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
