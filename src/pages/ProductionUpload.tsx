
import { useEffect } from "react";
import { PageTransition } from "@/components/layout/PageTransition";
import { SidebarLayout } from "@/components/layout/SidebarLayout";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductUploadStepsView } from "@/components/production/ProductUploadStepsView";
import { UploadFormView } from "@/components/production/UploadFormView";
import { BoxFolderIntegration } from "@/components/production/BoxFolderIntegration";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const ProductionUpload = () => {
  const { orderId, productId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const productParam = searchParams.get('product');
  
  // We'll use either the productId from URL or from query parameter
  const selectedProductId = productId || productParam;
  
  // Fetch order data from Supabase
  const { data: orderData, isLoading: orderLoading } = useQuery({
    queryKey: ['orderDetails', orderId],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('id', orderId)
          .single();
        
        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Error fetching order details:', error);
        return {
          orderNumber: orderId || "1234",
          address: "123 Main Street, Cityville",
          client: "Example Realty",
          photographer: "John Smith",
          scheduledDate: new Date().toISOString(),
        };
      }
    },
    enabled: !!orderId
  });
  
  // Helper function to get order number from different formats
  const getOrderNumber = (order: any): string => {
    if (!order) return String(orderId || "1234");
    return order.order_number || order.orderNumber || String(orderId || "1234");
  };
  
  // Determine if we should show steps view or legacy view
  const shouldShowStepsView = true; // In production this could be a feature flag
  
  return (
    <PageTransition>
      <SidebarLayout>
        {shouldShowStepsView ? (
          <ProductUploadStepsView />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <div className="mb-4">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => navigate(`/order/${orderId}`)}
                  className="flex items-center"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Order
                </Button>
              </div>
              <UploadFormView orderId={orderId} initialProductType={selectedProductId || undefined} />
            </div>
            <div className="md:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Order Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Order Number:</span>
                      <span className="font-medium">{getOrderNumber(orderData)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Property:</span>
                      <span className="font-medium">{orderData?.address}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Client:</span>
                      <span className="font-medium">{orderData?.client}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Photographer:</span>
                      <span className="font-medium">{orderData?.photographer}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Box Integration</AlertTitle>
                <AlertDescription>
                  Connect to Box and create a structured folder system for this order's content.
                </AlertDescription>
              </Alert>
              
              <BoxFolderIntegration 
                orderNumber={getOrderNumber(orderData)}
                propertyAddress={orderData?.address || "Property Address"}
                productType={selectedProductId || undefined}
              />
            </div>
          </div>
        )}
      </SidebarLayout>
    </PageTransition>
  );
};

export default ProductionUpload;
