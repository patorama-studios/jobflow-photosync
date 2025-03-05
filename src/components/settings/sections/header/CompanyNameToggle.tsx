
import React, { useCallback, memo } from 'react';
import { Switch } from '@/components/ui/switch';
import { useHeaderSettings } from '@/hooks/useHeaderSettings';

export const CompanyNameToggle = memo(function CompanyNameToggle() {
  const { settings, updateSettings } = useHeaderSettings();

  const handleCompanyNameToggle = useCallback((checked: boolean) => {
    updateSettings({ ...settings, showCompanyName: checked });
  }, [settings, updateSettings]);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-md font-medium">Display Company Name</h4>
          <p className="text-sm text-muted-foreground">Show company name next to logo in header</p>
        </div>
        <Switch 
          checked={settings.showCompanyName} 
          onCheckedChange={handleCompanyNameToggle}
        />
      </div>
    </div>
  );
});
