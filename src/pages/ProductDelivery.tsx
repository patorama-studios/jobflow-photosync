
import { PageTransition } from "@/components/layout/PageTransition";
import { SidebarLayout } from "@/components/layout/SidebarLayout";
import { ProductDeliveryView } from "@/components/delivery/ProductDeliveryView";
import { useParams } from "react-router-dom";

const ProductDelivery = () => {
  const { orderId } = useParams();
  
  return (
    <PageTransition>
      <SidebarLayout>
        <ProductDeliveryView orderId={orderId} />
      </SidebarLayout>
    </PageTransition>
  );
};

export default ProductDelivery;
