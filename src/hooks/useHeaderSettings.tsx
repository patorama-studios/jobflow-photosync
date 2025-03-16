
import { useState, useCallback, useEffect } from 'react';
import { useAppSettings } from './useAppSettings';
import { HeaderSettings } from './types/user-settings-types';

const defaultHeaderSettings: HeaderSettings = {
  color: '#ffffff',
  height: 64,
  logoUrl: '',
  showCompanyName: true,
  title: '',
  description: ''
};

export function useHeaderSettings() {
  const { value: headerSettings, setValue, loading } = useAppSettings<HeaderSettings>('header_settings', defaultHeaderSettings);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  
  // This function updates only the specific fields that have changed
  const updateSettings = useCallback(async (updates: Partial<HeaderSettings>) => {
    // Check if there are actual changes to save
    if (Object.keys(updates).length === 0) {
      return true;
    }
    
    // Don't save if the new values are the same as current values
    const hasChanges = Object.entries(updates).some(([key, newValue]) => {
      const currentValue = headerSettings[key as keyof HeaderSettings];
      return newValue !== currentValue;
    });
    
    if (!hasChanges) {
      return true;
    }
    
    const updatedSettings = { ...headerSettings, ...updates };
    const saveSuccess = await setValue(updatedSettings);
    
    if (saveSuccess) {
      // Save a string representation of when this save happened
      setLastSaved(new Date().toISOString());
    }
    
    return saveSuccess;
  }, [headerSettings, setValue]);
  
  return {
    headerSettings,
    loading,
    updateSettings,
    lastSaved
  };
}
