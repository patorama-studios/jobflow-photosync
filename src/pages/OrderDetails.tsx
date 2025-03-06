
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Edit, Trash2 } from 'lucide-react';
import { useOrderDetails } from '@/hooks/use-order-details';
import { useContractors } from '@/hooks/use-contractors';
import { useRefunds } from '@/hooks/use-refunds';

import { Button } from "@/components/ui/button";
import { OrderInformation } from '@/components/orders/details/OrderInformation';
import { ClientInformation } from '@/components/orders/details/ClientInformation';
import { PhotographerInformation } from '@/components/orders/details/PhotographerInformation';
import { OrderNotes } from '@/components/orders/details/OrderNotes';
import { ContractorsSection } from '@/components/orders/details/ContractorsSection';
import { RefundsSection } from '@/components/orders/details/RefundsSection';
import { DeleteOrderDialog } from '@/components/orders/details/DeleteOrderDialog';

const OrderDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { 
    order, 
    editedOrder, 
    isLoading, 
    error, 
    isEditing, 
    isDeleteDialogOpen,
    refundsForOrder, 
    setRefundsForOrder,
    setIsDeleteDialogOpen,
    handleEditClick,
    handleCancelClick,
    handleInputChange,
    handleStatusChange,
    handleSaveClick,
    handleDeleteClick,
    confirmDelete
  } = useOrderDetails(id);
  
  const { contractors, isLoading: isContractorsLoading, error: contractorsError } = useContractors();
  const { refunds, isLoading: isRefundsLoading, error: refundsError } = useRefunds();

  useEffect(() => {
    if (order && refunds) {
      const orderRefunds = refunds
        .filter(refund => refund.orderId === order.id);
      setRefundsForOrder(orderRefunds);
    }
  }, [order, refunds, setRefundsForOrder]);

  if (isLoading || isContractorsLoading || isRefundsLoading) {
    return <p>Loading order details...</p>;
  }

  if (error || contractorsError || refundsError) {
    return <p>Error: {error || contractorsError || refundsError}</p>;
  }

  if (!order) {
    return <p>Order not found.</p>;
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Order Details</h1>
        <div className="space-x-2">
          {!isEditing ? (
            <>
              <Button variant="outline" onClick={handleEditClick}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Order
              </Button>
              <Button variant="destructive" onClick={handleDeleteClick}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Order
              </Button>
            </>
          ) : (
            <>
              <Button variant="secondary" onClick={handleCancelClick}>
                Cancel
              </Button>
              <Button onClick={handleSaveClick}>Save</Button>
            </>
          )}
        </div>
      </div>

      <OrderInformation 
        editedOrder={editedOrder}
        isEditing={isEditing}
        handleInputChange={handleInputChange}
        handleStatusChange={handleStatusChange}
      />

      <ClientInformation
        editedOrder={editedOrder}
        isEditing={isEditing}
        handleInputChange={handleInputChange}
      />

      <PhotographerInformation
        editedOrder={editedOrder}
        isEditing={isEditing}
        handleInputChange={handleInputChange}
      />

      <OrderNotes
        editedOrder={editedOrder}
        isEditing={isEditing}
        handleInputChange={handleInputChange}
      />

      <ContractorsSection 
        contractors={contractors} 
      />

      <RefundsSection 
        refundsForOrder={refundsForOrder}
        order={order}
      />

      <DeleteOrderDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirmDelete={confirmDelete}
      />
    </div>
  );
};

export default OrderDetails;
