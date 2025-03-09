
export interface Contractor {
  id: string | number;
  name: string;
  role: string;
  payoutRate?: number;
  payoutAmount?: number;
  notes?: string;
}

export interface ContractorPayoutsProps {
  orderId: string | number;
}

export interface ContractorFormProps {
  contractor: Contractor;
  onSave: (contractor: Contractor) => void;
  onCancel: () => void;
  totalOrderAmount: number;
}

export interface ContractorDisplayProps {
  contractor: Contractor;
  onEdit: (contractor: Contractor) => void;
  onDelete: (contractorId: string | number) => void;
}

export interface NewContractorFormProps {
  onAdd: (contractor: Contractor) => void;
  onCancel: () => void;
  newContractor: Partial<Contractor>;
  setNewContractor: React.Dispatch<React.SetStateAction<Partial<Contractor>>>;
  totalOrderAmount: number;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: keyof Contractor) => void;
  handleSelectChange: (value: string, field: keyof Contractor) => void;
}

export interface ContractorSummaryProps {
  contractors: Contractor[];
}

export const contractorRoles = [
  { value: 'photographer', label: 'Photographer' },
  { value: 'editor', label: 'Editor' },
  { value: 'assistant', label: 'Assistant' },
  { value: 'videographer', label: 'Videographer' },
  { value: 'drone_operator', label: 'Drone Operator' },
  { value: 'other', label: 'Other' }
];
