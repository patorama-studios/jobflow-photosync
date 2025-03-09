
import React from 'react';
import * as LucideIcons from 'lucide-react';

// Fallback icon if the requested one isn't found
const FallbackIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

/**
 * Get an icon component from lucide-react by name
 */
export const useIcon = (iconName: string) => {
  try {
    // Get the icon component from lucide-react
    const IconComponent = LucideIcons[iconName as keyof typeof LucideIcons];
    return IconComponent || FallbackIcon;
  } catch (error) {
    console.error(`Error loading icon: ${iconName}`, error);
    return FallbackIcon;
  }
};

/**
 * A component that renders an icon from lucide-react by name
 */
export const SafeIcon = ({ 
  name, 
  ...props 
}: { 
  name: string; 
  [key: string]: any 
}) => {
  try {
    const LucideIcon = useIcon(name);
    // Type assertion to solve TypeScript issue
    return React.createElement(LucideIcon as React.ComponentType<any>, props);
  } catch (error) {
    console.error(`Failed to render icon: ${name}`, error);
    return <FallbackIcon />;
  }
};

/**
 * Get an icon component for direct usage
 */
export const getIcon = (iconName: string) => {
  try {
    return LucideIcons[iconName as keyof typeof LucideIcons] || FallbackIcon;
  } catch (error) {
    console.error(`Error getting icon: ${iconName}`, error);
    return FallbackIcon;
  }
};

/**
 * Proxy object that returns icon components by property access
 */
export const Icons = new Proxy({}, {
  get: (_, prop) => {
    if (typeof prop === 'string') {
      return getIcon(prop);
    }
    return FallbackIcon;
  }
});
