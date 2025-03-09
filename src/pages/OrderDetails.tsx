
import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Edit, Trash2, ArrowLeft } from 'lucide-react';
import { useOrderDetails } from '@/hooks/use-order-details';
import { Order as OrderType } from '@/types/order-types';
import { Button } from "@/components/ui/button";
import { OrderInformation } from '@/components/orders/details/OrderInformation';
import { ClientInformation } from '@/components/orders/details/ClientInformation';
import { PhotographerInformation } from '@/components/orders/details/PhotographerInformation';
import { OrderNotes } from '@/components/orders/details/OrderNotes';
import { DeleteOrderDialog } from '@/components/orders/details/DeleteOrderDialog';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { useHeaderSettings } from '@/hooks/useHeaderSettings';
import { PageTransition } from '@/components/layout/PageTransition';
import MainLayout from '@/components/layout/MainLayout';

const OrderDetails = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { setTitle, setShowBackButton, setBackButtonAction } = useHeaderSettings();
  
  const { 
    order, 
    editedOrder, 
    isLoading, 
    error, 
    isEditing, 
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    handleEditClick,
    handleCancelClick,
    handleInputChange,
    handleStatusChange,
    handleSaveClick,
    handleDeleteClick,
    confirmDelete
  } = useOrderDetails(orderId);

  useEffect(() => {
    // Set header title and back button
    if (order) {
      setTitle(`Order ${order.orderNumber || order.order_number || orderId}`);
    } else {
      setTitle('Order Details');
    }
    
    setShowBackButton(true);
    setBackButtonAction(() => navigate('/orders'));
    
    // Clean up when component unmounts
    return () => {
      setTitle(null);
      setShowBackButton(false);
    };
  }, [order, orderId, setTitle, setShowBackButton, setBackButtonAction, navigate]);

  if (isLoading) {
    return (
      <MainLayout>
        <PageTransition>
          <div className="container py-8">
            <div className="mb-6">
              <Skeleton className="h-10 w-64 mb-4" />
              <div className="flex gap-2">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-24" />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Skeleton className="h-64" />
              <Skeleton className="h-64" />
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
            </div>
          </div>
        </PageTransition>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <PageTransition>
          <div className="container py-8">
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Error Loading Order</h2>
              <p className="text-gray-600 mb-6">{error}</p>
              <Link to="/orders">
                <Button>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Return to Orders
                </Button>
              </Link>
            </div>
          </div>
        </PageTransition>
      </MainLayout>
    );
  }

  if (!order && !isLoading) {
    return (
      <MainLayout>
        <PageTransition>
          <div className="container py-8">
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Order Not Found</h2>
              <p className="text-gray-600 mb-6">The order you're looking for doesn't exist or has been removed.</p>
              <Link to="/orders">
                <Button>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Return to Orders
                </Button>
              </Link>
            </div>
          </div>
        </PageTransition>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <PageTransition>
        <div className="container py-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-semibold">
                Order {order?.orderNumber || order?.order_number || orderId}
              </h1>
              <p className="text-muted-foreground">
                {order?.scheduledDate || order?.scheduled_date 
                  ? new Date(order.scheduledDate || order.scheduled_date).toLocaleDateString() 
                  : 'No date scheduled'}
                {order?.status && (
                  <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    order.status === 'completed' ? 'bg-green-100 text-green-800' :
                    order.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                    order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                )}
              </p>
            </div>
            
            <div className="flex gap-2">
              {!isEditing ? (
                <>
                  <Button onClick={handleEditClick} className="flex items-center">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  <Button 
                    onClick={handleDeleteClick} 
                    variant="destructive" 
                    className="flex items-center"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </>
              ) : (
                <>
                  <Button onClick={handleCancelClick} variant="outline">
                    Cancel
                  </Button>
                  <Button onClick={handleSaveClick}>
                    Save Changes
                  </Button>
                </>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <OrderInformation 
              order={isEditing ? editedOrder : order} 
              isEditing={isEditing}
              onInputChange={handleInputChange}
              onStatusChange={handleStatusChange}
            />
            
            <ClientInformation 
              order={isEditing ? editedOrder : order} 
              isEditing={isEditing}
              onInputChange={handleInputChange}
            />
            
            <PhotographerInformation 
              order={isEditing ? editedOrder : order} 
              isEditing={isEditing}
              onInputChange={handleInputChange}
            />
            
            <OrderNotes 
              order={isEditing ? editedOrder : order} 
              isEditing={isEditing}
              onInputChange={handleInputChange}
            />
          </div>
  
          <DeleteOrderDialog
            isOpen={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
            onConfirmDelete={confirmDelete}
          />
        </div>
      </PageTransition>
    </MainLayout>
  );
};

export default OrderDetails;
