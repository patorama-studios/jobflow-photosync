
import { useState, useEffect } from 'react';
import { RefundRecord } from '@/types/orders';

// Sample refunds data for demo purposes
const sampleRefunds: (RefundRecord & { orderId: string })[] = [
  {
    id: "ref-001",
    orderId: "1", // Matches a sample order ID
    amount: 50,
    date: "2023-05-15",
    reason: "Customer dissatisfaction",
    isFullRefund: false,
    status: 'completed',
    stripeRefundId: "re_123456"
  },
  {
    id: "ref-002",
    orderId: "3", // Matches a sample order ID
    amount: 99,
    date: "2023-06-02",
    reason: "Duplicate charge",
    isFullRefund: true,
    status: 'completed',
    stripeRefundId: "re_789012"
  }
];

export const useRefunds = () => {
  const [refunds, setRefunds] = useState<(RefundRecord & { orderId: string })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate API call
    const fetchRefunds = async () => {
      try {
        // In a real app, this would be an API call
        setRefunds(sampleRefunds);
        setIsLoading(false);
      } catch (err) {
        setError("Failed to load refunds");
        setIsLoading(false);
      }
    };

    fetchRefunds();
  }, []);

  return { refunds, isLoading, error };
};
