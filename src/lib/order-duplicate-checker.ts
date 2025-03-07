
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

/**
 * Checks if there are any existing orders with the same address
 * @param address The address to check
 * @returns The order details if a duplicate exists, null otherwise
 */
export async function checkAddressExistingOrders(address: string): Promise<{ id: string, date: string } | null> {
  try {
    // Normalize the address to improve matching
    const normalizedAddress = normalizeAddress(address);
    
    if (!normalizedAddress) {
      return null;
    }
    
    // Query both the exact address and the normalized form
    const { data, error } = await supabase
      .from('orders')
      .select('id, address, scheduled_date, scheduled_time')
      .or(`address.ilike.%${normalizedAddress}%,address.eq.${address}`)
      .neq('status', 'canceled') // Exclude canceled orders
      .neq('status', 'completed') // Exclude completed orders
      .order('scheduled_date', { ascending: true });
    
    if (error) {
      console.error('Error checking for duplicate address:', error);
      return null;
    }
    
    if (data && data.length > 0) {
      // Format the date for display
      const orderDate = new Date(data[0].scheduled_date);
      const formattedDate = `${format(orderDate, 'PPP')} at ${data[0].scheduled_time}`;
      
      return {
        id: data[0].id,
        date: formattedDate
      };
    }
    
    return null;
  } catch (err) {
    console.error('Error checking for duplicate address:', err);
    return null;
  }
}

/**
 * Normalize an address by removing common elements that might vary
 * between the same physical location
 */
function normalizeAddress(address: string): string | null {
  if (!address) return null;
  
  // Convert to lowercase
  let normalized = address.toLowerCase();
  
  // Remove common street designations to improve matching
  normalized = normalized.replace(/\b(street|st|road|rd|avenue|ave|drive|dr|lane|ln|boulevard|blvd|court|ct|way|place|pl|terrace|ter)\b/g, '');
  
  // Remove apartment/unit numbers
  normalized = normalized.replace(/\b(unit|apt|apartment|suite|ste|#)\s*[a-z0-9-]+/g, '');
  
  // Remove special characters and extra spaces
  normalized = normalized.replace(/[^\w\s]/g, '');
  normalized = normalized.replace(/\s+/g, ' ').trim();
  
  return normalized;
}
