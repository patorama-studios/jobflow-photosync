
import { Order } from '@/types/order-types';
import { CalendarEvent } from '@/types/calendar';

export const convertOrdersToEvents = (orders: any[]): CalendarEvent[] => {
  // Map photographers to colors
  const photographerColors: Record<string, string> = {};
  const colors = [
    '#3174ad', // Blue
    '#32a852', // Green
    '#a83232', // Red
    '#a87f32', // Orange
    '#7e32a8', // Purple
    '#32a89e', // Teal
  ];

  // Assign colors to photographers
  orders.forEach((order, index) => {
    if (!photographerColors[order.photographer]) {
      photographerColors[order.photographer] = colors[index % colors.length];
    }
  });

  // Convert orders to calendar events
  const calendarEvents: CalendarEvent[] = orders.map((order) => {
    const startDate = new Date(order.scheduledDate);
    // Set the hours from the scheduled_time (format: "HH:MM AM/PM")
    const timeMatch = order.scheduledTime.match(/(\d+):(\d+)\s*([AP]M)/i);
    if (timeMatch) {
      let hours = parseInt(timeMatch[1]);
      const minutes = parseInt(timeMatch[2]);
      const ampm = timeMatch[3].toUpperCase();
      
      if (ampm === 'PM' && hours < 12) hours += 12;
      if (ampm === 'AM' && hours === 12) hours = 0;
      
      startDate.setHours(hours, minutes, 0);
    }
    
    const endDate = new Date(startDate);
    endDate.setHours(startDate.getHours() + 2); // Assume 2 hour sessions

    // Create an order object that conforms to the Order type from types/orders.ts
    const typedOrder: Order = {
      id: order.id,
      orderNumber: order.orderNumber,
      address: order.address,
      city: order.city || "",
      state: order.state || "",
      zip: order.zip || "",
      client: order.client,
      clientEmail: order.clientEmail,
      clientPhone: order.clientPhone,
      photographer: order.photographer,
      photographerPayoutRate: order.photographerPayoutRate,
      price: order.price,
      propertyType: order.propertyType,
      scheduledDate: order.scheduledDate,
      scheduledTime: order.scheduledTime,
      squareFeet: order.squareFeet,
      status: order.status as any,
      package: order.package || "",
      internalNotes: order.internalNotes,
      customerNotes: order.customerNotes,
      stripePaymentId: order.stripePaymentId,
    };

    return {
      id: order.id,
      title: order.package || "",
      start: startDate,
      end: endDate,
      client: order.client,
      photographer: order.photographer,
      photographerId: orders.findIndex((o) => o.photographer === order.photographer) + 1,
      location: (order.address || "") + ', ' + (order.city || ""),
      status: order.status,
      color: photographerColors[order.photographer],
      orderNumber: order.orderNumber || `ORD-${Math.floor(Math.random() * 10000)}`,
      order: typedOrder,
      // Additional properties to match with CalendarEvent type
      scheduledDate: order.scheduledDate,
      scheduledTime: order.scheduledTime,
      package: order.package,
      address: order.address
    };
  });

  return calendarEvents;
};

export const convertOrdersToTypedOrders = (orders: any[]): Order[] => {
  return orders.map(order => ({
    id: order.id,
    orderNumber: order.orderNumber,
    address: order.address,
    city: order.city || "",
    state: order.state || "",
    zip: order.zip || "",
    client: order.client,
    clientEmail: order.clientEmail,
    clientPhone: order.clientPhone,
    photographer: order.photographer,
    photographerPayoutRate: order.photographerPayoutRate,
    price: order.price,
    propertyType: order.propertyType,
    scheduledDate: order.scheduledDate,
    scheduledTime: order.scheduledTime,
    squareFeet: order.squareFeet,
    status: order.status as any,
    package: order.package || "",
    internalNotes: order.internalNotes,
    customerNotes: order.customerNotes,
    stripePaymentId: order.stripePaymentId,
  }));
};
