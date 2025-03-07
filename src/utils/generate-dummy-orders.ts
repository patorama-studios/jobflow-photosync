
import { addDays, subDays, addHours, format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';

export async function generateDummyOrders(count: number = 10) {
  const cities = ['Austin', 'San Francisco', 'New York', 'Chicago', 'Miami', 'Seattle', 'Denver', 'Boston'];
  const photographers = ['Maria Garcia', 'Alex Johnson', 'Wei Chen', 'Sarah Williams', 'Carlos Rodriguez'];
  // Update statuses to match the constraint in database
  const statuses = ['scheduled', 'pending', 'completed', 'cancelled'];
  const packages = ['basic', 'standard', 'premium', 'ultra'];
  const propertyTypes = ['residential', 'commercial', 'industrial', 'land'];
  const clients = [
    { name: 'John Smith', email: 'john@example.com', phone: '512-555-1234' },
    { name: 'Sarah Johnson', email: 'sarah@example.com', phone: '512-555-5678' },
    { name: 'Michael Brown', email: 'michael@example.com', phone: '512-555-9012' },
    { name: 'Jennifer Davis', email: 'jennifer@example.com', phone: '512-555-3456' },
    { name: 'Robert Wilson', email: 'robert@example.com', phone: '512-555-7890' },
  ];
  
  const orders = [];
  
  for (let i = 0; i < count; i++) {
    const client = clients[Math.floor(Math.random() * clients.length)];
    const now = new Date();
    const randomDayOffset = Math.floor(Math.random() * 14) - 7; // -7 to +7 days
    const scheduledDate = randomDayOffset >= 0 ? 
      addDays(now, randomDayOffset) : 
      subDays(now, Math.abs(randomDayOffset));
    
    // Format time as HH:MM AM/PM
    const hour = Math.floor(Math.random() * 8) + 9; // 9 AM to 5 PM
    const minute = Math.random() > 0.5 ? '00' : '30';
    const period = hour < 12 ? 'AM' : 'PM';
    const displayHour = hour % 12 === 0 ? 12 : hour % 12;
    const scheduledTime = `${displayHour}:${minute} ${period}`;
    
    const order = {
      order_number: `ORD-${(1000 + i).toString()}`,
      address: `${100 + i} ${['Main', 'Oak', 'Pine', 'Maple', 'Elm'][Math.floor(Math.random() * 5)]} St`,
      city: cities[Math.floor(Math.random() * cities.length)],
      state: ['TX', 'CA', 'NY', 'IL', 'FL'][Math.floor(Math.random() * 5)],
      zip: `${10000 + Math.floor(Math.random() * 90000)}`,
      client: client.name,
      client_email: client.email,
      client_phone: client.phone,
      photographer: i % 3 === 0 ? null : photographers[Math.floor(Math.random() * photographers.length)],
      photographer_payout_rate: Math.floor(Math.random() * 50) + 80, // $80 to $130
      price: (Math.floor(Math.random() * 30) + 5) * 10, // $50 to $350 in $10 increments
      property_type: propertyTypes[Math.floor(Math.random() * propertyTypes.length)],
      scheduled_date: scheduledDate.toISOString(),
      scheduled_time: scheduledTime,
      square_feet: (Math.floor(Math.random() * 40) + 10) * 100, // 1000 to 5000 sq ft
      status: statuses[Math.floor(Math.random() * statuses.length)],
      package: packages[Math.floor(Math.random() * packages.length)],
      notes: Math.random() > 0.3 ? `This is a note for order ${i+1}. ` + 
        `Please ${Math.random() > 0.5 ? 'arrive 15 minutes early' : 'contact client before arrival'}.` : null,
      customer_notes: Math.random() > 0.5 ? `Customer note: ${Math.random() > 0.5 ? 'Please use the side entrance' : 'The lockbox code is 1234'}.` : null,
      internal_notes: Math.random() > 0.7 ? `Internal note: ${Math.random() > 0.5 ? 'Previous photographer had issues accessing property' : 'VIP client, extra care needed'}.` : null,
    };
    
    orders.push(order);
  }
  
  try {
    // Insert orders into Supabase and return the result
    const { data, error } = await supabase
      .from('orders')
      .insert(orders)
      .select();
      
    if (error) {
      console.error('Error generating dummy orders:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error generating dummy orders:', error);
    throw error;
  }
}
