
import React, { useRef, useState, useEffect } from 'react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { LogoUploadSection } from './header/LogoUploadSection';
import { CompanyNameToggle } from './header/CompanyNameToggle';
import { HeaderHeightControl } from './header/HeaderHeightControl';
import { HeaderColorSelector } from './header/HeaderColorSelector';
import { ResetButton } from './header/ResetButton';
import { useHeaderSettings } from '@/hooks/useHeaderSettings';
import { useToast } from '@/hooks/use-toast';

export function HeaderSettings() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { settings: savedSettings, updateSettings: saveSettings } = useHeaderSettings();
  const [localSettings, setLocalSettings] = useState(savedSettings);
  const [hasChanges, setHasChanges] = useState(false);
  const { toast } = useToast();
  
  // Only load initial settings once
  useEffect(() => {
    setLocalSettings(savedSettings);
  }, []); // Empty dependency array to run only once
  
  const updateLocalSettings = (newSettingsPartial: Partial<typeof savedSettings>) => {
    setLocalSettings(prev => {
      const newSettings = { ...prev, ...newSettingsPartial };
      setHasChanges(JSON.stringify(newSettings) !== JSON.stringify(savedSettings));
      return newSettings;
    });
  };
  
  const handleSave = () => {
    saveSettings(localSettings);
    setHasChanges(false);
    toast({
      title: "Settings saved",
      description: "Header settings have been updated",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Header Appearance</h3>
        <p className="text-sm text-muted-foreground">
          Customize how the application header looks across the platform.
        </p>
      </div>
      
      <Separator />
      
      {/* Logo Upload */}
      <LogoUploadSection 
        fileInputRef={fileInputRef} 
        settings={localSettings}
        updateSettings={updateLocalSettings}
      />

      {/* Company Name Display */}
      <CompanyNameToggle 
        settings={localSettings}
        updateSettings={updateLocalSettings}
      />

      {/* Header Height */}
      <HeaderHeightControl 
        settings={localSettings}
        updateSettings={updateLocalSettings}
      />

      {/* Header Color */}
      <HeaderColorSelector 
        settings={localSettings}
        updateSettings={updateLocalSettings}
      />
      
      {/* Save Button */}
      <div className="flex justify-between items-center pt-4">
        <ResetButton onReset={() => {
          setLocalSettings({
            color: '#000000',
            height: 65,
            logoUrl: '/lovable-uploads/77021d72-0ef2-4178-8ddf-8a3c742c0974.png',
            showCompanyName: false
          });
          setHasChanges(true);
        }} />
        
        <Button 
          onClick={handleSave}
          disabled={!hasChanges}
        >
          Save Header Settings
        </Button>
      </div>
    </div>
  );
}
