
import { PageTransition } from "@/components/layout/PageTransition";
import { SidebarLayout } from "@/components/layout/SidebarLayout";
import { OrderDetailsView } from "@/components/production/OrderDetailsView";
import { useParams } from "react-router-dom";

const ProductionOrderDetails = () => {
  const { orderId } = useParams();
  
  return (
    <PageTransition>
      <SidebarLayout>
        <OrderDetailsView orderId={orderId} />
      </SidebarLayout>
    </PageTransition>
  );
};

export default ProductionOrderDetails;
