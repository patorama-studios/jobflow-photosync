
import React, { useState, useEffect } from 'react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useAppSettings } from '@/hooks/useAppSettings';

type FontOption = {
  name: string;
  value: string;
  category: 'sans-serif' | 'serif' | 'monospace' | 'display';
};

const fontOptions: FontOption[] = [
  { name: 'Inter (Default)', value: 'Inter', category: 'sans-serif' },
  { name: 'Arial', value: 'Arial', category: 'sans-serif' },
  { name: 'Roboto', value: 'Roboto', category: 'sans-serif' },
  { name: 'Helvetica', value: 'Helvetica', category: 'sans-serif' },
  { name: 'Georgia', value: 'Georgia', category: 'serif' },
  { name: 'Times New Roman', value: 'Times New Roman', category: 'serif' },
  { name: 'Courier New', value: 'Courier New', category: 'monospace' },
  { name: 'Consolas', value: 'Consolas', category: 'monospace' },
  { name: 'Playfair Display', value: 'Playfair Display', category: 'display' },
  { name: 'Montserrat', value: 'Montserrat', category: 'sans-serif' },
  { name: 'Poppins', value: 'Poppins', category: 'sans-serif' },
];

interface FontSelectorProps {
  onFontChange?: (font: string) => void;
  saveImmediately?: boolean;
}

export function FontSelector({ onFontChange, saveImmediately = false }: FontSelectorProps) {
  const { value: fontSettings, setValue: saveFontSettings } = useAppSettings('fontSettings', { font: 'Inter' });
  const [selectedFont, setSelectedFont] = useState(fontSettings.font);
  
  useEffect(() => {
    // Apply the font to the body element
    document.body.style.fontFamily = `${fontSettings.font}, sans-serif`;
  }, [fontSettings.font]);
  
  useEffect(() => {
    setSelectedFont(fontSettings.font);
  }, [fontSettings.font]);
  
  const handleFontChange = (font: string) => {
    setSelectedFont(font);
    
    if (onFontChange) {
      onFontChange(font);
    }
    
    if (saveImmediately) {
      saveFontSettings({ font });
    }
  };
  
  return (
    <Select value={selectedFont} onValueChange={handleFontChange}>
      <SelectTrigger className="w-full" style={{ fontFamily: `${selectedFont}, sans-serif` }}>
        <SelectValue placeholder="Select a font" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="Inter" style={{ fontFamily: 'Inter, sans-serif' }}>
          Inter (Default)
        </SelectItem>
        
        {fontOptions.filter(f => f.value !== 'Inter').map((font) => (
          <SelectItem 
            key={font.value} 
            value={font.value}
            style={{ fontFamily: `${font.value}, ${font.category}` }}
          >
            {font.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
