
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, PlusCircle, Edit, Trash2, DollarSign, FileText, Download } from 'lucide-react';
import { Order } from '@/types/order-types';
import { toast } from 'sonner';
import { InvoiceItems } from '@/components/orders/InvoiceItems';
import { RefundDialog } from '@/components/orders/RefundDialog';
import { RefundHistory } from '@/components/orders/RefundHistory';
import { ContractorPayouts } from '@/components/orders/ContractorPayouts';
import { RefundRecord } from '@/types/orders';

interface InvoicingTabProps {
  order: Order | null;
  refundsForOrder: RefundRecord[];
  setRefundsForOrder: (refunds: RefundRecord[]) => void;
}

export const InvoicingTab: React.FC<InvoicingTabProps> = ({
  order,
  refundsForOrder,
  setRefundsForOrder
}) => {
  const [isRefundDialogOpen, setIsRefundDialogOpen] = useState(false);
  
  if (!order) return null;

  // Mock invoice data for demonstration
  const invoiceData = {
    id: 'INV-001',
    status: 'Sent',
    total: order.price || order.amount || 0,
    date: new Date(),
    synced: true
  };

  const handleSyncWithXero = () => {
    toast.info("Syncing with Xero...");
    // Implementation for syncing with Xero would go here
  };

  const handleDownloadInvoice = () => {
    toast.info("Downloading invoice...");
    // Implementation for downloading invoice would go here
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle>Invoice Items</CardTitle>
              <CardDescription>Manage the items included in this order</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </CardHeader>
          <CardContent>
            <InvoiceItems orderId={order.id} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle>Xero Invoice</CardTitle>
              <CardDescription>View and manage invoice in Xero</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleSyncWithXero}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Sync with Xero
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownloadInvoice}>
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Xero Sync</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>{invoiceData.id}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">
                      {invoiceData.status}
                    </Badge>
                  </TableCell>
                  <TableCell>${invoiceData.total.toFixed(2)}</TableCell>
                  <TableCell>{invoiceData.date.toLocaleDateString()}</TableCell>
                  <TableCell>
                    {invoiceData.synced ? (
                      <Badge variant="outline" className="bg-green-50 text-green-800 border-green-200">
                        Synced
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-200">
                        Not Synced
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <FileText className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <div className="mt-4 flex justify-between">
              <Button 
                variant="outline" 
                className="text-red-600" 
                size="sm"
                onClick={() => setIsRefundDialogOpen(true)}
              >
                <DollarSign className="h-4 w-4 mr-1" />
                Process Refund
              </Button>
              
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Total Amount</div>
                <div className="text-2xl font-bold">${invoiceData.total.toFixed(2)}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <RefundHistory 
          orderData={order}
          refundsForOrder={refundsForOrder}
        />

        <Card>
          <CardHeader>
            <CardTitle>Contractor & Editor Payouts</CardTitle>
            <CardDescription>Manage payouts for contractors and editors</CardDescription>
          </CardHeader>
          <CardContent>
            <ContractorPayouts orderId={order.id} />
          </CardContent>
        </Card>
      </div>

      <RefundDialog 
        open={isRefundDialogOpen} 
        onOpenChange={setIsRefundDialogOpen}
        orderData={order}
        onRefundProcessed={(refund) => {
          setRefundsForOrder([...refundsForOrder, refund]);
        }}
      />
    </div>
  );
};
