
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Photographer {
  id: string;
  name: string;
}

interface PhotographerSectionProps {
  photographers: Photographer[];
}

export const PhotographerSection: React.FC<PhotographerSectionProps> = ({ photographers }) => {
  return (
    <div>
      <p className="text-sm font-medium mb-2">Photographer</p>
      <Select>
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
    </div>
  );
};
