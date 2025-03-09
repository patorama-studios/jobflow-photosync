
import React, { useState, useEffect } from "react";
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash, Plus, Building } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { useProducts } from "@/hooks/use-products";

interface Company {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
}

interface ProductOverride {
  id: string;
  name: string;
  companyId: string;
  companyName: string;
  overriddenProducts: Array<{
    productId: string;
    productName: string;
    regularPrice: number;
    overridePrice: number;
  }>;
}

export function ProductOverrides() {
  const { products } = useProducts();
  const [overrides, setOverrides] = useState<ProductOverride[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOverride, setEditingOverride] = useState<ProductOverride | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  
  const [newOverride, setNewOverride] = useState<Partial<ProductOverride>>({
    name: "",
    companyId: "",
    overriddenProducts: []
  });
  
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [overridePrice, setOverridePrice] = useState<string>("");

  useEffect(() => {
    fetchCompanies();
    fetchOverrides();
  }, []);

  useEffect(() => {
    if (products && products.length > 0) {
      const formattedProducts = products.map(product => ({
        id: product.id,
        name: product.name,
        price: product.price
      }));
      setAvailableProducts(formattedProducts);
    }
  }, [products]);

  const fetchCompanies = async () => {
    try {
      console.log("Fetching companies from Supabase...");
      const { data, error } = await supabase
        .from('companies')
        .select('id, name')
        .order('name');

      if (error) {
        throw error;
      }

      console.log("Fetched companies:", data);
      setCompanies(data || []);
    } catch (error) {
      console.error("Error fetching companies:", error);
      toast.error("Failed to load companies");
    }
  };

  const fetchOverrides = async () => {
    setIsLoading(true);
    try {
      console.log("Fetching product overrides from Supabase...");
      const { data, error } = await supabase
        .from('product_overrides')
        .select(`
          id,
          name,
          client_id,
          override_price,
          standard_price,
          discount,
          companies (name)
        `);

      if (error) {
        throw error;
      }

      console.log("Fetched product overrides:", data);

      // Group overrides by company
      const groupedOverrides = data.reduce((acc, curr) => {
        const companyId = curr.client_id;
        const companyName = curr.companies ? curr.companies.name : 'Unknown Company';
        
        // Find or create the override for this company
        let override = acc.find(o => o.companyId === companyId);
        
        if (!override) {
          override = {
            id: curr.id,
            name: curr.name || `${companyName} Override`,
            companyId,
            companyName,
            overriddenProducts: []
          };
          acc.push(override);
        }
        
        // Add this product to the override
        override.overriddenProducts.push({
          productId: curr.id,
          productName: curr.name,
          regularPrice: curr.standard_price,
          overridePrice: curr.override_price
        });
        
        return acc;
      }, [] as ProductOverride[]);
      
      setOverrides(groupedOverrides);
    } catch (error) {
      console.error("Error fetching product overrides:", error);
      toast.error("Failed to load product overrides");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditOverride = (override: ProductOverride) => {
    console.log("Editing override:", override);
    setEditingOverride(override);
    setNewOverride({
      name: override.name,
      companyId: override.companyId,
      overriddenProducts: [...override.overriddenProducts]
    });
    setIsDialogOpen(true);
  };

  const handleAddOverride = () => {
    setEditingOverride(null);
    setNewOverride({
      name: "",
      companyId: "",
      overriddenProducts: []
    });
    setIsDialogOpen(true);
  };

  const handleDeleteOverride = async (id: string) => {
    console.log("Deleting override with ID:", id);
    setIsDeleting(id);
    
    try {
      // Find the override to get all product IDs
      const override = overrides.find(o => o.id === id);
      if (!override) {
        throw new Error("Override not found");
      }
      
      // Delete all product overrides for this company
      const { error } = await supabase
        .from('product_overrides')
        .delete()
        .eq('client_id', override.companyId);

      if (error) {
        throw error;
      }

      // Update local state after successful deletion
      setOverrides(overrides.filter(o => o.id !== id));
      toast.success("Product override deleted successfully");
    } catch (error) {
      console.error("Error deleting product override:", error);
      toast.error("Failed to delete product override");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleAddProduct = () => {
    if (!selectedProductId || !overridePrice) {
      toast.error("Please select a product and enter an override price");
      return;
    }

    const product = availableProducts.find(p => p.id === selectedProductId);
    if (!product) {
      toast.error("Selected product not found");
      return;
    }

    // Check if product is already in the list
    const exists = newOverride.overriddenProducts?.some(p => p.productId === selectedProductId);
    if (exists) {
      toast.error("This product is already in the override list");
      return;
    }

    const price = parseFloat(overridePrice);
    if (isNaN(price) || price <= 0) {
      toast.error("Please enter a valid price greater than zero");
      return;
    }

    setNewOverride({
      ...newOverride,
      overriddenProducts: [
        ...(newOverride.overriddenProducts || []),
        {
          productId: product.id,
          productName: product.name,
          regularPrice: product.price,
          overridePrice: price
        }
      ]
    });

    setSelectedProductId("");
    setOverridePrice("");
  };

  const handleRemoveProduct = (productId: string) => {
    setNewOverride({
      ...newOverride,
      overriddenProducts: newOverride.overriddenProducts?.filter(p => p.productId !== productId)
    });
  };

  const handleSaveOverride = async () => {
    if (!newOverride.name || !newOverride.companyId || !newOverride.overriddenProducts?.length) {
      toast.error("Please fill in all required fields and add at least one product");
      return;
    }

    const company = companies.find(c => c.id === newOverride.companyId);
    if (!company) {
      toast.error("Selected company not found");
      return;
    }

    setIsSubmitting(true);

    try {
      console.log("Saving product override:", newOverride);

      if (editingOverride) {
        // Delete existing overrides for this company
        await supabase
          .from('product_overrides')
          .delete()
          .eq('client_id', newOverride.companyId);
      }

      // Insert new overrides
      const overridesToInsert = newOverride.overriddenProducts?.map(product => {
        const discount = ((product.regularPrice - product.overridePrice) / product.regularPrice * 100).toFixed(2) + '%';
        
        return {
          client_id: newOverride.companyId,
          name: product.productName,
          standard_price: product.regularPrice,
          override_price: product.overridePrice,
          discount: discount
        };
      });

      const { data, error } = await supabase
        .from('product_overrides')
        .insert(overridesToInsert)
        .select();

      if (error) {
        throw error;
      }

      // Refresh overrides after successful save
      await fetchOverrides();
      
      toast.success(`${newOverride.name} has been ${editingOverride ? 'updated' : 'created'} successfully`);
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error saving product override:", error);
      toast.error("Failed to save product override");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium">Company-Specific Pricing</h3>
            <p className="text-sm text-muted-foreground">
              Create custom pricing for specific companies
            </p>
          </div>
          <Skeleton className="h-9 w-32" />
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Company-Specific Pricing</h3>
          <p className="text-sm text-muted-foreground">
            Create custom pricing for specific companies
          </p>
        </div>
        <Button onClick={handleAddOverride}>
          <Plus className="h-4 w-4 mr-2" />
          Add Override
        </Button>
      </div>

      {overrides.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground mb-4">No product overrides found</p>
            <Button variant="outline" size="sm" onClick={handleAddOverride}>
              Add Your First Override
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Override Name</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Products</TableHead>
              <TableHead>Savings</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {overrides.map((override) => {
              const totalRegular = override.overriddenProducts.reduce((sum, p) => sum + p.regularPrice, 0);
              const totalOverride = override.overriddenProducts.reduce((sum, p) => sum + p.overridePrice, 0);
              const savings = totalRegular - totalOverride;
              const savingsPercent = Math.round((savings / totalRegular) * 100);
              
              return (
                <TableRow key={override.id}>
                  <TableCell className="font-medium">{override.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                      {override.companyName}
                    </div>
                  </TableCell>
                  <TableCell>{override.overriddenProducts.length} products</TableCell>
                  <TableCell>
                    <span className="text-green-600 font-medium">${savings.toFixed(2)}</span>
                    <span className="text-muted-foreground text-xs ml-1">({savingsPercent}% off)</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleEditOverride(override)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-destructive"
                      onClick={() => handleDeleteOverride(override.id)}
                      disabled={isDeleting === override.id}
                    >
                      <Trash className="h-4 w-4" />
                      {isDeleting === override.id && <span className="ml-2">Deleting...</span>}
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingOverride ? "Edit Product Override" : "Create Product Override"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="override-name">Override Name</Label>
                <Input
                  id="override-name"
                  value={newOverride.name}
                  onChange={(e) => setNewOverride({...newOverride, name: e.target.value})}
                  placeholder="e.g., Agency Partner Discount"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Select
                  value={newOverride.companyId}
                  onValueChange={(value) => setNewOverride({...newOverride, companyId: value})}
                >
                  <SelectTrigger id="company">
                    <SelectValue placeholder="Select company" />
                  </SelectTrigger>
                  <SelectContent>
                    {companies.map((company) => (
                      <SelectItem key={company.id} value={company.id}>
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="text-sm font-medium mb-4">Override Products</h4>

              <div className="flex space-x-2 mb-4">
                <div className="flex-1">
                  <Select value={selectedProductId} onValueChange={setSelectedProductId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select product" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableProducts.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name} - ${product.price}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-32">
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Price"
                    value={overridePrice}
                    onChange={(e) => setOverridePrice(e.target.value)}
                  />
                </div>
                <Button type="button" onClick={handleAddProduct}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {(!newOverride.overriddenProducts || newOverride.overriddenProducts.length === 0) ? (
                <div className="text-center p-6 border rounded-md bg-muted/50">
                  <p className="text-muted-foreground">No products added to this override yet</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Regular Price</TableHead>
                      <TableHead>Override Price</TableHead>
                      <TableHead>Discount</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {newOverride.overriddenProducts.map((product) => {
                      const savings = product.regularPrice - product.overridePrice;
                      const savingsPercent = Math.round((savings / product.regularPrice) * 100);
                      
                      return (
                        <TableRow key={product.productId}>
                          <TableCell>{product.productName}</TableCell>
                          <TableCell>${product.regularPrice.toFixed(2)}</TableCell>
                          <TableCell>${product.overridePrice.toFixed(2)}</TableCell>
                          <TableCell>
                            <span className="text-green-600">${savings.toFixed(2)}</span>
                            <span className="text-xs text-muted-foreground ml-1">({savingsPercent}%)</span>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive h-8 w-8 p-0"
                              onClick={() => handleRemoveProduct(product.productId)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveOverride} disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : (editingOverride ? "Update Override" : "Create Override")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
