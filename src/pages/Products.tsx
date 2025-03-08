
import React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageTransition } from "@/components/layout/PageTransition";
import { ProductSettings } from "@/components/settings/sections/ProductSettings";

function ProductsPage() {
  return (
    <MainLayout>
      <PageTransition>
        <div className="container py-10">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Products</h1>
            <p className="text-muted-foreground">
              Manage your products, pricing, and related settings
            </p>
          </div>
          
          <ProductSettings />
        </div>
      </PageTransition>
    </MainLayout>
  );
}

export default ProductsPage;
