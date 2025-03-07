
import { useState } from "react";
import { Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Product, useProducts } from "@/hooks/use-products";

interface ProductSearchProps {
  onSelectProduct: (product: Product, overridePrice: number) => Promise<void>;
  clientId: string;
}

export function ProductSearch({ onSelectProduct, clientId }: ProductSearchProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [overridePrice, setOverridePrice] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { products, isLoading } = useProducts();
  
  const filteredProducts = searchQuery.trim() === "" 
    ? products
    : products.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
  
  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setOverridePrice(product.price.toString());
  };
  
  const handleSubmit = async () => {
    if (!selectedProduct || !overridePrice) return;
    
    const price = parseFloat(overridePrice);
    if (isNaN(price) || price < 0) {
      alert("Please enter a valid price");
      return;
    }
    
    setIsSubmitting(true);
    try {
      await onSelectProduct(selectedProduct, price);
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Failed to create product override:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const resetForm = () => {
    setSelectedProduct(null);
    setOverridePrice("");
    setSearchQuery("");
  };
  
  return (
    <Dialog open={isDialogOpen} onOpenChange={(open) => {
      setIsDialogOpen(open);
      if (!open) resetForm();
    }}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Product Override
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Product Price Override</DialogTitle>
        </DialogHeader>
        
        {selectedProduct ? (
          <div className="space-y-4">
            <div>
              <Label>Selected Product</Label>
              <div className="p-3 border rounded-md mt-1">
                <h4 className="font-semibold">{selectedProduct.name}</h4>
                <p className="text-sm text-muted-foreground">{selectedProduct.description}</p>
                <p className="text-sm mt-1">Standard Price: ${selectedProduct.price.toFixed(2)}</p>
              </div>
            </div>
            
            <div>
              <Label htmlFor="override-price">Custom Price for this Client</Label>
              <Input 
                id="override-price" 
                type="number"
                min="0"
                step="0.01"
                value={overridePrice}
                onChange={(e) => setOverridePrice(e.target.value)}
                placeholder="Enter custom price"
                className="mt-1"
              />
              
              {overridePrice && !isNaN(parseFloat(overridePrice)) && (
                <p className="text-sm text-muted-foreground mt-1">
                  Discount: {(((selectedProduct.price - parseFloat(overridePrice)) / selectedProduct.price) * 100).toFixed(2)}%
                </p>
              )}
            </div>
            
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => setSelectedProduct(null)}
            >
              Change Product
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                className="pl-10" 
                placeholder="Search products..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="max-h-[300px] overflow-y-auto border rounded-md divide-y">
              {isLoading ? (
                <div className="p-4 text-center text-muted-foreground">Loading products...</div>
              ) : filteredProducts.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">No products found</div>
              ) : (
                filteredProducts.map((product) => (
                  <div 
                    key={product.id} 
                    className="p-3 hover:bg-secondary/50 cursor-pointer"
                    onClick={() => handleSelectProduct(product)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-semibold">{product.name}</h4>
                        <p className="text-sm text-muted-foreground">{product.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${product.price.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
            Cancel
          </Button>
          {selectedProduct && (
            <Button 
              onClick={handleSubmit}
              disabled={!selectedProduct || !overridePrice || isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create Override"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
