
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

// Custom hook to safely get icons
export const useIcon = (iconName: string) => {
  try {
    // Try to get the icon from lucide-react
    const Icon = LucideIcons[iconName as keyof typeof LucideIcons];
    
    // Return the icon if it exists, otherwise return fallback
    return Icon || FallbackIcon;
  } catch (error) {
    console.error(`Error loading icon: ${iconName}`, error);
    return FallbackIcon;
  }
};

// Safe icon component that handles errors
export const SafeIcon = ({ 
  name, 
  ...props 
}: { 
  name: string; 
  [key: string]: any 
}) => {
  try {
    const Icon = useIcon(name);
    return <Icon {...props} />;
  } catch (error) {
    console.error(`Failed to render icon: ${name}`, error);
    return <FallbackIcon />;
  }
};

// Export a function to safely get icon components
export const getIcon = (iconName: string) => {
  try {
    return LucideIcons[iconName as keyof typeof LucideIcons] || FallbackIcon;
  } catch (error) {
    console.error(`Error getting icon: ${iconName}`, error);
    return FallbackIcon;
  }
};

// Export all icons with safety wrapper
export const Icons = new Proxy({}, {
  get: (_, prop) => {
    if (typeof prop === 'string') {
      return getIcon(prop);
    }
    return FallbackIcon;
  }
});
