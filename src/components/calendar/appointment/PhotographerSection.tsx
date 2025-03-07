
import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useContractors } from '@/hooks/use-contractors';
import { Loader2 } from 'lucide-react';

interface PhotographerSectionProps {
  selectedPhotographer?: string;
  onSelectPhotographer?: (photographerId: string) => void;
}

export const PhotographerSection: React.FC<PhotographerSectionProps> = ({ 
  selectedPhotographer,
  onSelectPhotographer 
}) => {
  const { contractors, isLoading } = useContractors();
  
  // Filter contractors to only include photographers
  const photographers = contractors.filter(contractor => 
    contractor.role.toLowerCase() === 'photographer'
  );

  const handlePhotographerChange = (value: string) => {
    if (onSelectPhotographer) {
      onSelectPhotographer(value);
    }
  };

  return (
    <div>
      <p className="text-sm font-medium mb-2">Photographer</p>
      {isLoading ? (
        <div className="flex items-center space-x-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm text-muted-foreground">Loading photographers...</span>
        </div>
      ) : (
        <Select 
          value={selectedPhotographer} 
          onValueChange={handlePhotographerChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a photographer" />
          </SelectTrigger>
          <SelectContent>
            {photographers.map((photographer) => (
              <SelectItem key={photographer.id} value={photographer.id}>
                {photographer.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
};
