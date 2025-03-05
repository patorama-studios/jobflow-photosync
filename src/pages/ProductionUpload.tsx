
import { PageTransition } from "@/components/layout/PageTransition";
import { SidebarLayout } from "@/components/layout/SidebarLayout";
import { UploadFormView } from "@/components/production/UploadFormView";
import { BoxFolderIntegration } from "@/components/production/BoxFolderIntegration";
import { useParams, useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ProductionUpload = () => {
  const { orderId } = useParams();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const productType = searchParams.get('product');
  
  // Mock order data - in a real app this would be fetched based on orderId
  const orderData = {
    orderNumber: orderId || "1234",
    propertyAddress: "123 Main Street, Cityville",
    client: "Example Realty",
    photographer: "John Smith",
    scheduledDate: new Date().toISOString(),
  };
  
  return (
    <PageTransition>
      <SidebarLayout>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <UploadFormView orderId={orderId} initialProductType={productType || undefined} />
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
                    <span className="font-medium">{orderData.orderNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Property:</span>
                    <span className="font-medium">{orderData.propertyAddress}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Client:</span>
                    <span className="font-medium">{orderData.client}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Photographer:</span>
                    <span className="font-medium">{orderData.photographer}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <BoxFolderIntegration 
              orderNumber={orderData.orderNumber}
              propertyAddress={orderData.propertyAddress}
              productType={productType || undefined}
            />
          </div>
        </div>
      </SidebarLayout>
    </PageTransition>
  );
};

export default ProductionUpload;
