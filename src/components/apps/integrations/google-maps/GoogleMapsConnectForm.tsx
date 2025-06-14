import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MapPin, ExternalLink, Shield, Key } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface GoogleMapsConnectFormProps {
  onSuccess?: () => void;
}

export function GoogleMapsConnectForm({ onSuccess }: GoogleMapsConnectFormProps) {
  const [apiKey, setApiKey] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const { toast } = useToast();

  const validateApiKey = async (key: string): Promise<boolean> => {
    // Test the API key by making a simple request
    try {
      const testUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=Sydney,+AU&key=${key}`;
      const response = await fetch(testUrl);
      const data = await response.json();
      
      if (data.status === 'OK') {
        return true;
      } else if (data.status === 'REQUEST_DENIED') {
        console.error('Google Maps API key validation failed:', data.error_message);
        return false;
      }
      return false;
    } catch (error) {
      console.error('Error validating Google Maps API key:', error);
      return false;
    }
  };

  const handleConnect = async () => {
    if (!apiKey.trim()) {
      toast({
        title: 'API Key Required',
        description: 'Please enter your Google Maps API key',
        variant: 'destructive',
      });
      return;
    }

    setIsValidating(true);
    
    try {
      // Validate the API key
      const isValid = await validateApiKey(apiKey);
      
      if (isValid) {
        // Save the API key to localStorage
        localStorage.setItem('google_maps_api_key', apiKey);
        localStorage.setItem('google_maps_connected_at', new Date().toISOString());
        
        toast({
          title: 'Success!',
          description: 'Google Maps API key saved successfully. Address autocomplete is now enabled.',
        });
        
        if (onSuccess) {
          onSuccess();
        }
      } else {
        toast({
          title: 'Invalid API Key',
          description: 'The API key provided is not valid or does not have the required permissions. Please check your Google Cloud Console settings.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Connection Failed',
        description: 'Failed to validate the API key. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Connect Google Maps</CardTitle>
          <CardDescription>
            Enable address autocomplete and location services by adding your Google Maps API key
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              Your API key is stored locally in your browser and is never sent to our servers.
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Label htmlFor="api-key">Google Maps API Key</Label>
            <div className="flex gap-2">
              <Input
                id="api-key"
                type="password"
                placeholder="AIza..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="font-mono"
              />
              <Button
                onClick={handleConnect}
                disabled={isValidating || !apiKey.trim()}
              >
                {isValidating ? 'Validating...' : 'Connect'}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Enter your Google Maps API key with Places API enabled
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            How to get a Google Maps API Key
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>
              Go to the{' '}
              <a
                href="https://console.cloud.google.com/google/maps-apis/credentials"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline inline-flex items-center gap-1"
              >
                Google Cloud Console
                <ExternalLink className="h-3 w-3" />
              </a>
            </li>
            <li>Create a new project or select an existing one</li>
            <li>Enable the "Places API" and "Maps JavaScript API"</li>
            <li>Go to "Credentials" and create a new API key</li>
            <li>
              <strong>Important:</strong> Restrict your API key to your domain for security
            </li>
            <li>Copy the API key and paste it above</li>
          </ol>

          <Alert>
            <MapPin className="h-4 w-4" />
            <AlertDescription>
              <strong>Required APIs:</strong> Make sure to enable both "Places API" and "Maps JavaScript API" in your Google Cloud project for address autocomplete to work properly.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}