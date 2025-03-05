
import { PageTransition } from "@/components/layout/PageTransition";
import { SidebarLayout } from "@/components/layout/SidebarLayout";
import { UploadFormView } from "@/components/production/UploadFormView";
import { useParams, useLocation } from "react-router-dom";

const ProductionUpload = () => {
  const { orderId } = useParams();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const productType = searchParams.get('product');
  
  return (
    <PageTransition>
      <SidebarLayout>
        <UploadFormView orderId={orderId} initialProductType={productType || undefined} />
      </SidebarLayout>
    </PageTransition>
  );
};

export default ProductionUpload;
