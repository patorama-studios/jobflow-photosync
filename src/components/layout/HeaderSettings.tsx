
import React, { useRef } from 'react';
import { Settings, Upload, Palette, Check } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useHeaderSettings } from '@/hooks/useHeaderSettings';

export const HeaderSettings: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { settings, updateSettings } = useHeaderSettings();

  // Predefined colors
  const colors = [
    { name: 'Default', value: 'hsl(var(--background))' },
    { name: 'Purple', value: '#9b87f5' },
    { name: 'Blue', value: '#0ea5e9' },
    { name: 'Green', value: '#10b981' },
    { name: 'Orange', value: '#f97316' },
    { name: 'Red', value: '#ef4444' },
  ];

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Simulate file upload - in a real app this would be an API call
    const reader = new FileReader();
    reader.onload = (event) => {
      const logoUrl = event.target?.result as string;
      updateSettings({ ...settings, logoUrl });
      toast({
        title: "Logo uploaded",
        description: "Your company logo has been updated",
      });
    };
    reader.readAsDataURL(file);
  };

  const handleHeightChange = (values: number[]) => {
    updateSettings({ ...settings, height: values[0] });
  };

  const handleColorChange = (color: string) => {
    updateSettings({ ...settings, color });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <h3 className="font-medium">Header Settings</h3>
          <Separator />

          {/* Logo Upload */}
          <div className="space-y-2">
            <Label>Company Logo</Label>
            <div className="flex items-center gap-2">
              {settings.logoUrl ? (
                <div className="w-10 h-10 rounded overflow-hidden border">
                  <img 
                    src={settings.logoUrl} 
                    alt="Company Logo" 
                    className="w-full h-full object-contain" 
                  />
                </div>
              ) : (
                <div className="w-10 h-10 rounded bg-muted flex items-center justify-center">
                  <Settings className="h-5 w-5 opacity-50" />
                </div>
              )}
              <Button 
                variant="outline" 
                onClick={() => fileInputRef.current?.click()}
                className="flex-1"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Logo
              </Button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleLogoUpload}
                accept="image/*" 
                className="hidden" 
              />
            </div>
          </div>

          {/* Header Height */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Header Height</Label>
              <span className="text-sm text-muted-foreground">{settings.height}px</span>
            </div>
            <Slider
              defaultValue={[settings.height]}
              min={40}
              max={80}
              step={4}
              onValueChange={handleHeightChange}
            />
          </div>

          {/* Header Color */}
          <div className="space-y-2">
            <Label>Header Color</Label>
            <div className="grid grid-cols-3 gap-2">
              {colors.map(color => (
                <Button
                  key={color.value}
                  variant="outline"
                  className="h-8 relative"
                  style={{ backgroundColor: color.value }}
                  onClick={() => handleColorChange(color.value)}
                >
                  {settings.color === color.value && (
                    <Check className="h-4 w-4 absolute text-white" />
                  )}
                </Button>
              ))}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Input 
                type="color" 
                value={settings.color || '#ffffff'}
                onChange={(e) => handleColorChange(e.target.value)}
                className="w-10 h-10 p-1"
              />
              <Input
                type="text"
                value={settings.color || 'Default'}
                onChange={(e) => handleColorChange(e.target.value)}
                placeholder="Custom color"
                className="flex-1"
              />
            </div>
          </div>

          <Button 
            onClick={() => {
              updateSettings({
                color: 'hsl(var(--background))',
                height: 56,
                logoUrl: ''
              });
              toast({
                title: "Settings reset",
                description: "Header settings have been reset to default",
              });
            }}
            variant="outline"
            size="sm"
            className="w-full mt-2"
          >
            Reset to Defaults
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
