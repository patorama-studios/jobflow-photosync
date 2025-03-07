
import React, { useState } from "react";
import { Package, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProductOverride } from "./types";

interface ProductOverridesProps {
  productOverrides: ProductOverride[];
  onAddProductOverride?: (override: Omit<ProductOverride, 'id' | 'created_at'>) => Promise<any>;
  isLoading?: boolean;
  clientId?: string;
  customAddComponent?: React.ReactNode;
}

export function ProductOverrides({ 
  productOverrides, 
  onAddProductOverride, 
  isLoading = false,
  clientId,
  customAddComponent
}: ProductOverridesProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newOverride, setNewOverride] = useState({
    name: '',
    standard_price: '',
    override_price: '',
  });
  
  // Calculate discount percentage
  const calculateDiscount = (standard: number, override: number): string => {
    if (standard <= 0) return '0%';
    const discount = ((standard - override) / standard) * 100;
    return `${discount.toFixed(2)}%`;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onAddProductOverride) return;
    
    const standardPrice = Number(newOverride.standard_price);
    const overridePrice = Number(newOverride.override_price);
    const discount = calculateDiscount(standardPrice, overridePrice);
    
    try {
      await onAddProductOverride({
        client_id: clientId || '', // Will be added by the hook
        name: newOverride.name,
        standard_price: standardPrice,
        override_price: overridePrice,
        discount
      });
      
      setIsDialogOpen(false);
      // Reset form
      setNewOverride({
        name: '',
        standard_price: '',
        override_price: '',
      });
    } catch (error) {
      console.error("Failed to add product override:", error);
    }
  };

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>Product Overrides</CardTitle>
        <CardDescription>
          Custom pricing and product configurations for this client.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <p className="text-muted-foreground">Loading product overrides...</p>
          </div>
        ) : productOverrides.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8">
            <p className="text-muted-foreground mb-4">No product overrides configured for this client.</p>
            {customAddComponent ? (
              customAddComponent
            ) : onAddProductOverride && (
              <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add First Product Override
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead className="text-right">Standard Price</TableHead>
                  <TableHead className="text-right">Custom Price</TableHead>
                  <TableHead className="text-right">Discount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {productOverrides.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{product.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">${product.standard_price.toFixed(2)}</TableCell>
                    <TableCell className="text-right">${product.override_price.toFixed(2)}</TableCell>
                    <TableCell className="text-right text-green-600">{product.discount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        
        {productOverrides.length > 0 && (
          <div className="mt-4 flex justify-end">
            {customAddComponent || (onAddProductOverride && (
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product Override
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Product Override</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="name">Product Name</Label>
                        <Input 
                          id="name" 
                          value={newOverride.name}
                          onChange={e => setNewOverride({...newOverride, name: e.target.value})}
                          placeholder="Premium Photography Package"
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="standard_price">Standard Price ($)</Label>
                        <Input 
                          id="standard_price" 
                          type="number"
                          value={newOverride.standard_price}
                          onChange={e => setNewOverride({...newOverride, standard_price: e.target.value})}
                          placeholder="1200"
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="override_price">Override Price ($)</Label>
                        <Input 
                          id="override_price" 
                          type="number"
                          value={newOverride.override_price}
                          onChange={e => setNewOverride({...newOverride, override_price: e.target.value})}
                          placeholder="1000"
                          required
                        />
                      </div>
                      
                      {newOverride.standard_price && newOverride.override_price && (
                        <div className="text-sm text-muted-foreground">
                          Calculated discount: {calculateDiscount(
                            Number(newOverride.standard_price), 
                            Number(newOverride.override_price)
                          )}
                        </div>
                      )}
                    </div>
                    <DialogFooter>
                      <Button type="submit">Add Override</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
