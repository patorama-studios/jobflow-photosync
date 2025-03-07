
import React, { useState } from "react";
import { FileText, ExternalLink, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { format } from "date-fns";
import { Invoice } from "./types";

interface InvoiceHistoryProps {
  invoices: Invoice[];
  onAddInvoice?: (invoice: Omit<Invoice, 'id' | 'created_at'>) => Promise<any>;
  isLoading?: boolean;
}

export function InvoiceHistory({ invoices, onAddInvoice, isLoading = false }: InvoiceHistoryProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newInvoice, setNewInvoice] = useState({
    amount: '',
    status: 'Pending',
    order_number: '',
    date: format(new Date(), 'yyyy-MM-dd')
  });
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onAddInvoice) return;
    
    try {
      await onAddInvoice({
        client_id: '', // Will be added by the hook
        amount: Number(newInvoice.amount),
        status: newInvoice.status as 'Paid' | 'Pending' | 'Overdue',
        order_number: newInvoice.order_number,
        date: new Date(newInvoice.date).toISOString()
      });
      
      setIsDialogOpen(false);
      // Reset form
      setNewInvoice({
        amount: '',
        status: 'Pending',
        order_number: '',
        date: format(new Date(), 'yyyy-MM-dd')
      });
    } catch (error) {
      console.error("Failed to add invoice:", error);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Invoice History</CardTitle>
          <CardDescription>
            View all invoices and payment statuses.
          </CardDescription>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <ExternalLink className="h-4 w-4 mr-2" />
            Xero Profile
          </Button>
          
          {onAddInvoice && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Invoice
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Invoice</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="order_number">Order Number</Label>
                      <Input 
                        id="order_number" 
                        value={newInvoice.order_number}
                        onChange={e => setNewInvoice({...newInvoice, order_number: e.target.value})}
                        placeholder="ORD-2023-001"
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="amount">Amount ($)</Label>
                      <Input 
                        id="amount" 
                        type="number"
                        value={newInvoice.amount}
                        onChange={e => setNewInvoice({...newInvoice, amount: e.target.value})}
                        placeholder="1200"
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="date">Date</Label>
                      <Input 
                        id="date" 
                        type="date"
                        value={newInvoice.date}
                        onChange={e => setNewInvoice({...newInvoice, date: e.target.value})}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="status">Status</Label>
                      <Select 
                        value={newInvoice.status} 
                        onValueChange={value => setNewInvoice({...newInvoice, status: value})}
                      >
                        <SelectTrigger id="status">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Paid">Paid</SelectItem>
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="Overdue">Overdue</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Add Invoice</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <p className="text-muted-foreground">Loading invoices...</p>
          </div>
        ) : invoices.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8">
            <p className="text-muted-foreground mb-4">No invoices found for this client.</p>
            {onAddInvoice && (
              <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create First Invoice
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Order #</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{invoice.id.substring(0, 8).toUpperCase()}</span>
                      </div>
                    </TableCell>
                    <TableCell>{format(new Date(invoice.date), 'MMM dd, yyyy')}</TableCell>
                    <TableCell>{invoice.order_number}</TableCell>
                    <TableCell className="text-right">${invoice.amount.toFixed(2)}</TableCell>
                    <TableCell>
                      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${invoice.status === 'Paid' ? 'bg-green-100 text-green-800' : 
                          invoice.status === 'Overdue' ? 'bg-red-100 text-red-800' : 
                          'bg-amber-100 text-amber-800'}`}>
                        {invoice.status}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm">View</Button>
                        <Button variant="ghost" size="sm">Download</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
