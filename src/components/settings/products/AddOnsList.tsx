
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
import { 
  Edit, 
  Trash, 
  Copy, 
  GripVertical, 
  Image as ImageIcon,
  Check,
  X
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Product, ProductDialog } from "./ProductDialog";
import { useToast } from "@/components/ui/use-toast";

// Sample data for add-ons
const sampleAddOns: Product[] = [
  {
    id: "addon-1",
    title: "Twilight Photos",
    description: "Stunning twilight exterior photos of the property",
    isServiceable: true,
    hasVariants: false,
    price: 99,
    duration: 45,
    defaultPayout: 70,
    defaultPayoutType: "percentage",
    type: "addon"
  },
  {
    id: "addon-2",
    title: "Aerial Photography",
    description: "Drone photography showing property from above",
    isServiceable: true,
    hasVariants: false,
    price: 149,
    duration: 30,
    defaultPayout: 75,
    defaultPayoutType: "percentage",
    type: "addon"
  },
  {
    id: "addon-3",
    title: "Property Video",
    description: "Professional video tour of the property",
    isServiceable: true,
    hasVariants: true,
    type: "addon",
    variants: [
      {
        id: "var-1",
        name: "Standard",
        price: 199,
        duration: 60,
        payoutAmount: 65,
        payoutType: "percentage"
      },
      {
        id: "var-2",
        name: "Premium",
        price: 299,
        duration: 90,
        payoutAmount: 70,
        payoutType: "percentage"
      }
    ]
  }
];

export function AddOnsList() {
  const { toast } = useToast();
  const [addOns, setAddOns] = useState<Product[]>(sampleAddOns);
  const [editingAddOn, setEditingAddOn] = useState<Product | undefined>(undefined);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleEdit = (addOn: Product) => {
    setEditingAddOn(addOn);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    // In a real app, you would call an API here
    setAddOns(addOns.filter(addOn => addOn.id !== id));
    toast({
      title: "Add-on deleted",
      description: "The add-on has been removed"
    });
  };

  const handleDuplicate = (addOn: Product) => {
    const newAddOn = {
      ...addOn,
      id: Math.random().toString(36).substring(2, 9),
      title: `${addOn.title} (Copy)`,
      variants: addOn.variants ? [...addOn.variants.map(v => ({...v, id: Math.random().toString(36).substring(2, 9)}))] : undefined
    };
    setAddOns([...addOns, newAddOn]);
    toast({
      title: "Add-on duplicated",
      description: `Created a copy of ${addOn.title}`
    });
  };

  const getAddOnPriceDisplay = (addOn: Product) => {
    if (addOn.hasVariants && addOn.variants) {
      const prices = addOn.variants.map(v => v.price);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      return minPrice === maxPrice ? `$${minPrice}` : `$${minPrice} - $${maxPrice}`;
    }
    return `$${addOn.price}`;
  };

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10"></TableHead>
            <TableHead>Add-On</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Serviceable</TableHead>
            <TableHead>Variants</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {addOns.map((addOn) => (
            <TableRow key={addOn.id}>
              <TableCell>
                <Button variant="ghost" size="sm" className="cursor-move">
                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                </Button>
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-muted rounded-md flex items-center justify-center">
                    {addOn.imageUrl ? (
                      <img 
                        src={addOn.imageUrl} 
                        alt={addOn.title} 
                        className="h-full w-full object-cover rounded-md" 
                      />
                    ) : (
                      <ImageIcon className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium">{addOn.title}</div>
                    <div className="text-sm text-muted-foreground truncate max-w-[250px]">
                      {addOn.description}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>{getAddOnPriceDisplay(addOn)}</TableCell>
              <TableCell>
                {addOn.isServiceable ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <X className="h-4 w-4 text-muted-foreground" />
                )}
              </TableCell>
              <TableCell>
                {addOn.hasVariants ? (
                  <div className="text-sm text-muted-foreground">
                    {addOn.variants?.length} variant{addOn.variants?.length !== 1 ? 's' : ''}
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">None</div>
                )}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <DotsHorizontalIcon className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEdit(addOn)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDuplicate(addOn)}>
                      <Copy className="h-4 w-4 mr-2" />
                      Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleDelete(addOn.id)}
                      className="text-destructive"
                    >
                      <Trash className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
          
          {addOns.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8">
                <div className="text-muted-foreground">No add-ons found</div>
                <Button variant="outline" size="sm" className="mt-4">
                  Add Your First Add-On
                </Button>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <ProductDialog 
        open={isEditDialogOpen} 
        onOpenChange={setIsEditDialogOpen}
        productType="addon"
        editProduct={editingAddOn}
      />
    </div>
  );
}
