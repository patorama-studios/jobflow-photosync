
import { Order } from '@/types/orders';

export interface CalendarEvent {
  id: string | number;
  title: string;
  start: Date;
  end: Date;
  client?: string;
  photographer?: string;
  photographerId: number;
  location?: string;
  status?: string;
  color?: string;
  orderNumber?: string;
  order?: Order;
  
  // Additional properties to match the Order type
  scheduledDate?: string;
  scheduledTime?: string;
  package?: string;
  address?: string;
}

// Adding this type for compatibility with existing files
export type CalendarOrder = CalendarEvent;
