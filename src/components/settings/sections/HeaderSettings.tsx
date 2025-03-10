
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
import { Loader2 } from 'lucide-react';

export function HeaderSettings() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { settings: savedSettings, updateSettings } = useHeaderSettings();
  const [localSettings, setLocalSettings] = useState({ ...savedSettings });
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  
  // Update local settings when saved settings change
  useEffect(() => {
    setLocalSettings({ ...savedSettings });
  }, [savedSettings]);
  
  const updateLocalSettings = (newSettingsPartial: Partial<typeof savedSettings>) => {
    setLocalSettings(prev => {
      const newSettings = { ...prev, ...newSettingsPartial };
      setHasChanges(true);
      return newSettings;
    });
  };
  
  const handleSave = async () => {
    if (hasChanges) {
      setIsSaving(true);
      try {
        const saveSuccess = await updateSettings(localSettings);
        
        if (saveSuccess) {
          setHasChanges(false);
          toast({
            title: "Settings saved",
            description: "Header settings have been updated and will persist across sessions",
          });
        } else {
          toast({
            title: "Save failed",
            description: "There was a problem saving your header settings",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error('Error saving header settings:', error);
        toast({
          title: "Save failed",
          description: "An unexpected error occurred while saving settings",
          variant: "destructive"
        });
      } finally {
        setIsSaving(false);
      }
    }
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
            logoUrl: '',
            showCompanyName: false
          });
          setHasChanges(true);
        }} />
        
        <Button 
          onClick={handleSave}
          disabled={!hasChanges || isSaving}
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Header Settings'
          )}
        </Button>
      </div>
    </div>
  );
}
