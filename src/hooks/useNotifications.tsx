
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  time: string;
  link?: string;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch notifications (mock data for now)
  useEffect(() => {
    // In a real app, you would fetch from Supabase
    setIsLoading(true);
    
    // Mock notifications for demonstration
    const mockNotifications: Notification[] = [
      {
        id: '1',
        title: 'New Order',
        message: 'You have received a new order #12345',
        type: 'info',
        read: false,
        time: '5 minutes ago',
        link: '/orders/12345'
      },
      {
        id: '2',
        title: 'Payment Received',
        message: 'Payment of $150 has been received for order #12346',
        type: 'success',
        read: false,
        time: '2 hours ago',
        link: '/orders/12346'
      },
      {
        id: '3',
        title: 'Order Completed',
        message: 'Order #12347 has been marked as completed',
        type: 'success',
        read: true,
        time: '1 day ago',
        link: '/orders/12347'
      }
    ];
    
    setNotifications(mockNotifications);
    setIsLoading(false);
  }, []);

  // Get unread count
  const unreadCount = notifications.filter(n => !n.read).length;

  // Mark a notification as read
  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    
    toast('All notifications marked as read');
  };

  // Delete a notification
  const deleteNotification = (id: string) => {
    setNotifications(prev => 
      prev.filter(notification => notification.id !== id)
    );
    
    toast('Notification deleted');
  };

  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([]);
    
    toast('All notifications cleared');
  };

  return {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications
  };
};

export default useNotifications;
