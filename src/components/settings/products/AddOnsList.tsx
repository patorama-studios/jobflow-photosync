
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

export function AddOnsList() {
  const { products, isLoading, error, refetch, deleteProduct, saveUIProduct } = useProducts();
  const [addonsList, setAddonsList] = useState<Product[]>([]);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Mock data for addons - in a real app this would come from your API
  useEffect(() => {
    // In a real app, you would get addons from the API
    // For now, use mock data
    const mockAddons: Product[] = [
      {
        id: "addon1",
        title: "Rush Service",
        description: "24 hour turnaround time",
        price: 49.99,
        isActive: true,
        hasVariants: false,
        isServiceable: false,
        type: "addon",
      },
      {
        id: "addon2",
        title: "Additional Exposures",
        description: "Extra photo exposures for difficult lighting conditions",
        price: 29.99,
        isActive: true,
        hasVariants: false,
        isServiceable: false,
        type: "addon",
      },
      {
        id: "addon3",
        title: "Floor Plan",
        description: "Professional floor plan drawing",
        price: 75,
        isActive: true,
        hasVariants: false,
        isServiceable: false,
        type: "addon",
      }
    ];
    
    setAddonsList(mockAddons);
  }, []);

  const handleDeleteAddon = async (addonId: string) => {
    try {
      setIsDeleting(addonId);
      // In a real app, you would call an API
      // For now, update local state
      setAddonsList(prevList => prevList.filter(addon => addon.id !== addonId));
      
      toast.success("Add-on deleted successfully");
    } catch (error) {
      console.error("Error deleting add-on:", error);
      toast.error("Failed to delete add-on");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleEditAddon = (addon: Product) => {
    setEditProduct(addon);
    setIsEditDialogOpen(true);
  };

  const handleSaveEditedAddon = async (addon: Product) => {
    try {
      // In a real app, you would call an API
      // For now, update local state
      setAddonsList(prevList => 
        prevList.map(item => item.id === addon.id ? addon : item)
      );
      
      setIsEditDialogOpen(false);
      setEditProduct(null);
      toast.success("Add-on updated successfully");
    } catch (error) {
      console.error("Error updating add-on:", error);
      toast.error("Failed to update add-on");
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Add-Ons</CardTitle>
          <CardDescription>Manage your product add-ons</CardDescription>
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add-Ons</CardTitle>
        <CardDescription>Manage your product add-ons</CardDescription>
      </CardHeader>
      <CardContent>
        {addonsList.length === 0 ? (
          <div className="text-center p-6 text-muted-foreground">
            No add-ons found. Add your first add-on using the button above.
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
              {addonsList.map((addon) => (
                <TableRow key={addon.id}>
                  <TableCell className="font-medium">{addon.title}</TableCell>
                  <TableCell>${addon.price?.toFixed(2) || '0.00'}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={addon.isActive ? "success" : "secondary"}
                    >
                      {addon.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEditAddon(addon)}
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
                          <AlertDialogTitle>Delete Add-On</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this add-on? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={(e) => {
                              // Prevent default to avoid closing the dialog too early
                              e.preventDefault(); 
                              if (addon.id) {
                                handleDeleteAddon(addon.id).then(() => {
                                  // Close the dialog after operation completes
                                  const closeButton = document.querySelector('[data-state="open"] button[data-state="closed"]');
                                  if (closeButton && 'click' in closeButton) {
                                    (closeButton as HTMLElement).click();
                                  }
                                });
                              }
                            }}
                            disabled={isDeleting === addon.id}
                          >
                            {isDeleting === addon.id ? "Deleting..." : "Delete"}
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
          productType="addon"
          editProduct={editProduct}
          onSave={handleSaveEditedAddon}
        />
      )}
    </Card>
  );
}
