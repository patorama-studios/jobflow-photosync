
import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HeaderColorSelector } from "./header/HeaderColorSelector";
import { HeaderHeightControl } from "./header/HeaderHeightControl";
import { LogoUploadSection } from "./header/LogoUploadSection";
import { CompanyNameToggle } from "./header/CompanyNameToggle";
import { ResetButton } from "./header/ResetButton";
import { Separator } from "@/components/ui/separator";
import { useHeaderSettings } from "@/hooks/useHeaderSettings";
import { HeaderSettings as HeaderSettingsType } from "@/hooks/types/user-settings-types";
import { Loader2, RefreshCw, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export function HeaderSettings() {
  const { headerSettings: defaultSettings, updateSettings, loading } = useHeaderSettings();
  const [settings, setSettings] = useState<HeaderSettingsType>({
    color: "#000000",
    height: 65,
    logoUrl: "",
    showCompanyName: false,
    title: "",
    description: ""
  });
  const [isSaving, setIsSaving] = useState(false);
  const [loadRetry, setLoadRetry] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load initial settings
  useEffect(() => {
    if (defaultSettings) {
      setSettings(prev => ({
        ...prev,
        ...defaultSettings
      }));
    }
  }, [defaultSettings]);

  // Handle settings changes
  const handleSettingChange = (setting: Partial<HeaderSettingsType>) => {
    setSettings(prev => ({
      ...prev,
      ...setting
    }));
  };

  // Handle save
  const handleSave = async () => {
    setIsSaving(true);
    try {
      console.log("Saving header settings:", settings);
      const success = await updateSettings(settings);
      if (!success) {
        throw new Error("Failed to save settings");
      }
      toast.success("Header settings saved successfully");
    } catch (error) {
      console.error("Error saving header settings:", error);
      toast.error("Failed to save header settings");
    } finally {
      setIsSaving(false);
    }
  };

  // Handle reset to defaults
  const handleReset = () => {
    setSettings({
      color: "#000000",
      height: 65,
      logoUrl: "",
      showCompanyName: false,
      title: "",
      description: ""
    });
    toast.info("Settings reset to defaults. Click Save to apply changes.");
  };

  // Handle refresh
  const handleRefresh = () => {
    setLoadRetry(prev => prev + 1);
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <Loader2 className="h-8 w-8 animate-spin mb-4" />
        <p>Loading header settings...</p>
        {loadRetry > 1 && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleRefresh}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry Loading
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Header Settings</h2>
          <p className="text-muted-foreground">
            Customize the appearance of the application header
          </p>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleRefresh}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6 space-y-6">
          <HeaderColorSelector 
            settings={settings}
            updateSettings={handleSettingChange}
          />
          
          <Separator />
          
          <HeaderHeightControl 
            settings={settings}
            updateSettings={handleSettingChange}
          />
          
          <Separator />
          
          <LogoUploadSection 
            fileInputRef={fileInputRef}
            settings={settings}
            updateSettings={handleSettingChange}
          />
          
          <Separator />
          
          <CompanyNameToggle 
            settings={settings}
            updateSettings={handleSettingChange}
          />
        </CardContent>
      </Card>
      
      <div className="flex justify-between">
        <ResetButton onReset={handleReset} />
        <Button 
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Header Settings"
          )}
        </Button>
      </div>
    </div>
  );
}
