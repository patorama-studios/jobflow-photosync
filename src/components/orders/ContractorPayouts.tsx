import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DollarSign, Plus, Trash2, Edit, Check, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Contractor } from "@/types/orders";

interface ContractorPayoutsProps {
  contractors: Contractor[];
  onContractorsChange: (contractors: Contractor[]) => void;
  totalOrderAmount: number;
}

export const ContractorPayouts: React.FC<ContractorPayoutsProps> = ({
  contractors,
  onContractorsChange,
  totalOrderAmount
}) => {
  const [editingContractorId, setEditingContractorId] = useState<string | number | null>(null);
  const [newContractor, setNewContractor] = useState<Partial<Contractor>>({
    name: '',
    role: 'photographer',
    payoutRate: undefined,
    payoutAmount: undefined,
    notes: ''
  });
  const [showNewContractorForm, setShowNewContractorForm] = useState(false);
  const { toast } = useToast();

  const contractorRoles = [
    { value: 'photographer', label: 'Photographer' },
    { value: 'editor', label: 'Editor' },
    { value: 'assistant', label: 'Assistant' },
    { value: 'videographer', label: 'Videographer' },
    { value: 'drone_operator', label: 'Drone Operator' },
    { value: 'other', label: 'Other' }
  ];

  const handleEditContractor = (contractor: Contractor) => {
    setEditingContractorId(contractor.id);
  };

  const handleSaveContractor = (editedContractor: Contractor) => {
    const updatedContractors = contractors.map(c => 
      c.id === editedContractor.id ? editedContractor : c
    );
    onContractorsChange(updatedContractors);
    setEditingContractorId(null);
    
    toast({
      title: "Contractor Updated",
      description: `${editedContractor.name}'s payment details have been updated.`,
    });
  };

  const handleDeleteContractor = (contractorId: string | number) => {
    const updatedContractors = contractors.filter(c => c.id !== contractorId);
    onContractorsChange(updatedContractors);
    
    toast({
      title: "Contractor Removed",
      description: "The contractor has been removed from this order.",
    });
  };

  const handleAddNewContractor = () => {
    if (!newContractor.name) {
      toast({
        title: "Name Required",
        description: "Please enter a name for the contractor.",
        variant: "destructive"
      });
      return;
    }

    const newContractorWithId: Contractor = {
      ...newContractor as Contractor,
      id: `temp-${Date.now()}`  // In a real app, this would be a UUID or DB-generated ID
    };

    onContractorsChange([...contractors, newContractorWithId]);
    setNewContractor({
      name: '',
      role: 'photographer',
      payoutRate: undefined,
      payoutAmount: undefined,
      notes: ''
    });
    setShowNewContractorForm(false);

    toast({
      title: "Contractor Added",
      description: `${newContractorWithId.name} has been added to this order.`,
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: keyof Contractor,
    contractor?: Contractor
  ) => {
    const value = field === 'payoutRate' || field === 'payoutAmount' 
      ? parseFloat(e.target.value) 
      : e.target.value;

    if (contractor) {
      // Editing existing contractor
      const updatedContractor = { ...contractor, [field]: value };
      
      // If payoutRate changes, calculate payoutAmount
      if (field === 'payoutRate' && !isNaN(value as number)) {
        updatedContractor.payoutAmount = totalOrderAmount * (value as number) / 100;
      }
      
      // If payoutAmount changes, calculate payoutRate
      if (field === 'payoutAmount' && !isNaN(value as number) && totalOrderAmount > 0) {
        updatedContractor.payoutRate = ((value as number) / totalOrderAmount) * 100;
      }
      
      const updatedContractors = contractors.map(c => 
        c.id === contractor.id ? updatedContractor : c
      );
      onContractorsChange(updatedContractors);
    } else {
      // Adding new contractor
      const updatedNewContractor = { ...newContractor, [field]: value };
      
      // If payoutRate changes, calculate payoutAmount
      if (field === 'payoutRate' && !isNaN(value as number)) {
        updatedNewContractor.payoutAmount = totalOrderAmount * (value as number) / 100;
      }
      
      // If payoutAmount changes, calculate payoutRate
      if (field === 'payoutAmount' && !isNaN(value as number) && totalOrderAmount > 0) {
        updatedNewContractor.payoutRate = ((value as number) / totalOrderAmount) * 100;
      }
      
      setNewContractor(updatedNewContractor);
    }
  };

  const handleSelectChange = (
    value: string,
    field: keyof Contractor,
    contractor?: Contractor
  ) => {
    if (contractor) {
      // Editing existing contractor
      const updatedContractor = { ...contractor, [field]: value };
      const updatedContractors = contractors.map(c => 
        c.id === contractor.id ? updatedContractor : c
      );
      onContractorsChange(updatedContractors);
    } else {
      // Adding new contractor
      setNewContractor(prev => ({ ...prev, [field]: value }));
    }
  };

  const calculateTotalPayouts = () => {
    return contractors.reduce((sum, contractor) => sum + (contractor.payoutAmount || 0), 0);
  };

  return (
    <div className="space-y-6">
      {/* Existing Contractors */}
      <div className="space-y-4">
        {contractors.map(contractor => (
          <Card key={contractor.id} className="border border-gray-200">
            <CardContent className="p-4">
              {editingContractorId === contractor.id ? (
                // Edit mode
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <h3 className="font-medium">Edit Contractor</h3>
                    <div className="flex space-x-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => setEditingContractorId(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleSaveContractor(contractor)}
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
                        value={contractor.name}
                        onChange={(e) => handleInputChange(e, 'name', contractor)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`role-${contractor.id}`}>Role</Label>
                      <Select 
                        value={contractor.role} 
                        onValueChange={(value) => handleSelectChange(value, 'role', contractor)}
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
                        value={contractor.payoutRate !== undefined ? contractor.payoutRate : ''}
                        onChange={(e) => handleInputChange(e, 'payoutRate', contractor)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`amount-${contractor.id}`}>Payout Amount ($)</Label>
                      <Input
                        id={`amount-${contractor.id}`}
                        type="number"
                        min="0"
                        step="0.01"
                        value={contractor.payoutAmount !== undefined ? contractor.payoutAmount : ''}
                        onChange={(e) => handleInputChange(e, 'payoutAmount', contractor)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`notes-${contractor.id}`}>Notes</Label>
                    <Textarea
                      id={`notes-${contractor.id}`}
                      value={contractor.notes || ''}
                      onChange={(e) => handleInputChange(e, 'notes', contractor)}
                      placeholder="Add notes about this payment..."
                    />
                  </div>
                </div>
              ) : (
                // Display mode
                <div className="flex flex-col md:flex-row justify-between space-y-4 md:space-y-0">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src="" alt={contractor.name} />
                      <AvatarFallback>
                        {contractor.name.split(' ').map(part => part[0]).join('').slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">{contractor.name}</h3>
                      <p className="text-sm text-muted-foreground capitalize">
                        {contractor.role.replace('_', ' ')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-lg font-semibold flex items-center">
                        <DollarSign className="h-4 w-4 mr-1" />
                        {contractor.payoutAmount?.toFixed(2) || '0.00'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {contractor.payoutRate !== undefined ? 
                          `${contractor.payoutRate.toFixed(1)}% of total` : 
                          'Manual amount'}
                      </p>
                    </div>
                    
                    <div className="flex space-x-1">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleEditContractor(contractor)}
                      >
                        <Edit className="h-4 w-4 text-muted-foreground" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDeleteContractor(contractor.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Add New Contractor Form */}
      {showNewContractorForm ? (
        <Card className="border border-dashed border-primary/50 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-lg">Add New Contractor</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
                onClick={() => setShowNewContractorForm(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleAddNewContractor}>Add Contractor</Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Button 
          variant="outline" 
          className="w-full flex items-center justify-center gap-1"
          onClick={() => setShowNewContractorForm(true)}
        >
          <Plus className="h-4 w-4" />
          Add Contractor
        </Button>
      )}
      
      {/* Summary Section */}
      {contractors.length > 0 && (
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
      )}
    </div>
  );
};
