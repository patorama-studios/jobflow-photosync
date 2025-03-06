
import { Order } from '@/hooks/useSampleOrders';

export interface CalendarEvent {
  id: string | number;
  title: string;
  start: Date;
  end: Date;
  client?: string;
  photographer?: string;
  photographerId?: number;
  location?: string;
  status?: string;
  color?: string;
  orderNumber?: string;
  order?: Order;
  
  // Standard property names
  scheduledDate?: string;
  scheduledTime?: string;
  package?: string;
  address?: string;
  
  // Legacy property names for backward compatibility 
  // with existing components that use these names
  scheduled_date?: string;
  scheduled_time?: string;
}

// Adding this type for compatibility with existing files
export type CalendarOrder = CalendarEvent;
