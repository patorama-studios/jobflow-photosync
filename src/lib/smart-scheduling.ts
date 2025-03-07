
import { useContractors } from '@/hooks/use-contractors';

export interface SchedulingInput {
  address: string;
  preferredPhotographer?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

interface SchedulingSuggestion {
  date: Date;
  time: string;
  reason: string;
  photographerId?: string;
  photographerName?: string;
}

// Calculate distance between two coordinates in km using the Haversine formula
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Estimate driving time based on distance (very simple approximation)
const estimateDrivingTime = (distanceKm: number): number => {
  // Average city driving speed: 30km/h, return minutes
  return (distanceKm / 30) * 60;
};

// Mock previous job locations for demonstration
const previousJobs = [
  { photographerId: "1", lat: -33.865143, lng: 151.209900, date: new Date(), time: "10:00 AM" }, // Sydney
  { photographerId: "2", lat: -37.840935, lng: 144.946457, date: new Date(), time: "2:00 PM" },  // Melbourne
  { photographerId: "3", lat: -31.953004, lng: 115.857469, date: new Date(), time: "9:00 AM" },  // Perth
];

// Get smart scheduling suggestions based on various parameters
export const getSmartSchedulingSuggestions = async (
  input: SchedulingInput
): Promise<SchedulingSuggestion[]> => {
  // Wait for a short time to simulate API processing
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const today = new Date();
  const suggestions: SchedulingSuggestion[] = [];

  // Get available photographers (in a real app, this would come from your database)
  // For now, mock some photographers
  const photographers = [
    { id: "1", name: "Maria Garcia", availableHours: ["9:00 AM", "11:00 AM", "2:00 PM"] },
    { id: "2", name: "Alex Johnson", availableHours: ["10:00 AM", "1:00 PM", "3:00 PM"] },
    { id: "3", name: "Wei Chen", availableHours: ["8:00 AM", "12:00 PM", "4:00 PM"] },
  ];

  // Use location-based intelligence if we have coordinates
  if (input.coordinates) {
    // Find nearby jobs for efficient routing
    const nearbyJobs = previousJobs.filter(job => {
      if (!input.coordinates) return false;
      const distance = calculateDistance(
        input.coordinates.lat, 
        input.coordinates.lng, 
        job.lat, 
        job.lng
      );
      return distance < 30; // Jobs within 30km
    });
    
    // If we have nearby jobs, suggest time slots around them
    if (nearbyJobs.length > 0) {
      for (const job of nearbyJobs) {
        const photographer = photographers.find(p => p.id === job.photographerId);
        if (!photographer) continue;
        
        // Calculate optimal time slot based on driving distance
        const distance = calculateDistance(
          input.coordinates.lat, 
          input.coordinates.lng, 
          job.lat, 
          job.lng
        );
        const drivingTimeMinutes = estimateDrivingTime(distance);
        
        // Create a suggestion one day after the current date
        const date = new Date(today);
        date.setDate(date.getDate() + 1);
        
        // Suggest time slot based on driving time from previous job
        suggestions.push({
          date,
          time: photographer.availableHours[0],
          reason: `${photographer.name} is nearby (${Math.round(distance)}km away, ~${Math.round(drivingTimeMinutes)}min drive)`,
          photographerId: photographer.id,
          photographerName: photographer.name
        });
      }
    }
  }
  
  // If the user specified a preferred photographer, suggest slots for them
  if (input.preferredPhotographer) {
    const photographer = photographers.find(
      p => p.name.toLowerCase() === input.preferredPhotographer?.toLowerCase()
    );
    
    if (photographer) {
      // Add suggestions for preferred photographer
      for (let i = 1; i <= 3; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() + i);
        
        photographer.availableHours.forEach(time => {
          suggestions.push({
            date,
            time,
            reason: `${photographer.name} is available and is your preferred photographer`,
            photographerId: photographer.id,
            photographerName: photographer.name
          });
        });
      }
    }
  }
  
  // If we still don't have enough suggestions, add some general ones
  if (suggestions.length < 3) {
    photographers.forEach(photographer => {
      // Skip if this is already the preferred photographer
      if (input.preferredPhotographer && 
          photographer.name.toLowerCase() === input.preferredPhotographer.toLowerCase()) {
        return;
      }
      
      // Add a suggestion for tomorrow
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      suggestions.push({
        date: tomorrow,
        time: photographer.availableHours[0],
        reason: `${photographer.name} is available for a quick appointment`,
        photographerId: photographer.id,
        photographerName: photographer.name
      });
    });
  }
  
  // Deduplicate suggestions by creating a unique key for each one
  const uniqueSuggestions = suggestions.reduce((acc, curr) => {
    const key = `${curr.date.toDateString()}-${curr.time}-${curr.photographerId}`;
    acc[key] = curr;
    return acc;
  }, {} as Record<string, SchedulingSuggestion>);
  
  return Object.values(uniqueSuggestions).slice(0, 5); // Return at most 5 suggestions
};
