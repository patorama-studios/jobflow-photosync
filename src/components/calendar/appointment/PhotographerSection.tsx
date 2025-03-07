
import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
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
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter contractors to only include photographers and apply search
  const photographers = contractors.filter(contractor => 
    contractor.role?.toLowerCase() === 'photographer' && 
    (searchQuery === '' || 
     contractor.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handlePhotographerSelect = (photographer: any) => {
    if (onSelectPhotographer) {
      onSelectPhotographer(photographer.id);
    }
    setSearchQuery('');
  };

  const selectedPhotographerData = contractors.find(
    contractor => contractor.id === selectedPhotographer
  );

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-medium mb-2">Photographer</p>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search for a photographer..." 
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {isLoading ? (
          <div className="flex items-center space-x-2 mt-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm text-muted-foreground">Loading photographers...</span>
          </div>
        ) : searchQuery && photographers.length > 0 ? (
          <div className="mt-1 border rounded-md shadow-sm bg-background max-h-40 overflow-y-auto z-10 absolute">
            {photographers.map((photographer) => (
              <div 
                key={photographer.id}
                className="p-2 hover:bg-muted/50 cursor-pointer"
                onClick={() => handlePhotographerSelect(photographer)}
              >
                <p className="font-medium">{photographer.name}</p>
                {photographer.notes && (
                  <p className="text-sm text-muted-foreground">{photographer.notes}</p>
                )}
              </div>
            ))}
          </div>
        ) : null}
        
        {selectedPhotographerData && (
          <div className="mt-2 p-2 bg-primary/5 rounded text-sm">
            <p className="font-medium">{selectedPhotographerData.name}</p>
            {selectedPhotographerData.notes && (
              <p className="text-muted-foreground">{selectedPhotographerData.notes}</p>
            )}
          </div>
        )}
      </div>
      
      <div>
        <p className="text-sm font-medium mb-2">Date & Time</p>
        <div className="grid grid-cols-2 gap-2">
          <Input type="date" placeholder="Select date" />
          <Input type="time" placeholder="Select time" />
        </div>
      </div>
    </div>
  );
};
