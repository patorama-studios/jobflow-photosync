
import React from 'react';
import { Label } from '@/components/ui/label';

interface HeaderColorSelectorProps {
  settings: {
    color: string;
    height?: number;
    logoUrl?: string;
    showCompanyName?: boolean;
  };
  updateSettings: (newSettings: Partial<{
    color: string;
    height?: number;
    logoUrl?: string;
    showCompanyName?: boolean;
  }>) => void;
}

export function HeaderColorSelector({ settings, updateSettings }: HeaderColorSelectorProps) {
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateSettings({ color: e.target.value });
  };
  
  const predefinedColors = [
    '#000000', // Black
    '#FFFFFF', // White
    '#1E40AF', // Blue-800
    '#1F2937', // Gray-800
    '#7C3AED', // Violet-600
    '#059669', // Emerald-600
    '#DC2626', // Red-600
    '#D97706', // Amber-600
  ];
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <Label htmlFor="headerColor">Header Color</Label>
        <span className="text-sm font-medium">{settings.color}</span>
      </div>
      
      <div className="flex items-center space-x-2">
        <input
          id="headerColor"
          type="color"
          value={settings.color}
          onChange={handleColorChange}
          className="h-10 w-20"
        />
        <div className="grow">
          <div className="h-10 rounded-md" style={{ backgroundColor: settings.color }}></div>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 mt-2">
        {predefinedColors.map((color) => (
          <button
            key={color}
            type="button"
            className={`h-6 w-6 rounded-full border ${settings.color === color ? 'ring-2 ring-primary ring-offset-2' : 'border-gray-300'}`}
            style={{ backgroundColor: color }}
            onClick={() => updateSettings({ color })}
            aria-label={`Set color to ${color}`}
          />
        ))}
      </div>
    </div>
  );
}
