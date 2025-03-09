
import React from 'react';
import { OrderInformation } from '@/components/orders/details/OrderInformation';
import { ClientInformation } from '@/components/orders/details/ClientInformation';
import { PhotographerInformation } from '@/components/orders/details/PhotographerInformation';
import { OrderNotes } from '@/components/orders/details/OrderNotes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MessageSquare, Activity } from 'lucide-react';
import { Order } from '@/types/order-types';
import { format } from 'date-fns';

interface OrderDetailsTabProps {
  order: Order | null;
  editedOrder: Order | null;
  isEditing: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onStatusChange: (status: string) => void;
}

export const OrderDetailsTab: React.FC<OrderDetailsTabProps> = ({
  order,
  editedOrder,
  isEditing,
  onInputChange,
  onStatusChange
}) => {
  const currentOrder = isEditing ? editedOrder : order;
  
  if (!currentOrder) return null;
  
  // Mock activity data for demonstration
  const activities = [
    { 
      id: 1, 
      type: 'status-change', 
      description: 'Order status changed to Scheduled', 
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      user: 'Admin'
    },
    { 
      id: 2, 
      type: 'communication', 
      description: 'Email sent to client', 
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
      user: 'System'
    },
    { 
      id: 3, 
      type: 'upload', 
      description: 'Photographer uploaded 15 photos', 
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      user: currentOrder.photographer
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <OrderInformation 
          order={currentOrder} 
          isEditing={isEditing}
          onInputChange={onInputChange}
          onStatusChange={onStatusChange}
        />
        
        <ClientInformation 
          order={currentOrder} 
          isEditing={isEditing}
          onInputChange={onInputChange}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PhotographerInformation 
          order={currentOrder} 
          isEditing={isEditing}
          onInputChange={onInputChange}
        />
        
        <OrderNotes 
          order={currentOrder} 
          isEditing={isEditing}
          onInputChange={onInputChange}
        />
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-md font-medium">
              <Activity className="h-4 w-4 inline mr-2" />
              Order Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {activities.map(activity => (
                <div key={activity.id} className="border-l-2 border-muted pl-4 py-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{activity.description}</p>
                      <p className="text-sm text-muted-foreground">By {activity.user}</p>
                    </div>
                    <Badge variant="outline">
                      {format(activity.timestamp, 'MMM d, h:mm a')}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
