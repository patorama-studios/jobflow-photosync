
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Order } from "@/types/order-types";
import { RefundRecord } from "@/types/orders";

export interface RefundHistoryProps {
  orderData: Order;
  refundsForOrder: RefundRecord[];
}

export const RefundHistory: React.FC<RefundHistoryProps> = ({ orderData, refundsForOrder }) => {
  if (!refundsForOrder || refundsForOrder.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Refund History</CardTitle>
        <CardDescription>View all refunds processed for this order</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {refundsForOrder.map((refund) => (
              <TableRow key={refund.id}>
                <TableCell>{new Date(refund.date).toLocaleDateString()}</TableCell>
                <TableCell>${refund.amount.toFixed(2)}</TableCell>
                <TableCell>
                  {refund.isFullRefund ? 'Full Refund' : 'Partial Refund'}
                </TableCell>
                <TableCell>{refund.reason}</TableCell>
                <TableCell>
                  <Badge 
                    variant="outline" 
                    className={
                      refund.status === 'completed' 
                        ? 'bg-green-50 text-green-800 border-green-200'
                        : refund.status === 'pending'
                          ? 'bg-yellow-50 text-yellow-800 border-yellow-200'
                          : 'bg-red-50 text-red-800 border-red-200'
                    }
                  >
                    {refund.status.charAt(0).toUpperCase() + refund.status.slice(1)}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
