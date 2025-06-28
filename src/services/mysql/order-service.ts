import { Order } from '@/types/order-types';
import { getDbClient } from '@/integrations/mysql/config';

// Real MySQL database service
class OrderService {
  private generateOrderNumber(): string {
    // Simple order number generation - you can enhance this
    return `ORD-${Date.now()}`;
  }

  async getAllOrders(): Promise<Order[]> {
    try {
      const db = await getDbClient();
      const orders = await db.select<Order>('orders');
      return orders;
    } catch (error) {
      console.error('Error fetching orders:', error);
      return [];
    }
  }

  async getOrderById(id: string): Promise<Order | null> {
    try {
      const db = await getDbClient();
      const order = await db.queryOne<Order>('SELECT * FROM orders WHERE id = ?', [id]);
      return order;
    } catch (error) {
      console.error('Error fetching order by ID:', error);
      return null;
    }
  }

  async createOrder(orderData: Partial<Order>): Promise<Order | null> {
    try {
      const db = await getDbClient();
      
      // Generate order number if not provided
      const orderNumber = orderData.orderNumber || this.generateOrderNumber();
      
      // Log the incoming order data for debugging
      console.log('🔧 OrderService: Creating order with data:', {
        scheduledDate: orderData.scheduledDate,
        scheduledTime: orderData.scheduledTime,
        scheduled_date: orderData.scheduled_date,
        scheduled_time: orderData.scheduled_time
      });

      const newOrder = {
        id: crypto.randomUUID(),
        order_number: orderNumber,
        client: orderData.client || 'Unknown Client',
        client_email: orderData.clientEmail || 'no-email@example.com',
        client_phone: orderData.clientPhone || null, // This can be null
        package: orderData.package || 'Standard Package',
        price: orderData.price || 0,
        address: orderData.address || 'No address provided',
        city: orderData.city || 'Unknown City',
        state: orderData.state || 'Unknown State',
        zip: orderData.zip || '00000',
        property_type: orderData.propertyType || 'Residential',
        square_feet: orderData.squareFeet || 0,
        // Handle both camelCase and snake_case formats
        scheduled_date: orderData.scheduledDate || orderData.scheduled_date || '2025-01-01',
        scheduled_time: orderData.scheduledTime || orderData.scheduled_time || '09:00:00',
        photographer: orderData.photographer || null, // This can be null
        photographer_payout_rate: orderData.photographerPayoutRate || null, // This can be null
        status: orderData.status || 'pending',
        notes: orderData.notes || null, // This can be null
        internal_notes: orderData.internalNotes || null, // This can be null
        customer_notes: orderData.customerNotes || null, // This can be null
        stripe_payment_id: orderData.stripePaymentId || null // This can be null
      };

      console.log('🔧 OrderService: Final order data for database:', {
        scheduled_date: newOrder.scheduled_date,
        scheduled_time: newOrder.scheduled_time
      });

      const result = await db.insert('orders', newOrder);
      
      if (result.insertId) {
        return await this.getOrderById(newOrder.id);
      }
      
      return null;
    } catch (error) {
      console.error('Error creating order:', error);
      return null;
    }
  }

  async updateOrder(id: string, orderData: Partial<Order>): Promise<boolean> {
    try {
      const db = await getDbClient();
      
      const updateData = {
        status: orderData.status,
        price: orderData.price,
        scheduled_date: orderData.scheduledDate,
        scheduled_time: orderData.scheduledTime,
        address: orderData.address,
        city: orderData.city,
        state: orderData.state,
        zip: orderData.zip,
        notes: orderData.notes,
        client: orderData.client,
        client_email: orderData.clientEmail,
        client_phone: orderData.clientPhone,
        package: orderData.package,
        property_type: orderData.propertyType,
        square_feet: orderData.squareFeet,
        photographer: orderData.photographer
      };

      // Remove undefined values
      Object.keys(updateData).forEach(key => {
        if (updateData[key] === undefined) {
          delete updateData[key];
        }
      });

      const result = await db.update('orders', updateData, { id });
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error updating order:', error);
      return false;
    }
  }

  async deleteOrder(id: string): Promise<boolean> {
    try {
      const db = await getDbClient();
      const result = await db.delete('orders', { id });
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error deleting order:', error);
      return false;
    }
  }

  async deleteAllOrders(): Promise<boolean> {
    try {
      const db = await getDbClient();
      await db.query('DELETE FROM orders');
      return true;
    } catch (error) {
      console.error('Error deleting all orders:', error);
      return false;
    }
  }

  async refreshData(): Promise<void> {
    // No need to refresh with real database - just clear cache
    console.log('🔧 OrderService: Refreshing data (real database)');
  }

  async resetService(): Promise<void> {
    // No localStorage to reset with real database
    console.log('🔧 OrderService: Service reset (real database)');
  }

  // Legacy method compatibility
  async addOrder(orderData: Partial<Order>): Promise<Order | null> {
    return this.createOrder(orderData);
  }

  // Legacy method compatibility
  async saveOrder(orderData: Partial<Order>): Promise<boolean> {
    if (orderData.id) {
      return this.updateOrder(orderData.id, orderData);
    } else {
      const order = await this.createOrder(orderData);
      return order !== null;
    }
  }
}

export const orderService = new OrderService();