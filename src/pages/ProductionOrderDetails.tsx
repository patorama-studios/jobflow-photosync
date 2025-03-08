
import { PageTransition } from "@/components/layout/PageTransition";
import MainLayout from "@/components/layout/MainLayout";
import { OrderDetailsView } from "@/components/production/OrderDetailsView";
import { useParams } from "react-router-dom";

const ProductionOrderDetails = () => {
  const { orderId } = useParams();
  
  return (
    <MainLayout>
      <PageTransition>
        <OrderDetailsView orderId={orderId} />
      </PageTransition>
    </MainLayout>
  );
};

export default ProductionOrderDetails;
