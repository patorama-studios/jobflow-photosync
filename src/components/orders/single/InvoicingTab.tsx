
import React from 'react';
import { Order } from '@/types/order-types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Receipt, CreditCard, AlertCircle } from 'lucide-react';
import { RefundRecord } from '@/types/orders';

interface InvoicingTabProps {
  order: Order;
  refundsForOrder: RefundRecord[];
  setRefundsForOrder: React.Dispatch<React.SetStateAction<RefundRecord[]>>;
}

export function InvoicingTab({ order, refundsForOrder, setRefundsForOrder }: InvoicingTabProps) {
  return (
    <div className="mt-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Invoicing Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-md">
                <div className="font-medium">Order Amount</div>
                <p className="text-2xl font-bold">${order.price || 0}</p>
              </div>
              <div className="p-4 border rounded-md">
                <div className="font-medium">Payment Status</div>
                <div className="flex items-center gap-2 mt-1">
                  {order.stripePaymentId ? (
                    <>
                      <CreditCard className="h-4 w-4 text-green-500" />
                      <span className="text-green-500 font-medium">Paid</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-4 w-4 text-amber-500" />
                      <span className="text-amber-500 font-medium">Unpaid</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            {order.stripePaymentId && (
              <div className="p-4 border rounded-md">
                <div className="font-medium">Payment Details</div>
                <div className="text-sm text-muted-foreground mt-1">
                  Payment ID: {order.stripePaymentId}
                </div>
              </div>
            )}
            
            {refundsForOrder && refundsForOrder.length > 0 && (
              <div className="p-4 border rounded-md">
                <div className="font-medium">Refund History</div>
                <div className="text-sm space-y-2 mt-2">
                  {refundsForOrder.map((refund) => (
                    <div key={refund.id} className="border-b pb-2">
                      <div className="flex justify-between">
                        <span>{new Date(refund.date).toLocaleDateString()}</span>
                        <span className="font-medium">${refund.amount}</span>
                      </div>
                      <div className="text-muted-foreground">{refund.reason}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
