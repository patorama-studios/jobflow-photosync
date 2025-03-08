
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
  X,
  MoreHorizontal
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { ProductDialog } from "./dialogs/ProductDialog";
import { Product } from "./types/product-types";

// Sample data for demonstration
const sampleProducts: Product[] = [
  {
    id: "prod-1",
    title: "Standard Photo Package",
    description: "Professional real estate photography package with 25 edited photos",
    isServiceable: true,
    hasVariants: false,
    price: 149,
    duration: 60,
    defaultPayout: 70,
    defaultPayoutType: "percentage",
    type: "main"
  },
  {
    id: "prod-2",
    title: "Virtual Tour",
    description: "3D Matterport virtual tour of the property",
    isServiceable: true,
    hasVariants: true,
    type: "main",
    variants: [
      {
        id: "var-1",
        name: "Basic",
        price: 99,
        duration: 45,
        payoutAmount: 65,
        payoutType: "percentage"
      },
      {
        id: "var-2",
        name: "Premium",
        price: 149,
        duration: 60,
        payoutAmount: 70,
        payoutType: "percentage"
      }
    ]
  },
  {
    id: "prod-3",
    title: "Floor Plan",
    description: "Professional 2D floor plan of the property",
    isServiceable: false,
    hasVariants: false,
    price: 75,
    defaultPayout: 60,
    defaultPayoutType: "percentage",
    type: "main"
  }
];

export function ProductsList() {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>(sampleProducts);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    // In a real app, you would call an API here
    setProducts(products.filter(product => product.id !== id));
    toast({
      title: "Product deleted",
      description: "The product has been removed"
    });
  };

  const handleDuplicate = (product: Product) => {
    const newProduct = {
      ...product,
      id: Math.random().toString(36).substring(2, 9),
      title: `${product.title} (Copy)`,
      variants: product.variants ? [...product.variants.map(v => ({...v, id: Math.random().toString(36).substring(2, 9)}))] : undefined
    };
    setProducts([...products, newProduct]);
    toast({
      title: "Product duplicated",
      description: `Created a copy of ${product.title}`
    });
  };

  const getProductPriceDisplay = (product: Product) => {
    if (product.hasVariants && product.variants) {
      const prices = product.variants.map(v => v.price);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      return minPrice === maxPrice ? `$${minPrice}` : `$${minPrice} - $${maxPrice}`;
    }
    return `$${product.price}`;
  };

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10"></TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Serviceable</TableHead>
            <TableHead>Variants</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                <Button variant="ghost" size="sm" className="cursor-move">
                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                </Button>
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-muted rounded-md flex items-center justify-center">
                    {product.imageUrl ? (
                      <img 
                        src={product.imageUrl} 
                        alt={product.title} 
                        className="h-full w-full object-cover rounded-md" 
                      />
                    ) : (
                      <ImageIcon className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium">{product.title}</div>
                    <div className="text-sm text-muted-foreground truncate max-w-[250px]">
                      {product.description}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>{getProductPriceDisplay(product)}</TableCell>
              <TableCell>
                {product.isServiceable ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <X className="h-4 w-4 text-muted-foreground" />
                )}
              </TableCell>
              <TableCell>
                {product.hasVariants ? (
                  <div className="text-sm text-muted-foreground">
                    {product.variants?.length} variant{product.variants?.length !== 1 ? 's' : ''}
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">None</div>
                )}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEdit(product)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDuplicate(product)}>
                      <Copy className="h-4 w-4 mr-2" />
                      Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleDelete(product.id)}
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
          
          {products.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8">
                <div className="text-muted-foreground">No products found</div>
                <Button variant="outline" size="sm" className="mt-4">
                  Add Your First Product
                </Button>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <ProductDialog 
        open={isEditDialogOpen} 
        onOpenChange={setIsEditDialogOpen}
        productType="main"
        editProduct={editingProduct}
      />
    </div>
  );
}
