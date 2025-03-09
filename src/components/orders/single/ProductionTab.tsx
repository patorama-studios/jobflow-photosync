
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { UploadCloud, Check, Clock, Loader2 } from 'lucide-react';
import { Order } from '@/types/order-types';
import { useOrderProducts } from '@/components/orders/single/production/useOrderProducts';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { MediaGalleryCard } from '@/components/orders/single/production/MediaGalleryCard';
import { ProductionStatusCard } from '@/components/orders/single/production/ProductionStatusCard';

interface ProductionTabProps {
  order: Order | null;
}

export const ProductionTab: React.FC<ProductionTabProps> = ({ order }) => {
  const navigate = useNavigate();
  const { products, isLoading, updateProductStatus } = useOrderProducts(order?.id);
  
  if (!order) return null;
  
  const handleUploadClick = () => {
    navigate(`/production/upload/${order.id}`);
    toast.info("Navigating to upload page...");
  };
  
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-800 border-green-200">
            <Check className="h-3 w-3 mr-1" /> Completed
          </Badge>
        );
      case 'in_production':
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">
            <Loader2 className="h-3 w-3 mr-1 animate-spin" /> In Production
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-200">
            <Clock className="h-3 w-3 mr-1" /> To Do
          </Badge>
        );
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProductionStatusCard order={order} />
        <MediaGalleryCard order={order} />
      </div>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>Production Items</CardTitle>
            <CardDescription>Manage the production status of each product</CardDescription>
          </div>
          <Button variant="default" onClick={handleUploadClick}>
            <UploadCloud className="h-4 w-4 mr-2" />
            Upload Media
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4">
                    <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                    <p className="text-sm text-muted-foreground mt-2">Loading production items...</p>
                  </TableCell>
                </TableRow>
              ) : products && products.length > 0 ? (
                products.map((product: any) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{getStatusBadge(product.status)}</TableCell>
                    <TableCell>{product.assigned_editor || 'Unassigned'}</TableCell>
                    <TableCell>
                      <Select 
                        defaultValue={product.status}
                        onValueChange={(value) => updateProductStatus(product.id, value)}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Change status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="to_do">To Do</SelectItem>
                          <SelectItem value="in_production">In Production</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4">
                    <p className="text-sm text-muted-foreground">No production items found.</p>
                    <Button variant="link" className="mt-2" onClick={handleUploadClick}>
                      Upload media to get started
                    </Button>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
