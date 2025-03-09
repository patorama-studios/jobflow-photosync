
import { useState, useEffect } from 'react';

interface UseRefundDialogStateProps {
  open: boolean;
  orderTotal: number;
}

export const useRefundDialogState = ({ open, orderTotal }: UseRefundDialogStateProps) => {
  const [refundType, setRefundType] = useState<'full' | 'partial'>('full');
  const [refundAmount, setRefundAmount] = useState<number>(orderTotal);
  const [refundReason, setRefundReason] = useState<string>('');
  const [refundMethod, setRefundMethod] = useState<string>('original');
  const [processing, setProcessing] = useState<boolean>(false);

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setRefundType('full');
      setRefundAmount(orderTotal);
      setRefundReason('');
      setRefundMethod('original');
    }
  }, [open, orderTotal]);

  // Update refund amount when type changes
  useEffect(() => {
    if (refundType === 'full') {
      setRefundAmount(orderTotal);
    } else {
      setRefundAmount(0);
    }
  }, [refundType, orderTotal]);

  return {
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
  };
};
