
import React from 'react';
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

const OrderTableHeader = () => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-[100px]">Order ID</TableHead>
        <TableHead className="w-[180px]">Customer Name</TableHead>
        <TableHead className="w-[120px]">Appointment Date</TableHead>
        <TableHead className="w-[200px]">Address</TableHead>
        <TableHead className="w-[80px]">State</TableHead>
        <TableHead className="w-[120px] text-right">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default OrderTableHeader;
