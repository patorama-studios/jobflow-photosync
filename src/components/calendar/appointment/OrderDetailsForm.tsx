
import React from 'react';
import { Search, Bold, Italic, Underline, Link2, AlignLeft, List, ListOrdered } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const OrderDetailsForm: React.FC = () => {
  return (
    <div className="p-6 bg-muted/20">
      <h2 className="text-xl font-semibold mb-6">Create New Order</h2>
      
      <div className="space-y-6">
        <div>
          <p className="text-sm font-medium mb-2">Address</p>
          <p className="text-sm text-muted-foreground mb-1">Search Address</p>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search an address..." className="pl-9" />
          </div>
        </div>
        
        <div>
          <p className="text-sm font-medium mb-2">Customer</p>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search for a customer..." className="pl-9" />
          </div>
          <Button variant="link" className="p-0 h-auto text-primary mt-1">Create New Customer</Button>
        </div>
        
        <div>
          <p className="text-sm font-medium mb-2">Order Notes (private)</p>
          <div className="border rounded-md mb-2">
            <div className="flex items-center border-b p-1 gap-1">
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
            <Input placeholder="Search for a product..." className="pl-9" />
          </div>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-medium">Custom Items</p>
            <Button variant="link" className="p-0 h-auto text-primary">Add Custom Item</Button>
          </div>
          <p className="text-sm text-muted-foreground">No custom items added.</p>
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
    </div>
  );
};
