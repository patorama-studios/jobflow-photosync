
import React, { memo } from 'react';
import { TableHead, TableRow } from "@/components/ui/table";

const TableHeader = memo(() => (
  <TableHead>
    <TableRow>
      <TableHead>Order ID</TableHead>
      <TableHead>Customer</TableHead>
      <TableHead>Date</TableHead>
      <TableHead>Amount</TableHead>
      <TableHead>Status</TableHead>
      <TableHead className="text-right">Actions</TableHead>
    </TableRow>
  </TableHead>
));

TableHeader.displayName = 'TableHeader';

export default TableHeader;
