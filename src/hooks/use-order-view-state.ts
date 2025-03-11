
import { useState } from 'react';

export function useOrderViewState() {
  const [activeTab, setActiveTab] = useState('details');
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };

  return {
    activeTab,
    setActiveTab,
    isEditing,
    setIsEditing,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    handleEditClick,
    handleCancelClick
  };
}
