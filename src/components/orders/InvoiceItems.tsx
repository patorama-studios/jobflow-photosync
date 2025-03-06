
import React, { useState } from 'react';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Trash, Edit, Save, X } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

export interface InvoiceItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  type: 'product' | 'service' | 'custom';
}

interface InvoiceItemsProps {
  items: InvoiceItem[];
  onItemsChange: (items: InvoiceItem[]) => void;
}

export function InvoiceItems({ items, onItemsChange }: InvoiceItemsProps) {
  const [newItem, setNewItem] = useState<Partial<InvoiceItem>>({
    name: '',
    quantity: 1,
    price: 0,
    type: 'service'
  });
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Partial<InvoiceItem>>({});

  const handleAddItem = () => {
    if (!newItem.name || !newItem.price) {
      toast({
        title: "Incomplete item",
        description: "Please fill in the item name and price",
        variant: "destructive"
      });
      return;
    }

    const item: InvoiceItem = {
      id: Math.random().toString(36).substring(2, 9),
      name: newItem.name || '',
      quantity: newItem.quantity || 1,
      price: newItem.price || 0,
      type: newItem.type as 'product' | 'service' | 'custom' || 'custom'
    };

    onItemsChange([...items, item]);
    
    setNewItem({
      name: '',
      quantity: 1,
      price: 0,
      type: 'service'
    });

    toast({
      title: "Item added",
      description: `${item.name} added to invoice`,
    });
  };

  const startEditing = (item: InvoiceItem) => {
    setEditingItem(item.id);
    setEditValues({ ...item });
  };

  const cancelEditing = () => {
    setEditingItem(null);
    setEditValues({});
  };

  const saveEdit = (id: string) => {
    if (!editValues.name || !editValues.price) {
      toast({
        title: "Incomplete item",
        description: "Please fill in the item name and price",
        variant: "destructive"
      });
      return;
    }

    const updatedItems = items.map(item => 
      item.id === id 
        ? { ...item, ...editValues } as InvoiceItem
        : item
    );
    
    onItemsChange(updatedItems);
    setEditingItem(null);
    setEditValues({});
    
    toast({
      title: "Item updated",
      description: "Invoice item has been updated",
    });
  };

  const deleteItem = (id: string) => {
    const updatedItems = items.filter(item => item.id !== id);
    onItemsChange(updatedItems);
    
    toast({
      title: "Item removed",
      description: "Item has been removed from the invoice",
    });
  };

  // Calculate total
  const getTotal = () => {
    return items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  };

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Item</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Total</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map(item => (
            <TableRow key={item.id}>
              {editingItem === item.id ? (
                <>
                  <TableCell>
                    <Input 
                      value={editValues.name || ''} 
                      onChange={(e) => setEditValues({...editValues, name: e.target.value})}
                      className="w-full"
                    />
                  </TableCell>
                  <TableCell>
                    <Select 
                      value={editValues.type} 
                      onValueChange={(value) => setEditValues({...editValues, type: value as 'product' | 'service' | 'custom'})}
                    >
                      <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="product">Product</SelectItem>
                        <SelectItem value="service">Service</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Input 
                      type="number" 
                      min="1"
                      value={editValues.quantity || ''}
                      onChange={(e) => setEditValues({...editValues, quantity: parseInt(e.target.value) || 1})}
                      className="w-20"
                    />
                  </TableCell>
                  <TableCell>
                    <Input 
                      type="number" 
                      min="0" 
                      step="0.01"
                      value={editValues.price || ''}
                      onChange={(e) => setEditValues({...editValues, price: parseFloat(e.target.value) || 0})}
                      className="w-24"
                    />
                  </TableCell>
                  <TableCell>${((editValues.price || 0) * (editValues.quantity || 1)).toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-1">
                      <Button size="sm" variant="ghost" onClick={() => saveEdit(item.id)}>
                        <Save className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={cancelEditing}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </>
              ) : (
                <>
                  <TableCell>{item.name}</TableCell>
                  <TableCell className="capitalize">{item.type}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>${item.price.toFixed(2)}</TableCell>
                  <TableCell>${(item.quantity * item.price).toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-1">
                      <Button size="sm" variant="ghost" onClick={() => startEditing(item)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="text-destructive" onClick={() => deleteItem(item.id)}>
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </>
              )}
            </TableRow>
          ))}
          
          {/* Add new item row */}
          <TableRow>
            <TableCell>
              <Input 
                placeholder="Item name" 
                value={newItem.name || ''} 
                onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                className="w-full"
              />
            </TableCell>
            <TableCell>
              <Select 
                value={newItem.type as string} 
                onValueChange={(value) => setNewItem({...newItem, type: value as 'product' | 'service' | 'custom'})}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="product">Product</SelectItem>
                  <SelectItem value="service">Service</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </TableCell>
            <TableCell>
              <Input 
                type="number" 
                min="1"
                value={newItem.quantity || ''}
                onChange={(e) => setNewItem({...newItem, quantity: parseInt(e.target.value) || 1})}
                className="w-20"
              />
            </TableCell>
            <TableCell>
              <Input 
                type="number" 
                min="0" 
                step="0.01"
                value={newItem.price || ''}
                onChange={(e) => setNewItem({...newItem, price: parseFloat(e.target.value) || 0})}
                className="w-24"
              />
            </TableCell>
            <TableCell>${((newItem.price || 0) * (newItem.quantity || 1)).toFixed(2)}</TableCell>
            <TableCell className="text-right">
              <Button size="sm" variant="ghost" onClick={handleAddItem}>
                <PlusCircle className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
          
          {/* Total row */}
          <TableRow>
            <TableCell colSpan={4} className="text-right font-medium">Total</TableCell>
            <TableCell className="font-bold">${getTotal().toFixed(2)}</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}

export function ContractorPayout({ items, payoutRate }: { items: InvoiceItem[], payoutRate: number }) {
  const totalAmount = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  const contractorAmount = totalAmount * (payoutRate / 100);
  
  return (
    <div className="space-y-3 border rounded-md p-4 bg-muted/30">
      <h3 className="font-medium text-base">Contractor Payout</h3>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="text-muted-foreground">Total Invoice Amount:</div>
        <div className="font-medium">${totalAmount.toFixed(2)}</div>
        
        <div className="text-muted-foreground">Payout Rate:</div>
        <div className="font-medium">{payoutRate}%</div>
        
        <div className="text-muted-foreground font-medium">Contractor Payout:</div>
        <div className="font-bold">${contractorAmount.toFixed(2)}</div>
      </div>
    </div>
  );
}
