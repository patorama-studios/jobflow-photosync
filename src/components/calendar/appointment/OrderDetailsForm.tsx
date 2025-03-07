
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Home, Calendar, ShoppingCart, FileText } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useOrderForm } from '@/hooks/use-order-form';
import { GoogleMapsProvider } from '@/contexts/GoogleMapsContext';

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

export const OrderDetailsForm: React.FC = () => {
  const isMobile = useIsMobile();
  const orderForm = useOrderForm();
  
  // Get Google Maps API key from environment or use a default one for development
  // Note: In production, this should be loaded from an environment variable
  const googleMapsApiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || "AIzaSyDcwGyRxRbcNGWOFQVT87A1xkbTuoiRRwE";

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
              <GoogleMapsProvider apiKey={googleMapsApiKey} defaultRegion="au">
                <AddressSection 
                  addressDetails={orderForm.addressDetails}
                  onAddressSelect={orderForm.handleAddressSelect}
                />
              </GoogleMapsProvider>
              
              <CustomerSection 
                searchCustomer={orderForm.searchCustomer}
                setSearchCustomer={orderForm.setSearchCustomer}
                selectedCustomer={orderForm.selectedCustomer}
                filteredClients={orderForm.filteredClients}
                handleCustomerSelect={orderForm.handleCustomerSelect}
                openNewCustomerDialog={() => orderForm.setShowNewCustomerDialog(true)}
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
              selectedPhotographer={orderForm.selectedPhotographer}
              onSelectPhotographer={orderForm.handlePhotographerSelect}
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
                searchProduct={orderForm.searchProduct}
                setSearchProduct={orderForm.setSearchProduct}
                filteredProducts={orderForm.filteredProducts}
                handleProductSelect={orderForm.handleProductSelect}
                openAddProductDialog={() => orderForm.setShowAddProductDialog(true)}
              />
              
              <CustomItemsSection 
                customItems={orderForm.customItems}
                openAddItemDialog={() => orderForm.setShowAddItemDialog(true)}
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
        open={orderForm.showNewCustomerDialog}
        onOpenChange={orderForm.setShowNewCustomerDialog}
        newCustomer={orderForm.newCustomer}
        setNewCustomer={orderForm.setNewCustomer}
        handleCreateCustomer={orderForm.handleCreateCustomer}
      />

      <AddCustomItemDialog 
        open={orderForm.showAddItemDialog}
        onOpenChange={orderForm.setShowAddItemDialog}
        newItem={orderForm.newItem}
        setNewItem={orderForm.setNewItem}
        handleAddCustomItem={orderForm.handleAddCustomItem}
      />

      <AddProductDialog
        open={orderForm.showAddProductDialog}
        onOpenChange={orderForm.setShowAddProductDialog}
        onProductAdded={orderForm.handleAddProduct}
      />
    </div>
  );
};
