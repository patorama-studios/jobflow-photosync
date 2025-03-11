
import { useState, useEffect, useCallback } from 'react';

interface Prediction {
  description: string;
  place_id: string;
  structured_formatting?: {
    main_text: string;
    secondary_text: string;
  };
}

interface UseGoogleAutocompleteOptions {
  country?: string;
  bounds?: google.maps.LatLngBounds | google.maps.LatLngBoundsLiteral; 
  types?: string[] | string;
}

interface UseGoogleAutocompleteResult {
  predictions: Prediction[];
  loading: boolean;
  error: string | null;
  searchPlaces: (query: string) => void;
  getPlaceDetails: (placeId: string) => Promise<google.maps.places.PlaceResult | null>;
}

export function useGoogleAutocomplete(
  options: UseGoogleAutocompleteOptions = {}
): UseGoogleAutocompleteResult {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [autocompleteService, setAutocompleteService] = useState<google.maps.places.AutocompleteService | null>(null);
  const [placesService, setPlacesService] = useState<google.maps.places.PlacesService | null>(null);

  // Initialize Google services when the component mounts
  useEffect(() => {
    if (window.google && window.google.maps && window.google.maps.places) {
      setAutocompleteService(new window.google.maps.places.AutocompleteService());
      
      // Create a dummy div for PlacesService (it requires a DOM element)
      const placesDiv = document.createElement('div');
      document.body.appendChild(placesDiv);
      setPlacesService(new window.google.maps.places.PlacesService(placesDiv));
      
      return () => {
        // Clean up the dummy div when the component unmounts
        if (placesDiv.parentNode) {
          document.body.removeChild(placesDiv);
        }
      };
    }
  }, []);

  const searchPlaces = useCallback(
    (query: string) => {
      if (!query || query.length < 3 || !autocompleteService) {
        setPredictions([]);
        return;
      }

      setLoading(true);
      setError(null);

      const request: google.maps.places.AutocompleteRequest = {
        input: query,
      };

      if (options.country) {
        request.componentRestrictions = { country: options.country };
      }

      if (options.bounds) {
        request.bounds = options.bounds;
      }

      if (options.types) {
        request.types = options.types;
      }

      autocompleteService.getPlacePredictions(
        request,
        (results, status) => {
          setLoading(false);
          
          if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            setPredictions(results as Prediction[]);
          } else {
            setPredictions([]);
            if (status !== google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
              setError(`Error fetching predictions: ${status}`);
            }
          }
        }
      );
    },
    [autocompleteService, options]
  );

  const getPlaceDetails = useCallback(
    (placeId: string): Promise<google.maps.places.PlaceResult | null> => {
      return new Promise((resolve, reject) => {
        if (!placesService) {
          reject(new Error('Places service not initialized'));
          return;
        }

        placesService.getDetails(
          { placeId, fields: ['address_components', 'formatted_address', 'geometry'] },
          (result, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && result) {
              resolve(result);
            } else {
              reject(new Error(`Error fetching place details: ${status}`));
            }
          }
        );
      });
    },
    [placesService]
  );

  return { predictions, loading, error, searchPlaces, getPlaceDetails };
}
