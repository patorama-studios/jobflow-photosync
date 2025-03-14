
import React from 'react';
import { NotificationPreferencesProvider } from '@/contexts/NotificationPreferencesContext';
import { NotificationPreferencesContent } from './NotificationPreferencesContent';

export function NotificationPreferences() {
  return (
    <NotificationPreferencesProvider>
      <NotificationPreferencesContent />
    </NotificationPreferencesProvider>
  );
}
