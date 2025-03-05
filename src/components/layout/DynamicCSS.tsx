
import { useEffect } from 'react';
import { useHeaderSettings } from '@/hooks/useHeaderSettings';

export function DynamicCSS() {
  const { settings } = useHeaderSettings();
  
  useEffect(() => {
    // Set CSS variables
    document.documentElement.style.setProperty('--header-height', `${settings.height}px`);
  }, [settings.height]);
  
  return null;
}
