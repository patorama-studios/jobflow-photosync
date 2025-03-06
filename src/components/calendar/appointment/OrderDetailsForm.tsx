
import React, { useState } from 'react';
import { Bold, Italic, Underline, Link2, AlignLeft, List, ListOrdered, Search, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GoogleAddressAutocomplete } from '@/components/ui/google-address-autocomplete';
import { useGoogleMaps } from '@/contexts/GoogleMapsContext';
import { Label } from '@/components/ui/label';
import { useClients } from '@/hooks/use-clients';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useIsMobile } from '@/hooks/use-mobile';

interface CustomItem {
  id: string;
  name: string;
  price: number;
}

export const OrderDetailsForm: React.FC = () => {
  const { isLoaded } = useGoogleMaps();
  const { clients } = useClients();
  const isMobile = useIsMobile();

  const [addressDetails, setAddressDetails] = useState({
    formattedAddress: '',
    streetAddress: '',
    city: '',
    state: '',
    postalCode: '',
    lat: 0,
    lng: 0
  });
  const [searchCustomer, setSearchCustomer] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [showNewCustomerDialog, setShowNewCustomerDialog] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    company: ''
  });
  const [customItems, setCustomItems] = useState<CustomItem[]>([]);
  const [showAddItemDialog, setShowAddItemDialog] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    price: 0
  });
  const [searchProduct, setSearchProduct] = useState('');

  // Sample products for demonstration
  const products = [
    { id: 'p1', name: 'Standard Photography Package', price: 149 },
    { id: 'p2', name: 'Premium Photography Package', price: 249 },
    { id: 'p3', name: 'Virtual Tour Package', price: 199 },
    { id: 'p4', name: 'Drone Photography', price: 299 },
    { id: 'p5', name: 'Twilight Photography', price: 179 }
  ];
  
  // Sample photographers for demonstration
  const photographers = [
    { id: 'ph1', name: 'Maria Garcia' },
    { id: 'ph2', name: 'Alex Johnson' },
    { id: 'ph3', name: 'Wei Chen' },
    { id: 'ph4', name: 'David Smith' },
    { id: 'ph5', name: 'Sophia Patel' }
  ];

  // Filter products based on search term
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchProduct.toLowerCase())
  );

  // Filter clients based on search term
  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchCustomer.toLowerCase()) ||
    (client.email && client.email.toLowerCase().includes(searchCustomer.toLowerCase()))
  );

  const handleAddressSelect = (address: {
    formattedAddress: string;
    streetAddress: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    lat: number;
    lng: number;
  }) => {
    setAddressDetails({
      formattedAddress: address.formattedAddress,
      streetAddress: address.streetAddress,
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      lat: address.lat,
      lng: address.lng
    });
    
    console.log('Selected address:', address);
  };

  const handleCustomerSelect = (client: any) => {
    setSelectedCustomer(client);
    setSearchCustomer('');
  };

  const handleCreateCustomer = () => {
    // In a real app, this would create a new customer in the database
    console.log('Creating new customer:', newCustomer);
    setSelectedCustomer({
      id: `new-${Date.now()}`,
      name: newCustomer.name,
      email: newCustomer.email,
      company: newCustomer.company
    });
    setShowNewCustomerDialog(false);
    setNewCustomer({ name: '', email: '', company: '' });
  };

  const handleAddCustomItem = () => {
    if (newItem.name && newItem.price > 0) {
      setCustomItems([...customItems, { 
        id: `item-${Date.now()}`, 
        name: newItem.name, 
        price: newItem.price 
      }]);
      setNewItem({ name: '', price: 0 });
      setShowAddItemDialog(false);
    }
  };

  const handleProductSelect = (product: any) => {
    console.log('Selected product:', product);
    // In a real app, this would add the product to the order
    setSearchProduct('');
  };

  return (
    <div className={`${isMobile ? 'space-y-4' : 'bg-muted/20 max-h-[calc(100vh-200px)] overflow-y-auto p-6'}`}>
      <h2 className="text-xl font-semibold mb-6">Create New Order</h2>
      
      <div className="space-y-6">
        <div>
          <p className="text-sm font-medium mb-2">Address</p>
          <p className="text-sm text-muted-foreground mb-1">Search Address</p>
          
          {isLoaded ? (
            <GoogleAddressAutocomplete 
              onAddressSelect={handleAddressSelect}
              placeholder="Search an address..." 
            />
          ) : (
            <div className="relative">
              <Input placeholder="Loading Google Maps..." disabled className="pl-9" />
            </div>
          )}
          
          {addressDetails.formattedAddress && (
            <div className="mt-2 p-2 bg-primary/5 rounded text-sm">
              <p className="font-medium">{addressDetails.formattedAddress}</p>
              {addressDetails.streetAddress && (
                <div className={`${isMobile ? 'space-y-2' : 'grid grid-cols-2 gap-2'} mt-2`}>
                  <div>
                    <p className="text-xs text-muted-foreground">Street</p>
                    <p>{addressDetails.streetAddress}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">City</p>
                    <p>{addressDetails.city}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">State</p>
                    <p>{addressDetails.state}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Postal Code</p>
                    <p>{addressDetails.postalCode}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div>
          <p className="text-sm font-medium mb-2">Customer</p>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search for a customer..." 
              className="pl-9"
              value={searchCustomer}
              onChange={(e) => setSearchCustomer(e.target.value)}
            />
          </div>
          
          {searchCustomer && filteredClients.length > 0 && (
            <div className="mt-1 border rounded-md shadow-sm bg-background max-h-40 overflow-y-auto z-10 absolute">
              {filteredClients.map(client => (
                <div 
                  key={client.id}
                  className="p-2 hover:bg-muted/50 cursor-pointer"
                  onClick={() => handleCustomerSelect(client)}
                >
                  <p className="font-medium">{client.name}</p>
                  <p className="text-sm text-muted-foreground">{client.email}</p>
                </div>
              ))}
            </div>
          )}
          
          {selectedCustomer && (
            <div className="mt-2 p-2 bg-primary/5 rounded text-sm">
              <p className="font-medium">{selectedCustomer.name}</p>
              <p className="text-muted-foreground">{selectedCustomer.email}</p>
              {selectedCustomer.company && (
                <p className="text-muted-foreground">{selectedCustomer.company}</p>
              )}
            </div>
          )}
          
          <Button 
            variant="link" 
            className="p-0 h-auto text-primary mt-1"
            onClick={() => setShowNewCustomerDialog(true)}
          >
            Create New Customer
          </Button>
        </div>

        <div>
          <p className="text-sm font-medium mb-2">Photographer</p>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select a photographer" />
            </SelectTrigger>
            <SelectContent>
              {photographers.map((photographer) => (
                <SelectItem key={photographer.id} value={photographer.id}>
                  {photographer.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <p className="text-sm font-medium mb-2">Order Notes (private)</p>
          <div className="border rounded-md mb-2">
            <div className={`flex items-center border-b p-1 ${isMobile ? 'flex-wrap' : ''}`}>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Bold className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Italic className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Underline className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Link2 className="h-4 w-4" />
              </Button>
              <div className="h-6 w-px bg-border mx-1"></div>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <AlignLeft className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <List className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ListOrdered className="h-4 w-4" />
              </Button>
            </div>
            <Textarea className="border-0 focus-visible:ring-0" placeholder="Enter notes here..." />
          </div>
        </div>
        
        <div>
          <p className="text-sm font-medium mb-2">Products</p>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search for a product..." 
              className="pl-9"
              value={searchProduct}
              onChange={(e) => setSearchProduct(e.target.value)}
            />
          </div>
          
          {searchProduct && filteredProducts.length > 0 && (
            <div className="mt-1 border rounded-md shadow-sm bg-background max-h-40 overflow-y-auto z-10 absolute">
              {filteredProducts.map(product => (
                <div 
                  key={product.id}
                  className="p-2 hover:bg-muted/50 cursor-pointer"
                  onClick={() => handleProductSelect(product)}
                >
                  <div className="flex justify-between">
                    <p className="font-medium">{product.name}</p>
                    <p className="font-medium">${product.price}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-medium">Custom Items</p>
            <Button 
              variant="link" 
              className="p-0 h-auto text-primary"
              onClick={() => setShowAddItemDialog(true)}
            >
              Add Custom Item
            </Button>
          </div>
          
          {customItems.length > 0 ? (
            <div className="space-y-2">
              {customItems.map(item => (
                <div key={item.id} className="flex justify-between p-2 bg-muted/30 rounded">
                  <p>{item.name}</p>
                  <p className="font-medium">${item.price}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No custom items added.</p>
          )}
        </div>
        
        <div>
          <p className="text-sm font-medium mb-2">Order Form Custom Fields</p>
          <p className="text-sm text-muted-foreground mb-2">Select the order form to pull the custom fields from.</p>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select an order form" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">Standard Form</SelectItem>
              <SelectItem value="commercial">Commercial Form</SelectItem>
              <SelectItem value="residential">Residential Form</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* New Customer Dialog */}
      <Dialog open={showNewCustomerDialog} onOpenChange={setShowNewCustomerDialog}>
        <DialogContent className={`${isMobile ? 'w-[95%]' : 'sm:max-w-[425px]'}`}>
          <DialogHeader>
            <DialogTitle>Create New Customer</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input 
                id="name" 
                value={newCustomer.name}
                onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email"
                value={newCustomer.email}
                onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="company">Company (Optional)</Label>
              <Input 
                id="company"
                value={newCustomer.company}
                onChange={(e) => setNewCustomer({...newCustomer, company: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter className={isMobile ? "flex-col space-y-2" : ""}>
            <Button variant="outline" onClick={() => setShowNewCustomerDialog(false)} className={isMobile ? "w-full" : ""}>Cancel</Button>
            <Button onClick={handleCreateCustomer} className={isMobile ? "w-full" : ""}>Create Customer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Custom Item Dialog */}
      <Dialog open={showAddItemDialog} onOpenChange={setShowAddItemDialog}>
        <DialogContent className={`${isMobile ? 'w-[95%]' : 'sm:max-w-[425px]'}`}>
          <DialogHeader>
            <DialogTitle>Add Custom Item</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="itemName">Item Name</Label>
              <Input 
                id="itemName" 
                value={newItem.name}
                onChange={(e) => setNewItem({...newItem, name: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="itemPrice">Price</Label>
              <Input 
                id="itemPrice" 
                type="number"
                value={newItem.price || ''}
                onChange={(e) => setNewItem({...newItem, price: parseFloat(e.target.value) || 0})}
              />
            </div>
          </div>
          <DialogFooter className={isMobile ? "flex-col space-y-2" : ""}>
            <Button variant="outline" onClick={() => setShowAddItemDialog(false)} className={isMobile ? "w-full" : ""}>Cancel</Button>
            <Button onClick={handleAddCustomItem} className={isMobile ? "w-full" : ""}>Add Item</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
