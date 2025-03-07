
import React from "react";
import { DollarSign, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BillingSummaryProps {
  totalBilled: number;
  lastPaymentAmount: number;
  lastPaymentDate: string;
  outstandingPayment: number;
}

export function BillingSummary({ 
  totalBilled, 
  lastPaymentAmount, 
  lastPaymentDate, 
  outstandingPayment 
}: BillingSummaryProps) {
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
            <p className="text-2xl font-bold">${totalBilled}</p>
            <p className="text-sm text-muted-foreground mt-1">3 invoices</p>
          </div>
          <div className="border rounded-md p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium">Last Payment</span>
            </div>
            <p className="text-2xl font-bold">${lastPaymentAmount}</p>
            <p className="text-sm text-muted-foreground mt-1">{lastPaymentDate}</p>
          </div>
          <div className="border rounded-md p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium">Outstanding</span>
            </div>
            <p className="text-2xl font-bold text-amber-600">${outstandingPayment}</p>
            <p className="text-sm text-muted-foreground mt-1">1 open invoice</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
