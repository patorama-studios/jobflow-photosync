
import React, { memo } from 'react';
import { TableCell, TableFooter, TableRow } from "@/components/ui/table";

interface TableFooterProps {
  count: number;
}

const OrderTableFooter = memo(({ count }: TableFooterProps) => (
  <TableFooter>
    <TableRow>
      <TableCell colSpan={6} className="text-right">
        Total {count} orders
      </TableCell>
    </TableRow>
  </TableFooter>
));

OrderTableFooter.displayName = 'OrderTableFooter';

export default OrderTableFooter;
