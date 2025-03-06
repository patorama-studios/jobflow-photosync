
import React from 'react';
import { format } from 'date-fns';
import { RefundRecord } from '@/types/orders';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  CreditCard, 
  AlertCircle, 
  CheckCircle,
  Clock
} from 'lucide-react';

interface RefundHistoryProps {
  refunds: RefundRecord[];
  orderTotal: number;
}

export function RefundHistory({ refunds, orderTotal }: RefundHistoryProps) {
  // Sort refunds by date, newest first
  const sortedRefunds = [...refunds].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Calculate total refunded amount
  const totalRefunded = refunds.reduce((sum, refund) => 
    sum + (refund.status === 'completed' ? refund.amount : 0)
  , 0);

  // Get payment status based on refunds
  const getPaymentStatus = () => {
    if (refunds.length === 0) return 'none';
    if (totalRefunded >= orderTotal) return 'full';
    return 'partial';
  };

  const paymentStatus = getPaymentStatus();

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Refund History
        </CardTitle>
        <CardDescription>Track refunds issued for this order</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium">Total Refunded</h3>
            <p className="text-2xl font-bold">${totalRefunded.toFixed(2)}</p>
            <p className="text-sm text-muted-foreground">
              of ${orderTotal.toFixed(2)} original payment
            </p>
          </div>
          <div>
            <Badge 
              variant={
                paymentStatus === 'full' ? 'destructive' : 
                paymentStatus === 'partial' ? 'default' : 'outline'
              }
            >
              {paymentStatus === 'full' ? 'Fully Refunded' : 
               paymentStatus === 'partial' ? 'Partially Refunded' : 
               'No Refunds'}
            </Badge>
          </div>
        </div>

        {refunds.length > 0 ? (
          <div className="space-y-4 mt-4">
            <Separator />
            {sortedRefunds.map((refund, index) => (
              <div key={refund.id} className="py-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {refund.status === 'completed' ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : refund.status === 'failed' ? (
                      <AlertCircle className="h-4 w-4 text-red-500" />
                    ) : (
                      <Clock className="h-4 w-4 text-amber-500" />
                    )}
                    <span className="font-medium">
                      {refund.isFullRefund ? 'Full Refund' : 'Partial Refund'}
                    </span>
                  </div>
                  <span className="font-semibold">${refund.amount.toFixed(2)}</span>
                </div>
                <div className="ml-6 mt-1 text-sm text-muted-foreground">
                  {format(new Date(refund.date), 'MMM d, yyyy h:mm a')}
                </div>
                {refund.reason && (
                  <div className="ml-6 mt-1 text-sm">
                    Reason: {refund.reason}
                  </div>
                )}
                {index < sortedRefunds.length - 1 && <Separator className="mt-3" />}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            No refunds have been issued for this order.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
