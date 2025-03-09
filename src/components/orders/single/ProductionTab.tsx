
import React from 'react';
import { Order } from '@/types/order-types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, FileImage, CheckCircle, Clock } from 'lucide-react';

interface ProductionTabProps {
  order: Order;
}

export function ProductionTab({ order }: ProductionTabProps) {
  return (
    <div className="mt-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Production Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-md">
              <div className="font-medium">Status</div>
              <div className="flex items-center gap-2 mt-2">
                {order.status === 'completed' ? (
                  <>
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="font-medium text-green-500">Completed</span>
                  </>
                ) : (
                  <>
                    <Clock className="h-5 w-5 text-amber-500" />
                    <span className="font-medium text-amber-500">{order.status}</span>
                  </>
                )}
              </div>
            </div>
            <div className="p-4 border rounded-md">
              <div className="font-medium">Media</div>
              <div className="flex items-center gap-2 mt-2">
                <FileImage className="h-5 w-5 text-blue-500" />
                <span>{order.mediaUploaded ? 'Media uploaded' : 'No media uploaded'}</span>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <div className="font-medium mb-2">Products</div>
            {order.products && order.products.length > 0 ? (
              <div className="space-y-2">
                {order.products.map((product, index) => (
                  <div key={index} className="p-3 border rounded-md">
                    {product}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-muted-foreground">No products associated with this order</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
