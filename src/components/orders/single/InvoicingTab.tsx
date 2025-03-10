
import React from 'react';
import { Order } from '@/types/order-types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export interface InvoicingTabProps {
  order: Order;
  refunds?: any[];
  setRefunds?: React.Dispatch<React.SetStateAction<any[]>>;
}

export function InvoicingTab({ order, refunds = [], setRefunds }: InvoicingTabProps) {
  return (
    <TabsContent value="invoicing" className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Invoice Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <span className="font-medium">Order Total</span>
              <span className="font-bold">${order.price}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">Payment Status</span>
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                {order.stripePaymentId || order.stripe_payment_id ? 'Paid' : 'Unpaid'}
              </span>
            </div>
            
            {refunds && refunds.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-semibold mb-2">Refund History</h3>
                <div className="divide-y">
                  {refunds.map((refund, index) => (
                    <div key={index} className="py-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">{refund.date}</span>
                        <span className="text-red-600 font-medium">-${refund.amount}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{refund.reason}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
