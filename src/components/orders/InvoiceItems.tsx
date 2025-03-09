
import React from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';

export interface InvoiceItemsProps {
  orderId: string | number;
}

export const InvoiceItems: React.FC<InvoiceItemsProps> = ({ orderId }) => {
  // Mock invoice items for demonstration
  const invoiceItems = [
    {
      id: '1',
      name: 'Professional Photography',
      quantity: 1,
      unitPrice: 199.00,
      total: 199.00
    },
    {
      id: '2',
      name: 'Video Tour',
      quantity: 1,
      unitPrice: 149.00,
      total: 149.00
    },
    {
      id: '3',
      name: 'Floor Plan',
      quantity: 1,
      unitPrice: 99.00,
      total: 99.00
    }
  ];

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Item</TableHead>
          <TableHead className="text-right">Quantity</TableHead>
          <TableHead className="text-right">Unit Price</TableHead>
          <TableHead className="text-right">Total</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoiceItems.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="font-medium">{item.name}</TableCell>
            <TableCell className="text-right">{item.quantity}</TableCell>
            <TableCell className="text-right">${item.unitPrice.toFixed(2)}</TableCell>
            <TableCell className="text-right">${item.total.toFixed(2)}</TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button variant="ghost" size="icon">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
