
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ProductFormGeneral } from "./ProductFormGeneral";
import { ProductVariantsList } from "./ProductVariantsList";
import { ProductSingleDetails } from "./ProductSingleDetails";
import { Product, ProductVariant } from "../types/product-types";

interface ProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productType: "main" | "addon";
  editProduct?: Product;
}

export function ProductDialog({ open, onOpenChange, productType, editProduct }: ProductDialogProps) {
  const { toast } = useToast();
  const isEditing = !!editProduct;
  
  const [product, setProduct] = useState<Partial<Product>>(
    editProduct || {
      title: "",
      description: "",
      isServiceable: true,
      hasVariants: false,
      type: productType,
      price: 0,
      duration: 60,
      defaultPayout: 70,
      defaultPayoutType: "percentage",
      variants: [],
    }
  );

  const [variants, setVariants] = useState<ProductVariant[]>(
    editProduct?.variants || []
  );

  const handleAddVariant = () => {
    const newVariant: ProductVariant = {
      id: Math.random().toString(36).substring(2, 9),
      name: "",
      price: 0,
      duration: 60,
      payoutAmount: 70,
      payoutType: "percentage",
    };
    setVariants([...variants, newVariant]);
  };

  const handleUpdateVariant = (id: string, field: keyof ProductVariant, value: any) => {
    setVariants(
      variants.map(variant => 
        variant.id === id ? { ...variant, [field]: value } : variant
      )
    );
  };

  const handleRemoveVariant = (id: string) => {
    setVariants(variants.filter(variant => variant.id !== id));
  };

  const handleSave = () => {
    if (!product.title) {
      toast({
        title: "Missing information",
        description: "Please enter a product title",
        variant: "destructive",
      });
      return;
    }

    if (product.hasVariants && variants.length === 0) {
      toast({
        title: "Missing variants",
        description: "Please add at least one variant or disable variants",
        variant: "destructive",
      });
      return;
    }

    if (product.hasVariants) {
      // Check for empty variant names
      const hasEmptyVariantNames = variants.some(v => !v.name);
      if (hasEmptyVariantNames) {
        toast({
          title: "Incomplete variants",
          description: "Please ensure all variants have names",
          variant: "destructive",
        });
        return;
      }
    }

    // Save product logic would go here
    // For now, we'll just show a success message
    toast({
      title: isEditing ? "Product updated" : "Product created",
      description: `${product.title} has been ${isEditing ? "updated" : "added"} successfully`,
    });
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Product" : `Add New ${productType === "main" ? "Product" : "Add-On"}`}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="grid grid-cols-1 gap-4">
            <ProductFormGeneral 
              product={product}
              setProduct={setProduct}
            />

            {!product.hasVariants && (
              <ProductSingleDetails
                product={product}
                setProduct={setProduct}
              />
            )}

            {product.hasVariants && (
              <ProductVariantsList
                product={product}
                variants={variants}
                onAddVariant={handleAddVariant}
                onUpdateVariant={handleUpdateVariant}
                onRemoveVariant={handleRemoveVariant}
              />
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            {isEditing ? "Update Product" : "Create Product"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
