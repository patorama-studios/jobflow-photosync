
import { useState } from 'react';

export function useOrderViewState() {
  // UI state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [isEditing, setIsEditing] = useState(false);

  // Action handlers
  const handleEditClick = () => {
    setIsEditing(true);
  };
  
  const handleCancelClick = () => {
    setIsEditing(false);
  };

  return {
    // State
    activeTab,
    setActiveTab,
    isEditing,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    
    // Actions
    handleEditClick,
    handleCancelClick,
  };
}
