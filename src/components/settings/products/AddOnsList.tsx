
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
  const { fetchAddOns, isLoading, error, deleteProduct, saveUIProduct } = useProducts();
  const [addonsList, setAddonsList] = useState<Product[]>([]);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Fetch add-ons from Supabase
  const loadAddOns = async () => {
    console.log("Loading add-ons...");
    try {
      const addons = await fetchAddOns();
      console.log("Received add-ons from API:", addons);
      
      if (addons && addons.length > 0) {
        // Convert DB addons to UI format
        const convertedAddons = addons.map(addon => ({
          id: addon.id,
          title: addon.name,
          description: addon.description || '',
          price: addon.price,
          isActive: addon.is_active,
          hasVariants: false,
          isServiceable: false,
          type: "addon" as const,
          variants: []
        }));
        console.log("Converted add-ons for UI:", convertedAddons);
        setAddonsList(convertedAddons);
      } else {
        setAddonsList([]);
      }
    } catch (err) {
      console.error("Error fetching add-ons:", err);
      toast.error("Failed to load add-ons");
    }
  };

  useEffect(() => {
    loadAddOns();
  }, []);

  const handleDeleteAddon = async (addonId: string) => {
    console.log("Deleting add-on with ID:", addonId);
    try {
      setIsDeleting(addonId);
      await deleteProduct(addonId);
      setAddonsList(prevList => prevList.filter(addon => addon.id !== addonId));
      toast.success("Add-on deleted successfully");
    } catch (error) {
      console.error("Error deleting add-on:", error);
      toast.error(`Failed to delete add-on: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsDeleting(null);
    }
  };

  const handleEditAddon = (addon: Product) => {
    console.log("Editing add-on:", addon);
    setEditProduct(addon);
    setIsEditDialogOpen(true);
  };

  const handleSaveEditedAddon = async (addon: Product) => {
    console.log("Saving edited add-on:", addon);
    try {
      await saveUIProduct(addon);
      await loadAddOns(); // Refresh the list after saving
      setIsEditDialogOpen(false);
      setEditProduct(null);
      toast.success("Add-on updated successfully");
    } catch (error) {
      console.error("Error updating add-on:", error);
      toast.error(`Failed to update add-on: ${error instanceof Error ? error.message : String(error)}`);
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
