
import React from 'react';
import { Order } from '@/types/order-types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw, Download, Coins } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface InvoicingTabProps {
  order: Order;
}

export const InvoicingTab: React.FC<InvoicingTabProps> = ({ order }) => {
  // Mock data for order items - will be replaced with real data
  const orderItems = [
    { id: 1, name: 'Professional Photography', quantity: 1, price: order.price, total: order.price },
    { id: 2, name: 'Virtual Tour', quantity: 1, price: 99, total: 99 }
  ];
  
  // Mock data for payouts - will be replaced with real data
  const payouts = [
    { id: 1, role: 'Photographer', name: order.photographer, amount: order.photographerPayoutRate || 120, status: 'pending' },
    { id: 2, role: 'Editor', name: 'Jane Smith', amount: 45, status: 'pending' }
  ];
  
  return (
    <div className="space-y-6">
      {/* Order Items Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Order Items</CardTitle>
          <Button size="sm" variant="outline" className="flex items-center gap-1">
            <Plus className="h-4 w-4" />
            Add Item
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead className="w-24 text-right">Qty</TableHead>
                <TableHead className="w-32 text-right">Price</TableHead>
                <TableHead className="w-32 text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orderItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell className="text-right">{item.quantity}</TableCell>
                  <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                  <TableCell className="text-right">${item.total.toFixed(2)}</TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={2}></TableCell>
                <TableCell className="text-right font-medium">Total</TableCell>
                <TableCell className="text-right font-bold">
                  ${orderItems.reduce((acc, item) => acc + item.total, 0).toFixed(2)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Xero Integration Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            Xero Integration
            <Badge variant="outline">Not Synced</Badge>
          </CardTitle>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="flex items-center gap-1">
              <RefreshCw className="h-4 w-4" />
              Sync with Xero
            </Button>
            <Button size="sm" variant="outline" className="flex items-center gap-1">
              <Download className="h-4 w-4" />
              Download Invoice
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This order has not yet been synced with Xero. Click the "Sync with Xero" button to create an invoice.
          </p>
        </CardContent>
      </Card>
      
      {/* Contractor and Editor Payouts Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Coins className="h-5 w-5" />
            Payouts
          </CardTitle>
          <Button size="sm" variant="outline" className="flex items-center gap-1">
            <Plus className="h-4 w-4" />
            Add Payout
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="w-32 text-right">Amount</TableHead>
                <TableHead className="w-32">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payouts.map((payout) => (
                <TableRow key={payout.id}>
                  <TableCell>{payout.role}</TableCell>
                  <TableCell>{payout.name}</TableCell>
                  <TableCell className="text-right">${payout.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={payout.status === 'paid' ? 'default' : 'outline'}>
                      {payout.status === 'paid' ? 'Paid' : 'Pending'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
