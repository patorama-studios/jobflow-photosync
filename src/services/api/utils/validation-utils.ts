
/**
 * Utility functions for validation
 */
import { OrderStatus } from '@/types/order-types';

export const validateStatus = (status: string | null | undefined): OrderStatus => {
  if (!status) return "pending";
  
  const validStatuses: OrderStatus[] = [
    "scheduled", "completed", "pending", "canceled", "cancelled",
    "rescheduled", "in_progress", "editing", "review", "delivered", "unavailable"
  ];
  
  return validStatuses.includes(status as OrderStatus) 
    ? (status as OrderStatus) 
    : "pending";
};
