import { Order } from '@/types/order-types';

// Simulated MySQL database storage using localStorage for persistence
class OrderService {
  private getStorageKey(): string {
    return 'mysql_orders';
  }

  private generateOrderNumber(): string {
    return `ORD-${Date.now()}`;
  }

  private getSampleOrders(): Order[] {
    return [
      {
        id: 'order-1',
        orderNumber: 'ORD-001',
        client: 'John Smith',
        clientEmail: 'john.smith@email.com',
        clientPhone: '(555) 123-4567',
        address: '123 Main Street, Anytown',
        city: 'Anytown',
        state: 'CA',
        zip: '90210',
        price: 450,
        propertyType: 'Single Family Home',
        squareFeet: 2400,
        package: 'Premium Package',
        photographer: 'Sarah Johnson',
        scheduledDate: '2024-07-15',
        scheduledTime: '10:00',
        status: 'scheduled' as const,
        notes: 'Beautiful modern home with great natural light',
        drivingTimeMin: 25,
        photographerPayoutRate: 65,
        internalNotes: 'Client prefers morning shoots',
        customerNotes: 'Please call before arrival'
      },
      {
        id: 'order-2',
        orderNumber: 'ORD-002',
        client: 'Emily Davis',
        clientEmail: 'emily.davis@email.com',
        clientPhone: '(555) 987-6543',
        address: '456 Oak Avenue, Springfield',
        city: 'Springfield',
        state: 'CA',
        zip: '90211',
        price: 325,
        propertyType: 'Condo',
        squareFeet: 1800,
        package: 'Standard Package',
        photographer: 'Mike Chen',
        scheduledDate: '2024-07-16',
        scheduledTime: '14:00',
        status: 'completed' as const,
        completedDate: '2024-07-16',
        notes: 'Luxury condo with city views',
        drivingTimeMin: 35,
        photographerPayoutRate: 60,
        internalNotes: 'Completed on time',
        customerNotes: 'Very satisfied with results'
      },
      {
        id: 'order-3',
        orderNumber: 'ORD-003',
        client: 'Robert Wilson',
        clientEmail: 'robert.wilson@email.com',
        clientPhone: '(555) 456-7890',
        address: '789 Pine Street, Beverly Hills',
        city: 'Beverly Hills',
        state: 'CA',
        zip: '90212',
        price: 675,
        propertyType: 'Luxury Home',
        squareFeet: 4200,
        package: 'Luxury Package',
        photographer: 'Alex Rodriguez',
        scheduledDate: '2024-07-18',
        scheduledTime: '09:00',
        status: 'in_progress' as const,
        notes: 'High-end property requiring special attention',
        drivingTimeMin: 45,
        photographerPayoutRate: 70,
        internalNotes: 'VIP client - ensure quality',
        customerNotes: 'Staging will be complete by 8:30 AM'
      }
    ];
  }

  async getAllOrders(): Promise<Order[]> {
    try {
      console.log('🔧 OrderService: Fetching all orders from MySQL');
      
      const stored = localStorage.getItem(this.getStorageKey());
      if (stored) {
        const orders = JSON.parse(stored);
        console.log('🔧 OrderService: Found stored orders:', orders.length);
        return orders;
      }
      
      console.log('🔧 OrderService: No stored orders, creating sample data');
      const sampleOrders = this.getSampleOrders();
      await this.saveOrders(sampleOrders);
      return sampleOrders;
    } catch (error) {
      console.error('🔧 OrderService: Error fetching orders:', error);
      return this.getSampleOrders();
    }
  }

  async getOrderById(id: string): Promise<Order | null> {
    try {
      console.log('🔧 OrderService: Fetching order by ID:', id);
      const orders = await this.getAllOrders();
      const order = orders.find(o => o.id === id || o.orderNumber === id);
      return order || null;
    } catch (error) {
      console.error('🔧 OrderService: Error fetching order by ID:', error);
      return null;
    }
  }

  async createOrder(orderData: Omit<Order, 'id' | 'orderNumber'>): Promise<Order | null> {
    try {
      console.log('🔧 OrderService: Creating new order:', orderData);
      
      const newOrder: Order = {
        ...orderData,
        id: `order-${Date.now()}`,
        orderNumber: this.generateOrderNumber()
      };

      const orders = await this.getAllOrders();
      orders.unshift(newOrder); // Add to beginning of array
      
      const success = await this.saveOrders(orders);
      if (success) {
        console.log('🔧 OrderService: Order created successfully:', newOrder.orderNumber);
        return newOrder;
      }
      
      return null;
    } catch (error) {
      console.error('🔧 OrderService: Error creating order:', error);
      return null;
    }
  }

  async updateOrder(id: string, updates: Partial<Order>): Promise<Order | null> {
    try {
      console.log('🔧 OrderService: Updating order:', { id, updates });
      
      const orders = await this.getAllOrders();
      const orderIndex = orders.findIndex(o => o.id === id || o.orderNumber === id);
      
      if (orderIndex === -1) {
        console.error('🔧 OrderService: Order not found for update:', id);
        return null;
      }

      orders[orderIndex] = {
        ...orders[orderIndex],
        ...updates
      };

      const success = await this.saveOrders(orders);
      if (success) {
        console.log('🔧 OrderService: Order updated successfully');
        return orders[orderIndex];
      }
      
      return null;
    } catch (error) {
      console.error('🔧 OrderService: Error updating order:', error);
      return null;
    }
  }

  async deleteOrder(id: string): Promise<boolean> {
    try {
      console.log('🔧 OrderService: Deleting order:', id);
      
      const orders = await this.getAllOrders();
      const filteredOrders = orders.filter(o => o.id !== id && o.orderNumber !== id);
      
      if (filteredOrders.length === orders.length) {
        console.error('🔧 OrderService: Order not found for deletion:', id);
        return false;
      }

      const success = await this.saveOrders(filteredOrders);
      if (success) {
        console.log('🔧 OrderService: Order deleted successfully');
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('🔧 OrderService: Error deleting order:', error);
      return false;
    }
  }

  async deleteAllOrders(): Promise<boolean> {
    try {
      console.log('🔧 OrderService: Deleting all orders');
      
      const success = await this.saveOrders([]);
      if (success) {
        console.log('🔧 OrderService: All orders deleted successfully');
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('🔧 OrderService: Error deleting all orders:', error);
      return false;
    }
  }

  private async saveOrders(orders: Order[]): Promise<boolean> {
    try {
      // Simulate database save with a delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      localStorage.setItem(this.getStorageKey(), JSON.stringify(orders));
      return true;
    } catch (error) {
      console.error('🔧 OrderService: Error saving orders:', error);
      return false;
    }
  }
}

export const orderService = new OrderService();