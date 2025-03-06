
import { Order } from '@/types/orders';

export interface CalendarOrder extends Omit<Order, 'id'> {
  id: string;
  location?: string;
  // Add the missing properties from Order that are needed
  orderNumber?: string; 
  propertyType?: string;
  scheduledDate?: string;
  scheduledTime?: string;
  squareFeet?: number;
}
