
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ProductionStatus, StatusFormData } from './types';

export function useProductionStatus() {
  const { toast } = useToast();
  const [statuses, setStatuses] = useState<ProductionStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingStatus, setEditingStatus] = useState<ProductionStatus | null>(null);
  const [formData, setFormData] = useState<StatusFormData>({
    name: '',
    color: '#94a3b8',
    description: '',
    isDefault: false
  });

  const fetchStatuses = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('production_statuses')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setStatuses(data || []);
    } catch (error) {
      console.error('Error fetching production statuses:', error);
      toast({
        title: 'Error',
        description: 'Failed to load production statuses',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatuses();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, isDefault: e.target.checked }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      color: '#94a3b8',
      description: '',
      isDefault: false
    });
    setEditingStatus(null);
  };

  const handleAddClick = () => {
    resetForm();
    setDialogOpen(true);
  };

  const handleEditClick = (status: ProductionStatus) => {
    setEditingStatus(status);
    setFormData({
      name: status.name,
      color: status.color,
      description: status.description || '',
      isDefault: status.is_default
    });
    setDialogOpen(true);
  };

  const handleDeleteClick = async (id: string) => {
    try {
      // Check if this is the default status
      const isDefault = statuses.find(s => s.id === id)?.is_default;
      if (isDefault) {
        toast({
          title: 'Cannot Delete',
          description: 'You cannot delete the default status',
          variant: 'destructive'
        });
        return;
      }

      const { error } = await supabase
        .from('production_statuses')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Status Deleted',
        description: 'Production status has been deleted'
      });
      fetchStatuses();
    } catch (error) {
      console.error('Error deleting status:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete status',
        variant: 'destructive'
      });
    }
  };

  const handleSubmit = async () => {
    try {
      if (!formData.name || !formData.color) {
        toast({
          title: 'Validation Error',
          description: 'Name and color are required',
          variant: 'destructive'
        });
        return;
      }

      // If setting as default, need to update all other statuses
      if (formData.isDefault) {
        await supabase
          .from('production_statuses')
          .update({ is_default: false })
          .not('id', editingStatus?.id || 'none');
      }

      if (editingStatus) {
        // Update existing
        const { error } = await supabase
          .from('production_statuses')
          .update({
            name: formData.name,
            color: formData.color,
            description: formData.description || null,
            is_default: formData.isDefault,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingStatus.id);

        if (error) throw error;
        toast({
          title: 'Status Updated',
          description: 'Production status has been updated'
        });
      } else {
        // Create new
        const maxOrder = Math.max(...statuses.map(s => s.sort_order || 0), 0);
        const { error } = await supabase
          .from('production_statuses')
          .insert({
            name: formData.name,
            color: formData.color,
            description: formData.description || null,
            is_default: formData.isDefault,
            sort_order: maxOrder + 1
          });

        if (error) throw error;
        toast({
          title: 'Status Created',
          description: 'New production status has been created'
        });
      }

      setDialogOpen(false);
      resetForm();
      fetchStatuses();
    } catch (error) {
      console.error('Error saving status:', error);
      toast({
        title: 'Error',
        description: 'Failed to save status',
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
    handleSubmit
  };
}
