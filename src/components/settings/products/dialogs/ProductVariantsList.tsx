
import React from "react";
import { Plus, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Product, ProductVariant } from "../types/product-types";

interface ProductVariantsListProps {
  product: Partial<Product>;
  variants: ProductVariant[];
  onAddVariant: () => void;
  onUpdateVariant: (id: string, field: keyof ProductVariant, value: any) => void;
  onRemoveVariant: (id: string) => void;
}

export function ProductVariantsList({ 
  product, 
  variants, 
  onAddVariant, 
  onUpdateVariant, 
  onRemoveVariant 
}: ProductVariantsListProps) {
  return (
    <div className="border-t pt-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-medium">Product Variants</h3>
        <Button type="button" variant="outline" size="sm" onClick={onAddVariant}>
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
        <ProductVariantItem 
          key={variant.id}
          variant={variant}
          index={index}
          isServiceable={product.isServiceable}
          onUpdateVariant={onUpdateVariant}
          onRemoveVariant={onRemoveVariant}
        />
      ))}
    </div>
  );
}

interface ProductVariantItemProps {
  variant: ProductVariant;
  index: number;
  isServiceable?: boolean;
  onUpdateVariant: (id: string, field: keyof ProductVariant, value: any) => void;
  onRemoveVariant: (id: string) => void;
}

function ProductVariantItem({ 
  variant, 
  index, 
  isServiceable, 
  onUpdateVariant, 
  onRemoveVariant 
}: ProductVariantItemProps) {
  return (
    <div className="border rounded-md p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium">Variant {index + 1}</h4>
        <Button 
          type="button" 
          variant="ghost" 
          size="sm" 
          className="text-destructive"
          onClick={() => onRemoveVariant(variant.id)}
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
            onChange={(e) => onUpdateVariant(variant.id, 'name', e.target.value)}
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
            onChange={(e) => onUpdateVariant(variant.id, 'price', parseFloat(e.target.value) || 0)}
          />
        </div>
        
        {isServiceable && (
          <div className="space-y-2">
            <Label htmlFor={`variant-duration-${variant.id}`}>Duration (minutes)</Label>
            <Input
              id={`variant-duration-${variant.id}`}
              type="number"
              min="1"
              value={variant.duration}
              onChange={(e) => onUpdateVariant(variant.id, 'duration', parseInt(e.target.value) || 0)}
            />
          </div>
        )}
        
        <div className="space-y-2">
          <Label htmlFor={`variant-payout-type-${variant.id}`}>Payout Type</Label>
          <RadioGroup
            id={`variant-payout-type-${variant.id}`}
            value={variant.payoutType}
            onValueChange={(value: "percentage" | "fixed") => 
              onUpdateVariant(variant.id, 'payoutType', value)}
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
            onChange={(e) => onUpdateVariant(
              variant.id, 
              'payoutAmount', 
              parseFloat(e.target.value) || 0
            )}
          />
        </div>
      </div>
    </div>
  );
}
