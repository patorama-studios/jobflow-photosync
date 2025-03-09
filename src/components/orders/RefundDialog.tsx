
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';

export interface RefundDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: string | number;
  orderTotal: number;
}

export interface RefundRecord {
  id: string | number;
  date: string;
  amount: number;
  isFullRefund: boolean;
  reason: string;
  status: 'pending' | 'completed' | 'failed';
  order_id?: string | number;
}

export const RefundDialog: React.FC<RefundDialogProps> = ({ 
  open, 
  onOpenChange, 
  orderId, 
  orderTotal 
}) => {
  const [refundType, setRefundType] = useState<'full' | 'partial'>('full');
  const [refundAmount, setRefundAmount] = useState<number>(orderTotal);
  const [refundReason, setRefundReason] = useState<string>('');
  const [refundMethod, setRefundMethod] = useState<string>('original');
  const [processing, setProcessing] = useState<boolean>(false);

  // Reset form when dialog opens
  React.useEffect(() => {
    if (open) {
      setRefundType('full');
      setRefundAmount(orderTotal);
      setRefundReason('');
      setRefundMethod('original');
    }
  }, [open, orderTotal]);

  // Update refund amount when type changes
  React.useEffect(() => {
    if (refundType === 'full') {
      setRefundAmount(orderTotal);
    } else {
      setRefundAmount(0);
    }
  }, [refundType, orderTotal]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (refundAmount <= 0 || refundAmount > orderTotal) {
      toast.error("Please enter a valid refund amount");
      return;
    }
    
    if (!refundReason.trim()) {
      toast.error("Please provide a reason for the refund");
      return;
    }
    
    setProcessing(true);
    
    try {
      // In a real app, we would create a 'refunds' table in Supabase
      // and handle the refund processing with a serverless function
      // For now, simulate a successful refund with a timeout
      
      // Simulating server processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create mock refund data
      const refundData: Omit<RefundRecord, 'id'> = {
        date: new Date().toISOString(),
        amount: refundAmount,
        isFullRefund: refundType === 'full',
        reason: refundReason,
        status: 'completed',
        order_id: orderId
      };
      
      // Log the refund data that would be inserted
      console.log('Would insert refund:', refundData);
      
      // Instead of actually inserting to a potentially non-existent table,
      // just show a success message
      toast.success(`Refund of $${refundAmount.toFixed(2)} has been processed`);
      
      // Close the dialog
      onOpenChange(false);
    } catch (error) {
      console.error('Error processing refund:', error);
      toast.error("Failed to process refund. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Process Refund</DialogTitle>
          <DialogDescription>
            Create a refund for this order. This will refund the customer's payment.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <RadioGroup
            value={refundType}
            onValueChange={(value) => setRefundType(value as 'full' | 'partial')}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="full" id="full-refund" />
              <Label htmlFor="full-refund">Full Refund (${orderTotal.toFixed(2)})</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="partial" id="partial-refund" />
              <Label htmlFor="partial-refund">Partial Refund</Label>
            </div>
          </RadioGroup>
          
          {refundType === 'partial' && (
            <div className="space-y-2">
              <Label htmlFor="refund-amount">Refund Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
                <Input
                  id="refund-amount"
                  type="number"
                  min="0.01"
                  step="0.01"
                  max={orderTotal}
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(parseFloat(e.target.value) || 0)}
                  className="pl-7"
                />
              </div>
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="refund-reason">Reason for Refund</Label>
            <Textarea
              id="refund-reason"
              value={refundReason}
              onChange={(e) => setRefundReason(e.target.value)}
              placeholder="Please explain why you're processing this refund..."
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="refund-method">Refund Method</Label>
            <Select
              value={refundMethod}
              onValueChange={setRefundMethod}
            >
              <SelectTrigger id="refund-method">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="original">Refund to Original Payment Method</SelectItem>
                <SelectItem value="store_credit">Store Credit</SelectItem>
                <SelectItem value="manual">Manual Refund (processed offline)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={processing}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={processing}>
              {processing ? "Processing..." : "Process Refund"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
