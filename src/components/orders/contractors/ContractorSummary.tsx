
import React from 'react';
import { ContractorSummaryProps } from './types';

export const ContractorSummary: React.FC<ContractorSummaryProps> = ({ contractors }) => {
  const calculateTotalPayouts = () => {
    return contractors.reduce((sum, contractor) => sum + (contractor.payoutAmount || 0), 0);
  };

  return (
    <div className="bg-muted p-4 rounded-md">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">Total Payout</h3>
        <p className="text-lg font-semibold">
          ${calculateTotalPayouts().toFixed(2)}
        </p>
      </div>
      <div className="text-sm text-muted-foreground mt-1">
        Across {contractors.length} contractor{contractors.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
};
