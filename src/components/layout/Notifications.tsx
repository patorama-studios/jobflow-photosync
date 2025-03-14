
import React, { useState } from 'react';
import { 
  Bell,
  Check,
  AlertTriangle,
  Info,
  X,
  Settings,
  MoreHorizontal
} from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "@/hooks/useNotifications";

export function Notifications() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, markAsRead, clearAllNotifications: clearAll } = useNotifications();
  
  const unreadCount = notifications?.filter(n => !n.read).length || 0;
  
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case 'error':
        return <X className="h-4 w-4 text-red-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };
  
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 h-5 min-w-[1.25rem] p-0.5 flex items-center justify-center text-xs"
                  >
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Notifications</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <DropdownMenuContent align="end" className="w-[380px]">
        <div className="flex items-center justify-between p-4">
          <h3 className="font-medium">Notifications</h3>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/notifications')}
          >
            View All
          </Button>
        </div>
        
        <DropdownMenuSeparator />
        
        <div className="max-h-[300px] overflow-y-auto py-1">
          {notifications && notifications.length > 0 ? (
            notifications.slice(0, 5).map((notification) => (
              <DropdownMenuItem key={notification.id} className="cursor-default p-0">
                <div 
                  className={`flex w-full gap-3 p-3 hover:bg-muted/50 ${notification.read ? '' : 'bg-muted/20'}`}
                  onClick={() => {
                    markAsRead(notification.id);
                    if (notification.link) {
                      navigate(notification.link);
                      setIsOpen(false);
                    }
                  }}
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">{notification.title}</p>
                    <p className="text-xs text-muted-foreground">{notification.message}</p>
                    <p className="text-xs text-muted-foreground/70">
                      {notification.time}
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        markAsRead(notification.id);
                      }}
                    >
                      {notification.read ? (
                        <MoreHorizontal className="h-4 w-4" />
                      ) : (
                        <Check className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </DropdownMenuItem>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
              <Bell className="h-10 w-10 text-muted-foreground/50 mb-3" />
              <p className="text-sm text-muted-foreground">No notifications yet</p>
              <p className="text-xs text-muted-foreground/70 mt-1">
                We'll notify you when something important happens
              </p>
            </div>
          )}
        </div>
        
        <DropdownMenuSeparator />
        
        <div className="flex items-center justify-between p-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs"
            onClick={clearAll}
          >
            Clear all
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            className="text-xs"
            onClick={() => navigate('/settings/notifications')}
          >
            <Settings className="h-3.5 w-3.5 mr-1.5" />
            Notification Settings
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default Notifications;
