
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { ContractorPayoutsProps } from './contractors/types';
import { ContractorDisplay } from './contractors/ContractorDisplay';
import { ContractorForm } from './contractors/ContractorForm';
import { NewContractorForm } from './contractors/NewContractorForm';
import { ContractorSummary } from './contractors/ContractorSummary';
import { useContractorPayouts } from './contractors/useContractorPayouts';

export const ContractorPayouts: React.FC<ContractorPayoutsProps> = ({ orderId }) => {
  const {
    contractors,
    totalOrderAmount,
    editingContractorId,
    newContractor,
    showNewContractorForm,
    setShowNewContractorForm,
    handleEditContractor,
    handleSaveContractor,
    handleDeleteContractor,
    handleAddNewContractor,
    handleInputChange,
    handleSelectChange,
    setEditingContractorId,
    setNewContractor
  } = useContractorPayouts(orderId);

  return (
    <div className="space-y-6">
      {/* Existing Contractors */}
      <div className="space-y-4">
        {contractors.map(contractor => (
          <Card key={contractor.id} className="border border-gray-200">
            <CardContent className="p-4">
              {editingContractorId === contractor.id ? (
                <ContractorForm 
                  contractor={contractor}
                  onSave={handleSaveContractor}
                  onCancel={() => setEditingContractorId(null)}
                  totalOrderAmount={totalOrderAmount}
                />
              ) : (
                <ContractorDisplay
                  contractor={contractor}
                  onEdit={handleEditContractor}
                  onDelete={handleDeleteContractor}
                />
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Add New Contractor Form */}
      {showNewContractorForm ? (
        <Card className="border border-dashed border-primary/50 bg-primary/5">
          <CardContent>
            <NewContractorForm
              onAdd={handleAddNewContractor}
              onCancel={() => setShowNewContractorForm(false)}
              newContractor={newContractor}
              setNewContractor={setNewContractor}
              totalOrderAmount={totalOrderAmount}
              handleInputChange={handleInputChange}
              handleSelectChange={handleSelectChange}
            />
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
        <ContractorSummary contractors={contractors} />
      )}
    </div>
  );
};
