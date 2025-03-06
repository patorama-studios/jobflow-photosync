
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle } from 'lucide-react';

interface StripeConnectFormProps {
  mode: 'test' | 'live';
  setMode: (mode: 'test' | 'live') => void;
  apiKey: string;
  setApiKey: (key: string) => void;
  secretKey: string;
  setSecretKey: (key: string) => void;
  webhookSecret: string;
  setWebhookSecret: (key: string) => void;
}

export function StripeConnectForm({
  mode,
  setMode,
  apiKey,
  setApiKey,
  secretKey,
  setSecretKey,
  webhookSecret,
  setWebhookSecret
}: StripeConnectFormProps) {
  return (
    <div className="space-y-4">
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
      
      <div className="space-y-2">
        <Label htmlFor="publishable-key">Publishable Key</Label>
        <Input 
          id="publishable-key"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)} 
          placeholder={mode === 'test' ? "pk_test_..." : "pk_live_..."}
        />
        <p className="text-xs text-muted-foreground">
          Your Stripe publishable key for client-side operations
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="secret-key">Secret Key</Label>
        <Input 
          id="secret-key"
          type="password"
          value={secretKey}
          onChange={(e) => setSecretKey(e.target.value)} 
          placeholder={mode === 'test' ? "sk_test_..." : "sk_live_..."}
        />
        <p className="text-xs text-muted-foreground">
          Your Stripe secret key (stored securely for server operations)
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="webhook-secret">Webhook Secret (Optional)</Label>
        <Input 
          id="webhook-secret"
          type="password"
          value={webhookSecret}
          onChange={(e) => setWebhookSecret(e.target.value)} 
          placeholder="whsec_..."
        />
        <p className="text-xs text-muted-foreground">
          Used to verify incoming webhook events from Stripe
        </p>
      </div>
      
      <div className="p-3 bg-amber-50 rounded-md border border-amber-200">
        <p className="text-sm flex items-start gap-2">
          <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
          <span>
            Your secret key must be kept confidential and should only be stored in secure environments. 
            It will be saved on the server side only.
          </span>
        </p>
      </div>
    </div>
  );
}
