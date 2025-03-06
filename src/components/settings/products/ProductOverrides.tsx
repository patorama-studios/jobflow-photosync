
import React, { useState } from "react";
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
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

// Sample data
const sampleOverrides: ProductOverride[] = [
  {
    id: "override-1",
    name: "Agency Partner Discount",
    companyId: "company-1",
    companyName: "ABC Realty",
    overriddenProducts: [
      {
        productId: "prod-1",
        productName: "Standard Photo Package",
        regularPrice: 149,
        overridePrice: 129
      },
      {
        productId: "prod-2",
        productName: "Virtual Tour",
        regularPrice: 149,
        overridePrice: 129
      }
    ]
  },
  {
    id: "override-2",
    name: "Premium Partner Discount",
    companyId: "company-2", 
    companyName: "XYZ Properties",
    overriddenProducts: [
      {
        productId: "prod-1",
        productName: "Standard Photo Package",
        regularPrice: 149,
        overridePrice: 119
      },
      {
        productId: "prod-3",
        productName: "Floor Plan",
        regularPrice: 75,
        overridePrice: 60
      }
    ]
  }
];

// Sample companies for select dropdown
const sampleCompanies = [
  { id: "company-1", name: "ABC Realty" },
  { id: "company-2", name: "XYZ Properties" },
  { id: "company-3", name: "123 Real Estate" },
  { id: "company-4", name: "City View Homes" },
];

// Sample products for select dropdown
const sampleProducts = [
  { id: "prod-1", name: "Standard Photo Package", price: 149 },
  { id: "prod-2", name: "Virtual Tour", price: 149 },
  { id: "prod-3", name: "Floor Plan", price: 75 },
  { id: "addon-1", name: "Twilight Photos", price: 99 },
  { id: "addon-2", name: "Aerial Photography", price: 149 },
];

export function ProductOverrides() {
  const { toast } = useToast();
  const [overrides, setOverrides] = useState<ProductOverride[]>(sampleOverrides);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOverride, setEditingOverride] = useState<ProductOverride | null>(null);
  
  const [newOverride, setNewOverride] = useState<Partial<ProductOverride>>({
    name: "",
    companyId: "",
    overriddenProducts: []
  });
  
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [overridePrice, setOverridePrice] = useState<string>("");

  const handleEditOverride = (override: ProductOverride) => {
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

  const handleDeleteOverride = (id: string) => {
    setOverrides(overrides.filter(override => override.id !== id));
    toast({
      title: "Override deleted",
      description: "The product override has been removed"
    });
  };

  const handleAddProduct = () => {
    if (!selectedProductId || !overridePrice) {
      toast({
        title: "Missing information",
        description: "Please select a product and enter an override price",
        variant: "destructive"
      });
      return;
    }

    const product = sampleProducts.find(p => p.id === selectedProductId);
    if (!product) return;

    // Check if product is already in the list
    const exists = newOverride.overriddenProducts?.some(p => p.productId === selectedProductId);
    if (exists) {
      toast({
        title: "Product already added",
        description: "This product is already in the override list",
        variant: "destructive"
      });
      return;
    }

    const price = parseFloat(overridePrice);
    if (isNaN(price) || price <= 0) {
      toast({
        title: "Invalid price",
        description: "Please enter a valid price greater than zero",
        variant: "destructive"
      });
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

  const handleSaveOverride = () => {
    if (!newOverride.name || !newOverride.companyId || !newOverride.overriddenProducts?.length) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields and add at least one product",
        variant: "destructive"
      });
      return;
    }

    const company = sampleCompanies.find(c => c.id === newOverride.companyId);
    if (!company) return;

    if (editingOverride) {
      // Update existing override
      setOverrides(overrides.map(override => 
        override.id === editingOverride.id 
          ? {
              ...override,
              name: newOverride.name || "",
              companyId: newOverride.companyId || "",
              companyName: company.name,
              overriddenProducts: newOverride.overriddenProducts || []
            }
          : override
      ));
      
      toast({
        title: "Override updated",
        description: `${newOverride.name} has been updated successfully`
      });
    } else {
      // Create new override
      const newId = Math.random().toString(36).substring(2, 9);
      setOverrides([
        ...overrides,
        {
          id: newId,
          name: newOverride.name || "",
          companyId: newOverride.companyId || "",
          companyName: company.name,
          overriddenProducts: newOverride.overriddenProducts || []
        }
      ]);
      
      toast({
        title: "Override created",
        description: `${newOverride.name} has been created successfully`
      });
    }

    setIsDialogOpen(false);
  };

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
                    {sampleCompanies.map((company) => (
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
                      {sampleProducts.map((product) => (
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
            <Button onClick={handleSaveOverride}>
              {editingOverride ? "Update Override" : "Create Override"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
