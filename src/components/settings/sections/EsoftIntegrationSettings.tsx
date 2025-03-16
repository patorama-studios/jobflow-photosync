
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle, 
  CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle
} from '@/components/ui/dialog';
import { AlertTriangle, Save, X, Loader2 } from 'lucide-react';
import { useIntegrationSettings } from '@/hooks/useIntegrationSettings';

interface EsoftSettings {
  client_id: string;
  api_username: string;
  api_password: string;
  white_label_domain: string | null;
  auto_deliver_listings: boolean;
  default_order_reference_format: string | null;
  allow_reference_editing: boolean;
}

const defaultSettings: EsoftSettings = {
  client_id: '70100293',
  api_username: 'pta-live',
  api_password: 'UFRBRXNvZnRAMjAyNA==',
  white_label_domain: 'https://upload.patorama.com.au',
  auto_deliver_listings: false,
  default_order_reference_format: '',
  allow_reference_editing: true,
};

export function EsoftIntegrationSettings() {
  const { settings, loading, saveSettings } = useIntegrationSettings('esoft', true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [clientId, setClientId] = useState('');
  const [apiUsername, setApiUsername] = useState('');
  const [apiPassword, setApiPassword] = useState('');
  const [whiteLabelDomain, setWhiteLabelDomain] = useState('');
  const [autoDeliverListings, setAutoDeliverListings] = useState(false);
  const [defaultOrderReferenceFormat, setDefaultOrderReferenceFormat] = useState('');
  const [allowReferenceEditing, setAllowReferenceEditing] = useState(true);

  // Load settings when they're available
  useEffect(() => {
    if (settings) {
      setClientId(settings.client_id || defaultSettings.client_id);
      setApiUsername(settings.api_username || defaultSettings.api_username);
      setApiPassword(settings.api_password || defaultSettings.api_password);
      setWhiteLabelDomain(settings.white_label_domain || defaultSettings.white_label_domain || '');
      setAutoDeliverListings(settings.auto_deliver_listings ?? defaultSettings.auto_deliver_listings);
      setDefaultOrderReferenceFormat(settings.default_order_reference_format || defaultSettings.default_order_reference_format || '');
      setAllowReferenceEditing(settings.allow_reference_editing ?? defaultSettings.allow_reference_editing);
    } else if (!loading) {
      // Set default values if no settings found
      setClientId(defaultSettings.client_id);
      setApiUsername(defaultSettings.api_username);
      setApiPassword(defaultSettings.api_password);
      setWhiteLabelDomain(defaultSettings.white_label_domain || '');
      setAutoDeliverListings(defaultSettings.auto_deliver_listings);
      setDefaultOrderReferenceFormat(defaultSettings.default_order_reference_format || '');
      setAllowReferenceEditing(defaultSettings.allow_reference_editing);
    }
  }, [settings, loading]);

  const handleSaveCredentials = async () => {
    if (!clientId || !apiUsername || !apiPassword) {
      return;
    }

    setIsSaving(true);
    try {
      const updatedSettings = {
        ...settings,
        client_id: clientId,
        api_username: apiUsername,
        api_password: apiPassword,
        white_label_domain: whiteLabelDomain || null
      };
      
      const success = await saveSettings(updatedSettings);
      if (!success) {
        throw new Error('Failed to save Esoft credentials');
      }
    } catch (error) {
      console.error('Error saving Esoft credentials:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateListingDelivery = async () => {
    setIsSaving(true);
    try {
      const updatedSettings = {
        ...settings,
        auto_deliver_listings: autoDeliverListings
      };
      
      const success = await saveSettings(updatedSettings);
      if (!success) {
        throw new Error('Failed to update listing delivery settings');
      }
    } catch (error) {
      console.error('Error updating listing delivery settings:', error);
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
      if (!success) {
        throw new Error('Failed to update Esoft order settings');
      }
    } catch (error) {
      console.error('Error updating Esoft order settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteIntegration = async () => {
    setIsSaving(true);
    try {
      const success = await saveSettings(null);
      if (!success) {
        throw new Error('Failed to remove Esoft integration');
      }
      
      // Reset to defaults after deletion
      setClientId(defaultSettings.client_id);
      setApiUsername(defaultSettings.api_username);
      setApiPassword(defaultSettings.api_password);
      setWhiteLabelDomain(defaultSettings.white_label_domain || '');
      setAutoDeliverListings(defaultSettings.auto_deliver_listings);
      setDefaultOrderReferenceFormat(defaultSettings.default_order_reference_format || '');
      setAllowReferenceEditing(defaultSettings.allow_reference_editing);
      
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting Esoft integration:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Esoft Integration</CardTitle>
          <CardDescription>Loading settings...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Configure Esoft Integration</CardTitle>
          <CardDescription>
            Enter your Esoft credentials to enable integration with Esoft photo editing services
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="clientId">Esoft Client ID</Label>
            <Input 
              id="clientId" 
              value={clientId} 
              onChange={(e) => setClientId(e.target.value)} 
              placeholder="e.g., 70100293"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="apiUsername">Esoft API Username</Label>
            <Input 
              id="apiUsername" 
              value={apiUsername} 
              onChange={(e) => setApiUsername(e.target.value)} 
              placeholder="e.g., pta-live"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="apiPassword">Esoft API Password</Label>
            <Input 
              id="apiPassword" 
              type="password" 
              value={apiPassword} 
              onChange={(e) => setApiPassword(e.target.value)} 
              placeholder="Enter your API password"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="whiteLabelDomain">Esoft White Label Domain (optional)</Label>
            <Input 
              id="whiteLabelDomain" 
              value={whiteLabelDomain} 
              onChange={(e) => setWhiteLabelDomain(e.target.value)} 
              placeholder="e.g., https://upload.patorama.com.au"
            />
            <p className="text-sm text-muted-foreground">
              If you are a white labeling customer, enter your custom Coconut domain here.
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSaveCredentials} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Esoft Credentials
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      <Separator className="my-6" />

      <Card>
        <CardHeader>
          <CardTitle>Listing Delivery</CardTitle>
          <CardDescription>
            Configure how Esoft listings are delivered to your clients
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="autoDeliverListings">Auto Deliver Listings</Label>
              <p className="text-sm text-muted-foreground">
                When turned on, the listing will automatically be delivered to the customer when all outstanding Esoft orders have been received.
              </p>
            </div>
            <Switch 
              id="autoDeliverListings" 
              checked={autoDeliverListings} 
              onCheckedChange={setAutoDeliverListings}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleUpdateListingDelivery} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Update Listing Delivery"
            )}
          </Button>
        </CardFooter>
      </Card>

      <Separator className="my-6" />

      <Card>
        <CardHeader>
          <CardTitle>Esoft Order Settings</CardTitle>
          <CardDescription>
            Configure how Esoft orders are created and managed
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="defaultOrderReferenceFormat">Default Order Reference Format</Label>
            <Input 
              id="defaultOrderReferenceFormat" 
              value={defaultOrderReferenceFormat} 
              onChange={(e) => setDefaultOrderReferenceFormat(e.target.value)} 
              placeholder="e.g., {address}-{date}"
            />
            <p className="text-sm text-muted-foreground">
              Sets a default order reference format on all Esoft orders.
            </p>
          </div>
          <div className="flex items-center justify-between pt-4">
            <div className="space-y-0.5">
              <Label htmlFor="allowReferenceEditing">Order Reference Editing</Label>
              <p className="text-sm text-muted-foreground">
                When turned on, the user can edit the Esoft order reference for the first order for a listing.
              </p>
            </div>
            <Switch 
              id="allowReferenceEditing" 
              checked={allowReferenceEditing} 
              onCheckedChange={setAllowReferenceEditing}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleUpdateOrderSettings} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Update Esoft Order Settings"
            )}
          </Button>
        </CardFooter>
      </Card>

      <Separator className="my-6" />

      <Card>
        <CardHeader>
          <CardTitle className="text-destructive">Remove Esoft Integration</CardTitle>
          <CardDescription>
            This will remove your Esoft Integration and all associated settings.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button 
            variant="destructive" 
            onClick={() => setIsDeleteDialogOpen(true)}
            disabled={isSaving}
          >
            <X className="mr-2 h-4 w-4" />
            Remove Esoft Integration
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Esoft Integration</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove the Esoft integration? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="flex items-center space-x-2 rounded-md border border-amber-200 bg-amber-50 p-4 text-amber-800">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              <span>This will delete all Esoft settings and disconnect the integration.</span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={isSaving}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteIntegration} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Removing...
                </>
              ) : (
                "Remove Integration"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
