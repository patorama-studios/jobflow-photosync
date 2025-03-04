
import { useState, useEffect } from 'react';
import { addDays } from 'date-fns';

export type Order = {
  id: number;
  orderNumber: string;
  address: string;
  client: string;
  photographer: string;
  photographerPayoutRate: number;
  price: number;
  propertyType: string;
  scheduledDate: string;
  scheduledTime: string;
  squareFeet: number;
  status: 'pending' | 'scheduled' | 'completed';
  additionalAppointments?: Array<{
    date: string;
    time: string;
    description: string;
  }>;
  customFields?: Record<string, any>;
  customerNotes?: string;
  internalNotes?: string;
  mediaUploaded?: boolean;
  mediaLinks?: string[];
};

export const useSampleOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  
  useEffect(() => {
    // Sample data - in a real app, this would come from an API
    const sampleOrders: Order[] = [
      {
        id: 1,
        orderNumber: "ORD-2023-001",
        address: "123 Maple Street, Seattle, WA 98101",
        client: "John Smith - ABC Realty",
        photographer: "Alex Johnson",
        photographerPayoutRate: 95,
        price: 149,
        propertyType: "Residential",
        scheduledDate: addDays(new Date(), -2).toISOString(),
        scheduledTime: "10:00 AM",
        squareFeet: 1800,
        status: "completed",
        additionalAppointments: [
          {
            date: addDays(new Date(), 5).toISOString(),
            time: "11:00 AM",
            description: "Follow-up shots"
          }
        ],
        customFields: {
          specialInstructions: "Focus on kitchen and master bathroom",
          accessCode: "1234",
          lockboxLocation: "Front door"
        },
        customerNotes: "Customer prefers shots with natural lighting. Property will be staged by 9:30 AM.",
        internalNotes: "This is a VIP client, ensure all shots are perfect. Previous order had issues with bathroom lighting.",
        mediaUploaded: true,
        mediaLinks: ['/images/sample1.jpg', '/images/sample2.jpg']
      },
      {
        id: 2,
        orderNumber: "ORD-2023-002",
        address: "456 Oak Avenue, Seattle, WA 98102",
        client: "Sarah Johnson - Johnson Properties",
        photographer: "Maria Garcia",
        photographerPayoutRate: 120,
        price: 199,
        propertyType: "Commercial",
        scheduledDate: addDays(new Date(), 1).toISOString(),
        scheduledTime: "2:00 PM",
        squareFeet: 2500,
        status: "scheduled",
        customerNotes: "Focus on the open layout and natural light. Avoid showing the storage area.",
        internalNotes: "Client is very particular about angles. Check previous orders for reference."
      },
      {
        id: 3,
        orderNumber: "ORD-2023-003",
        address: "789 Pine Boulevard, Bellevue, WA 98004",
        client: "Michael Williams - Luxury Homes",
        photographer: "Wei Chen",
        photographerPayoutRate: 150,
        price: 249,
        propertyType: "Residential",
        scheduledDate: addDays(new Date(), 3).toISOString(),
        scheduledTime: "11:30 AM",
        squareFeet: 3200,
        status: "scheduled",
        customFields: {
          specialInstructions: "Staged home, no editing needed"
        },
        customerNotes: "This is a luxury property, emphasize the view and high-end finishes."
      },
      {
        id: 4,
        orderNumber: "ORD-2023-004",
        address: "321 Cedar Road, Redmond, WA 98052",
        client: "Emily Davis - Modern Living",
        photographer: "Priya Patel",
        photographerPayoutRate: 85,
        price: 149,
        propertyType: "Apartment",
        scheduledDate: addDays(new Date(), 5).toISOString(),
        scheduledTime: "9:00 AM",
        squareFeet: 1200,
        status: "pending",
        additionalAppointments: [
          {
            date: addDays(new Date(), 6).toISOString(),
            time: "10:00 AM",
            description: "Twilight shots"
          }
        ],
        customerNotes: "First time working with this photographer, please review shots before finalizing."
      },
      {
        id: 5,
        orderNumber: "ORD-2023-005",
        address: "654 Birch Lane, Kirkland, WA 98033",
        client: "David Wilson - Wilson Realty",
        photographer: "Thomas Wilson",
        photographerPayoutRate: 110,
        price: 199,
        propertyType: "Condo",
        scheduledDate: addDays(new Date(), -5).toISOString(),
        scheduledTime: "3:30 PM",
        squareFeet: 1600,
        status: "completed",
        mediaUploaded: true,
        mediaLinks: ['/images/sample3.jpg', '/images/sample4.jpg']
      }
    ];
    
    setOrders(sampleOrders);
  }, []);
  
  return { orders };
};
