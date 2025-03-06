
import React from 'react';
import { Separator } from "@/components/ui/separator";
import { IntegrationStatus } from './IntegrationStatus';
import { WebhookSection } from './WebhookSection';
import { IntegrationControls } from './IntegrationControls';

interface GenericConnectedViewProps {
  id: string;
  lastSynced?: string;
  isSync: boolean;
  setIsSync: (isSync: boolean) => void;
  webhookUrl: string;
  setWebhookUrl: (url: string) => void;
  isSyncLoading: boolean;
  handleSync: () => void;
}

export function GenericConnectedView({
  id,
  lastSynced,
  isSync,
  setIsSync,
  webhookUrl,
  setWebhookUrl,
  isSyncLoading,
  handleSync
}: GenericConnectedViewProps) {
  return (
    <>
      <IntegrationStatus lastSynced={lastSynced} />
      
      <Separator />
      
      <WebhookSection 
        id={id}
        isSync={isSync}
        setIsSync={setIsSync}
        webhookUrl={webhookUrl}
        setWebhookUrl={setWebhookUrl}
        webhookSecret=""
        setWebhookSecret={() => {}}
      />
      
      <IntegrationControls
        id={id}
        isSyncLoading={isSyncLoading}
        handleSync={handleSync}
      />
    </>
  );
}
