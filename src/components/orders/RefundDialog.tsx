
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { RefundTypeSelector } from './refund/RefundTypeSelector';
import { RefundAmountField } from './refund/RefundAmountField';
import { RefundReasonField } from './refund/RefundReasonField';
import { RefundMethodSelector } from './refund/RefundMethodSelector';
import { useRefundDialogState } from './refund/useRefundDialogState';

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
  const {
    refundType,
    setRefundType,
    refundAmount,
    setRefundAmount,
    refundReason,
    setRefundReason,
    refundMethod,
    setRefundMethod,
    processing,
    setProcessing
  } = useRefundDialogState({ open, orderTotal });

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
          <RefundTypeSelector 
            value={refundType}
            onChange={setRefundType}
            orderTotal={orderTotal}
          />
          
          {refundType === 'partial' && (
            <RefundAmountField
              value={refundAmount}
              onChange={setRefundAmount}
              max={orderTotal}
            />
          )}
          
          <RefundReasonField
            value={refundReason}
            onChange={setRefundReason}
          />
          
          <RefundMethodSelector
            value={refundMethod}
            onValueChange={setRefundMethod}
          />
          
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
