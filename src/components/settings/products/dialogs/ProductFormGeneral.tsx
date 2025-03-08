
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Product } from "../types/product-types";

interface ProductFormGeneralProps {
  product: Partial<Product>;
  setProduct: React.Dispatch<React.SetStateAction<Partial<Product>>>;
}

export function ProductFormGeneral({ product, setProduct }: ProductFormGeneralProps) {
  return (
    <>
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
    </>
  );
}
