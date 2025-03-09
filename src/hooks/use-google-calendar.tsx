
import { useState, useEffect } from 'react';
import { Order, OrderStatus } from '@/types/order-types';
import { mapSupabaseOrdersToOrderType } from '@/utils/map-supabase-orders';

// Mock function for getting Google Calendar events
const fetchGoogleCalendarEvents = async (): Promise<any[]> => {
  // This would actually fetch from Google API in production
  // For now, return mock data
  return [
    {
      id: 'google-event-1',
      title: 'Client Meeting',
      start: new Date(),
      end: new Date(new Date().getTime() + 60 * 60 * 1000),
      type: 'google',
    },
    {
      id: 'google-event-2',
      title: 'Photography Session',
      start: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
      end: new Date(new Date().getTime() + 25 * 60 * 60 * 1000),
      type: 'google',
    },
  ];
};

// Convert Google Calendar events to Order format
const convertToOrders = (events: any[]): Order[] => {
  return events.map((event) => {
    const date = event.start instanceof Date ? event.start : new Date(event.start);
    
    // Create an Order object from the Google Calendar event
    return {
      id: event.id,
      orderNumber: `Google-${event.id.substring(0, 6)}`,
      order_number: `Google-${event.id.substring(0, 6)}`,
      address: event.location || 'No location specified',
      city: '',
      state: '',
      zip: '',
      client: event.title || 'Google Calendar Event',
      customerName: event.title || 'Google Calendar Event',
      propertyAddress: event.location || 'No location specified',
      clientEmail: '',
      client_email: '',
      clientPhone: '',
      client_phone: '',
      photographer: 'Not assigned',
      price: 0,
      propertyType: 'Unknown',
      property_type: 'Unknown',
      scheduledDate: date.toISOString(),
      scheduled_date: date.toISOString(),
      scheduledTime: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      scheduled_time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      squareFeet: 0,
      square_feet: 0,
      status: 'unavailable' as OrderStatus, // Use a specific status for Google events
      notes: event.description || '',
    };
  });
};

export function useGoogleCalendar() {
  const [events, setEvents] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        const googleEvents = await fetchGoogleCalendarEvents();
        const convertedEvents = convertToOrders(googleEvents);
        setEvents(convertedEvents);
      } catch (err: any) {
        console.error('Error fetching Google Calendar events:', err);
        setError(err.message || 'Failed to fetch Google Calendar events');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return { events, isLoading, error };
}
