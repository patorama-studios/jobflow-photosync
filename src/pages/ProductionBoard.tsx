
import { PageTransition } from "@/components/layout/PageTransition";
import { MainLayout } from "@/components/layout/MainLayout";
import { ProductionBoardView } from "@/components/production/ProductionBoardView";

const ProductionBoard = () => {
  return (
    <MainLayout>
      <PageTransition>
        <ProductionBoardView />
      </PageTransition>
    </MainLayout>
  );
};

export default ProductionBoard;
