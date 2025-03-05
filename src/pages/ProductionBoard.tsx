
import { PageTransition } from "@/components/layout/PageTransition";
import { SidebarLayout } from "@/components/layout/SidebarLayout";
import { ProductionBoardView } from "@/components/production/ProductionBoardView";

const ProductionBoard = () => {
  return (
    <PageTransition>
      <SidebarLayout>
        <ProductionBoardView />
      </SidebarLayout>
    </PageTransition>
  );
};

export default ProductionBoard;
