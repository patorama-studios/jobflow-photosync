
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
import { Product as UIProduct } from "./types/product-types";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

export function ProductsList() {
  const { products, isLoading, error, refetch } = useProducts();
  const [productList, setProductList] = useState<UIProduct[]>([]);
  
  // Convert database products to UI products format
  useEffect(() => {
    if (products && products.length > 0) {
      // Simple conversion for now - in a real app, you would load detailed UI product data
      const convertedProducts: UIProduct[] = products.map(dbProduct => ({
        id: dbProduct.id,
        title: dbProduct.name,
        description: dbProduct.description || '',
        price: dbProduct.price,
        isActive: dbProduct.is_active,
        hasVariants: false,
        productType: 'main',
        variants: []
      }));
      
      setProductList(convertedProducts);
    }
  }, [products]);

  const handleDeleteProduct = async (productId: string) => {
    try {
      // Call API to delete product
      // await deleteProduct(productId);
      toast.success("Product deleted successfully");
      refetch();
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
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
                  <TableCell>${product.price.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={product.isActive ? "success" : "secondary"}
                    >
                      {product.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="sm">
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
                            onClick={() => product.id && handleDeleteProduct(product.id)}
                          >
                            Delete
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
    </Card>
  );
}
