
import React, { useState } from 'react';
import { 
  Bell,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';

type Notification = {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  category: 'info' | 'warning' | 'error' | 'success';
};

// Mock notifications for now
const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Order Completed',
    message: 'Order #1234 has been completed successfully.',
    date: '2023-05-15T10:30:00Z',
    read: false,
    category: 'success'
  },
  {
    id: '2',
    title: 'New Comment',
    message: 'John Doe commented on your photo collection.',
    date: '2023-05-14T08:15:00Z',
    read: true,
    category: 'info'
  },
  {
    id: '3',
    title: 'Payment Due',
    message: 'Invoice #5678 is due in 3 days.',
    date: '2023-05-13T14:45:00Z',
    read: false,
    category: 'warning'
  }
];

export function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [open, setOpen] = useState(false);
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };
  
  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };
  
  const removeNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  const getCategoryColor = (category: Notification['category']) => {
    switch (category) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between p-4">
          <h3 className="font-medium">Notifications</h3>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={markAllAsRead}
              className="text-xs text-blue-500 hover:text-blue-700"
            >
              Mark all as read
            </Button>
          )}
        </div>
        <Separator />
        
        <div className="max-h-80 overflow-y-auto py-2">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8">
              <p className="text-muted-foreground text-center">
                No notifications to display
              </p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div 
                key={notification.id}
                className={`relative p-4 hover:bg-gray-50 cursor-pointer ${!notification.read ? 'bg-blue-50' : ''}`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <span className="font-medium">{notification.title}</span>
                      <span className={`text-xs ml-2 px-2 py-0.5 rounded-full ${getCategoryColor(notification.category)}`}>
                        {notification.category}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {notification.message}
                    </p>
                    <span className="text-xs text-gray-500 mt-1 block">
                      {formatDate(notification.date)}
                    </span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6" 
                    onClick={(e) => {
                      e.stopPropagation();
                      removeNotification(notification.id);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                {!notification.read && (
                  <span className="absolute left-1 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-blue-500" />
                )}
              </div>
            ))
          )}
        </div>
        
        <Separator />
        <div className="p-4">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={() => setOpen(false)}
          >
            View all notifications
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
