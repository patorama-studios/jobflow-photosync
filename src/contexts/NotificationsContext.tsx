
import React, { createContext, useContext, useState, useEffect } from 'react';
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
];

interface NotificationsContextValue {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: number) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: number) => void;
  clearAllNotifications: () => void;
}

const NotificationsContext = createContext<NotificationsContextValue | undefined>(undefined);

export const NotificationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>(sampleNotifications);
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

  return (
    <NotificationsContext.Provider value={{
      notifications,
      unreadCount,
      markAsRead,
      markAllAsRead,
      deleteNotification,
      clearAllNotifications
    }}>
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotificationsContext = () => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error('useNotificationsContext must be used within a NotificationsProvider');
  }
  return context;
};
