
import { Order } from '../types/order-types';
import { format, addDays, subDays } from 'date-fns';

// Generate sample orders for testing and development
export function generateSampleOrders(): Order[] {
  const today = new Date();
  return [
    {
      id: 1,
      orderNumber: "ORD-2023-001",
      order_number: "ORD-2023-001",
      address: "123 Maple Street, Seattle, WA 98101",
      client: "John Smith - ABC Realty",
      customerName: "John Smith - ABC Realty", 
      propertyAddress: "123 Maple Street, Seattle, WA 98101",
      photographer: "Alex Johnson",
      photographerPayoutRate: 95,
      photographer_payout_rate: 95,
      price: 149,
      propertyType: "Residential",
      property_type: "Residential",
      scheduledDate: format(today, 'yyyy-MM-dd'),
      scheduled_date: format(today, 'yyyy-MM-dd'),
      scheduledTime: "10:00 AM",
      scheduled_time: "10:00 AM",
      squareFeet: 1800,
      square_feet: 1800,
      status: "completed",
      drivingTimeMin: 25,
      previousLocation: "Office",
      city: "Seattle",
      state: "WA",
      zip: "98101",
      package: "Basic Photography Package",
      customerNotes: "",
      customer_notes: "",
      internalNotes: "",
      internal_notes: "",
      stripe_payment_id: ""
    },
    {
      id: 2,
      orderNumber: "ORD-2023-002",
      order_number: "ORD-2023-002",
      address: "456 Oak Avenue, Seattle, WA 98102",
      client: "Sarah Johnson - Johnson Properties",
      customerName: "Sarah Johnson - Johnson Properties", // Add for compatibility
      propertyAddress: "456 Oak Avenue, Seattle, WA 98102", // Add for compatibility  
      photographer: "Maria Garcia",
      photographerPayoutRate: 120,
      photographer_payout_rate: 120,
      price: 199,
      propertyType: "Commercial",
      property_type: "Commercial",
      scheduledDate: format(addDays(today, 1), 'yyyy-MM-dd'),
      scheduled_date: format(addDays(today, 1), 'yyyy-MM-dd'),
      scheduledTime: "2:00 PM",
      scheduled_time: "2:00 PM",
      squareFeet: 2500,
      square_feet: 2500,
      status: "scheduled",
      drivingTimeMin: 20,
      city: "Seattle",
      state: "WA",
      zip: "98102",
      package: "Premium Photography Package",
      customerNotes: "",
      customer_notes: "",
      internalNotes: "",
      internal_notes: "",
      stripe_payment_id: ""
    },
    {
      id: 3,
      orderNumber: "ORD-2023-003",
      order_number: "ORD-2023-003",
      address: "789 Pine Boulevard, Bellevue, WA 98004",
      client: "Michael Williams - Luxury Homes",
      customerName: "Michael Williams - Luxury Homes", // Add for compatibility
      propertyAddress: "789 Pine Boulevard, Bellevue, WA 98004", // Add for compatibility
      photographer: "Wei Chen",
      photographerPayoutRate: 150,
      photographer_payout_rate: 150,
      price: 249,
      propertyType: "Residential",
      property_type: "Residential",
      scheduledDate: format(addDays(today, 2), 'yyyy-MM-dd'),
      scheduled_date: format(addDays(today, 2), 'yyyy-MM-dd'),
      scheduledTime: "11:30 AM",
      scheduled_time: "11:30 AM",
      squareFeet: 3200,
      square_feet: 3200,
      status: "scheduled",
      drivingTimeMin: 35,
      city: "Bellevue",
      state: "WA",
      zip: "98004",
      package: "Deluxe Photography Package",
      customerNotes: "",
      customer_notes: "",
      internalNotes: "",
      internal_notes: "",
      stripe_payment_id: ""
    },
    {
      id: 4,
      orderNumber: "ORD-2023-004",
      order_number: "ORD-2023-004",
      address: "321 Cedar Road, Redmond, WA 98052",
      client: "Emily Davis - Modern Living",
      customerName: "Emily Davis - Modern Living", // Add for compatibility
      propertyAddress: "321 Cedar Road, Redmond, WA 98052", // Add for compatibility
      photographer: "Priya Patel",
      photographerPayoutRate: 85,
      photographer_payout_rate: 85,
      price: 149,
      propertyType: "Apartment",
      property_type: "Apartment",
      scheduledDate: format(addDays(today, 3), 'yyyy-MM-dd'),
      scheduled_date: format(addDays(today, 3), 'yyyy-MM-dd'),
      scheduledTime: "9:00 AM",
      scheduled_time: "9:00 AM",
      squareFeet: 1200,
      square_feet: 1200,
      status: "pending",
      drivingTimeMin: 15,
      city: "Redmond",
      state: "WA",
      zip: "98052",
      package: "Basic Photography Package",
      customerNotes: "",
      customer_notes: "",
      internalNotes: "",
      internal_notes: "",
      stripe_payment_id: ""
    },
    {
      id: 5,
      orderNumber: "ORD-2023-005",
      order_number: "ORD-2023-005",
      address: "654 Birch Lane, Kirkland, WA 98033",
      client: "David Wilson - Wilson Realty",
      customerName: "David Wilson - Wilson Realty", // Add for compatibility
      propertyAddress: "654 Birch Lane, Kirkland, WA 98033", // Add for compatibility
      photographer: "Thomas Wilson",
      photographerPayoutRate: 110,
      photographer_payout_rate: 110,
      price: 199,
      propertyType: "Condo",
      property_type: "Condo",
      scheduledDate: format(subDays(today, 1), 'yyyy-MM-dd'),
      scheduled_date: format(subDays(today, 1), 'yyyy-MM-dd'),
      scheduledTime: "3:30 PM",
      scheduled_time: "3:30 PM",
      squareFeet: 1600,
      square_feet: 1600,
      status: "completed",
      drivingTimeMin: 30,
      city: "Kirkland",
      state: "WA",
      zip: "98033",
      package: "Premium Photography Package",
      customerNotes: "",
      customer_notes: "",
      internalNotes: "",
      internal_notes: "",
      stripe_payment_id: ""
    }
  ];
}
