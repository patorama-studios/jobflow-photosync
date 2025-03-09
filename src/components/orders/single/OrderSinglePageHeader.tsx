
import React from 'react';
import { Edit, Trash2, Download, Link2, Send } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Order } from "@/types/order-types";
import { toast } from 'sonner';

interface OrderSinglePageHeaderProps {
  order: Order;
  orderId: string | undefined;
  isEditing: boolean;
  handleEditClick: () => void;
  handleDeleteClick: () => void;
  handleCancelClick: () => void;
  handleSaveClick: () => void;
}

export const OrderSinglePageHeader: React.FC<OrderSinglePageHeaderProps> = ({
  order,
  orderId,
  isEditing,
  handleEditClick,
  handleDeleteClick,
  handleCancelClick,
  handleSaveClick
}) => {
  const isDelivered = order.status === 'completed';

  const handleDeliverClick = () => {
    toast.info(isDelivered ? "Re-delivering content..." : "Delivering content...");
    // Implementation to deliver or re-deliver content would go here
  };

  const handleDownloadClick = () => {
    toast.info("Opening download page...");
    // Implementation to navigate to download page would go here
  };

  const handleWebsiteClick = () => {
    toast.info("Opening property website...");
    // Implementation to navigate to property website would go here
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-semibold">
            Order {order?.orderNumber || order?.order_number || orderId}
          </h1>
          <p className="text-muted-foreground">
            {order?.propertyAddress || order?.address || 'No address provided'}
          </p>
          <div className="mt-1">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              order.status === 'completed' ? 'bg-green-100 text-green-800' :
              order.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
              order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
          </div>
        </div>
        
        <div className="flex gap-2 flex-wrap">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center"
            onClick={handleDownloadClick}
          >
            <Download className="mr-2 h-4 w-4" />
            Download Page
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center"
            onClick={handleWebsiteClick}
          >
            <Link2 className="mr-2 h-4 w-4" />
            Property Website
          </Button>
          
          <Button 
            variant={isDelivered ? "outline" : "default"} 
            size="sm" 
            className="flex items-center"
            onClick={handleDeliverClick}
          >
            <Send className="mr-2 h-4 w-4" />
            {isDelivered ? "Re-deliver Content" : "Deliver"}
          </Button>
        </div>
      </div>
      
      <div className="flex justify-end gap-2">
        {!isEditing ? (
          <>
            <Button onClick={handleEditClick} className="flex items-center" size="sm">
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <Button 
              onClick={handleDeleteClick} 
              variant="destructive" 
              className="flex items-center"
              size="sm"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </>
        ) : (
          <>
            <Button onClick={handleCancelClick} variant="outline" size="sm">
              Cancel
            </Button>
            <Button onClick={handleSaveClick} size="sm">
              Save Changes
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
