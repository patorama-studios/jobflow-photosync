
import { useState, useEffect } from 'react';
import { Notification } from '@/types/notifications';
import { useToast } from '@/hooks/use-toast';

// Sample notification data
const sampleNotifications: Notification[] = [
  { 
    id: 1, 
    text: 'New order received', 
    read: false, 
    time: '2 min ago', 
    date: '2023-05-30',
    category: 'order',
    link: '/orders/1234', 
    details: 'A new order has been placed by John Smith for a property at 123 Main St.' 
  },
  { 
    id: 2, 
    text: 'Delivery completed for Order #1234', 
    read: false, 
    time: '1 hour ago', 
    date: '2023-05-30',
    category: 'delivery',
    link: '/orders/1234', 
    details: 'Delivery for Order #1234 has been marked as complete.' 
  },
  { 
    id: 3, 
    text: 'Payment received from Client ABC', 
    read: true, 
    time: 'Yesterday', 
    date: '2023-05-29',
    category: 'payment',
    link: '/customers', 
    details: 'Payment of $150.00 has been received for Order #1234.' 
  },
  { 
    id: 4, 
    text: 'System maintenance scheduled', 
    read: true, 
    time: '2 days ago', 
    date: '2023-05-28',
    category: 'system',
    details: 'System maintenance is scheduled for June 5, 2023 from 2am to 4am EST.' 
  },
  { 
    id: 5, 
    text: 'New feature available: Calendar sync', 
    read: true, 
    time: '3 days ago', 
    date: '2023-05-27',
    category: 'system',
    link: '/settings', 
    details: 'You can now sync your calendar with Google Calendar and Outlook.' 
  },
  { 
    id: 6, 
    text: 'Order #5678 requires attention', 
    read: false, 
    time: '3 days ago', 
    date: '2023-05-27',
    category: 'order',
    link: '/orders/5678', 
    details: 'Client has requested changes to their order.' 
  },
  { 
    id: 7, 
    text: 'Weekly sales report available', 
    read: true, 
    time: '1 week ago', 
    date: '2023-05-23',
    category: 'system',
    link: '/dashboard', 
    details: 'Your weekly sales report is now available.' 
  },
];

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>(sampleNotifications);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true } 
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    
    toast({
      title: "All notifications marked as read",
      variant: "default",
    });
  };

  const deleteNotification = (id: number) => {
    setNotifications(prev => 
      prev.filter(notification => notification.id !== id)
    );
    
    toast({
      title: "Notification deleted",
      variant: "default",
    });
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    
    toast({
      title: "All notifications cleared",
      variant: "default",
    });
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
}
