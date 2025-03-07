
import React from 'react';
import { Slider } from '@/components/ui/slider';

interface HeaderSettings {
  height: number;
  color: string;
  logoUrl: string;
  showCompanyName: boolean;
}

interface HeaderHeightControlProps {
  settings: HeaderSettings;
  updateSettings: (newSettings: Partial<HeaderSettings>) => void;
}

export function HeaderHeightControl({ settings, updateSettings }: HeaderHeightControlProps) {
  const handleHeightChange = (values: number[]) => {
    updateSettings({ height: values[0] });
  };

  return (
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
  );
}
