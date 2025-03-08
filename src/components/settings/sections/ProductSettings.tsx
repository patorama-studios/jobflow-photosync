
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductsList } from "../products/ProductsList";
import { AddOnsList } from "../products/AddOnsList";
import { ProductOverrides } from "../products/ProductOverrides";
import { SubscriptionProducts } from "../products/SubscriptionProducts";
import { TaxSettings } from "../products/TaxSettings";
import { CouponCodes } from "../products/CouponCodes";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ProductDialog } from "../products/dialogs/ProductDialog";

export function ProductSettings() {
  const [activeTab, setActiveTab] = useState("main-products");
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [productType, setProductType] = useState<"main" | "addon">("main");

  const handleAddProduct = (type: "main" | "addon") => {
    setProductType(type);
    setIsProductDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Product Management</h2>
        <p className="text-muted-foreground">
          Manage your products, pricing, and related settings
        </p>
      </div>

      <Tabs defaultValue="main-products" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="main-products">Main Products</TabsTrigger>
            <TabsTrigger value="add-ons">Add-Ons</TabsTrigger>
            <TabsTrigger value="overrides">Product Overrides</TabsTrigger>
            <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
            <TabsTrigger value="taxes">Tax Settings</TabsTrigger>
            <TabsTrigger value="coupons">Coupon Codes</TabsTrigger>
          </TabsList>
          
          {(activeTab === "main-products" || activeTab === "add-ons") && (
            <Button 
              onClick={() => handleAddProduct(activeTab === "main-products" ? "main" : "addon")}
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add {activeTab === "main-products" ? "Product" : "Add-On"}
            </Button>
          )}
        </div>

        <TabsContent value="main-products" className="mt-6">
          <ProductsList />
        </TabsContent>
        
        <TabsContent value="add-ons" className="mt-6">
          <AddOnsList />
        </TabsContent>
        
        <TabsContent value="overrides" className="mt-6">
          <ProductOverrides />
        </TabsContent>
        
        <TabsContent value="subscriptions" className="mt-6">
          <SubscriptionProducts />
        </TabsContent>
        
        <TabsContent value="taxes" className="mt-6">
          <TaxSettings />
        </TabsContent>
        
        <TabsContent value="coupons" className="mt-6">
          <CouponCodes />
        </TabsContent>
      </Tabs>

      <ProductDialog 
        open={isProductDialogOpen} 
        onOpenChange={setIsProductDialogOpen}
        productType={productType}
      />
    </div>
  );
}
