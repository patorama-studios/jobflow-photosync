
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle } from 'lucide-react';

interface GenericConnectFormProps {
  id: string;
  name: string;
  apiKey: string;
  setApiKey: (key: string) => void;
  webhookUrl?: string;
  setWebhookUrl?: (url: string) => void;
}

export function GenericConnectForm({ 
  id, 
  name, 
  apiKey, 
  setApiKey,
  webhookUrl,
  setWebhookUrl
}: GenericConnectFormProps) {
  return (
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
      
      {id === 'zapier' && setWebhookUrl && (
        <div className="space-y-2">
          <Label htmlFor="webhook-url">Webhook URL</Label>
          <Input 
            id="webhook-url"
            value={webhookUrl || ''}
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
  );
}
