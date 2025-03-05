
import React, { useRef } from 'react';
import { Separator } from '@/components/ui/separator';
import { LogoUploadSection } from './header/LogoUploadSection';
import { CompanyNameToggle } from './header/CompanyNameToggle';
import { HeaderHeightControl } from './header/HeaderHeightControl';
import { HeaderColorSelector } from './header/HeaderColorSelector';
import { ResetButton } from './header/ResetButton';

export function HeaderSettings() {
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      <LogoUploadSection fileInputRef={fileInputRef} />

      {/* Company Name Display */}
      <CompanyNameToggle />

      {/* Header Height */}
      <HeaderHeightControl />

      {/* Header Color */}
      <HeaderColorSelector />

      {/* Reset Button */}
      <ResetButton />
    </div>
  );
}
