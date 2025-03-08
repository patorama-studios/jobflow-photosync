
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";

interface CompanyBillingTabProps {
  company: any;
}

export function CompanyBillingTab({ company }: CompanyBillingTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Billing & Payments</CardTitle>
        <CardDescription>
          Financial information for {company.name}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium">Payment Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">${company.total_revenue?.toFixed(2) || '0.00'}</div>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">${company.outstanding_amount?.toFixed(2) || '0.00'}</div>
                  <p className="text-sm text-muted-foreground">Outstanding Amount</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">30 days</div>
                  <p className="text-sm text-muted-foreground">Payment Terms</p>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="text-lg font-medium">Recent Invoices</h3>
            <div className="mt-2 rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                      No invoices found
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
