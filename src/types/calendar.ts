
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
}
