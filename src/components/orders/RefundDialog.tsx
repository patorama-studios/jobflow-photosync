
import React, { useState } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { RefundRecord } from '@/types/orders';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface RefundDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: string | number;
  orderTotal: number;
  stripePaymentId?: string;
  onRefundComplete: (refund: RefundRecord) => void;
}

export function RefundDialog({
  open,
  onOpenChange,
  orderId,
  orderTotal,
  stripePaymentId,
  onRefundComplete
}: RefundDialogProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [refundType, setRefundType] = useState<'full' | 'partial'>('full');
  const [amount, setAmount] = useState(orderTotal);
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Reset form when dialog opens
  React.useEffect(() => {
    if (open) {
      setRefundType('full');
      setAmount(orderTotal);
      setReason('');
      setError('');
      setIsSuccess(false);
    }
  }, [open, orderTotal]);

  // Update amount when refund type changes
  React.useEffect(() => {
    if (refundType === 'full') {
      setAmount(orderTotal);
    }
  }, [refundType, orderTotal]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (isNaN(value) || value <= 0) {
      setAmount(0);
    } else if (value > orderTotal) {
      setAmount(orderTotal);
    } else {
      setAmount(value);
    }
  };

  const processRefund = async () => {
    if (!stripePaymentId) {
      setError('No payment ID associated with this order');
      return;
    }

    if (amount <= 0 || amount > orderTotal) {
      setError('Please enter a valid refund amount');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/refund', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentId: stripePaymentId,
          amount: Math.round(amount * 100), // Convert to cents for Stripe
          reason,
          orderId,
          isFullRefund: refundType === 'full',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process refund');
      }

      const newRefund: RefundRecord = {
        id: data.refundId,
        amount: amount,
        date: new Date().toISOString(),
        reason: reason,
        status: 'completed',
        stripeRefundId: data.stripeRefundId,
        isFullRefund: refundType === 'full',
      };

      setIsSuccess(true);
      setTimeout(() => {
        onRefundComplete(newRefund);
        onOpenChange(false);
      }, 1500);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Process Refund</DialogTitle>
          <DialogDescription>
            Issue a refund for this order through Stripe.
          </DialogDescription>
        </DialogHeader>

        {isSuccess ? (
          <div className="py-6 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">Refund Successful</h3>
            <p className="mt-2 text-sm text-gray-500">
              The refund has been processed successfully.
            </p>
          </div>
        ) : (
          <div className="py-4 space-y-4">
            {error && (
              <div className="p-3 rounded-md bg-red-50 text-red-700 text-sm flex items-start space-x-2">
                <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <RadioGroup
              defaultValue="full"
              value={refundType}
              onValueChange={(value) => setRefundType(value as 'full' | 'partial')}
              className="grid grid-cols-2 gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="full" id="full" />
                <Label htmlFor="full" className="cursor-pointer">Full Refund</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="partial" id="partial" />
                <Label htmlFor="partial" className="cursor-pointer">Partial Refund</Label>
              </div>
            </RadioGroup>

            <div className="space-y-2">
              <Label htmlFor="amount">Refund Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2">$</span>
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={handleAmountChange}
                  className="pl-7"
                  disabled={refundType === 'full'}
                  min={0}
                  max={orderTotal}
                  step={0.01}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                {refundType === 'full' 
                  ? 'This will refund the full order amount.'
                  : `Maximum refund amount: $${orderTotal.toFixed(2)}`}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Refund</Label>
              <Textarea
                id="reason"
                placeholder="Provide a reason for this refund..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="resize-none"
                rows={3}
              />
            </div>
          </div>
        )}

        <DialogFooter className="flex space-x-2 sm:justify-end">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          {!isSuccess && (
            <Button
              onClick={processRefund}
              disabled={isLoading || !stripePaymentId}
              className={isLoading ? 'opacity-80' : ''}
            >
              {isLoading ? 'Processing...' : 'Process Refund'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
