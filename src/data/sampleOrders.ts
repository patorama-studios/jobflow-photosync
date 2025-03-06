
import { addDays } from 'date-fns';

// Define the Order type for the sample data
export interface Order {
  id: number;
  orderNumber: string;
  address: string;
  client: string;
  clientEmail?: string;
  clientPhone?: string;
  photographer: string;
  photographerPayoutRate?: number;
  price: number;
  propertyType: string;
  scheduledDate: string;
  scheduledTime: string;
  squareFeet: number;
  status: string;
  additionalAppointments?: {
    date: string;
    time: string;
    description: string;
  }[];
  customFields?: Record<string, string>;
  customerNotes?: string;
  internalNotes?: string;
  mediaUploaded?: boolean;
  mediaLinks?: string[];
  drivingTimeMin?: number;
  previousLocation?: string;
  city?: string;
  state?: string;
  zip?: string;
  package?: string;
  stripePaymentId?: string;
}

// Generate sample orders data
export const generateSampleOrders = (): Order[] => {
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
      mediaLinks: ['/images/sample1.jpg', '/images/sample2.jpg'],
      drivingTimeMin: 25,
      previousLocation: "Office"
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
    },
    // Adding more sample orders for better calendar visualization
    {
      id: 6,
      orderNumber: "ORD-2023-006",
      address: "987 Spruce Court, Seattle, WA 98103",
      client: "Jennifer Brown - City Homes",
      photographer: "Alex Johnson",
      photographerPayoutRate: 95,
      price: 149,
      propertyType: "Townhouse",
      scheduledDate: addDays(new Date(), 1).toISOString(),
      scheduledTime: "9:00 AM",
      squareFeet: 1750,
      status: "scheduled",
      customerNotes: "Please capture the unique architectural features."
    },
    {
      id: 7,
      orderNumber: "ORD-2023-007",
      address: "246 Aspen Way, Bellevue, WA 98005",
      client: "Robert Taylor - Elite Properties",
      photographer: "Alex Johnson",
      photographerPayoutRate: 95,
      price: 149,
      propertyType: "Residential",
      scheduledDate: addDays(new Date(), 2).toISOString(),
      scheduledTime: "1:00 PM",
      squareFeet: 2200,
      status: "scheduled",
      customerNotes: "New construction home, focus on modern features."
    },
    {
      id: 8,
      orderNumber: "ORD-2023-008",
      address: "135 Fir Street, Redmond, WA 98053",
      client: "Susan Miller - Miller Realty",
      photographer: "Wei Chen",
      photographerPayoutRate: 150,
      price: 249,
      propertyType: "Residential",
      scheduledDate: addDays(new Date(), 2).toISOString(),
      scheduledTime: "10:00 AM",
      squareFeet: 2800,
      status: "scheduled",
      customerNotes: "Large property with extensive gardens. Exterior shots are priority."
    },
    {
      id: 9,
      orderNumber: "ORD-2023-009",
      address: "864 Cherry Avenue, Kirkland, WA 98034",
      client: "James Wilson - Lakeside Realty",
      photographer: "Maria Garcia",
      photographerPayoutRate: 120,
      price: 199,
      propertyType: "Waterfront",
      scheduledDate: addDays(new Date(), 3).toISOString(),
      scheduledTime: "4:00 PM",
      squareFeet: 3500,
      status: "scheduled",
      customerNotes: "Capture the lake views from all angles. Schedule during sunset if possible."
    },
    {
      id: 10,
      orderNumber: "ORD-2023-010",
      address: "753 Walnut Boulevard, Seattle, WA 98104",
      client: "Patricia Johnson - Downtown Properties",
      photographer: "Priya Patel",
      photographerPayoutRate: 85,
      price: 149,
      propertyType: "Condo",
      scheduledDate: addDays(new Date(), 3).toISOString(),
      scheduledTime: "11:00 AM",
      squareFeet: 1100,
      status: "scheduled",
      customerNotes: "High-rise condo with city views. Emphasized the floor-to-ceiling windows."
    }
  ];
  
  // Add drivingTimeMin and previousLocation to all orders
  return sampleOrders.map((order, index) => {
    if (index > 0 && !order.drivingTimeMin) {
      return {
        ...order,
        drivingTimeMin: 15 + Math.floor(Math.random() * 30), // Random driving time between 15-45 mins
        previousLocation: index === 0 ? "Office" : sampleOrders[index - 1].address
      };
    }
    return order;
  });
};

// Export the sample orders for use in other components
export const sampleOrders = generateSampleOrders();
