
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { NewContractorFormProps, contractorRoles } from './types';

export const NewContractorForm: React.FC<NewContractorFormProps> = ({
  onAdd,
  onCancel,
  newContractor,
  setNewContractor,
  totalOrderAmount,
  handleInputChange,
  handleSelectChange
}) => {
  return (
    <div className="p-4 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="new-name">Name</Label>
          <Input
            id="new-name"
            value={newContractor.name}
            onChange={(e) => handleInputChange(e, 'name')}
            placeholder="Enter contractor name"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="new-role">Role</Label>
          <Select 
            value={newContractor.role} 
            onValueChange={(value) => handleSelectChange(value, 'role')}
          >
            <SelectTrigger id="new-role">
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
          <Label htmlFor="new-rate">Payout Rate (%)</Label>
          <Input
            id="new-rate"
            type="number"
            min="0"
            max="100"
            step="0.1"
            value={newContractor.payoutRate !== undefined ? newContractor.payoutRate : ''}
            onChange={(e) => handleInputChange(e, 'payoutRate')}
            placeholder="Enter percentage"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="new-amount">Payout Amount ($)</Label>
          <Input
            id="new-amount"
            type="number"
            min="0"
            step="0.01"
            value={newContractor.payoutAmount !== undefined ? newContractor.payoutAmount : ''}
            onChange={(e) => handleInputChange(e, 'payoutAmount')}
            placeholder="Enter amount"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="new-notes">Notes</Label>
        <Textarea
          id="new-notes"
          value={newContractor.notes || ''}
          onChange={(e) => handleInputChange(e, 'notes')}
          placeholder="Add notes about this payment..."
        />
      </div>
      
      <div className="flex justify-end space-x-2 pt-2">
        <Button 
          variant="outline" 
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button onClick={() => onAdd(newContractor as any)}>Add Contractor</Button>
      </div>
    </div>
  );
};
