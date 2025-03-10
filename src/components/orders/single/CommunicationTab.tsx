
import React from 'react';
import { Order } from '@/types/order-types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TabsContent } from '@/components/ui/tabs';

export interface CommunicationTabProps {
  order: Order;
}

export function CommunicationTab({ order }: CommunicationTabProps) {
  return (
    <TabsContent value="communication" className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Communication History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">No communication history available for this order</p>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
