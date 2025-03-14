
import { useState, useCallback } from 'react';
import { Notification } from '@/types/notifications';

// Mock data for notifications
const initialNotifications: Notification[] = [
  { 
    id: '1', 
    title: 'New Order Received', 
    message: 'A new order has been placed',
    type: 'info',
    text: 'New order received', 
    read: false, 
    time: '2 min ago',
    date: '2023-05-30',
    category: 'order',
    link: '/orders/1234',
    details: 'A new order has been placed by John Doe for $150.00'
  },
  { 
    id: '2', 
    title: 'Payment Processed', 
    message: 'Your payment has been processed successfully',
    type: 'success',
    text: 'Payment processed', 
    read: false, 
    time: '1 hour ago',
    date: '2023-05-30',
    category: 'payment',
    link: '/payments/5678',
    details: 'Payment of $250.00 has been processed for order #5678'
  },
  { 
    id: '3', 
    title: 'Delivery Scheduled', 
    message: 'Your order has been scheduled for delivery',
    type: 'info',
    text: 'Delivery scheduled', 
    read: true, 
    time: 'Yesterday',
    date: '2023-05-29',
    category: 'delivery',
    link: '/orders/9012',
    details: 'Your order #9012 has been scheduled for delivery on June 5th'
  },
  { 
    id: '4', 
    title: 'Order Canceled', 
    message: 'An order has been canceled',
    type: 'error',
    text: 'Order canceled', 
    read: true, 
    time: '2 days ago',
    date: '2023-05-28',
    category: 'order',
    link: '/orders/3456',
    details: 'Order #3456 has been canceled. Reason: Customer request'
  },
  { 
    id: '5', 
    title: 'New Comment', 
    message: 'A new comment has been added to your order',
    type: 'info',
    text: 'New comment on order', 
    read: true, 
    time: '3 days ago',
    date: '2023-05-27',
    category: 'order',
    link: '/orders/7890',
    details: 'John Smith commented on order #7890: "Please deliver as soon as possible"'
  },
  { 
    id: '6', 
    title: 'System Maintenance', 
    message: 'Scheduled system maintenance will occur tonight',
    type: 'warning',
    text: 'System maintenance', 
    read: true, 
    time: '4 days ago',
    date: '2023-05-26',
    category: 'system',
    link: '/announcements',
    details: 'Scheduled system maintenance will occur tonight from 11PM to 2AM EST'
  },
  { 
    id: '7', 
    title: 'New Feature Available', 
    message: 'A new feature has been added to the platform',
    type: 'success',
    text: 'New feature available', 
    read: true, 
    time: '5 days ago',
    date: '2023-05-25',
    category: 'system',
    link: '/features',
    details: 'Check out our new analytics dashboard for improved insights!'
  }
];

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  
  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true } 
          : notification
      )
    );
  }, []);
  
  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  }, []);
  
  const deleteNotification = useCallback((id: string) => {
    setNotifications(prev => 
      prev.filter(notification => notification.id !== id)
    );
  }, []);
  
  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);
  
  return {
    notifications,
    unreadCount: notifications.filter(n => !n.read).length,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications
  };
};

export default useNotifications;
