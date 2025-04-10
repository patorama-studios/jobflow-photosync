
import { useOrderDetails } from './use-order-details';
import { useOrderViewState } from './use-order-view-state';
import { useOrderActions } from './use-order-actions';

export function useOrderDetailsView(orderId: string) {
  // Get UI state from the view state hook
  const {
    activeTab,
    setActiveTab,
    isEditing,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    handleEditClick,
    handleCancelClick,
    setIsEditing
  } = useOrderViewState();
  
  // Get order data and operations from the existing hook
  const { 
    order, 
    isLoading, 
    error, 
    refetch, 
    deleteOrder 
  } = useOrderDetails(orderId);
  
  // Create a wrapper for the deleteOrder function that returns a Promise
  const deleteOrderWithPromise = async (): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      try {
        deleteOrder();
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  };

  // Get action handlers from the actions hook
  const {
    handleDeleteClick,
    handleConfirmDelete,
    handleSaveClick,
    handleBackClick
  } = useOrderActions({
    orderId,
    deleteOrder: deleteOrderWithPromise,
    setIsEditing,
    setIsDeleteDialogOpen
  });

  // Return all the state and handlers from all hooks
  return {
    // Order data
    order,
    isLoading,
    error,
    refetch,
    
    // UI state
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    activeTab,
    setActiveTab,
    isEditing,
    
    // Action handlers
    handleDeleteClick,
    handleConfirmDelete,
    handleEditClick,
    handleCancelClick,
    handleSaveClick,
    handleBackClick,
    deleteOrder: deleteOrderWithPromise
  };
}
