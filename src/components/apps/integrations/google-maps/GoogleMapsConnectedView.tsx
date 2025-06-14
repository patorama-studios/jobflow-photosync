import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MapPin, Check, Eye, EyeOff, Trash2, Settings } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface GoogleMapsConnectedViewProps {
  onDisconnect?: () => void;
}

export function GoogleMapsConnectedView({ onDisconnect }: GoogleMapsConnectedViewProps) {
  const [showKey, setShowKey] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [connectedAt, setConnectedAt] = useState<string | null>(null);
  const [showDisconnectDialog, setShowDisconnectDialog] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const key = localStorage.getItem('google_maps_api_key') || '';
    const connected = localStorage.getItem('google_maps_connected_at');
    setApiKey(key);
    setConnectedAt(connected);
  }, []);

  const handleDisconnect = () => {
    localStorage.removeItem('google_maps_api_key');
    localStorage.removeItem('google_maps_connected_at');
    
    toast({
      title: 'Disconnected',
      description: 'Google Maps API key has been removed. Address autocomplete is now disabled.',
    });
    
    if (onDisconnect) {
      onDisconnect();
    }
  };

  const maskedKey = apiKey ? `${apiKey.substring(0, 8)}...${apiKey.substring(apiKey.length - 4)}` : '';
  
  const formattedDate = connectedAt 
    ? new Date(connectedAt).toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    : 'Unknown';

  return (
    <div className="space-y-6">
      <Alert className="border-green-200 bg-green-50">
        <Check className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          Google Maps is connected and address autocomplete is enabled.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Google Maps Configuration</CardTitle>
          <CardDescription>
            Manage your Google Maps API integration settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm font-medium">API Key</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 px-3 py-2 bg-muted rounded-md font-mono text-sm">
                {showKey ? apiKey : maskedKey}
              </code>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowKey(!showKey)}
              >
                {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Connected Since</p>
            <p className="text-sm text-muted-foreground">{formattedDate}</p>
          </div>

          <div className="pt-4 border-t">
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setShowDisconnectDialog(true)}
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Disconnect Google Maps
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Integration Features
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="font-medium text-sm">Address Autocomplete</p>
              <p className="text-sm text-muted-foreground">
                Automatically suggest addresses as users type in order forms
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="font-medium text-sm">Location Parsing</p>
              <p className="text-sm text-muted-foreground">
                Automatically extract city, state, and zip code from selected addresses
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showDisconnectDialog} onOpenChange={setShowDisconnectDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Disconnect Google Maps?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove your Google Maps API key and disable address autocomplete features. 
              You can reconnect at any time by adding your API key again.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDisconnect} className="bg-destructive text-destructive-foreground">
              Disconnect
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}