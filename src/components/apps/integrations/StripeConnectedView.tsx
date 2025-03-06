
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { IntegrationStatus } from './IntegrationStatus';
import { WebhookSection } from './WebhookSection';
import { IntegrationControls } from './IntegrationControls';

interface StripeConnectedViewProps {
  mode: 'test' | 'live';
  setMode: (mode: 'test' | 'live') => void;
  lastSynced?: string;
  isSync: boolean;
  setIsSync: (isSync: boolean) => void;
  webhookSecret: string;
  setWebhookSecret: (secret: string) => void;
  isSyncLoading: boolean;
  handleSync: () => void;
  handleOpenStripe: () => void;
}

export function StripeConnectedView({
  mode,
  setMode,
  lastSynced,
  isSync,
  setIsSync,
  webhookSecret,
  setWebhookSecret,
  isSyncLoading,
  handleSync,
  handleOpenStripe
}: StripeConnectedViewProps) {
  return (
    <>
      <IntegrationStatus lastSynced={lastSynced} />
      
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
      
      <Separator />
      
      <WebhookSection 
        id="stripe"
        isSync={isSync}
        setIsSync={setIsSync}
        webhookUrl=""
        setWebhookUrl={() => {}}
        webhookSecret={webhookSecret}
        setWebhookSecret={setWebhookSecret}
      />
      
      <IntegrationControls
        id="stripe"
        isSyncLoading={isSyncLoading}
        handleSync={handleSync}
        handleOpenService={handleOpenStripe}
      />
    </>
  );
}
