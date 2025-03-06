
import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Dialog, 
  DialogContent, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { RefundRecord } from '@/types/orders';
import { toast } from '@/components/ui/use-toast';

const refundSchema = z.object({
  amount: z.coerce.number().positive('Amount must be positive'),
  reason: z.string().min(1, 'Reason is required'),
  type: z.enum(['full', 'partial']),
});

type RefundFormValues = z.infer<typeof refundSchema>;

interface RefundDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: number | string;
  orderTotal: number;
  stripePaymentId: string;
  onRefundComplete: (refund: RefundRecord) => void;
}

export function RefundDialog({
  open,
  onOpenChange,
  orderId,
  orderTotal,
  stripePaymentId,
  onRefundComplete,
}: RefundDialogProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { register, handleSubmit, watch, reset, setValue, formState: { errors } } = useForm<RefundFormValues>({
    resolver: zodResolver(refundSchema),
    defaultValues: {
      amount: orderTotal,
      reason: '',
      type: 'full',
    },
  });
  
  const refundType = watch('type');
  
  // When refund type changes, update amount
  React.useEffect(() => {
    if (refundType === 'full') {
      setValue('amount', orderTotal);
    }
  }, [refundType, orderTotal, setValue]);
  
  const onSubmit = async (data: RefundFormValues) => {
    try {
      setIsProcessing(true);
      
      // In a real implementation, this would call your backend to process the refund
      // For now, we'll just simulate a successful refund
      
      console.log('Processing refund:', {
        orderId,
        stripePaymentId,
        amount: data.amount,
        reason: data.reason,
        isFullRefund: data.type === 'full'
      });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create a refund record
      const refundRecord: RefundRecord = {
        id: `refund-${Date.now()}`,
        amount: data.amount,
        date: new Date().toISOString(),
        reason: data.reason,
        isFullRefund: data.type === 'full',
        status: 'completed',
        stripeRefundId: `re_${Math.random().toString(36).substring(2, 10)}`
      };
      
      // Notify the parent component
      onRefundComplete(refundRecord);
      
      // Close the dialog and reset the form
      onOpenChange(false);
      reset();
      
      // Show success toast
      toast({
        title: `${data.type === 'full' ? 'Full' : 'Partial'} Refund Processed`,
        description: `$${data.amount.toFixed(2)} has been refunded to the customer.`,
      });
    } catch (error) {
      console.error('Error processing refund:', error);
      
      toast({
        title: "Refund Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isProcessing) {
        onOpenChange(isOpen);
        if (!isOpen) reset();
      }
    }}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Process Refund</DialogTitle>
          <DialogDescription>
            Create a refund for this order. This will attempt to refund the customer's payment method.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <RadioGroup
              value={refundType}
              onValueChange={(value) => setValue('type', value as 'full' | 'partial')}
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="full" id="refund-full" />
                <Label htmlFor="refund-full">Full Refund (${orderTotal.toFixed(2)})</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="partial" id="refund-partial" />
                <Label htmlFor="refund-partial">Partial Refund</Label>
              </div>
            </RadioGroup>
            
            {refundType === 'partial' && (
              <div className="mt-2">
                <Label htmlFor="amount">Refund Amount</Label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5">$</span>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="0.01"
                    max={orderTotal}
                    className="pl-7"
                    {...register('amount')}
                  />
                </div>
                {errors.amount && (
                  <p className="text-sm text-destructive mt-1">{errors.amount.message}</p>
                )}
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="reason">Reason for Refund</Label>
            <Textarea
              id="reason"
              placeholder="Explain why you are processing this refund..."
              {...register('reason')}
            />
            {errors.reason && (
              <p className="text-sm text-destructive">{errors.reason.message}</p>
            )}
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
            <Button type="submit" disabled={isProcessing}>
              {isProcessing ? 'Processing...' : 'Process Refund'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
