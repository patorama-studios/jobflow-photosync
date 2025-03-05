
// Google Maps API script loader

interface GoogleMapsScriptOptions {
  apiKey: string;
  libraries?: string[];
  callback?: string;
  region?: string;
}

let isLoaded = false;
let isLoading = false;
let callbacks: Array<() => void> = [];
let defaultRegion = 'au'; // Default to Australia

export const setDefaultRegion = (region: string) => {
  defaultRegion = region;
};

export const getDefaultRegion = () => {
  return defaultRegion;
};

export const loadGoogleMapsScript = (options: GoogleMapsScriptOptions): Promise<void> => {
  return new Promise((resolve, reject) => {
    // If already loaded, resolve immediately
    if (isLoaded) {
      resolve();
      return;
    }
    
    // Add to callbacks queue if script is currently loading
    if (isLoading) {
      callbacks.push(() => resolve());
      return;
    }
    
    // Start loading
    isLoading = true;
    
    // Create script element
    const script = document.createElement('script');
    script.id = 'google-maps-script';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${options.apiKey}&libraries=${
      options.libraries?.join(',') || 'places'
    }${options.callback ? `&callback=${options.callback}` : ''}${
      options.region ? `&region=${options.region}` : `&region=${defaultRegion}`
    }`;
    script.async = true;
    script.defer = true;
    
    // Handle success
    script.onload = () => {
      isLoaded = true;
      isLoading = false;
      resolve();
      
      // Execute any pending callbacks
      callbacks.forEach(callback => callback());
      callbacks = [];
    };
    
    // Handle error
    script.onerror = () => {
      isLoading = false;
      reject(new Error('Failed to load Google Maps API'));
      callbacks = [];
    };
    
    // Append to document
    document.head.appendChild(script);
  });
};

// Define global Google Maps types
declare global {
  interface Window {
    google: {
      maps: {
        places: {
          Autocomplete: new (
            element: HTMLInputElement,
            options?: AutocompleteOptions
          ) => Autocomplete;
        };
        Map: any;
        Marker: any;
        event: {
          clearInstanceListeners(instance: any): void;
        };
      };
    };
  }
}

// Define types within a namespace
export namespace GoogleMapsTypes {
  export interface AutocompleteOptions {
    types?: string[];
    componentRestrictions?: {
      country: string | string[];
    };
    fields?: string[];
  }
  
  export interface Autocomplete {
    addListener(event: string, handler: () => void): void;
    getPlace(): {
      address_components?: Array<{
        long_name: string;
        short_name: string;
        types: string[];
      }>;
      formatted_address?: string;
      geometry?: {
        location: {
          lat(): number;
          lng(): number;
        };
      };
    };
  }
}

// We need to maintain the global namespace for compatibility
type AutocompleteOptions = GoogleMapsTypes.AutocompleteOptions;
type Autocomplete = GoogleMapsTypes.Autocomplete;
