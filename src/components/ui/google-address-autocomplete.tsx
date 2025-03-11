
import * as React from "react";
import { cn } from "@/lib/utils";
import { Input } from "./input";

export interface GoogleAddressAutocompleteProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  value?: string;
  onChange?: (value: string) => void;
  onSelect?: (address: {
    formattedAddress: string;
    streetAddress?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
    lat?: number;
    lng?: number;
  }) => void;
}

export const GoogleAddressAutocomplete = React.forwardRef<
  HTMLInputElement,
  GoogleAddressAutocompleteProps
>(({ className, onChange, onSelect, ...props }, ref) => {
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const autocompleteRef = React.useRef<google.maps.places.Autocomplete | null>(null);

  React.useEffect(() => {
    if (!inputRef.current || !window.google || !window.google.maps || !window.google.maps.places) {
      return;
    }

    // Initialize Google Places Autocomplete
    autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
      componentRestrictions: { country: "au" }, // Restrict to Australia
      fields: ["address_components", "formatted_address", "geometry"],
    });

    // Add listener for place selection
    autocompleteRef.current.addListener("place_changed", () => {
      if (!autocompleteRef.current) return;

      const place = autocompleteRef.current.getPlace();
      
      if (!place || !place.formatted_address) {
        return;
      }

      let streetAddress = "";
      let city = "";
      let state = "";
      let postalCode = "";
      let country = "";

      // Extract address components
      if (place.address_components) {
        for (const component of place.address_components) {
          const componentType = component.types[0];

          switch (componentType) {
            case "street_number": {
              streetAddress = `${component.long_name} ${streetAddress}`;
              break;
            }
            case "route": {
              streetAddress += component.long_name;
              break;
            }
            case "locality": {
              city = component.long_name;
              break;
            }
            case "administrative_area_level_1": {
              state = component.short_name;
              break;
            }
            case "postal_code": {
              postalCode = component.long_name;
              break;
            }
            case "country": {
              country = component.long_name;
              break;
            }
          }
        }
      }

      // Create address object
      const addressData = {
        formattedAddress: place.formatted_address,
        streetAddress,
        city,
        state,
        postalCode,
        country,
        lat: place.geometry?.location?.lat(),
        lng: place.geometry?.location?.lng(),
      };

      // Call onSelect with the address data
      if (onSelect) {
        onSelect(addressData);
      }
    });

    return () => {
      // Clean up
      if (autocompleteRef.current && window.google) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [onSelect]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <Input
      type="text"
      className={cn(className)}
      ref={(node) => {
        inputRef.current = node;
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      }}
      onChange={handleChange}
      {...props}
    />
  );
});

GoogleAddressAutocomplete.displayName = "GoogleAddressAutocomplete";
