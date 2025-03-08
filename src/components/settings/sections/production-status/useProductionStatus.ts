
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { ProductionStatus, StatusFormData } from './types';

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

export const useProductionStatus = () => {
  const [statuses, setStatuses] = useState<ProductionStatus[]>(mockStatuses);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<ProductionStatus | null>(null);

  const fetchStatuses = useCallback(async () => {
    setIsLoading(true);
    try {
      // In a real app, this would be an API call
      setTimeout(() => {
        setStatuses(mockStatuses);
        setIsLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error fetching statuses:', error);
      setIsLoading(false);
      toast.error('Failed to load production statuses');
    }
  }, []);

  const addStatus = useCallback(async (formData: StatusFormData) => {
    setIsLoading(true);
    try {
      // In a real app, this would be an API call
      const newStatus: ProductionStatus = {
        id: Date.now().toString(),
        name: formData.name,
        color: formData.color,
        description: formData.description || null,
        is_default: formData.isDefault,
        sort_order: statuses.length + 1,
        created_at: new Date().toISOString(),
        updated_at: null,
      };

      // If the new status is set as default, update other statuses
      let updatedStatuses = [...statuses];
      if (formData.isDefault) {
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
      setIsLoading(false);
      setIsDialogOpen(false);
    }
  }, [statuses]);

  const updateStatus = useCallback(async (id: string, formData: StatusFormData) => {
    setIsLoading(true);
    try {
      // In a real app, this would be an API call
      const updatedStatuses = statuses.map(status => {
        if (status.id === id) {
          return {
            ...status,
            name: formData.name,
            color: formData.color,
            description: formData.description || null,
            is_default: formData.isDefault,
            updated_at: new Date().toISOString(),
          };
        }
        // If the updated status is set as default, remove default from other statuses
        if (formData.isDefault && status.id !== id) {
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
      setIsLoading(false);
      setIsDialogOpen(false);
    }
  }, [statuses]);

  const deleteStatus = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      // Add a confirmation before deleting
      const confirmed = window.confirm('Are you sure you want to delete this status?');
      
      if (!confirmed) {
        setIsLoading(false);
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
      setIsLoading(false);
    }
  }, [statuses]);

  return {
    statuses,
    isLoading,
    isDialogOpen,
    setIsDialogOpen,
    currentStatus,
    setCurrentStatus,
    fetchStatuses,
    addStatus,
    updateStatus,
    deleteStatus
  };
};
