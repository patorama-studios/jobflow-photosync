
import React from 'react';
import { Settings, Upload, Palette, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useHeaderSettings } from '@/hooks/useHeaderSettings';

export function HeaderSettings() {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
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
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Header Appearance</h3>
        <p className="text-sm text-muted-foreground">
          Customize how the application header looks across the platform.
        </p>
      </div>
      
      <Separator />
      
      {/* Logo Upload */}
      <div className="space-y-4">
        <div>
          <h4 className="text-md font-medium mb-2">Company Logo</h4>
          <p className="text-sm text-muted-foreground mb-4">
            Upload your company logo to display in the header
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          {settings.logoUrl ? (
            <div className="w-16 h-16 rounded-md overflow-hidden border">
              <img 
                src={settings.logoUrl} 
                alt="Company Logo" 
                className="w-full h-full object-contain" 
              />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-md bg-muted flex items-center justify-center">
              <Settings className="h-6 w-6 opacity-50" />
            </div>
          )}
          
          <div className="space-y-2">
            <Button 
              variant="outline" 
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Logo
            </Button>
            
            {settings.logoUrl && (
              <Button 
                variant="outline" 
                onClick={() => updateSettings({ ...settings, logoUrl: '' })}
                className="text-destructive hover:text-destructive"
              >
                Remove Logo
              </Button>
            )}
            
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleLogoUpload}
              accept="image/*" 
              className="hidden" 
            />
          </div>
        </div>
      </div>

      {/* Header Height */}
      <div className="space-y-2">
        <div>
          <h4 className="text-md font-medium mb-2">Header Height</h4>
          <div className="flex justify-between">
            <p className="text-sm text-muted-foreground">Adjust the height of the header bar</p>
            <span className="text-sm font-medium">{settings.height}px</span>
          </div>
        </div>
        <Slider
          value={[settings.height]}
          min={40}
          max={80}
          step={4}
          onValueChange={handleHeightChange}
          className="my-6"
        />
      </div>

      {/* Header Color */}
      <div className="space-y-4">
        <div>
          <h4 className="text-md font-medium mb-2">Header Color</h4>
          <p className="text-sm text-muted-foreground">
            Choose a color for the header or set a custom color
          </p>
        </div>
        
        <div className="grid grid-cols-3 gap-3">
          {colors.map(color => (
            <Button
              key={color.value}
              variant="outline"
              className="h-10 relative"
              style={{ backgroundColor: color.value }}
              onClick={() => handleColorChange(color.value)}
            >
              {settings.color === color.value && (
                <Check className="h-4 w-4 absolute text-white" />
              )}
            </Button>
          ))}
        </div>
        
        <div className="flex items-center gap-2 mt-4">
          <Input 
            type="color" 
            value={settings.color || '#ffffff'}
            onChange={(e) => handleColorChange(e.target.value)}
            className="w-12 h-12 p-1"
          />
          <Input
            type="text"
            value={settings.color || 'Default'}
            onChange={(e) => handleColorChange(e.target.value)}
            placeholder="Custom color code"
            className="flex-1"
          />
        </div>
      </div>

      <div className="pt-4">
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
          className="w-full"
        >
          Reset to Defaults
        </Button>
      </div>
    </div>
  );
}
