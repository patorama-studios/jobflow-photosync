
import React, { useState, useEffect } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2 } from "lucide-react";
import { useProducts } from "@/hooks/use-products";
import { Product } from "./types/product-types";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ProductDialog } from "./dialogs/ProductDialog";

export function ProductsList() {
  const { products, isLoading, error, refetch, deleteProduct, saveUIProduct } = useProducts();
  const [productList, setProductList] = useState<Product[]>([]);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  // Convert database products to UI products format
  useEffect(() => {
    console.log("Products in ProductsList:", products);
    if (products && products.length > 0) {
      // Simple conversion for now - in a real app, you would load detailed UI product data
      const convertedProducts: Product[] = products.map(dbProduct => ({
        id: dbProduct.id,
        title: dbProduct.name,
        description: dbProduct.description || '',
        price: dbProduct.price,
        isActive: dbProduct.is_active,
        hasVariants: false,
        isServiceable: false, // Default value
        type: "main", // Default value
        variants: []
      }));
      
      console.log("Converted products for UI:", convertedProducts);
      setProductList(convertedProducts);
    } else {
      setProductList([]);
    }
  }, [products]);

  const handleDeleteProduct = async (productId: string) => {
    console.log("Deleting product with ID:", productId);
    try {
      setIsDeleting(productId);
      // Call actual delete function from hook
      await deleteProduct(productId);
      // Update products list
      setProductList(prevList => prevList.filter(product => product.id !== productId));
      toast.success("Product deleted successfully");
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error(`Failed to delete product: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsDeleting(null);
    }
  };

  const handleEditProduct = (product: Product) => {
    console.log("Editing product:", product);
    setEditProduct(product);
    setIsEditDialogOpen(true);
  };

  const handleSaveEditedProduct = async (product: Product) => {
    console.log("Saving edited product:", product);
    try {
      await saveUIProduct(product);
      await refetch();
      setIsEditDialogOpen(false);
      setEditProduct(null);
      toast.success("Product updated successfully");
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error(`Failed to update product: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Products</CardTitle>
          <CardDescription>Manage your main products</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Products</CardTitle>
          <CardDescription>Manage your main products</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 text-red-600 bg-red-50 rounded-md">
            Error loading products. Please try again later.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Products</CardTitle>
        <CardDescription>Manage your main products</CardDescription>
      </CardHeader>
      <CardContent>
        {productList.length === 0 ? (
          <div className="text-center p-6 text-muted-foreground">
            No products found. Add your first product using the button above.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {productList.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.title}</TableCell>
                  <TableCell>${product.price?.toFixed(2) || '0.00'}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={product.isActive ? "success" : "secondary"}
                    >
                      {product.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEditProduct(product)}
                    >
                      <Pencil className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Product</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this product? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={(e) => {
                              // Prevent default to avoid closing the dialog too early
                              e.preventDefault(); 
                              if (product.id) {
                                handleDeleteProduct(product.id).then(() => {
                                  // Close the dialog after operation completes
                                  const closeButton = document.querySelector('[data-state="open"] button[data-state="closed"]');
                                  if (closeButton && 'click' in closeButton) {
                                    (closeButton as HTMLElement).click();
                                  }
                                });
                              }
                            }}
                            disabled={isDeleting === product.id}
                          >
                            {isDeleting === product.id ? "Deleting..." : "Delete"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>

      {/* Product Edit Dialog */}
      {editProduct && (
        <ProductDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          productType="main"
          editProduct={editProduct}
          onSave={handleSaveEditedProduct}
        />
      )}
    </Card>
  );
}
