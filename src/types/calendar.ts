
import { Order } from '@/types/orders';

export interface CalendarOrder extends Order {
  location?: string;
  address: string;
}
