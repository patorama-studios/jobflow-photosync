
// Google Maps API script loader

interface GoogleMapsScriptOptions {
  apiKey: string;
  libraries?: string[];
  callback?: string;
}

let isLoaded = false;
let isLoading = false;
let callbacks: Array<() => void> = [];

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
    }${options.callback ? `&callback=${options.callback}` : ''}`;
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

// Declare global Google Maps types
declare global {
  interface Window {
    google: {
      maps: {
        places: {
          Autocomplete: typeof google.maps.places.Autocomplete;
        };
        event: typeof google.maps.event;
      };
    };
  }
}
