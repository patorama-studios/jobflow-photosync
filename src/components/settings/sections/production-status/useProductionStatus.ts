
import { useState, useCallback, ChangeEvent } from 'react';
import { toast } from 'sonner';
import { ProductionStatus, StatusFormData } from './types';
import { supabase } from '@/integrations/supabase/client';

// This would normally be an API call
const mockStatuses: ProductionStatus[] = [
  {
    id: '1',
    name: 'Scheduled',
    color: '#3498db',
    description: 'The shoot has been scheduled',
    is_default: true,
    sort_order: 1,
    created_at: '2023-01-01T00:00:00Z',
    updated_at: null,
  },
  {
    id: '2',
    name: 'In Progress',
    color: '#f1c40f',
    description: 'The shoot is currently in progress',
    is_default: false,
    sort_order: 2,
    created_at: '2023-01-01T00:00:00Z',
    updated_at: null,
  },
  {
    id: '3',
    name: 'Editing',
    color: '#9b59b6',
    description: 'Photos are being edited',
    is_default: false,
    sort_order: 3,
    created_at: '2023-01-01T00:00:00Z',
    updated_at: null,
  },
  {
    id: '4',
    name: 'Ready for Delivery',
    color: '#2ecc71',
    description: 'Photos are ready to be delivered to the client',
    is_default: false,
    sort_order: 4,
    created_at: '2023-01-01T00:00:00Z',
    updated_at: null,
  },
  {
    id: '5',
    name: 'Delivered',
    color: '#27ae60',
    description: 'Photos have been delivered to the client',
    is_default: false,
    sort_order: 5,
    created_at: '2023-01-01T00:00:00Z',
    updated_at: null,
  },
  {
    id: '6',
    name: 'Cancelled',
    color: '#e74c3c',
    description: 'The shoot has been cancelled',
    is_default: false,
    sort_order: 6,
    created_at: '2023-01-01T00:00:00Z',
    updated_at: null,
  },
];

const defaultFormData: StatusFormData = {
  name: '',
  color: '#3498db',
  description: '',
  is_default: false,
};

export const useProductionStatus = () => {
  const [statuses, setStatuses] = useState<ProductionStatus[]>(mockStatuses);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingStatus, setEditingStatus] = useState<ProductionStatus | null>(null);
  const [formData, setFormData] = useState<StatusFormData>(defaultFormData);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, is_default: checked }));
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
      is_default: status.is_default,
    });
    setDialogOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    deleteStatus(id);
  };

  const handleSubmit = () => {
    if (editingStatus) {
      updateStatus(editingStatus.id, formData);
    } else {
      addStatus(formData);
    }
  };

  // Handle reordering of statuses
  const handleReorder = useCallback((dragIndex: number, hoverIndex: number) => {
    setStatuses(prevStatuses => {
      const newStatuses = [...prevStatuses];
      const draggedStatus = newStatuses[dragIndex];
      
      // Remove the dragged status
      newStatuses.splice(dragIndex, 1);
      
      // Insert it at the new position
      newStatuses.splice(hoverIndex, 0, draggedStatus);
      
      // Update sort_order for each status
      return newStatuses.map((status, index) => ({
        ...status,
        sort_order: index + 1,
      }));
    });
  }, []);

  // Save the new order to the database
  const saveOrder = useCallback(async () => {
    setLoading(true);
    try {
      // In a real app, this would be an API call to save the new order
      toast.success('Production status order saved successfully');
    } catch (error) {
      console.error('Error saving status order:', error);
      toast.error('Failed to save production status order');
    } finally {
      setLoading(false);
    }
  }, [statuses]);

  const fetchStatuses = useCallback(async () => {
    setLoading(true);
    try {
      // In a real app, this would be an API call
      setTimeout(() => {
        setStatuses(mockStatuses);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error fetching statuses:', error);
      setLoading(false);
      toast.error('Failed to load production statuses');
    }
  }, []);

  const addStatus = useCallback(async (formData: StatusFormData) => {
    setLoading(true);
    try {
      // In a real app, this would be an API call
      const newStatus: ProductionStatus = {
        id: Date.now().toString(),
        name: formData.name,
        color: formData.color,
        description: formData.description || null,
        is_default: formData.is_default,
        sort_order: statuses.length + 1,
        created_at: new Date().toISOString(),
        updated_at: null,
      };

      // If the new status is set as default, update other statuses
      let updatedStatuses = [...statuses];
      if (formData.is_default) {
        updatedStatuses = updatedStatuses.map(status => ({
          ...status,
          is_default: false,
        }));
      }

      setStatuses([...updatedStatuses, newStatus]);
      toast.success('Production status added successfully');
    } catch (error) {
      console.error('Error adding status:', error);
      toast.error('Failed to add production status');
    } finally {
      setLoading(false);
      setDialogOpen(false);
    }
  }, [statuses]);

  const updateStatus = useCallback(async (id: string, formData: StatusFormData) => {
    setLoading(true);
    try {
      // In a real app, this would be an API call
      const updatedStatuses = statuses.map(status => {
        if (status.id === id) {
          return {
            ...status,
            name: formData.name,
            color: formData.color,
            description: formData.description || null,
            is_default: formData.is_default,
            updated_at: new Date().toISOString(),
          };
        }
        // If the updated status is set as default, remove default from other statuses
        if (formData.is_default && status.id !== id) {
          return {
            ...status,
            is_default: false,
          };
        }
        return status;
      });

      setStatuses(updatedStatuses);
      toast.success('Production status updated successfully');
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update production status');
    } finally {
      setLoading(false);
      setDialogOpen(false);
    }
  }, [statuses]);

  const deleteStatus = useCallback(async (id: string) => {
    setLoading(true);
    try {
      // Add a confirmation before deleting
      const confirmed = window.confirm('Are you sure you want to delete this status?');
      
      if (!confirmed) {
        setLoading(false);
        return;
      }
      
      // In a real app, this would be an API call
      const filteredStatuses = statuses.filter(status => status.id !== id);
      setStatuses(filteredStatuses);
      toast.success('Production status deleted successfully');
    } catch (error) {
      console.error('Error deleting status:', error);
      toast.error('Failed to delete production status');
    } finally {
      setLoading(false);
    }
  }, [statuses]);

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
    saveOrder
  };
};
