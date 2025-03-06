
import React from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RefundRecord } from '@/types/orders';
import { Badge } from '@/components/ui/badge';
import { CreditCard, AlertCircle } from 'lucide-react';

interface RefundHistoryProps {
  refunds: RefundRecord[];
  orderTotal: number;
}

export function RefundHistory({ refunds, orderTotal }: RefundHistoryProps) {
  if (refunds.length === 0) return null;
  
  const totalRefundedAmount = refunds.reduce((sum, refund) => sum + refund.amount, 0);
  const isFullyRefunded = totalRefundedAmount >= orderTotal;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Refund History
          {isFullyRefunded && (
            <Badge variant="destructive" className="ml-2">Fully Refunded</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isFullyRefunded && (
          <div className="bg-destructive/10 text-destructive p-3 rounded-md mb-4 flex items-start gap-2">
            <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">This order has been fully refunded</p>
              <p className="text-sm">The customer has received a complete refund of ${orderTotal.toFixed(2)}</p>
            </div>
          </div>
        )}
        
        <div className="space-y-4">
          {refunds.map((refund, index) => (
            <div key={refund.id} className="border-b pb-4 last:border-b-0 last:pb-0">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">
                    {refund.isFullRefund ? 'Full Refund' : 'Partial Refund'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(refund.date), 'MMM d, yyyy h:mm a')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">${refund.amount.toFixed(2)}</p>
                  <Badge variant={
                    refund.status === 'completed' ? 'default' :
                    refund.status === 'pending' ? 'outline' : 'destructive'
                  } className="mt-1">
                    {refund.status}
                  </Badge>
                </div>
              </div>
              
              {refund.reason && (
                <div className="mt-2">
                  <p className="text-sm text-muted-foreground">{refund.reason}</p>
                </div>
              )}
              
              {refund.stripeRefundId && (
                <p className="text-xs text-muted-foreground mt-2">
                  Refund ID: {refund.stripeRefundId}
                </p>
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-4 flex justify-between pt-2 border-t">
          <p className="font-medium">Total Refunded</p>
          <p className="font-medium">${totalRefundedAmount.toFixed(2)}</p>
        </div>
      </CardContent>
    </Card>
  );
}
