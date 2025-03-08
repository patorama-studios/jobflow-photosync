
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { FormItem, FormLabel } from '@/components/ui/form';
import { SearchIcon, UserIcon } from 'lucide-react';
import { usePhotographers, Photographer } from '@/hooks/use-photographers';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface PhotographerSearchProps {
  onPhotographerSelect: (photographer: Photographer) => void;
  selectedPhotographer?: string;
}

export const PhotographerSearch: React.FC<PhotographerSearchProps> = ({
  onPhotographerSelect,
  selectedPhotographer
}) => {
  const { photographers, isLoading, error } = usePhotographers();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPhotographers, setFilteredPhotographers] = useState<Photographer[]>([]);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (photographers && searchQuery) {
      const filtered = photographers.filter(photographer => 
        photographer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (photographer.email && photographer.email.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredPhotographers(filtered);
    } else {
      setFilteredPhotographers(photographers || []);
    }
  }, [searchQuery, photographers]);

  const handleInputFocus = () => {
    setShowResults(true);
  };

  const handleInputBlur = () => {
    // Delay hiding results to allow for selection
    setTimeout(() => {
      setShowResults(false);
    }, 200);
  };

  const handleSelect = (photographer: Photographer) => {
    onPhotographerSelect(photographer);
    setShowResults(false);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="space-y-2 relative">
      <FormItem>
        <FormLabel>Photographer</FormLabel>
        <div className="relative">
          <Input
            placeholder="Search for photographer"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            className="pr-10"
            disabled={isLoading}
          />
          <SearchIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
      </FormItem>

      {showResults && (
        <div className="absolute z-10 w-full bg-background border rounded-md overflow-hidden shadow-md">
          <div className="max-h-64 overflow-y-auto">
            {isLoading ? (
              <div className="p-3 text-sm text-center text-muted-foreground">Loading photographers...</div>
            ) : filteredPhotographers.length > 0 ? (
              filteredPhotographers.map((photographer) => (
                <div
                  key={photographer.id}
                  className="p-3 hover:bg-muted cursor-pointer border-b last:border-b-0 flex items-center gap-3"
                  onClick={() => handleSelect(photographer)}
                >
                  <Avatar className="h-8 w-8" style={{ backgroundColor: photographer.color }}>
                    <AvatarFallback>{getInitials(photographer.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{photographer.name}</div>
                    {photographer.email && (
                      <div className="text-xs text-muted-foreground">{photographer.email}</div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-3 text-sm text-center text-muted-foreground">
                No photographers found
              </div>
            )}
          </div>
        </div>
      )}

      {selectedPhotographer && (
        <div className="mt-2 border rounded-md p-2 flex items-center gap-2">
          <UserIcon className="h-4 w-4 text-muted-foreground" />
          <span>{selectedPhotographer}</span>
        </div>
      )}
    </div>
  );
};
