
/**
 * Utility functions for working with addresses
 */

interface AddressFormatOptions {
  includeCountry?: boolean;
  separator?: string;
}

interface ParsedAddress {
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
}

/**
 * Format an address from its components
 */
export function formatAddress(
  components: ParsedAddress,
  options: AddressFormatOptions = {}
): string {
  const { includeCountry = true, separator = ', ' } = options;
  
  const parts = [
    components.street,
    components.city,
    components.state && components.zip
      ? `${components.state} ${components.zip}`
      : components.state || components.zip,
  ];
  
  if (includeCountry && components.country) {
    parts.push(components.country);
  }
  
  return parts.filter(Boolean).join(separator);
}

/**
 * Parse a simple address string into components
 * This is a very simplified parser and won't work for all address formats
 */
export function parseSimpleAddress(addressString: string): ParsedAddress {
  // This is a very naive implementation that assumes a comma-separated format
  const parts = addressString.split(',').map(part => part.trim());
  
  if (parts.length === 0) return {};
  
  const result: ParsedAddress = {};
  
  // Assume the first part is the street
  if (parts.length > 0) result.street = parts[0];
  
  // Assume the second part is the city
  if (parts.length > 1) result.city = parts[1];
  
  // Try to parse state and zip from the third part
  if (parts.length > 2) {
    const stateZip = parts[2].split(' ').filter(Boolean);
    
    if (stateZip.length >= 2) {
      // Assume last element is zip and everything before is state
      result.zip = stateZip.pop() || '';
      result.state = stateZip.join(' ');
    } else if (stateZip.length === 1) {
      // Just one element, assume it's the state
      result.state = stateZip[0];
    }
  }
  
  // Assume the fourth part is the country
  if (parts.length > 3) result.country = parts[3];
  
  return result;
}

/**
 * Get an address from coordinates using Google Maps Geocoding API
 */
export async function getAddressFromCoordinates(
  lat: number,
  lng: number,
  apiKey: string
): Promise<ParsedAddress> {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
    );
    
    if (!response.ok) {
      throw new Error('Geocoding API returned an error');
    }
    
    const data: google.maps.Geocoding.GeocoderResponse = await response.json();
    
    if (data.status !== google.maps.Geocoding.GeocoderStatus.OK || !data.results.length) {
      throw new Error(`Geocoding failed with status: ${data.status}`);
    }
    
    const result = data.results[0];
    const components: ParsedAddress = {};
    
    // Extract address components
    for (const component of result.address_components) {
      const types = component.types;
      
      if (types.includes('street_number') || types.includes('route')) {
        components.street = components.street 
          ? `${components.street} ${component.long_name}`
          : component.long_name;
      } else if (types.includes('locality')) {
        components.city = component.long_name;
      } else if (types.includes('administrative_area_level_1')) {
        components.state = component.short_name;
      } else if (types.includes('postal_code')) {
        components.zip = component.long_name;
      } else if (types.includes('country')) {
        components.country = component.long_name;
      }
    }
    
    // If we didn't extract a street, use the formatted address
    if (!components.street && result.formatted_address) {
      components.street = result.formatted_address.split(',')[0];
    }
    
    return components;
  } catch (error) {
    console.error('Error getting address from coordinates:', error);
    return {};
  }
}

/**
 * Validate if the provided string looks like a valid address
 */
export function isValidAddress(address: string): boolean {
  if (!address || address.trim().length < 5) return false;
  
  // Simple validation: check if the address has at least one comma
  // and has a reasonable length
  return address.includes(',') && address.length > 10;
}
