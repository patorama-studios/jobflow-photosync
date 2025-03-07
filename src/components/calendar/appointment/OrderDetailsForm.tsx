
import React, { useState } from 'react';
import { useClients } from '@/hooks/use-clients';
import { useIsMobile } from '@/hooks/use-mobile';
import { ChevronDown, ChevronUp, Home, Calendar, ShoppingCart, FileText } from 'lucide-react';

// Import our component sections
import { AddressSection } from './AddressSection';
import { CustomerSection } from './CustomerSection';
import { PhotographerSection } from './PhotographerSection';
import { OrderNotesSection } from './OrderNotesSection';
import { ProductsSection } from './ProductsSection';
import { CustomItemsSection } from './CustomItemsSection';
import { OrderFormSection } from './OrderFormSection';
import { NewCustomerDialog } from './NewCustomerDialog';
import { AddCustomItemDialog } from './AddCustomItemDialog';
import { AddProductDialog } from './AddProductDialog';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface CustomItem {
  id: string;
  name: string;
  price: number;
}

interface Product {
  id: string;
  name: string;
  price: number;
}

export const OrderDetailsForm: React.FC = () => {
  const { clients } = useClients();
  const isMobile = useIsMobile();

  // Track open sections with state
  const [openSection, setOpenSection] = useState<string>("address");

  // Address state
  const [addressDetails, setAddressDetails] = useState({
    formattedAddress: '',
    streetAddress: '',
    city: '',
    state: '',
    postalCode: '',
    lat: 0,
    lng: 0
  });

  // Customer state
  const [searchCustomer, setSearchCustomer] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [showNewCustomerDialog, setShowNewCustomerDialog] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    company: ''
  });

  // Photographer state
  const [selectedPhotographer, setSelectedPhotographer] = useState<string | undefined>(undefined);

  // Custom items state
  const [customItems, setCustomItems] = useState<CustomItem[]>([]);
  const [showAddItemDialog, setShowAddItemDialog] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    price: 0
  });

  // Product search state
  const [searchProduct, setSearchProduct] = useState('');
  const [showAddProductDialog, setShowAddProductDialog] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  
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

  const handleAddProduct = (product: { name: string; price: number }) => {
    const newProduct = {
      id: `prod-${Date.now()}`,
      name: product.name,
      price: product.price
    };
    setProducts([...products, newProduct]);
    console.log('Added new product:', newProduct);
  };

  const handlePhotographerSelect = (photographerId: string) => {
    setSelectedPhotographer(photographerId);
    console.log('Selected photographer:', photographerId);
  };

  return (
    <div className={`${isMobile ? 'space-y-4' : 'bg-muted/20 max-h-[calc(100vh-200px)] overflow-y-auto p-6'}`}>
      <h2 className="text-xl font-semibold mb-6">Create New Order</h2>
      
      <Accordion type="single" collapsible defaultValue="address" className="w-full">
        {/* Address and Customer Section */}
        <AccordionItem value="address" className="border rounded-md mb-4 overflow-hidden">
          <AccordionTrigger className="px-4 py-3 hover:bg-muted/50 flex items-center">
            <div className="flex items-center">
              <Home className="mr-2 h-5 w-5 text-primary" />
              <span className="font-medium">Address & Customer</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 py-3 border-t bg-card">
            <div className="space-y-6">
              <AddressSection 
                addressDetails={addressDetails}
                onAddressSelect={handleAddressSelect}
              />
              
              <CustomerSection 
                searchCustomer={searchCustomer}
                setSearchCustomer={setSearchCustomer}
                selectedCustomer={selectedCustomer}
                filteredClients={filteredClients}
                handleCustomerSelect={handleCustomerSelect}
                openNewCustomerDialog={() => setShowNewCustomerDialog(true)}
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Time and Date Section */}
        <AccordionItem value="timedate" className="border rounded-md mb-4 overflow-hidden">
          <AccordionTrigger className="px-4 py-3 hover:bg-muted/50 flex items-center">
            <div className="flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-primary" />
              <span className="font-medium">Time & Date</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 py-3 border-t bg-card">
            <PhotographerSection 
              selectedPhotographer={selectedPhotographer}
              onSelectPhotographer={handlePhotographerSelect}
            />
          </AccordionContent>
        </AccordionItem>

        {/* Products Section */}
        <AccordionItem value="products" className="border rounded-md mb-4 overflow-hidden">
          <AccordionTrigger className="px-4 py-3 hover:bg-muted/50 flex items-center">
            <div className="flex items-center">
              <ShoppingCart className="mr-2 h-5 w-5 text-primary" />
              <span className="font-medium">Products</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 py-3 border-t bg-card">
            <div className="space-y-6">
              <ProductsSection 
                searchProduct={searchProduct}
                setSearchProduct={setSearchProduct}
                filteredProducts={filteredProducts}
                handleProductSelect={handleProductSelect}
                openAddProductDialog={() => setShowAddProductDialog(true)}
              />
              
              <CustomItemsSection 
                customItems={customItems}
                openAddItemDialog={() => setShowAddItemDialog(true)}
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Custom Fields and Notes Section */}
        <AccordionItem value="notes" className="border rounded-md mb-4 overflow-hidden">
          <AccordionTrigger className="px-4 py-3 hover:bg-muted/50 flex items-center">
            <div className="flex items-center">
              <FileText className="mr-2 h-5 w-5 text-primary" />
              <span className="font-medium">Custom Fields & Notes</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 py-3 border-t bg-card">
            <div className="space-y-6">
              <OrderFormSection />
              <OrderNotesSection />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Dialogs */}
      <NewCustomerDialog 
        open={showNewCustomerDialog}
        onOpenChange={setShowNewCustomerDialog}
        newCustomer={newCustomer}
        setNewCustomer={setNewCustomer}
        handleCreateCustomer={handleCreateCustomer}
      />

      <AddCustomItemDialog 
        open={showAddItemDialog}
        onOpenChange={setShowAddItemDialog}
        newItem={newItem}
        setNewItem={setNewItem}
        handleAddCustomItem={handleAddCustomItem}
      />

      <AddProductDialog
        open={showAddProductDialog}
        onOpenChange={setShowAddProductDialog}
        onProductAdded={handleAddProduct}
      />
    </div>
  );
};
