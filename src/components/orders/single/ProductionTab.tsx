
import React from 'react';
import { Order } from '@/types/order-types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { UploadCloud, Edit, CheckCircle, Clock, ChevronRight, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface ProductionTabProps {
  order: Order;
}

export const ProductionTab: React.FC<ProductionTabProps> = ({ order }) => {
  // Fix: Convert order.id to string if it's a number
  const orderId = typeof order.id === 'number' ? order.id.toString() : order.id;
  
  // Fetch order products from the database
  const { data: orderProducts, isLoading } = useQuery({
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
  
  // Use fetched products or fallback to mock data
  const products = orderProducts?.length ? orderProducts : [
    { id: 1, name: 'Professional Photography', status: 'to_do', assigned_editor: null },
    { id: 2, name: 'Virtual Tour', status: 'in_production', assigned_editor: 'David Chen' }
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
      default:
        return status;
    }
  };
  
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
            <div className="py-8 text-center text-muted-foreground">
              Loading production data...
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Editor</TableHead>
                  <TableHead className="w-20"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
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
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      
      {/* Media Gallery Placeholder */}
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
