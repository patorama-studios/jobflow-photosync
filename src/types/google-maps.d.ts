
/**
 * Type declarations for Google Maps API
 */

declare namespace google.maps {
  class Map {
    constructor(element: HTMLElement, options: MapOptions);
    setCenter(center: LatLng | LatLngLiteral): void;
    setZoom(zoom: number): void;
  }

  class Marker {
    constructor(options: MarkerOptions);
    setMap(map: Map | null): void;
    setPosition(position: LatLng | LatLngLiteral): void;
  }

  interface MapOptions {
    center: LatLng | LatLngLiteral;
    zoom: number;
    mapTypeControl?: boolean;
    streetViewControl?: boolean;
    fullscreenControl?: boolean;
    [key: string]: any;
  }

  interface MarkerOptions {
    position: LatLng | LatLngLiteral;
    map: Map | null;
    title?: string;
    animation?: number;
    [key: string]: any;
  }

  interface LatLngLiteral {
    lat: number;
    lng: number;
  }

  class LatLng {
    constructor(lat: number, lng: number);
    lat(): number;
    lng(): number;
  }

  const Animation: {
    DROP: number;
    BOUNCE: number;
  };

  namespace event {
    function clearInstanceListeners(instance: any): void;
    function addListener(instance: any, eventName: string, handler: Function): { remove: () => void };
  }

  namespace places {
    class Autocomplete {
      constructor(input: HTMLInputElement, options?: AutocompleteOptions);
      addListener(eventName: string, callback: () => void): any;
      getPlace(): PlaceResult;
    }

    interface AutocompleteOptions {
      types?: string[];
      fields?: string[];
      componentRestrictions?: {
        country: string | string[];
      };
      [key: string]: any;
    }

    interface PlaceResult {
      address_components?: AddressComponent[];
      formatted_address?: string;
      geometry?: {
        location: LatLng;
      };
      [key: string]: any;
    }

    interface AddressComponent {
      long_name: string;
      short_name: string;
      types: string[];
    }
  }
}
