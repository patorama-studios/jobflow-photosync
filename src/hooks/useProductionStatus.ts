
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ProductionStatus } from '@/components/settings/sections/production-status/types';
import update from 'immutability-helper';

export const useProductionStatus = () => {
  const [statuses, setStatuses] = useState<ProductionStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingStatus, setEditingStatus] = useState<ProductionStatus | null>(null);
  const [hasOrderChanged, setHasOrderChanged] = useState(false);
  const { toast } = useToast();

  const defaultFormData = {
    name: '',
    color: '#3B82F6',
    description: '',
    is_default: false,
  };
  
  const [formData, setFormData] = useState(defaultFormData);

  const fetchStatuses = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('production_statuses')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;

      setStatuses(data || []);
    } catch (err) {
      console.error('Error fetching production statuses:', err);
      toast({
        title: 'Error',
        description: 'Failed to fetch production statuses.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatuses();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, is_default: checked }));
  };

  const handleAddClick = () => {
    setEditingStatus(null);
    setFormData(defaultFormData);
    setDialogOpen(true);
  };

  const handleEditClick = (status: ProductionStatus) => {
    setEditingStatus(status);
    setFormData({
      name: status.name,
      color: status.color,
      description: status.description || '',
      is_default: status.is_default || false,
    });
    setDialogOpen(true);
  };

  const handleDeleteClick = async (id: string) => {
    try {
      const { error } = await supabase
        .from('production_statuses')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Update local state
      setStatuses(statuses.filter(status => status.id !== id));
      
      toast({
        title: 'Status deleted',
        description: 'Production status has been deleted successfully.',
      });
    } catch (err) {
      console.error('Error deleting production status:', err);
      toast({
        title: 'Error',
        description: 'Failed to delete production status.',
        variant: 'destructive'
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingStatus) {
        // Update existing status
        const { error } = await supabase
          .from('production_statuses')
          .update({
            name: formData.name,
            color: formData.color,
            description: formData.description,
            is_default: formData.is_default,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingStatus.id);

        if (error) throw error;

        // Update local state
        setStatuses(statuses.map(status => 
          status.id === editingStatus.id 
            ? { ...status, ...formData } 
            : status
        ));

        // If this status is being set as default, update other statuses
        if (formData.is_default && !editingStatus.is_default) {
          await updateDefaultStatus(editingStatus.id);
        }

        toast({
          title: 'Status updated',
          description: 'Production status has been updated successfully.',
        });
      } else {
        // Create new status
        const newStatus = {
          ...formData,
          sort_order: statuses.length + 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        const { data, error } = await supabase
          .from('production_statuses')
          .insert(newStatus)
          .select();

        if (error) throw error;

        // Update local state
        if (data && data.length > 0) {
          setStatuses([...statuses, data[0] as ProductionStatus]);

          // If this new status is set as default, update other statuses
          if (formData.is_default) {
            await updateDefaultStatus(data[0].id);
          }
        }

        toast({
          title: 'Status created',
          description: 'New production status has been created successfully.',
        });
      }

      // Reset form and close dialog
      setFormData(defaultFormData);
      setDialogOpen(false);
    } catch (err) {
      console.error('Error saving production status:', err);
      toast({
        title: 'Error',
        description: 'Failed to save production status.',
        variant: 'destructive'
      });
    }
  };

  const updateDefaultStatus = async (newDefaultId: string) => {
    try {
      // Set all other statuses as non-default
      const { error } = await supabase
        .from('production_statuses')
        .update({ is_default: false })
        .neq('id', newDefaultId);

      if (error) throw error;

      // Update local state
      setStatuses(statuses.map(status => ({
        ...status,
        is_default: status.id === newDefaultId
      })));
    } catch (err) {
      console.error('Error updating default status:', err);
    }
  };

  const handleReorder = useCallback((dragIndex: number, hoverIndex: number) => {
    // Don't do anything if we're trying to drop in the same position
    if (dragIndex === hoverIndex) return;

    // Use immutability-helper to reorder the array
    const reorderedStatuses = update(statuses, {
      $splice: [
        [dragIndex, 1],
        [hoverIndex, 0, statuses[dragIndex]]
      ]
    });

    setStatuses(reorderedStatuses);
    setHasOrderChanged(true);
  }, [statuses]);

  const saveOrder = async () => {
    try {
      if (!hasOrderChanged) return;

      // Prepare batch updates for all statuses with new sort_order values
      const updates = statuses.map((status, index) => ({
        id: status.id,
        sort_order: index + 1
      }));

      // Update all statuses in a batch operation
      for (const update of updates) {
        await supabase
          .from('production_statuses')
          .update({ sort_order: update.sort_order })
          .eq('id', update.id);
      }

      setHasOrderChanged(false);
      
      toast({
        title: 'Order saved',
        description: 'Production status order has been updated successfully.',
      });
    } catch (err) {
      console.error('Error saving status order:', err);
      toast({
        title: 'Error',
        description: 'Failed to save status order.',
        variant: 'destructive'
      });
    }
  };

  return {
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
    saveOrder,
    hasOrderChanged
  };
};
