
import React from 'react';
import { PlaceResult } from '@/hooks/google-maps/types';
import { Loader2 } from 'lucide-react';

interface AddressSuggestionsListProps {
  suggestions: PlaceResult[];
  isSearching: boolean;
  onSelectAddress: (prediction: PlaceResult) => void;
}

export const AddressSuggestionsList: React.FC<AddressSuggestionsListProps> = ({
  suggestions,
  isSearching,
  onSelectAddress
}) => {
  // Show dropdown if we're searching or have suggestions
  const showDropdown = isSearching || suggestions.length > 0;
  
  if (!showDropdown) return null;

  return (
    <div className="absolute z-50 w-full mt-1 border rounded-md bg-background shadow-lg max-h-80 overflow-y-auto">
      {isSearching ? (
        <div className="p-4 text-center">
          <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2 text-primary" />
          <p className="text-sm text-muted-foreground">Searching for addresses...</p>
        </div>
      ) : suggestions.length > 0 ? (
        <ul className="py-1">
          {suggestions.map((prediction) => (
            <li
              key={prediction.place_id || Math.random().toString()}
              className="px-4 py-2 hover:bg-muted cursor-pointer transition-colors"
              onClick={() => onSelectAddress(prediction)}
            >
              <div className="font-medium">{prediction.formatted_address}</div>
              {prediction.name && prediction.formatted_address && prediction.name !== prediction.formatted_address && (
                <div className="text-xs text-muted-foreground">
                  {prediction.name}
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <div className="p-4 text-center">
          <p className="text-sm text-muted-foreground">No matching addresses found</p>
          <p className="text-xs text-muted-foreground mt-1">Try a different search term or enter address manually</p>
        </div>
      )}
    </div>
  );
};
