
import React, { useState } from 'react';
import { Order } from '@/types/order-types';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  UploadCloud, 
  Edit, 
  CheckCircle, 
  Clock, 
  ChevronRight, 
  ExternalLink, 
  AlertTriangle,
  Images,
  FileImage,
  Video,
  Clapperboard,
  ArrowLeft 
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

interface ProductionTabProps {
  order: Order;
}

export const ProductionTab: React.FC<ProductionTabProps> = ({ order }) => {
  const navigate = useNavigate();
  // Fix: Convert order.id to string if it's a number
  const orderId = typeof order.id === 'number' ? order.id.toString() : order.id;
  
  // Fetch order products from the database
  const { data: orderProducts, isLoading: productsLoading } = useQuery({
    queryKey: ['orderProducts', orderId],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('order_products')
          .select('*')
          .eq('order_id', orderId);
        
        if (error) throw error;
        return data || [];
      } catch (error) {
        console.error('Error fetching order products:', error);
        return [];
      }
    },
    enabled: !!orderId
  });
  
  // Mock data for upload statuses since we don't have the real table yet
  const mockUploadStatuses = [
    { id: 1, order_id: orderId, product_id: 1, status: 'in_progress', total_uploaded: 23, total_required: 30 },
    { id: 2, order_id: orderId, product_id: 2, status: 'completed', total_uploaded: 1, total_required: 1 },
    { id: 3, order_id: orderId, product_id: 3, status: 'not_started', total_uploaded: 0, total_required: 1 },
    { id: 4, order_id: orderId, product_id: 4, status: 'error', total_uploaded: 2, total_required: 5 }
  ];
  
  // Use fetched products or fallback to mock data
  const products = orderProducts?.length ? orderProducts : [
    { id: 1, name: 'Professional Photography', status: 'to_do', assigned_editor: null },
    { id: 2, name: 'Virtual Tour', status: 'in_production', assigned_editor: 'David Chen' },
    { id: 3, name: 'Floor Plan', status: 'completed', assigned_editor: 'Sarah Miller' },
    { id: 4, name: 'Video Tour', status: 'in_production', assigned_editor: 'James Wilson' }
  ];
  
  // Function to get the status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'to_do':
        return <Clock className="h-4 w-4 text-gray-500" />;
      case 'in_production':
        return <Edit className="h-4 w-4 text-blue-500" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };
  
  // Function to get the status text
  const getStatusText = (status: string) => {
    switch (status) {
      case 'to_do':
        return 'To Do';
      case 'in_production':
        return 'In Production';
      case 'completed':
        return 'Completed';
      case 'error':
        return 'Error';
      default:
        return status;
    }
  };
  
  // Function to get product icon
  const getProductIcon = (productName: string) => {
    if (!productName) return <FileImage className="h-4 w-4" />;
    
    const name = productName.toLowerCase();
    if (name.includes('photo') || name.includes('image')) {
      return <Images className="h-4 w-4" />;
    } else if (name.includes('floor') || name.includes('plan')) {
      return <FileImage className="h-4 w-4" />;
    } else if (name.includes('video') || name.includes('tour')) {
      return name.includes('virtual') 
        ? <Clapperboard className="h-4 w-4" /> 
        : <Video className="h-4 w-4" />;
    }
    
    return <FileImage className="h-4 w-4" />;
  };
  
  // Function to handle product upload button click
  const handleUploadClick = (productId: any, productName: string) => {
    navigate(`/production/upload/${orderId}?product=${productId}`);
  };
  
  const isLoading = productsLoading;
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Production Status</CardTitle>
          <div className="flex gap-2">
            <Button asChild>
              <Link to={`/production/upload/${orderId}`} className="flex items-center gap-1">
                <UploadCloud className="h-4 w-4" />
                Upload Content
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to={`/production/order/${orderId}`} className="flex items-center gap-1">
                <ExternalLink className="h-4 w-4" />
                View in Production
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Editor</TableHead>
                  <TableHead>Upload Progress</TableHead>
                  <TableHead className="w-20"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => {
                  // Find upload status for this product if available
                  const uploadStatus = mockUploadStatuses.find(u => u.product_id === product.id) || null;
                  const progress = uploadStatus 
                    ? `${uploadStatus.total_uploaded || 0}/${uploadStatus.total_required || '-'}`
                    : '-';
                    
                  return (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {getProductIcon(product.name)}
                        <span>{product.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(product.status)}
                        <span>{getStatusText(product.status)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {product.assigned_editor ? (
                        product.assigned_editor
                      ) : (
                        <Badge variant="outline" className="text-muted-foreground">Not Assigned</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {uploadStatus ? (
                        <div className="text-sm">
                          {uploadStatus.status === 'completed' ? (
                            <Badge variant="success" className="bg-green-100 text-green-800">
                              Complete
                            </Badge>
                          ) : uploadStatus.status === 'in_progress' ? (
                            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                              {progress} Uploaded
                            </Badge>
                          ) : uploadStatus.status === 'error' ? (
                            <Badge variant="destructive">Error</Badge>
                          ) : (
                            <Badge variant="outline">{progress} Uploaded</Badge>
                          )}
                        </div>
                      ) : (
                        <Badge variant="outline">Not Started</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => handleUploadClick(product.id, product.name)}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                )})}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      
      {/* Media Gallery */}
      <Card>
        <CardHeader>
          <CardTitle>Media Gallery</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-muted/40 rounded-md flex items-center justify-center">
            <p className="text-muted-foreground">Media gallery will be implemented here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
