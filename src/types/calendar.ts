
import { Order as BaseOrder } from '@/types/orders';

export interface CalendarOrder extends BaseOrder {
  location?: string;
  address: string;
}
