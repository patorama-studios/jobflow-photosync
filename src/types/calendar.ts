
import { Order } from '@/types/orders';

export interface CalendarOrder extends Omit<Order, 'id'> {
  id: string;
  location?: string;
}
