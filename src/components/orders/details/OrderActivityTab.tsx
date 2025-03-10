
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { CalendarClock, MessageCircle, UserCog, AlertCircle } from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'status_change' | 'communication' | 'system' | 'user_action';
  description: string;
  timestamp: string;
  user?: string;
  metadata?: Record<string, any>;
}

interface OrderActivityTabProps {
  orderId: string;
}

export function OrderActivityTab({ orderId }: OrderActivityTabProps) {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // This would be replaced with a real API call to fetch order activities
    const fetchActivities = async () => {
      setIsLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data
      const mockActivities: ActivityItem[] = [
        {
          id: '1',
          type: 'system',
          description: 'Order created',
          timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          user: 'System'
        },
        {
          id: '2',
          type: 'status_change',
          description: 'Status changed from "pending" to "scheduled"',
          timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          user: 'Admin User'
        },
        {
          id: '3',
          type: 'user_action',
          description: 'Photographer assigned to order',
          timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          user: 'Admin User'
        },
        {
          id: '4',
          type: 'communication',
          description: 'Email sent to client',
          timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
          user: 'System',
          metadata: {
            subject: 'Your order is confirmed',
            recipient: 'client@example.com'
          }
        },
        {
          id: '5',
          type: 'communication',
          description: 'SMS sent to photographer',
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          user: 'System',
          metadata: {
            recipient: '+1234567890'
          }
        },
        {
          id: '6',
          type: 'user_action',
          description: 'Order details updated',
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          user: 'Admin User'
        }
      ];
      
      setActivities(mockActivities);
      setIsLoading(false);
    };
    
    fetchActivities();
  }, [orderId]);
  
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'status_change':
        return <CalendarClock className="h-5 w-5 text-blue-500" />;
      case 'communication':
        return <MessageCircle className="h-5 w-5 text-green-500" />;
      case 'user_action':
        return <UserCog className="h-5 w-5 text-violet-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Activity Log</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex gap-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : activities.length > 0 ? (
          <div className="space-y-6">
            {activities.map(activity => (
              <div key={activity.id} className="flex gap-4">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.description}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(activity.timestamp), "MMM d, yyyy 'at' h:mm a")}
                    </p>
                    {activity.user && (
                      <>
                        <span className="text-xs text-muted-foreground">•</span>
                        <p className="text-xs text-muted-foreground">{activity.user}</p>
                      </>
                    )}
                  </div>
                  {activity.metadata && Object.keys(activity.metadata).length > 0 && (
                    <div className="mt-2 pl-2 border-l-2 border-muted">
                      {Object.entries(activity.metadata).map(([key, value]) => (
                        <p key={key} className="text-xs">
                          <span className="font-medium">{key.charAt(0).toUpperCase() + key.slice(1)}:</span> {value}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-muted-foreground">No activity has been recorded for this order yet.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
