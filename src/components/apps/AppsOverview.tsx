
import React from 'react';
import { IntegrationCard } from './IntegrationCard';
import { IntegrationDialog } from './IntegrationDialog';
import { 
  Box, 
  Calendar as CalendarIcon, 
  Mail, 
  Plug, 
  BarChart, 
  Megaphone,
  CreditCard
} from 'lucide-react';
import { Integration } from './types';
import { useAuth } from '@/contexts/AuthContext';

export function AppsOverview() {
  const [open, setOpen] = React.useState(false);
  const [selectedIntegration, setSelectedIntegration] = React.useState<Integration | null>(null);
  const { user } = useAuth();

  const integrations: Integration[] = [
    {
      id: 'box',
      name: 'Box.com',
      description: 'Cloud content management & file sharing',
      icon: Box,
      connected: true,
      status: 'active',
      lastSynced: '2 hours ago'
    },
    {
      id: 'stripe',
      name: 'Stripe',
      description: 'Payment processing platform',
      icon: CreditCard,
      connected: false
    },
    {
      id: 'google-calendar',
      name: 'Google Calendar',
      description: 'Sync events and appointments',
      icon: CalendarIcon,
      connected: false
    },
    {
      id: 'microsoft-365',
      name: 'Microsoft 365',
      description: 'Outlook calendar and email integration',
      icon: Mail,
      connected: false
    },
    {
      id: 'zapier',
      name: 'Zapier',
      description: 'Connect with thousands of apps',
      icon: Plug,
      connected: true,
      status: 'active',
      lastSynced: '1 day ago'
    },
    {
      id: 'xero',
      name: 'Xero',
      description: 'Accounting & invoicing platform',
      icon: BarChart,
      connected: false
    },
    {
      id: 'go-high-level',
      name: 'Go High Level',
      description: 'All-in-one marketing platform',
      icon: Megaphone,
      connected: false
    }
  ];

  const handleOpenIntegration = (integration: Integration) => {
    setSelectedIntegration(integration);
    setOpen(true);
  };

  return (
    <div className="space-y-6">
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
}
