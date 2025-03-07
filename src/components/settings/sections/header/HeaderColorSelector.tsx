
import React from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface HeaderSettings {
  height: number;
  color: string;
  logoUrl: string;
  showCompanyName: boolean;
}

interface HeaderColorSelectorProps {
  settings: HeaderSettings;
  updateSettings: (newSettings: Partial<HeaderSettings>) => void;
}

export function HeaderColorSelector({ settings, updateSettings }: HeaderColorSelectorProps) {
  // Predefined colors
  const colors = [
    { name: 'Default', value: 'hsl(var(--background))' },
    { name: 'Black', value: '#000000' },
    { name: 'Purple', value: '#9b87f5' },
    { name: 'Blue', value: '#0ea5e9' },
    { name: 'Green', value: '#10b981' },
    { name: 'Orange', value: '#f97316' },
    { name: 'Red', value: '#ef4444' },
  ];

  const handleColorChange = (color: string) => {
    updateSettings({ color });
  };

  return (
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
            style={{ 
              backgroundColor: color.value,
              color: (color.value === '#000000' || color.name === 'Black') ? 'white' : 'black'
            }}
            onClick={() => handleColorChange(color.value)}
          >
            {settings.color === color.value && (
              <Check className={`h-4 w-4 absolute ${(color.value === '#000000' || color.name === 'Black') ? 'text-white' : 'text-black'}`} />
            )}
            <span className={`text-xs ${(color.value === '#000000' || color.name === 'Black') ? 'text-white' : ''}`}>
              {color.name}
            </span>
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
  );
}
