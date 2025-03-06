
import { useState, useEffect } from 'react';
import { Contractor } from '@/types/orders';

// Sample contractors data for demo purposes
const sampleContractors: Contractor[] = [
  {
    id: "c-001",
    name: "Maria Garcia",
    role: "Photographer",
    payoutRate: 120,
    payoutAmount: 0,
    notes: "Available weekdays only"
  },
  {
    id: "c-002",
    name: "Alex Johnson",
    role: "Editor",
    payoutRate: 80,
    payoutAmount: 0,
    notes: "Fast turnaround"
  }
];

export const useContractors = () => {
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate API call
    const fetchContractors = async () => {
      try {
        // In a real app, this would be an API call
        setContractors(sampleContractors);
        setIsLoading(false);
      } catch (err) {
        setError("Failed to load contractors");
        setIsLoading(false);
      }
    };

    fetchContractors();
  }, []);

  return { contractors, isLoading, error };
};
