
import React from "react";
import { DollarSign, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";

interface BillingSummaryProps {
  totalBilled: number;
  lastPaymentAmount: number;
  lastPaymentDate: string | null;
  outstandingPayment: number;
  invoiceCount?: number;
  openInvoiceCount?: number;
  isLoading?: boolean;
}

export function BillingSummary({ 
  totalBilled, 
  lastPaymentAmount, 
  lastPaymentDate, 
  outstandingPayment,
  invoiceCount = 0,
  openInvoiceCount = 0,
  isLoading = false
}: BillingSummaryProps) {
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Billing Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-4">
            <p className="text-muted-foreground">Loading billing summary...</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Billing Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border rounded-md p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium">Total Billed YTD</span>
            </div>
            <p className="text-2xl font-bold">${totalBilled.toFixed(2)}</p>
            <p className="text-sm text-muted-foreground mt-1">{invoiceCount} invoice{invoiceCount !== 1 ? 's' : ''}</p>
          </div>
          <div className="border rounded-md p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium">Last Payment</span>
            </div>
            <p className="text-2xl font-bold">${lastPaymentAmount.toFixed(2)}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {lastPaymentDate ? format(new Date(lastPaymentDate), 'MMM dd, yyyy') : 'No payments yet'}
            </p>
          </div>
          <div className="border rounded-md p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium">Outstanding</span>
            </div>
            <p className={`text-2xl font-bold ${outstandingPayment > 0 ? 'text-amber-600' : 'text-green-600'}`}>
              ${outstandingPayment.toFixed(2)}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {openInvoiceCount} open invoice{openInvoiceCount !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
