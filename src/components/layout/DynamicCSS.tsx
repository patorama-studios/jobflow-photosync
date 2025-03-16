
import { useEffect } from 'react';
import { useHeaderSettings } from '@/hooks/useHeaderSettings';

export function DynamicCSS() {
  const { headerSettings } = useHeaderSettings();
  
  useEffect(() => {
    // Set CSS variables
    document.documentElement.style.setProperty('--header-height', `${headerSettings.height}px`);
  }, [headerSettings.height]);
  
  return null;
}
