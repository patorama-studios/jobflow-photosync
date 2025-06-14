import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Camera, ExternalLink, Shield, Info } from 'lucide-react';

interface EsoftConnectFormProps {
  clientId: string;
  setClientId: (value: string) => void;
  apiUsername: string;
  setApiUsername: (value: string) => void;
  apiPassword: string;
  setApiPassword: (value: string) => void;
  whiteLabelDomain: string;
  setWhiteLabelDomain: (value: string) => void;
}

export function EsoftConnectForm({
  clientId,
  setClientId,
  apiUsername,
  setApiUsername,
  apiPassword,
  setApiPassword,
  whiteLabelDomain,
  setWhiteLabelDomain
}: EsoftConnectFormProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Connect Esoft</CardTitle>
          <CardDescription>
            Enter your Esoft credentials to enable photo editing services integration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              Your credentials are securely stored and only used for API communication with Esoft services.
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Label htmlFor="clientId">Client ID</Label>
            <Input
              id="clientId"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              placeholder="e.g., 70100293"
            />
            <p className="text-sm text-muted-foreground">
              Your unique Esoft client identifier
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="apiUsername">API Username</Label>
            <Input
              id="apiUsername"
              value={apiUsername}
              onChange={(e) => setApiUsername(e.target.value)}
              placeholder="e.g., pta-live"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="apiPassword">API Password</Label>
            <Input
              id="apiPassword"
              type="password"
              value={apiPassword}
              onChange={(e) => setApiPassword(e.target.value)}
              placeholder="Enter your API password"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="whiteLabelDomain">White Label Domain (Optional)</Label>
            <Input
              id="whiteLabelDomain"
              value={whiteLabelDomain}
              onChange={(e) => setWhiteLabelDomain(e.target.value)}
              placeholder="e.g., https://upload.patorama.com.au"
            />
            <p className="text-sm text-muted-foreground">
              Custom Coconut domain for white label customers
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            About Esoft Integration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Camera className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium text-sm">Professional Photo Editing</p>
                <p className="text-sm text-muted-foreground">
                  Automated photo enhancement and editing services
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Camera className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium text-sm">Automatic Delivery</p>
                <p className="text-sm text-muted-foreground">
                  Seamless integration with your photography workflow
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Camera className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium text-sm">Quality Assurance</p>
                <p className="text-sm text-muted-foreground">
                  Professional editing standards for real estate photography
                </p>
              </div>
            </div>
          </div>

          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Need Esoft credentials?</strong> Contact your Esoft account manager or visit{' '}
              <a
                href="https://esoft.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline inline-flex items-center gap-1"
              >
                esoft.com
                <ExternalLink className="h-3 w-3" />
              </a>
              {' '}to set up your account.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}