
import React from 'react';
import { Order } from '@/types/order-types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TabsContent } from '@/components/ui/tabs';

export interface ProductionTabProps {
  order: Order;
}

export function ProductionTab({ order }: ProductionTabProps) {
  return (
    <TabsContent value="production" className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Production Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">No production data available for this order</p>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
