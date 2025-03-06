
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface WebhookSectionProps {
  id: string;
  isSync: boolean;
  setIsSync: (isSync: boolean) => void;
  webhookUrl: string;
  setWebhookUrl: (url: string) => void;
  webhookSecret: string;
  setWebhookSecret: (secret: string) => void;
}

export function WebhookSection({ 
  id, 
  isSync, 
  setIsSync,
  webhookUrl,
  setWebhookUrl,
  webhookSecret,
  setWebhookSecret
}: WebhookSectionProps) {
  return (
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
  );
}
