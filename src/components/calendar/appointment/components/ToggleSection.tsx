
import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ToggleSectionProps { 
  title: string; 
  children: React.ReactNode; 
  isOpen: boolean; 
  onToggle: () => void;
}

export const ToggleSection: React.FC<ToggleSectionProps> = ({
  title, 
  children, 
  isOpen, 
  onToggle 
}) => {
  return (
    <div className="border rounded-md mb-4">
      <div 
        className="flex justify-between items-center p-4 cursor-pointer bg-muted/30"
        onClick={onToggle}
      >
        <h3 className="text-lg font-medium">{title}</h3>
        {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
      </div>
      {isOpen && (
        <div className="p-4 border-t">
          {children}
        </div>
      )}
    </div>
  );
};
