
import { OrderStatus } from '@/types/order-types';

/**
 * Helper function to validate that a string is a valid OrderStatus
 * @param status The status to validate
 * @returns A valid OrderStatus
 */
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
