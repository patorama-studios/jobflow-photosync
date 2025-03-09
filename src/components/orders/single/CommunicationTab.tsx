
import React from 'react';
import { Order } from '@/types/order-types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle } from 'lucide-react';

interface CommunicationTabProps {
  order: Order;
}

export function CommunicationTab({ order }: CommunicationTabProps) {
  return (
    <div className="mt-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Communication History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {order.notes ? (
            <div className="space-y-4">
              <div className="p-4 border rounded-md">
                <div className="font-medium">Customer Notes</div>
                <p className="text-muted-foreground mt-1">{order.customerNotes || 'No customer notes provided'}</p>
              </div>
              <div className="p-4 border rounded-md">
                <div className="font-medium">Internal Notes</div>
                <p className="text-muted-foreground mt-1">{order.internalNotes || 'No internal notes provided'}</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No communication history available for this order
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
