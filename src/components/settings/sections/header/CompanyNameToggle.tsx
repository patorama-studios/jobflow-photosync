
import React, { useCallback, memo } from 'react';
import { Switch } from '@/components/ui/switch';

interface HeaderSettings {
  height: number;
  color: string;
  logoUrl: string;
  showCompanyName: boolean;
}

interface CompanyNameToggleProps {
  settings: HeaderSettings;
  updateSettings: (newSettings: Partial<HeaderSettings>) => void;
}

export const CompanyNameToggle = memo(function CompanyNameToggle({ 
  settings, 
  updateSettings 
}: CompanyNameToggleProps) {
  const handleCompanyNameToggle = useCallback((checked: boolean) => {
    updateSettings({ showCompanyName: checked });
  }, [updateSettings]);

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
