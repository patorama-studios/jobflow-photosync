
import React from 'react';
import { PlaceResult } from '@/hooks/google-maps/types';

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
  if (!isSearching && suggestions.length === 0) return null;

  return (
    <div className="absolute z-50 w-full mt-1 border rounded-md bg-background shadow-lg max-h-80 overflow-y-auto">
      {isSearching ? (
        <div className="p-2 text-center text-sm">Searching...</div>
      ) : suggestions.length > 0 ? (
        <ul className="py-1">
          {suggestions.map((prediction) => (
            <li
              key={prediction.place_id || Math.random().toString()}
              className="px-4 py-2 hover:bg-muted cursor-pointer"
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
        <div className="p-2 text-center text-sm">No results found</div>
      )}
    </div>
  );
};
