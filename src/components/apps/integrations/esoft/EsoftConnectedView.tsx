import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Camera, Check, Settings, Package, Trash2, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useIntegrationSettings } from '@/hooks/useIntegrationSettings';
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

interface EsoftConnectedViewProps {
  onDisconnect?: () => void;
}

interface EsoftSettings {
  client_id: string;
  api_username: string;
  api_password: string;
  white_label_domain: string | null;
  auto_deliver_listings: boolean;
  default_order_reference_format: string | null;
  allow_reference_editing: boolean;
}

export function EsoftConnectedView({ onDisconnect }: EsoftConnectedViewProps) {
  const [showCredentials, setShowCredentials] = useState(false);
  const [showDisconnectDialog, setShowDisconnectDialog] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const { settings, loading, saveSettings } = useIntegrationSettings('esoft', true);

  // Form state
  const [autoDeliverListings, setAutoDeliverListings] = useState(false);
  const [defaultOrderReferenceFormat, setDefaultOrderReferenceFormat] = useState('');
  const [allowReferenceEditing, setAllowReferenceEditing] = useState(true);

  useEffect(() => {
    if (settings) {
      setAutoDeliverListings(settings.auto_deliver_listings ?? false);
      setDefaultOrderReferenceFormat(settings.default_order_reference_format || '');
      setAllowReferenceEditing(settings.allow_reference_editing ?? true);
    }
  }, [settings]);

  const handleDisconnect = async () => {
    try {
      const success = await saveSettings(null);
      if (success) {
        toast({
          title: 'Disconnected',
          description: 'Esoft integration has been removed successfully.',
        });
        
        if (onDisconnect) {
          onDisconnect();
        }
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to disconnect Esoft integration.',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateDeliverySettings = async () => {
    setIsSaving(true);
    try {
      const updatedSettings = {
        ...settings,
        auto_deliver_listings: autoDeliverListings
      };
      
      const success = await saveSettings(updatedSettings);
      if (success) {
        toast({
          title: 'Settings Updated',
          description: 'Listing delivery settings have been saved.',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update delivery settings.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateOrderSettings = async () => {
    setIsSaving(true);
    try {
      const updatedSettings = {
        ...settings,
        default_order_reference_format: defaultOrderReferenceFormat || null,
        allow_reference_editing: allowReferenceEditing
      };
      
      const success = await saveSettings(updatedSettings);
      if (success) {
        toast({
          title: 'Settings Updated',
          description: 'Order settings have been saved.',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update order settings.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="space-y-2 mt-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  const maskedPassword = settings?.api_password ? 
    `${settings.api_password.substring(0, 4)}...${settings.api_password.substring(settings.api_password.length - 4)}` : 
    '';

  return (
    <div className="space-y-6">
      <Alert className="border-green-200 bg-green-50">
        <Check className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          Esoft integration is connected and active.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="delivery">Delivery</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Connection Details</CardTitle>
              <CardDescription>
                Your Esoft integration configuration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Client ID</Label>
                  <p className="text-sm text-muted-foreground">{settings?.client_id}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Username</Label>
                  <p className="text-sm text-muted-foreground">{settings?.api_username}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">API Password</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowCredentials(!showCredentials)}
                  >
                    {showCredentials ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                <code className="block px-3 py-2 bg-muted rounded-md font-mono text-sm">
                  {showCredentials ? settings?.api_password : maskedPassword}
                </code>
              </div>

              {settings?.white_label_domain && (
                <div>
                  <Label className="text-sm font-medium">White Label Domain</Label>
                  <p className="text-sm text-muted-foreground">{settings.white_label_domain}</p>
                </div>
              )}

              <div className="pt-4 border-t">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setShowDisconnectDialog(true)}
                  className="gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Disconnect Esoft
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="delivery" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Listing Delivery Settings</CardTitle>
              <CardDescription>
                Configure how Esoft listings are delivered to your clients
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="autoDeliver">Auto Deliver Listings</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically deliver listings when all Esoft orders are complete
                  </p>
                </div>
                <Switch
                  id="autoDeliver"
                  checked={autoDeliverListings}
                  onCheckedChange={setAutoDeliverListings}
                />
              </div>
              
              <div className="pt-4">
                <Button 
                  onClick={handleUpdateDeliverySettings} 
                  disabled={isSaving}
                  className="gap-2"
                >
                  <Settings className="h-4 w-4" />
                  {isSaving ? 'Saving...' : 'Update Delivery Settings'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Order Settings</CardTitle>
              <CardDescription>
                Configure how Esoft orders are created and managed
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="orderReference">Default Order Reference Format</Label>
                <Input
                  id="orderReference"
                  value={defaultOrderReferenceFormat}
                  onChange={(e) => setDefaultOrderReferenceFormat(e.target.value)}
                  placeholder="e.g., {address}-{date}"
                />
                <p className="text-sm text-muted-foreground">
                  Sets a default order reference format on all Esoft orders
                </p>
              </div>

              <div className="flex items-center justify-between pt-4">
                <div className="space-y-0.5">
                  <Label htmlFor="allowEditing">Order Reference Editing</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow users to edit the Esoft order reference for the first order of a listing
                  </p>
                </div>
                <Switch
                  id="allowEditing"
                  checked={allowReferenceEditing}
                  onCheckedChange={setAllowReferenceEditing}
                />
              </div>

              <div className="pt-4">
                <Button 
                  onClick={handleUpdateOrderSettings} 
                  disabled={isSaving}
                  className="gap-2"
                >
                  <Package className="h-4 w-4" />
                  {isSaving ? 'Saving...' : 'Update Order Settings'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Integration Features
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="gap-1">
              <Check className="h-3 w-3" />
              Photo Editing
            </Badge>
            <Badge variant="secondary" className="gap-1">
              <Check className="h-3 w-3" />
              Auto Delivery
            </Badge>
            <Badge variant="secondary" className="gap-1">
              <Check className="h-3 w-3" />
              Order Management
            </Badge>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showDisconnectDialog} onOpenChange={setShowDisconnectDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Disconnect Esoft?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove your Esoft integration and all associated settings. 
              This action cannot be undone.
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