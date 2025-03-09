
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Order } from "@/types/order-types";
import { RefundRecord } from "@/types/orders";
import { supabase } from '@/integrations/supabase/client';

export interface RefundDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderData: Order;
  onRefundProcessed: (refund: RefundRecord) => void;
}

export const RefundDialog: React.FC<RefundDialogProps> = ({ 
  open, 
  onOpenChange, 
  orderData, 
  onRefundProcessed 
}) => {
  const [amount, setAmount] = useState<string>('');
  const [reason, setReason] = useState<string>('');
  const [isFullRefund, setIsFullRefund] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const handleFullRefundChange = (checked: boolean) => {
    setIsFullRefund(checked);
    if (checked && orderData.price) {
      setAmount(orderData.price.toString());
    } else {
      setAmount('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !reason) {
      toast.error("Please fill in all required fields");
      return;
    }

    const refundAmount = parseFloat(amount);
    
    if (isNaN(refundAmount) || refundAmount <= 0) {
      toast.error("Please enter a valid refund amount");
      return;
    }

    if (orderData.price && refundAmount > orderData.price) {
      toast.error("Refund amount cannot exceed the order total");
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate processing with Stripe
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Create a new refund record
      const newRefund: RefundRecord = {
        id: `refund-${Date.now()}`,
        amount: refundAmount,
        date: new Date().toISOString(),
        reason,
        isFullRefund,
        status: 'completed',
        stripeRefundId: `rf_${Math.random().toString(36).substring(2, 12)}`
      };

      // In a real app, we would save this to the database
      const { error } = await supabase
        .from('refunds')
        .insert([newRefund]);
        
      if (error) throw error;

      onRefundProcessed(newRefund);
      onOpenChange(false);
      toast.success(`Refund of $${refundAmount.toFixed(2)} processed successfully`);
      
      // Reset form
      setAmount('');
      setReason('');
      setIsFullRefund(false);
      
    } catch (error) {
      console.error('Error processing refund:', error);
      toast.error("Failed to process refund. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Process Refund</DialogTitle>
          <DialogDescription>
            Create a refund for this order. This will process the refund through your connected payment processor.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="full-refund" 
                checked={isFullRefund}
                onCheckedChange={handleFullRefundChange}
              />
              <Label htmlFor="full-refund">Full Refund</Label>
            </div>
            <p className="text-sm text-muted-foreground">
              Total order amount: ${orderData.price?.toFixed(2) || '0.00'}
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="amount">Refund Amount</Label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0.01"
                max={orderData.price?.toString() || "9999"}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-7"
                disabled={isFullRefund}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="reason">Reason for Refund</Label>
            <Textarea
              id="reason"
              placeholder="Please specify the reason for this refund..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            />
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : 'Process Refund'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
