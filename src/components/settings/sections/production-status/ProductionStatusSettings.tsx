
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { StatusTable } from './StatusTable';
import { StatusFormDialog } from './StatusFormDialog';
import { useProductionStatus } from './useProductionStatus';

export function ProductionStatusSettings() {
  const {
    statuses,
    loading,
    dialogOpen,
    setDialogOpen,
    editingStatus,
    formData,
    handleInputChange,
    handleCheckboxChange,
    handleAddClick,
    handleEditClick,
    handleDeleteClick,
    handleSubmit,
    handleReorder,
    saveOrder
  } = useProductionStatus();

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Production Statuses</CardTitle>
            <CardDescription>
              Manage the status options for production tasks
            </CardDescription>
          </div>
          <Button onClick={handleAddClick}>
            <Plus className="mr-2 h-4 w-4" />
            Add Status
          </Button>
        </CardHeader>
        <CardContent>
          <StatusTable 
            statuses={statuses}
            loading={loading}
            onEditClick={handleEditClick}
            onDeleteClick={handleDeleteClick}
            onReorder={handleReorder}
            onSaveOrder={saveOrder}
          />
        </CardContent>
      </Card>

      <StatusFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        formData={formData}
        editingStatus={editingStatus}
        onInputChange={handleInputChange}
        onCheckboxChange={handleCheckboxChange}
        onSubmit={handleSubmit}
      />
    </>
  );
}
