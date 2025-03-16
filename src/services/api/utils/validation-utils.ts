
/**
 * Utility functions for validation
 */

export const validateStatus = (status: string | null | undefined): string => {
  if (!status) return "pending";
  
  const validStatuses = [
    "scheduled", "completed", "pending", "canceled", "cancelled",
    "rescheduled", "in_progress", "editing", "review", "delivered", "unavailable"
  ];
  
  return validStatuses.includes(status) 
    ? status 
    : "pending";
};
