
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
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
import { useToast } from '@/hooks/use-toast';
import { AlertTriangle, Save, X } from 'lucide-react';

interface EsoftSettings {
  id: string;
  client_id: string;
  api_username: string;
  api_password: string;
  white_label_domain: string | null;
  auto_deliver_listings: boolean;
  default_order_reference_format: string | null;
  allow_reference_editing: boolean;
  created_at: string;
  updated_at: string | null;
}

export function EsoftIntegrationSettings() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<EsoftSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const [clientId, setClientId] = useState('');
  const [apiUsername, setApiUsername] = useState('');
  const [apiPassword, setApiPassword] = useState('');
  const [whiteLabelDomain, setWhiteLabelDomain] = useState('');
  const [autoDeliverListings, setAutoDeliverListings] = useState(false);
  const [defaultOrderReferenceFormat, setDefaultOrderReferenceFormat] = useState('');
  const [allowReferenceEditing, setAllowReferenceEditing] = useState(true);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('esoft_settings')
        .select('*')
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
        setSettings(data);
        setClientId(data.client_id);
        setApiUsername(data.api_username);
        setApiPassword(data.api_password);
        setWhiteLabelDomain(data.white_label_domain || '');
        setAutoDeliverListings(data.auto_deliver_listings);
        setDefaultOrderReferenceFormat(data.default_order_reference_format || '');
        setAllowReferenceEditing(data.allow_reference_editing);
      } else {
        // Default values for new settings
        setClientId('70100293');
        setApiUsername('pta-live');
        setApiPassword('UFRBRXNvZnRAMjAyNA==');
        setWhiteLabelDomain('https://upload.patorama.com.au');
        setAutoDeliverListings(false);
        setDefaultOrderReferenceFormat('');
        setAllowReferenceEditing(true);
      }
    } catch (error) {
      console.error('Error fetching Esoft settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to load Esoft integration settings',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSaveCredentials = async () => {
    try {
      if (!clientId || !apiUsername || !apiPassword) {
        toast({
          title: 'Validation Error',
          description: 'Client ID, API username, and API password are required',
          variant: 'destructive'
        });
        return;
      }

      const updateData = {
        client_id: clientId,
        api_username: apiUsername,
        api_password: apiPassword,
        white_label_domain: whiteLabelDomain || null,
        updated_at: new Date().toISOString()
      };

      if (settings) {
        // Update existing
        const { error } = await supabase
          .from('esoft_settings')
          .update(updateData)
          .eq('id', settings.id);

        if (error) throw error;
      } else {
        // Create new
        const { error } = await supabase
          .from('esoft_settings')
          .insert(updateData);

        if (error) throw error;
      }

      toast({
        title: 'Settings Saved',
        description: 'Esoft credentials have been saved successfully'
      });
      fetchSettings();
    } catch (error) {
      console.error('Error saving Esoft credentials:', error);
      toast({
        title: 'Error',
        description: 'Failed to save Esoft credentials',
        variant: 'destructive'
      });
    }
  };

  const handleUpdateListingDelivery = async () => {
    try {
      if (!settings) {
        toast({
          title: 'Error',
          description: 'Please save credentials first',
          variant: 'destructive'
        });
        return;
      }

      const { error } = await supabase
        .from('esoft_settings')
        .update({
          auto_deliver_listings: autoDeliverListings,
          updated_at: new Date().toISOString()
        })
        .eq('id', settings.id);

      if (error) throw error;

      toast({
        title: 'Settings Updated',
        description: 'Listing delivery settings have been updated'
      });
      fetchSettings();
    } catch (error) {
      console.error('Error updating listing delivery settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to update listing delivery settings',
        variant: 'destructive'
      });
    }
  };

  const handleUpdateOrderSettings = async () => {
    try {
      if (!settings) {
        toast({
          title: 'Error',
          description: 'Please save credentials first',
          variant: 'destructive'
        });
        return;
      }

      const { error } = await supabase
        .from('esoft_settings')
        .update({
          default_order_reference_format: defaultOrderReferenceFormat || null,
          allow_reference_editing: allowReferenceEditing,
          updated_at: new Date().toISOString()
        })
        .eq('id', settings.id);

      if (error) throw error;

      toast({
        title: 'Settings Updated',
        description: 'Esoft order settings have been updated'
      });
      fetchSettings();
    } catch (error) {
      console.error('Error updating Esoft order settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to update Esoft order settings',
        variant: 'destructive'
      });
    }
  };

  const handleDeleteIntegration = async () => {
    try {
      if (!settings) {
        setIsDeleteDialogOpen(false);
        return;
      }

      const { error } = await supabase
        .from('esoft_settings')
        .delete()
        .eq('id', settings.id);

      if (error) throw error;

      toast({
        title: 'Integration Removed',
        description: 'Esoft integration has been removed successfully'
      });
      setSettings(null);
      setClientId('');
      setApiUsername('');
      setApiPassword('');
      setWhiteLabelDomain('');
      setAutoDeliverListings(false);
      setDefaultOrderReferenceFormat('');
      setAllowReferenceEditing(true);
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting Esoft integration:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove Esoft integration',
        variant: 'destructive'
      });
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Esoft Integration</CardTitle>
          <CardDescription>Loading settings...</CardDescription>
        </CardHeader>
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
          <Button onClick={handleSaveCredentials}>
            <Save className="mr-2 h-4 w-4" />
            Save Esoft Credentials
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
          <Button onClick={handleUpdateListingDelivery}>Update Listing Delivery</Button>
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
          <Button onClick={handleUpdateOrderSettings}>Update Esoft Order Settings</Button>
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
            disabled={!settings}
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
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteIntegration}>
              Remove Integration
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
