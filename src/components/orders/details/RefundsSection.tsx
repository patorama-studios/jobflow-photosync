
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RefundRecord, Order } from '@/types/orders';
import { generateRandomId } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast";

interface RefundsSectionProps {
  refundsForOrder: RefundRecord[];
  order: Order | null;
}

export function RefundsSection({ refundsForOrder, order }: RefundsSectionProps) {
  const [isRefundDialogOpen, setIsRefundDialogOpen] = useState(false);
  const [isAddRefundDialogOpen, setIsAddRefundDialogOpen] = useState(false);
  const [isFullRefund, setIsFullRefund] = useState(false);
  const [newRefund, setNewRefund] = useState<Omit<RefundRecord, 'id' | 'status' | 'stripeRefundId'>>({
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    reason: '',
    isFullRefund: false,
  });
  const { toast } = useToast();

  const handleRefundClick = () => {
    setIsRefundDialogOpen(true);
  };

  const handleAddRefundClick = () => {
    setIsAddRefundDialogOpen(true);
  };

  const handleRefundInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewRefund((prev) => ({ ...prev, [name]: value }));
  };

  const handleRefundAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setNewRefund((prev) => ({ ...prev, amount: parseFloat(value) }));
  };

  const handleIsFullRefundChange = (checked: boolean) => {
    setIsFullRefund(checked);
    setNewRefund((prev) => ({ ...prev, isFullRefund: checked }));
  };

  const handleSaveRefund = () => {
    if (!newRefund.amount || !newRefund.date || !newRefund.reason) {
      toast({
        title: "Error",
        description: "Refund amount, date, and reason are required.",
        variant: "destructive",
      });
      return;
    }

    // Simulate API save
    setTimeout(() => {
      // Generate a random ID for the new refund
      const newRefundWithId: RefundRecord = { 
        ...newRefund, 
        id: generateRandomId(), 
        status: 'pending' 
      };

      toast({
        title: "Refund saved",
        description: "Refund has been saved successfully.",
      });
      
      setIsAddRefundDialogOpen(false);
    }, 500);
  };

  return (
    <>
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Refunds</CardTitle>
          <CardDescription>Manage refunds associated with this order</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Button onClick={handleAddRefundClick}>Add Refund</Button>
          </div>
          {refundsForOrder && refundsForOrder.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {refundsForOrder.map((refund) => (
                <Card key={refund.id}>
                  <CardHeader>
                    <CardTitle>Refund ID: {refund.id}</CardTitle>
                    <CardDescription>Amount: {refund.amount}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>Date: {refund.date}</p>
                    <p>Reason: {refund.reason}</p>
                    <p>Status: {refund.status}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p>No refunds added yet.</p>
          )}
        </CardContent>
      </Card>

      <Dialog open={isRefundDialogOpen} onOpenChange={setIsRefundDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Refunds</DialogTitle>
            <DialogDescription>
              Manage refunds associated with this order
            </DialogDescription>
          </DialogHeader>
          <CardContent>
            <div className="mb-4">
              <Button onClick={handleAddRefundClick}>Add Refund</Button>
            </div>
            {refundsForOrder && refundsForOrder.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {refundsForOrder.map((refund) => (
                  <Card key={refund.id}>
                    <CardHeader>
                      <CardTitle>Refund ID: {refund.id}</CardTitle>
                      <CardDescription>Amount: {refund.amount}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>Date: {refund.date}</p>
                      <p>Reason: {refund.reason}</p>
                      <p>Status: {refund.status}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p>No refunds added yet.</p>
            )}
          </CardContent>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isAddRefundDialogOpen} onOpenChange={setIsAddRefundDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Refund</DialogTitle>
            <DialogDescription>
              Add a new refund to this order
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right">
                Amount
              </Label>
              <Input
                type="number"
                id="amount"
                name="amount"
                value={newRefund.amount}
                onChange={handleRefundAmountChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">
                Date
              </Label>
              <Input
                type="date"
                id="date"
                name="date"
                value={newRefund.date}
                onChange={handleRefundInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="reason" className="text-right">
                Reason
              </Label>
              <Textarea
                id="reason"
                name="reason"
                value={newRefund.reason}
                onChange={handleRefundInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="isFullRefund" className="text-right">
                Full Refund
              </Label>
              <Checkbox
                id="isFullRefund"
                checked={isFullRefund}
                onCheckedChange={handleIsFullRefundChange}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </DialogClose>
            <Button type="button" onClick={handleSaveRefund}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
