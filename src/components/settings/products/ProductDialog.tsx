
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Plus, Trash } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface ProductVariant {
  id: string;
  name: string;
  price: number;
  duration: number;
  payoutAmount: number;
  payoutType: "percentage" | "fixed";
}

interface ProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productType: "main" | "addon";
  editProduct?: Product;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  isServiceable: boolean;
  hasVariants: boolean;
  price?: number;
  duration?: number;
  defaultPayout?: number;
  defaultPayoutType?: "percentage" | "fixed";
  variants?: ProductVariant[];
  type: "main" | "addon";
  imageUrl?: string;
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
            <div className="space-y-2">
              <Label htmlFor="title">Product Title</Label>
              <Input
                id="title"
                value={product.title}
                onChange={(e) => setProduct({ ...product, title: e.target.value })}
                placeholder="Enter product title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Product Description</Label>
              <Textarea
                id="description"
                value={product.description}
                onChange={(e) => setProduct({ ...product, description: e.target.value })}
                placeholder="Enter product description"
                className="min-h-[100px]"
              />
            </div>

            <div className="flex items-center justify-between border-t pt-4">
              <div>
                <Label htmlFor="isServiceable" className="block mb-1">Serviceable Product</Label>
                <p className="text-sm text-muted-foreground">
                  Can be booked with a specific time duration
                </p>
              </div>
              <Switch
                id="isServiceable"
                checked={product.isServiceable}
                onCheckedChange={(checked) => setProduct({ ...product, isServiceable: checked })}
              />
            </div>

            <div className="border-t pt-4">
              <Label className="block mb-4">Product Structure</Label>
              <RadioGroup
                value={product.hasVariants ? "variants" : "single"}
                onValueChange={(value) => setProduct({ ...product, hasVariants: value === "variants" })}
                className="space-y-4"
              >
                <div className="flex items-start space-x-2">
                  <RadioGroupItem value="single" id="single" />
                  <div>
                    <Label htmlFor="single" className="block mb-1">Single Product Option</Label>
                    <p className="text-sm text-muted-foreground">
                      Simple product with one price, duration, and payout rate
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2">
                  <RadioGroupItem value="variants" id="variants" />
                  <div>
                    <Label htmlFor="variants" className="block mb-1">Product Variants</Label>
                    <p className="text-sm text-muted-foreground">
                      Multiple variations with different prices, durations, and payout rates
                    </p>
                  </div>
                </div>
              </RadioGroup>
            </div>

            {!product.hasVariants && (
              <div className="border-t pt-4 space-y-4">
                <h3 className="text-base font-medium">Product Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price ($)</Label>
                    <Input
                      id="price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={product.price || ''}
                      onChange={(e) => setProduct({ ...product, price: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                  
                  {product.isServiceable && (
                    <div className="space-y-2">
                      <Label htmlFor="duration">Duration (minutes)</Label>
                      <Input
                        id="duration"
                        type="number"
                        min="1"
                        value={product.duration || ''}
                        onChange={(e) => setProduct({ ...product, duration: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="defaultPayoutType">Payout Type</Label>
                    <RadioGroup
                      id="defaultPayoutType"
                      value={product.defaultPayoutType || 'percentage'}
                      onValueChange={(value: "percentage" | "fixed") => 
                        setProduct({ ...product, defaultPayoutType: value })}
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="percentage" id="percentage" />
                        <Label htmlFor="percentage">Percentage</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="fixed" id="fixed" />
                        <Label htmlFor="fixed">Fixed Amount</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="defaultPayout">
                      {product.defaultPayoutType === "percentage" ? "Payout Percentage (%)" : "Fixed Payout Amount ($)"}
                    </Label>
                    <Input
                      id="defaultPayout"
                      type="number"
                      min="0"
                      step={product.defaultPayoutType === "percentage" ? "1" : "0.01"}
                      max={product.defaultPayoutType === "percentage" ? "100" : undefined}
                      value={product.defaultPayout || ''}
                      onChange={(e) => setProduct({ ...product, defaultPayout: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                </div>
              </div>
            )}

            {product.hasVariants && (
              <div className="border-t pt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-medium">Product Variants</h3>
                  <Button type="button" variant="outline" size="sm" onClick={handleAddVariant}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Variant
                  </Button>
                </div>
                
                {variants.length === 0 && (
                  <div className="text-center p-4 border rounded-md bg-muted/50">
                    <p className="text-muted-foreground">No variants added. Click "Add Variant" to create one.</p>
                  </div>
                )}
                
                {variants.map((variant, index) => (
                  <div key={variant.id} className="border rounded-md p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Variant {index + 1}</h4>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        className="text-destructive"
                        onClick={() => handleRemoveVariant(variant.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`variant-name-${variant.id}`}>Variant Name</Label>
                        <Input
                          id={`variant-name-${variant.id}`}
                          value={variant.name}
                          onChange={(e) => handleUpdateVariant(variant.id, 'name', e.target.value)}
                          placeholder="e.g., Basic, Premium, etc."
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`variant-price-${variant.id}`}>Price ($)</Label>
                        <Input
                          id={`variant-price-${variant.id}`}
                          type="number"
                          min="0"
                          step="0.01"
                          value={variant.price}
                          onChange={(e) => handleUpdateVariant(variant.id, 'price', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      
                      {product.isServiceable && (
                        <div className="space-y-2">
                          <Label htmlFor={`variant-duration-${variant.id}`}>Duration (minutes)</Label>
                          <Input
                            id={`variant-duration-${variant.id}`}
                            type="number"
                            min="1"
                            value={variant.duration}
                            onChange={(e) => handleUpdateVariant(variant.id, 'duration', parseInt(e.target.value) || 0)}
                          />
                        </div>
                      )}
                      
                      <div className="space-y-2">
                        <Label htmlFor={`variant-payout-type-${variant.id}`}>Payout Type</Label>
                        <RadioGroup
                          id={`variant-payout-type-${variant.id}`}
                          value={variant.payoutType}
                          onValueChange={(value: "percentage" | "fixed") => 
                            handleUpdateVariant(variant.id, 'payoutType', value)}
                          className="flex space-x-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="percentage" id={`percentage-${variant.id}`} />
                            <Label htmlFor={`percentage-${variant.id}`}>Percentage</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="fixed" id={`fixed-${variant.id}`} />
                            <Label htmlFor={`fixed-${variant.id}`}>Fixed Amount</Label>
                          </div>
                        </RadioGroup>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`variant-payout-${variant.id}`}>
                          {variant.payoutType === "percentage" ? "Payout Percentage (%)" : "Fixed Payout Amount ($)"}
                        </Label>
                        <Input
                          id={`variant-payout-${variant.id}`}
                          type="number"
                          min="0"
                          step={variant.payoutType === "percentage" ? "1" : "0.01"}
                          max={variant.payoutType === "percentage" ? "100" : undefined}
                          value={variant.payoutAmount}
                          onChange={(e) => handleUpdateVariant(
                            variant.id, 
                            'payoutAmount', 
                            parseFloat(e.target.value) || 0
                          )}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
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
