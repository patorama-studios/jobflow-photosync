
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Check, X, Calendar, CreditCard, Package, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Notification } from '@/types/notifications';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: number) => void;
  onDelete: (id: number) => void;
  compact?: boolean;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onMarkAsRead,
  onDelete,
  compact = false
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    onMarkAsRead(notification.id);
    if (notification.link) {
      navigate(notification.link);
    }
  };

  const getIcon = () => {
    switch (notification.category) {
      case 'order':
        return <Calendar className="h-5 w-5 text-blue-500" />;
      case 'payment':
        return <CreditCard className="h-5 w-5 text-green-500" />;
      case 'delivery':
        return <Package className="h-5 w-5 text-amber-500" />;
      case 'system':
        return <Info className="h-5 w-5 text-purple-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  if (compact) {
    return (
      <div 
        className={`p-3 hover:bg-muted/50 ${notification.read ? 'opacity-70' : 'bg-muted/20'} cursor-pointer`}
        onClick={handleClick}
      >
        <div className="flex justify-between items-start mb-1">
          <p className="text-sm font-medium">{notification.text}</p>
          {!notification.read && (
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
          )}
        </div>
        <p className="text-xs text-muted-foreground">{notification.time}</p>
      </div>
    );
  }

  return (
    <div className={`border-b last:border-0 p-4 ${notification.read ? 'opacity-80' : 'bg-muted/10'}`}>
      <div className="flex gap-3">
        <div className="flex-shrink-0 mt-1">
          {getIcon()}
        </div>
        <div className="flex-grow">
          <div 
            className="hover:underline cursor-pointer" 
            onClick={handleClick}
          >
            <p className="font-medium">{notification.text}</p>
          </div>
          <p className="text-sm text-muted-foreground mt-1">{notification.details}</p>
          <p className="text-xs text-muted-foreground mt-2">{notification.time}</p>
        </div>
        <div className="flex flex-col gap-2 flex-shrink-0">
          {!notification.read && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8" 
              onClick={() => onMarkAsRead(notification.id)}
              title="Mark as read"
            >
              <Check className="h-4 w-4" />
            </Button>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-muted-foreground hover:text-destructive" 
            onClick={() => onDelete(notification.id)}
            title="Delete notification"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
