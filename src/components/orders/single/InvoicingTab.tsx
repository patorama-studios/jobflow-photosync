
import React, { useState } from 'react';
import { Order } from '@/types/order-types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw, Download, Coins, PlusCircle } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useProducts } from '@/hooks/use-products';
import { toast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface InvoicingTabProps {
  order: Order;
}

export const InvoicingTab: React.FC<InvoicingTabProps> = ({ order }) => {
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isCustomProductOpen, setIsCustomProductOpen] = useState(false);
  const [customProduct, setCustomProduct] = useState({
    name: '',
    description: '',
    price: ''
  });
  const { products, isLoading: productsLoading } = useProducts();
  const [selectedProductId, setSelectedProductId] = useState('');
  
  // Mock data for order items - will be replaced with real data
  const [orderItems, setOrderItems] = useState([
    { id: 1, name: 'Professional Photography', quantity: 1, price: order.price, total: order.price },
    { id: 2, name: 'Virtual Tour', quantity: 1, price: 99, total: 99 }
  ]);
  
  // Mock data for payouts - will be replaced with real data
  const payouts = [
    { id: 1, role: 'Photographer', name: order.photographer, amount: order.photographerPayoutRate || 120, status: 'pending' },
    { id: 2, role: 'Editor', name: 'Jane Smith', amount: 45, status: 'pending' }
  ];

  const handleCustomProductChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCustomProduct({ ...customProduct, [name]: value });
  };

  const handleAddCustomProduct = () => {
    if (!customProduct.name || !customProduct.price) {
      toast({
        title: "Missing information",
        description: "Please provide a name and price for the custom product.",
        variant: "destructive"
      });
      return;
    }

    const price = parseFloat(customProduct.price);
    if (isNaN(price) || price <= 0) {
      toast({
        title: "Invalid price",
        description: "Please enter a valid price greater than zero.",
        variant: "destructive"
      });
      return;
    }

    // Add the new custom product to the order items
    const newItem = {
      id: Date.now(), // temporary ID
      name: customProduct.name,
      description: customProduct.description,
      quantity: 1,
      price: price,
      total: price
    };

    setOrderItems([...orderItems, newItem]);
    setCustomProduct({ name: '', description: '', price: '' });
    setIsCustomProductOpen(false);
    
    toast({
      title: "Custom product added",
      description: `${customProduct.name} has been added to the order.`
    });
  };

  const handleAddProductFromCatalog = () => {
    if (!selectedProductId) {
      toast({
        title: "No product selected",
        description: "Please select a product from the catalog.",
        variant: "destructive"
      });
      return;
    }

    const selectedProduct = products.find(p => p.id === selectedProductId);
    if (!selectedProduct) return;

    // Add the selected product to the order items
    const newItem = {
      id: Date.now(), // temporary ID
      name: selectedProduct.name,
      description: selectedProduct.description || '',
      quantity: 1,
      price: selectedProduct.price,
      total: selectedProduct.price
    };

    setOrderItems([...orderItems, newItem]);
    setSelectedProductId('');
    setIsAddProductOpen(false);
    
    toast({
      title: "Product added",
      description: `${selectedProduct.name} has been added to the order.`
    });
  };
  
  return (
    <div className="space-y-6">
      {/* Order Items Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Order Items</CardTitle>
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline" 
              className="flex items-center gap-1"
              onClick={() => setIsAddProductOpen(true)}
            >
              <Plus className="h-4 w-4" />
              Add Product
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              className="flex items-center gap-1"
              onClick={() => setIsCustomProductOpen(true)}
            >
              <PlusCircle className="h-4 w-4" />
              Custom Item
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead className="w-24 text-right">Qty</TableHead>
                <TableHead className="w-32 text-right">Price</TableHead>
                <TableHead className="w-32 text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orderItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell className="text-right">{item.quantity}</TableCell>
                  <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                  <TableCell className="text-right">${item.total.toFixed(2)}</TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={2}></TableCell>
                <TableCell className="text-right font-medium">Total</TableCell>
                <TableCell className="text-right font-bold">
                  ${orderItems.reduce((acc, item) => acc + item.total, 0).toFixed(2)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Xero Integration Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            Xero Integration
            <Badge variant="outline">Not Synced</Badge>
          </CardTitle>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="flex items-center gap-1">
              <RefreshCw className="h-4 w-4" />
              Sync with Xero
            </Button>
            <Button size="sm" variant="outline" className="flex items-center gap-1">
              <Download className="h-4 w-4" />
              Download Invoice
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This order has not yet been synced with Xero. Click the "Sync with Xero" button to create an invoice.
          </p>
        </CardContent>
      </Card>
      
      {/* Contractor and Editor Payouts Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Coins className="h-5 w-5" />
            Payouts
          </CardTitle>
          <Button size="sm" variant="outline" className="flex items-center gap-1">
            <Plus className="h-4 w-4" />
            Add Payout
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="w-32 text-right">Amount</TableHead>
                <TableHead className="w-32">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payouts.map((payout) => (
                <TableRow key={payout.id}>
                  <TableCell>{payout.role}</TableCell>
                  <TableCell>{payout.name}</TableCell>
                  <TableCell className="text-right">${payout.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={payout.status === 'paid' ? 'default' : 'outline'}>
                      {payout.status === 'paid' ? 'Paid' : 'Pending'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Product from Catalog Dialog */}
      <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Product</DialogTitle>
            <DialogDescription>
              Select a product from the catalog to add to this order.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="product">Product</Label>
              <Select
                value={selectedProductId}
                onValueChange={setSelectedProductId}
              >
                <SelectTrigger id="product">
                  <SelectValue placeholder="Select a product" />
                </SelectTrigger>
                <SelectContent>
                  {productsLoading ? (
                    <SelectItem value="loading" disabled>Loading products...</SelectItem>
                  ) : products.length === 0 ? (
                    <SelectItem value="none" disabled>No products available</SelectItem>
                  ) : (
                    products.map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name} - ${product.price.toFixed(2)}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsAddProductOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleAddProductFromCatalog}>
              Add Product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Custom Product Dialog */}
      <Dialog open={isCustomProductOpen} onOpenChange={setIsCustomProductOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Custom Item</DialogTitle>
            <DialogDescription>
              Create a custom item for this order.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={customProduct.name}
                onChange={handleCustomProductChange}
                placeholder="Enter product name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                name="description"
                value={customProduct.description}
                onChange={handleCustomProductChange}
                placeholder="Enter product description"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                value={customProduct.price}
                onChange={handleCustomProductChange}
                placeholder="0.00"
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsCustomProductOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleAddCustomProduct}>
              Add Item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
