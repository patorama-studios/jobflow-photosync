
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageTransition } from "@/components/layout/PageTransition";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Edit, Trash, Plus, Tag, Package, DollarSign, Check, Info } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  is_active: boolean;
  esoft_products: string[];
  created_at: string;
  updated_at: string;
}

// Available Esoft products
const ESOFT_PRODUCTS = [
  "Day to Dusk",
  "Photo Retouching",
  "Item Removal",
  "Virtual Staging",
  "Floor Plans",
  "Virtual Renovation",
  "Commercial Photography",
  "Aerial Photography",
  "Property Videos",
  "3D Tours",
];

function ProductsPage() {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [esoftProducts, setEsoftProducts] = useState<string[]>([]);
  const [selectedEsoftProduct, setSelectedEsoftProduct] = useState<string>("");

  // Fetch products
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("name");

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast({
        title: "Error",
        description: "Failed to load products",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setPrice("");
    setIsActive(true);
    setEsoftProducts([]);
    setEditingProduct(null);
  };

  const handleAddClick = () => {
    resetForm();
    setDialogOpen(true);
  };

  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
    setName(product.name);
    setDescription(product.description || "");
    setPrice(product.price.toString());
    setIsActive(product.is_active);
    setEsoftProducts(product.esoft_products || []);
    setDialogOpen(true);
  };

  const handleDeleteClick = async (id: string) => {
    try {
      const { error } = await supabase.from("products").delete().eq("id", id);

      if (error) throw error;

      setProducts(products.filter((product) => product.id !== id));
      toast({
        title: "Product Deleted",
        description: "Product has been successfully deleted",
      });
    } catch (error) {
      console.error("Error deleting product:", error);
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      });
    }
  };

  const addEsoftProduct = () => {
    if (selectedEsoftProduct && !esoftProducts.includes(selectedEsoftProduct)) {
      setEsoftProducts([...esoftProducts, selectedEsoftProduct]);
      setSelectedEsoftProduct("");
    }
  };

  const removeEsoftProduct = (productToRemove: string) => {
    setEsoftProducts(esoftProducts.filter(p => p !== productToRemove));
  };

  const handleSubmit = async () => {
    try {
      if (!name || !price) {
        toast({
          title: "Validation Error",
          description: "Name and price are required",
          variant: "destructive",
        });
        return;
      }

      const parsedPrice = parseFloat(price);
      if (isNaN(parsedPrice) || parsedPrice < 0) {
        toast({
          title: "Validation Error",
          description: "Price must be a valid number greater than or equal to 0",
          variant: "destructive",
        });
        return;
      }

      const productData = {
        name,
        description: description || null,
        price: parsedPrice,
        is_active: isActive,
        esoft_products: esoftProducts,
        updated_at: new Date().toISOString(),
      };

      if (editingProduct) {
        // Update existing product
        const { error } = await supabase
          .from("products")
          .update(productData)
          .eq("id", editingProduct.id);

        if (error) throw error;

        setProducts(
          products.map((p) => (p.id === editingProduct.id ? { ...p, ...productData } : p))
        );

        toast({
          title: "Product Updated",
          description: "Product has been successfully updated",
        });
      } else {
        // Create new product
        const { data, error } = await supabase
          .from("products")
          .insert(productData)
          .select();

        if (error) throw error;

        if (data) {
          setProducts([...products, data[0]]);
        }

        toast({
          title: "Product Created",
          description: "New product has been successfully created",
        });
      }

      setDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error saving product:", error);
      toast({
        title: "Error",
        description: "Failed to save product",
        variant: "destructive",
      });
    }
  };

  return (
    <MainLayout>
      <PageTransition>
        <div className="container py-10">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Products</h1>
              <p className="text-muted-foreground">
                Manage your products and services
              </p>
            </div>
            <Button onClick={handleAddClick}>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Products List</CardTitle>
              <CardDescription>
                View and manage all available products
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8 text-muted-foreground">
                  Loading products...
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Esoft Products</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="text-center py-6 text-muted-foreground"
                        >
                          No products found
                        </TableCell>
                      </TableRow>
                    ) : (
                      products.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell className="font-medium">
                            {product.name}
                          </TableCell>
                          <TableCell>
                            {product.description || "-"}
                          </TableCell>
                          <TableCell>
                            ${product.price.toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={product.is_active ? "outline" : "secondary"}
                              className={
                                product.is_active
                                  ? "bg-green-100 text-green-800 border-green-200"
                                  : "bg-gray-100 text-gray-800"
                              }
                            >
                              {product.is_active ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {product.esoft_products && product.esoft_products.length > 0 ? (
                                product.esoft_products.map((esoftProduct) => (
                                  <Badge key={esoftProduct} variant="secondary" className="text-xs">
                                    {esoftProduct}
                                  </Badge>
                                ))
                              ) : (
                                <span className="text-muted-foreground text-sm">None</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEditClick(product)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteClick(product.id)}
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>
                  {editingProduct ? "Edit Product" : "Add Product"}
                </DialogTitle>
                <DialogDescription>
                  {editingProduct
                    ? "Update the details of this product"
                    : "Add a new product to your catalog"}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Real Estate Photography Package"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description (optional)</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter product description"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0.00"
                  />
                </div>
                <div className="flex items-center space-x-2 pt-2">
                  <Switch
                    id="isActive"
                    checked={isActive}
                    onCheckedChange={setIsActive}
                  />
                  <Label htmlFor="isActive">Active</Label>
                </div>
                
                <div className="space-y-2 pt-4">
                  <Label>Esoft Products</Label>
                  <div className="flex gap-2">
                    <Select value={selectedEsoftProduct} onValueChange={setSelectedEsoftProduct}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Esoft product" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Esoft Products</SelectLabel>
                          {ESOFT_PRODUCTS.map((product) => (
                            <SelectItem key={product} value={product}>
                              {product}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <Button 
                      type="button" 
                      onClick={addEsoftProduct}
                      disabled={!selectedEsoftProduct}
                    >
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {esoftProducts.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No Esoft products selected</p>
                    ) : (
                      esoftProducts.map((product) => (
                        <Badge key={product} variant="secondary" className="px-2 py-1">
                          {product}
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-4 w-4 ml-1 p-0" 
                            onClick={() => removeEsoftProduct(product)}
                          >
                            <Trash className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    <Info className="h-3 w-3 inline-block mr-1" /> 
                    Link this product to Esoft products for easier order management
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSubmit}>
                  {editingProduct ? "Update Product" : "Create Product"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </PageTransition>
    </MainLayout>
  );
}

export default ProductsPage;
