
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageTransition } from '@/components/layout/PageTransition';
import { useNotificationsContext } from '@/contexts/NotificationsContext';
import { NotificationItem } from '@/components/notifications/NotificationItem';
import { NotificationFilters } from '@/components/notifications/NotificationFilters';
import { Notification } from '@/types/notifications';
import MainLayout from '@/components/layout/MainLayout';

const NotificationsCenter: React.FC = () => {
  const navigate = useNavigate();
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification, 
    clearAllNotifications 
  } = useNotificationsContext();
  
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filteredNotifications = useMemo(() => {
    return notifications.filter(notification => {
      // Apply category filter
      if (filter === 'unread' && notification.read) {
        return false;
      } else if (filter !== 'all' && filter !== 'unread' && notification.category !== filter) {
        return false;
      }
      
      // Apply search filter
      if (search.trim() !== '') {
        const searchLower = search.toLowerCase();
        return (
          notification.text.toLowerCase().includes(searchLower) ||
          notification.details?.toLowerCase().includes(searchLower) ||
          false
        );
      }
      
      return true;
    });
  }, [notifications, filter, search]);

  // Group notifications by date
  const groupedNotifications = useMemo(() => {
    const groups: Record<string, Notification[]> = {};
    
    filteredNotifications.forEach(notification => {
      if (!groups[notification.date]) {
        groups[notification.date] = [];
      }
      groups[notification.date].push(notification);
    });
    
    return groups;
  }, [filteredNotifications]);

  return (
    <MainLayout>
      <PageTransition>
        <div className="container mx-auto py-6 max-w-4xl">
          <div className="flex items-center mb-6">
            <Button 
              variant="ghost" 
              size="icon" 
              className="mr-2"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-3xl font-semibold flex items-center">
              <Bell className="h-6 w-6 mr-3" />
              Notification Center
            </h1>
          </div>

          <div className="bg-card rounded-lg shadow-sm border mb-6">
            <div className="p-4">
              <NotificationFilters 
                filter={filter}
                onFilterChange={setFilter}
                search={search}
                onSearchChange={setSearch}
                onClearAll={clearAllNotifications}
                onMarkAllAsRead={markAllAsRead}
                unreadCount={unreadCount}
              />
            </div>
          </div>

          <div className="bg-card rounded-lg shadow-sm border">
            {Object.keys(groupedNotifications).length > 0 ? (
              Object.entries(groupedNotifications).map(([date, dateNotifications]) => (
                <div key={date} className="border-b last:border-0">
                  <div className="p-3 bg-muted/20 font-medium">
                    {new Date(date).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </div>
                  <div className="divide-y">
                    {dateNotifications.map(notification => (
                      <NotificationItem 
                        key={notification.id}
                        notification={notification}
                        onMarkAsRead={markAsRead}
                        onDelete={deleteNotification}
                      />
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center text-muted-foreground">
                <Bell className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <h3 className="text-lg font-medium mb-1">No notifications found</h3>
                <p>
                  {filter !== 'all' || search 
                    ? "Try changing your filters or search terms"
                    : "You don't have any notifications at the moment"
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      </PageTransition>
    </MainLayout>
  );
};

export default NotificationsCenter;
