
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useNotificationPreferences } from '@/contexts/NotificationPreferencesContext';

interface NotificationTypeItemProps {
  type: string;
  channel: 'email' | 'sms' | 'push';
}

export const NotificationTypeItem: React.FC<NotificationTypeItemProps> = ({ type, channel }) => {
  const { settings, updateChannelForType } = useNotificationPreferences();
  
  const setting = settings.find(s => s.type === type) || {
    type,
    channels: { email: false, sms: false, push: false }
  };

  return (
    <div className="flex items-start space-x-2">
      <Checkbox 
        id={`${channel}-${type}`} 
        checked={setting.channels[channel]}
        onCheckedChange={(checked) => 
          updateChannelForType(type, channel, checked === true)
        }
      />
      <div className="grid gap-1">
        <Label htmlFor={`${channel}-${type}`} className="font-normal">
          {type}
        </Label>
        <p className="text-sm text-muted-foreground">
          Receive {channel === 'email' ? 'an email' : channel === 'sms' ? 'an SMS' : 'a push notification'} when this event occurs
        </p>
      </div>
    </div>
  );
};
