
import { useState, useEffect } from 'react';
import { addDays } from 'date-fns';

type Order = {
  id: number;
  address: string;
  client: string;
  photographer: string;
  price: number;
  propertyType: string;
  scheduledDate: string;
  scheduledTime: string;
  squareFeet: number;
  status: 'pending' | 'scheduled' | 'completed';
};

export const useSampleOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  
  useEffect(() => {
    // Sample data - in a real app, this would come from an API
    const sampleOrders: Order[] = [
      {
        id: 1,
        address: "123 Maple Street, Seattle, WA 98101",
        client: "John Smith - ABC Realty",
        photographer: "Alex Johnson",
        price: 149,
        propertyType: "Residential",
        scheduledDate: addDays(new Date(), -2).toISOString(),
        scheduledTime: "10:00 AM",
        squareFeet: 1800,
        status: "completed"
      },
      {
        id: 2,
        address: "456 Oak Avenue, Seattle, WA 98102",
        client: "Sarah Johnson - Johnson Properties",
        photographer: "Maria Garcia",
        price: 199,
        propertyType: "Commercial",
        scheduledDate: addDays(new Date(), 1).toISOString(),
        scheduledTime: "2:00 PM",
        squareFeet: 2500,
        status: "scheduled"
      },
      {
        id: 3,
        address: "789 Pine Boulevard, Bellevue, WA 98004",
        client: "Michael Williams - Luxury Homes",
        photographer: "Wei Chen",
        price: 249,
        propertyType: "Residential",
        scheduledDate: addDays(new Date(), 3).toISOString(),
        scheduledTime: "11:30 AM",
        squareFeet: 3200,
        status: "scheduled"
      },
      {
        id: 4,
        address: "321 Cedar Road, Redmond, WA 98052",
        client: "Emily Davis - Modern Living",
        photographer: "Priya Patel",
        price: 149,
        propertyType: "Apartment",
        scheduledDate: addDays(new Date(), 5).toISOString(),
        scheduledTime: "9:00 AM",
        squareFeet: 1200,
        status: "pending"
      },
      {
        id: 5,
        address: "654 Birch Lane, Kirkland, WA 98033",
        client: "David Wilson - Wilson Realty",
        photographer: "Thomas Wilson",
        price: 199,
        propertyType: "Condo",
        scheduledDate: addDays(new Date(), -5).toISOString(),
        scheduledTime: "3:30 PM",
        squareFeet: 1600,
        status: "completed"
      }
    ];
    
    setOrders(sampleOrders);
  }, []);
  
  return { orders };
};
