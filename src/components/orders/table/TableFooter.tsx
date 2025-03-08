
import React from 'react';
import { TableFooter, TableRow, TableCell } from "@/components/ui/table";

interface OrderTableFooterProps {
  count: number;
}

const OrderTableFooter = ({ count }: OrderTableFooterProps) => {
  return (
    <TableFooter>
      <TableRow>
        <TableCell colSpan={6} className="text-right text-sm text-muted-foreground">
          Total Orders: {count}
        </TableCell>
      </TableRow>
    </TableFooter>
  );
};

export default OrderTableFooter;
