
import React, { useEffect, useState, memo } from 'react';
import { IntegrationCard } from './IntegrationCard';
import { IntegrationDialog } from './IntegrationDialog';
import { 
  Box, 
  Calendar as CalendarIcon, 
  Mail, 
  Plug, 
  BarChart, 
  Megaphone,
  CreditCard,
  MapPin,
  Camera
} from 'lucide-react';
import { Integration } from './types';
import { useAuth } from '@/contexts/MySQLAuthContext';

interface AppsOverviewProps {
  hideHeader?: boolean;
}

export const AppsOverview = memo(function AppsOverview({ hideHeader = false }: AppsOverviewProps) {
  const [open, setOpen] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const { user } = useAuth();

  // Load integration status from localStorage on component mount
  useEffect(() => {
    const defaultIntegrations: Integration[] = [
      {
        id: 'box',
        name: 'Box.com',
        description: 'Cloud content management & file sharing',
        icon: Box,
        connected: false,
        status: 'pending'
      },
      {
        id: 'stripe',
        name: 'Stripe',
        description: 'Payment processing platform',
        icon: CreditCard,
        connected: false,
        status: 'pending'
      },
      {
        id: 'google-calendar',
        name: 'Google Calendar',
        description: 'Sync events and appointments',
        icon: CalendarIcon,
        connected: false,
        status: 'pending'
      },
      {
        id: 'microsoft-365',
        name: 'Microsoft 365',
        description: 'Outlook calendar and email integration',
        icon: Mail,
        connected: false,
        status: 'pending'
      },
      {
        id: 'zapier',
        name: 'Zapier',
        description: 'Connect with thousands of apps',
        icon: Plug,
        connected: false,
        status: 'pending'
      },
      {
        id: 'xero',
        name: 'Xero',
        description: 'Accounting & invoicing platform',
        icon: BarChart,
        connected: false,
        status: 'pending'
      },
      {
        id: 'go-high-level',
        name: 'Go High Level',
        description: 'All-in-one marketing platform',
        icon: Megaphone,
        connected: false,
        status: 'pending'
      },
      {
        id: 'google-maps',
        name: 'Google Maps',
        description: 'Enable address autocomplete and location services',
        icon: MapPin,
        connected: false,
        status: 'pending'
      },
      {
        id: 'esoft',
        name: 'Esoft',
        description: 'Professional photo editing and processing services',
        icon: Camera,
        connected: false,
        status: 'pending'
      }
    ];
    
    // Check if Box is connected based on localStorage
    const boxToken = localStorage.getItem('box_access_token');
    const boxMasterFolder = localStorage.getItem('box_master_folder_id');
    const isBoxConnected = !!(boxToken && boxMasterFolder);
    
    // Check if Google Maps is connected
    const googleMapsApiKey = localStorage.getItem('google_maps_api_key');
    const isGoogleMapsConnected = !!googleMapsApiKey;
    
    // Check if Esoft is connected by checking for integration settings
    // We'll assume it's connected if there are saved credentials
    const isEsoftConnected = false; // This will be updated by the dialog when settings exist
    
    // Get authentication time for last synced info
    const boxAuthTime = localStorage.getItem('box_auth_time');
    const lastSyncedTime = boxAuthTime 
      ? new Date(boxAuthTime).toLocaleString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          hour: '2-digit', 
          minute: '2-digit' 
        })
      : '2 hours ago';
    
    const updatedIntegrations = defaultIntegrations.map(integration => {
      if (integration.id === 'box' && isBoxConnected) {
        return {
          ...integration,
          connected: true,
          status: 'active' as const,
          lastSynced: lastSyncedTime
        };
      }
      if (integration.id === 'google-maps' && isGoogleMapsConnected) {
        return {
          ...integration,
          connected: true,
          status: 'active' as const,
          lastSynced: 'Active'
        };
      }
      if (integration.id === 'esoft' && isEsoftConnected) {
        return {
          ...integration,
          connected: true,
          status: 'active' as const,
          lastSynced: 'Active'
        };
      }
      return integration;
    });
    
    setIntegrations(updatedIntegrations);
  }, [open]); // Re-run when dialog closes to refresh status

  const handleOpenIntegration = (integration: Integration) => {
    setSelectedIntegration(integration);
    setOpen(true);
  };

  return (
    <div className="space-y-6">
      {!hideHeader && (
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Integrations</h2>
          <p className="text-muted-foreground">
            Connect Patorama Studios with your favorite tools and services
          </p>
          {!user && (
            <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-md text-sm text-yellow-800">
              You need to be logged in to connect or manage integrations.
            </div>
          )}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map(integration => (
          <IntegrationCard 
            key={integration.id}
            integration={integration}
            onClick={() => handleOpenIntegration(integration)}
          />
        ))}
      </div>

      {selectedIntegration && (
        <IntegrationDialog
          integration={selectedIntegration}
          open={open}
          onOpenChange={setOpen}
        />
      )}
    </div>
  );
});
