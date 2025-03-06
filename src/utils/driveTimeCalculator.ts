
import { Order } from '@/hooks/useSampleOrders';

/**
 * Calculate driving time between two locations
 * This is a simplified implementation - in a real app, this would use
 * Google Maps Distance Matrix API or similar
 */
export const calculateDriveTime = (
  fromAddress: string,
  toAddress: string
): number => {
  // This is a placeholder - in real implementation, we would call Google Maps API
  // For now, returning a random drive time between 15 and 60 minutes
  const baseDriveTime = 15;
  const randomFactor = Math.floor(Math.random() * 45);
  return baseDriveTime + randomFactor;
};

/**
 * Calculate driving times between a sequence of appointments
 */
export const calculateDriveTimes = (orders: Order[]): Order[] => {
  // Sort orders by date and time
  const sortedOrders = [...orders].sort((a, b) => {
    const dateA = new Date(a.scheduledDate);
    const dateB = new Date(b.scheduledDate);
    
    if (dateA.getTime() !== dateB.getTime()) {
      return dateA.getTime() - dateB.getTime();
    }
    
    return a.scheduledTime.localeCompare(b.scheduledTime);
  });
  
  // Calculate drive times between appointments
  return sortedOrders.map((order, index) => {
    if (index === 0) {
      // First appointment of the day - driving from home/office
      return {
        ...order,
        drivingTimeMin: 15 + Math.floor(Math.random() * 15),
        previousLocation: "Office"
      };
    }
    
    const previousOrder = sortedOrders[index - 1];
    const previousDate = new Date(previousOrder.scheduledDate);
    const currentDate = new Date(order.scheduledDate);
    
    // If appointments are on different days, assume driving from home/office
    if (previousDate.toDateString() !== currentDate.toDateString()) {
      return {
        ...order,
        drivingTimeMin: 15 + Math.floor(Math.random() * 15),
        previousLocation: "Office"
      };
    }
    
    // Calculate drive time from previous appointment
    const driveTime = calculateDriveTime(
      previousOrder.address,
      order.address
    );
    
    return {
      ...order,
      drivingTimeMin: driveTime,
      previousLocation: previousOrder.address
    };
  });
};
