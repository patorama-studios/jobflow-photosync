
import React, { useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import { useGoogleMaps } from '@/contexts/GoogleMapsContext';

interface AddressMapProps {
  lat: number;
  lng: number;
  address: string;
}

export const AddressMap: React.FC<AddressMapProps> = ({ lat, lng, address }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const { isLoaded } = useGoogleMaps();

  useEffect(() => {
    if (!isLoaded || !mapRef.current || !lat || !lng) return;

    // Create the map instance
    try {
      const center = { lat, lng };
      
      if (!googleMapRef.current) {
        // Initialize the map if not already created
        googleMapRef.current = new window.google.maps.Map(mapRef.current, {
          center,
          zoom: 15,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false
        });
      } else {
        // Update existing map
        googleMapRef.current.setCenter(center);
      }

      // Remove any existing marker
      if (markerRef.current) {
        markerRef.current.setMap(null);
      }

      // Add a marker
      markerRef.current = new window.google.maps.Marker({
        position: center,
        map: googleMapRef.current,
        title: address,
        animation: window.google.maps.Animation.DROP
      });

      console.log("Map initialized with coordinates:", lat, lng);
    } catch (error) {
      console.error("Error initializing map:", error);
    }
  }, [isLoaded, lat, lng, address]);

  if (!isLoaded) {
    return (
      <div className="h-40 flex items-center justify-center bg-muted/20 rounded border">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        <span className="ml-2 text-sm text-muted-foreground">Loading map...</span>
      </div>
    );
  }

  if (!lat || !lng) {
    return null;
  }

  return (
    <div className="mt-2 rounded-md overflow-hidden border">
      <div ref={mapRef} className="h-40 w-full bg-muted/10"></div>
    </div>
  );
};
