
import React, { useEffect } from 'react';
import { Separator } from '@/components/ui/separator';
import { useTheme } from '@/components/theme-provider';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { FontSelector } from './theme/FontSelector';
import { useAppSettings } from '@/hooks/useAppSettings';

export function ThemeSettings() {
  const { theme, setTheme } = useTheme();
  const { value: themeSettings, setValue: saveThemeSettings } = useAppSettings('themeSettings', {
    fontSize: 16,
    enableAnimations: true,
    uiDensity: 'comfortable'
  });
  
  useEffect(() => {
    document.documentElement.style.fontSize = `${themeSettings.fontSize}px`;
  }, [themeSettings.fontSize]);

  const handleFontSizeChange = (values: number[]) => {
    saveThemeSettings({
      ...themeSettings,
      fontSize: values[0]
    });
  };

  const handleAnimationsToggle = (enabled: boolean) => {
    saveThemeSettings({
      ...themeSettings,
      enableAnimations: enabled
    });
  };

  const handleDensityChange = (density: string) => {
    saveThemeSettings({
      ...themeSettings,
      uiDensity: density
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Theme Settings</h3>
        <p className="text-sm text-muted-foreground">
          Customize the appearance of the application.
        </p>
      </div>
      
      <Separator />
      
      {/* Color Theme */}
      <div className="space-y-2">
        <h4 className="text-md font-medium">Color Theme</h4>
        <p className="text-sm text-muted-foreground mb-4">
          Choose between light, dark, or system preference theme
        </p>
        <RadioGroup 
          defaultValue={theme} 
          onValueChange={(value) => setTheme(value as "light" | "dark" | "system")}
          className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="light" id="light" />
            <Label htmlFor="light" className="cursor-pointer">Light</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="dark" id="dark" />
            <Label htmlFor="dark" className="cursor-pointer">Dark</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="system" id="system" />
            <Label htmlFor="system" className="cursor-pointer">System</Label>
          </div>
        </RadioGroup>
      </div>
      
      <Separator />
      
      {/* Font Settings */}
      <div className="space-y-4">
        <h4 className="text-md font-medium">Typography</h4>
        
        {/* Font Family */}
        <div className="space-y-2">
          <Label htmlFor="font-family">Font Family</Label>
          <FontSelector />
        </div>
        
        {/* Font Size */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label>Font Size</Label>
            <span className="text-sm font-medium">{themeSettings.fontSize}px</span>
          </div>
          <Slider
            id="font-size"
            value={[themeSettings.fontSize]}
            min={12}
            max={24}
            step={1}
            onValueChange={handleFontSizeChange}
          />
        </div>
      </div>
      
      <Separator />
      
      {/* UI Density */}
      <div className="space-y-2">
        <h4 className="text-md font-medium">Interface Density</h4>
        <Label htmlFor="ui-density">Control the spacing and density of the UI elements</Label>
        <Select value={themeSettings.uiDensity} onValueChange={handleDensityChange}>
          <SelectTrigger id="ui-density" className="w-full">
            <SelectValue placeholder="Select density" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="compact">Compact</SelectItem>
            <SelectItem value="comfortable">Comfortable</SelectItem>
            <SelectItem value="spacious">Spacious</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Separator />
      
      {/* Animations */}
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h4 className="text-md font-medium">Animations</h4>
          <p className="text-sm text-muted-foreground">
            Enable or disable UI animations
          </p>
        </div>
        <Switch 
          checked={themeSettings.enableAnimations}
          onCheckedChange={handleAnimationsToggle}
        />
      </div>
    </div>
  );
}
