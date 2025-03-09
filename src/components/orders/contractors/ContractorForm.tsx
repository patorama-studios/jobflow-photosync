
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, X } from "lucide-react";
import { ContractorFormProps, contractorRoles } from './types';

export const ContractorForm: React.FC<ContractorFormProps> = ({ 
  contractor, 
  onSave, 
  onCancel, 
  totalOrderAmount 
}) => {
  const [editedContractor, setEditedContractor] = React.useState({ ...contractor });
  
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: keyof typeof contractor
  ) => {
    const value = field === 'payoutRate' || field === 'payoutAmount' 
      ? parseFloat(e.target.value) 
      : e.target.value;
      
    const updatedContractor = { ...editedContractor, [field]: value };
    
    // If payoutRate changes, calculate payoutAmount
    if (field === 'payoutRate' && !isNaN(value as number)) {
      updatedContractor.payoutAmount = totalOrderAmount * (value as number) / 100;
    }
    
    // If payoutAmount changes, calculate payoutRate
    if (field === 'payoutAmount' && !isNaN(value as number) && totalOrderAmount > 0) {
      updatedContractor.payoutRate = ((value as number) / totalOrderAmount) * 100;
    }
    
    setEditedContractor(updatedContractor);
  };

  const handleSelectChange = (value: string, field: keyof typeof contractor) => {
    setEditedContractor(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h3 className="font-medium">Edit Contractor</h3>
        <div className="flex space-x-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onCancel}
          >
            <X className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => onSave(editedContractor)}
          >
            <Check className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor={`name-${contractor.id}`}>Name</Label>
          <Input
            id={`name-${contractor.id}`}
            value={editedContractor.name}
            onChange={(e) => handleInputChange(e, 'name')}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor={`role-${contractor.id}`}>Role</Label>
          <Select 
            value={editedContractor.role} 
            onValueChange={(value) => handleSelectChange(value, 'role')}
          >
            <SelectTrigger id={`role-${contractor.id}`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {contractorRoles.map(role => (
                <SelectItem key={role.value} value={role.value}>
                  {role.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor={`rate-${contractor.id}`}>Payout Rate (%)</Label>
          <Input
            id={`rate-${contractor.id}`}
            type="number"
            min="0"
            max="100"
            step="0.1"
            value={editedContractor.payoutRate !== undefined ? editedContractor.payoutRate : ''}
            onChange={(e) => handleInputChange(e, 'payoutRate')}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor={`amount-${contractor.id}`}>Payout Amount ($)</Label>
          <Input
            id={`amount-${contractor.id}`}
            type="number"
            min="0"
            step="0.01"
            value={editedContractor.payoutAmount !== undefined ? editedContractor.payoutAmount : ''}
            onChange={(e) => handleInputChange(e, 'payoutAmount')}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor={`notes-${contractor.id}`}>Notes</Label>
        <Textarea
          id={`notes-${contractor.id}`}
          value={editedContractor.notes || ''}
          onChange={(e) => handleInputChange(e, 'notes')}
          placeholder="Add notes about this payment..."
        />
      </div>
    </div>
  );
};
