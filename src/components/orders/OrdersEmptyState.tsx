
import React from 'react';
import { FileText, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export function OrdersEmptyState() {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
        <FileText className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold">No orders found</h3>
      <p className="text-muted-foreground mt-1 mb-4 max-w-md">
        There are no orders matching your current filters or you haven't created any orders yet.
      </p>
      <Button onClick={() => navigate('/orders/new')} className="flex items-center gap-1">
        <Plus className="h-4 w-4" />
        Create New Order
      </Button>
    </div>
  );
}
