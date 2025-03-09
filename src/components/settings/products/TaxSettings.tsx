
import React, { useState, useEffect } from "react";
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash, Plus, Percent, DollarSign } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

interface TaxRate {
  id: string;
  name: string;
  type: "percentage" | "fixed" | "combined";
  percentage?: number;
  fixed_amount?: number;
  enabled: boolean;
  is_payment_fee?: boolean;
}

export function TaxSettings() {
  const [taxRates, setTaxRates] = useState<TaxRate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTax, setEditingTax] = useState<TaxRate | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  
  const [newTax, setNewTax] = useState<Partial<TaxRate>>({
    name: "",
    type: "percentage",
    percentage: 0,
    fixed_amount: 0,
    enabled: true,
    is_payment_fee: false
  });

  useEffect(() => {
    fetchTaxRates();
  }, []);

  const fetchTaxRates = async () => {
    setIsLoading(true);
    try {
      console.log("Fetching tax rates from Supabase...");
      const { data, error } = await supabase
        .from('tax_settings')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        throw error;
      }

      console.log("Fetched tax rates:", data);
      const formattedTaxRates: TaxRate[] = data.map(rate => ({
        id: rate.id,
        name: rate.name,
        type: rate.type as "percentage" | "fixed" | "combined",
        percentage: rate.percentage,
        fixed_amount: rate.fixed_amount,
        enabled: rate.enabled,
        is_payment_fee: rate.is_payment_fee
      }));

      setTaxRates(formattedTaxRates);
    } catch (error) {
      console.error("Error fetching tax rates:", error);
      toast.error("Failed to load tax rates");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditTax = (tax: TaxRate) => {
    console.log("Editing tax:", tax);
    setEditingTax(tax);
    setNewTax({...tax});
    setIsDialogOpen(true);
  };

  const handleAddTax = () => {
    setEditingTax(null);
    setNewTax({
      name: "",
      type: "percentage",
      percentage: 0,
      fixed_amount: 0,
      enabled: true,
      is_payment_fee: false
    });
    setIsDialogOpen(true);
  };

  const handleDeleteTax = async (id: string) => {
    console.log("Deleting tax rate with ID:", id);
    setIsDeleting(id);
    
    try {
      const { error } = await supabase
        .from('tax_settings')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      // Update local state after successful deletion
      setTaxRates(taxRates.filter(tax => tax.id !== id));
      toast.success("Tax rate deleted successfully");
    } catch (error) {
      console.error("Error deleting tax rate:", error);
      toast.error("Failed to delete tax rate");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleToggleTax = async (id: string, enabled: boolean) => {
    console.log("Toggling tax rate:", id, enabled);
    
    try {
      const { error } = await supabase
        .from('tax_settings')
        .update({ enabled, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) {
        throw error;
      }

      // Update local state after successful update
      setTaxRates(taxRates.map(tax => 
        tax.id === id ? { ...tax, enabled } : tax
      ));
      
      toast.success(enabled ? "Tax rate enabled" : "Tax rate disabled");
    } catch (error) {
      console.error("Error updating tax rate:", error);
      toast.error("Failed to update tax rate");
    }
  };

  const handleSaveTax = async () => {
    if (!newTax.name) {
      toast.error("Please enter a name for the tax rate");
      return;
    }

    // Validate based on type
    if (newTax.type === "percentage" || newTax.type === "combined") {
      if (!newTax.percentage || newTax.percentage <= 0) {
        toast.error("Please enter a valid percentage greater than zero");
        return;
      }
    }

    if (newTax.type === "fixed" || newTax.type === "combined") {
      if (!newTax.fixed_amount || newTax.fixed_amount <= 0) {
        toast.error("Please enter a valid amount greater than zero");
        return;
      }
    }

    try {
      if (editingTax) {
        // Update existing tax
        console.log("Updating tax rate:", newTax);
        const { error } = await supabase
          .from('tax_settings')
          .update({
            name: newTax.name,
            type: newTax.type,
            percentage: newTax.percentage,
            fixed_amount: newTax.fixed_amount,
            enabled: newTax.enabled,
            is_payment_fee: newTax.is_payment_fee,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingTax.id);

        if (error) {
          throw error;
        }
        
        // Update local state
        setTaxRates(taxRates.map(tax => 
          tax.id === editingTax.id ? { ...tax, ...newTax as TaxRate } : tax
        ));
        
        toast.success(`${newTax.name} has been updated successfully`);
      } else {
        // Create new tax
        console.log("Creating new tax rate:", newTax);
        const { data, error } = await supabase
          .from('tax_settings')
          .insert({
            name: newTax.name,
            type: newTax.type,
            percentage: newTax.percentage,
            fixed_amount: newTax.fixed_amount,
            enabled: newTax.enabled,
            is_payment_fee: newTax.is_payment_fee
          })
          .select()
          .single();

        if (error) {
          throw error;
        }
        
        // Add new tax to local state
        setTaxRates([...taxRates, {
          id: data.id,
          name: data.name,
          type: data.type,
          percentage: data.percentage,
          fixed_amount: data.fixed_amount,
          enabled: data.enabled,
          is_payment_fee: data.is_payment_fee
        }]);
        
        toast.success(`${newTax.name} has been created successfully`);
      }

      // Close dialog after successful save
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error saving tax rate:", error);
      toast.error("Failed to save tax rate");
    }
  };

  const renderTaxRateValue = (tax: TaxRate) => {
    if (tax.type === "percentage") {
      return `${tax.percentage}%`;
    } else if (tax.type === "fixed") {
      return `$${tax.fixed_amount?.toFixed(2)}`;
    } else {
      return `${tax.percentage}% + $${tax.fixed_amount?.toFixed(2)}`;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium">Tax & Fee Settings</h3>
            <p className="text-sm text-muted-foreground">
              Configure tax rates and additional fees for your products
            </p>
          </div>
          <Skeleton className="h-9 w-32" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Tax & Fee Settings</h3>
          <p className="text-sm text-muted-foreground">
            Configure tax rates and additional fees for your products
          </p>
        </div>
        <Button onClick={handleAddTax}>
          <Plus className="h-4 w-4 mr-2" />
          Add Tax or Fee
        </Button>
      </div>

      {taxRates.length === 0 ? (
        <div className="text-center p-8 border rounded-md">
          <p className="text-muted-foreground mb-4">No tax rates or fees configured</p>
          <Button variant="outline" size="sm" onClick={handleAddTax}>
            Add Your First Tax Rate
          </Button>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Rate/Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {taxRates.map((tax) => (
              <TableRow key={tax.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center">
                    {tax.name}
                    {tax.is_payment_fee && (
                      <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded">
                        Payment Fee
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    {tax.type === "percentage" && <Percent className="h-4 w-4 mr-1.5 text-muted-foreground" />}
                    {tax.type === "fixed" && <DollarSign className="h-4 w-4 mr-1.5 text-muted-foreground" />}
                    {tax.type === "combined" && (
                      <div className="flex">
                        <Percent className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span className="mr-1">+</span>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )}
                    <span className="capitalize">{tax.type}</span>
                  </div>
                </TableCell>
                <TableCell>{renderTaxRateValue(tax)}</TableCell>
                <TableCell>
                  <Switch
                    checked={tax.enabled}
                    onCheckedChange={(checked) => handleToggleTax(tax.id, checked)}
                  />
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => handleEditTax(tax)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-destructive"
                    onClick={() => handleDeleteTax(tax.id)}
                    disabled={isDeleting === tax.id}
                  >
                    <Trash className="h-4 w-4" />
                    {isDeleting === tax.id && <span className="ml-2">Deleting...</span>}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingTax ? "Edit Tax Rate" : "Add Tax Rate"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="tax-name">Tax Name</Label>
              <Input
                id="tax-name"
                value={newTax.name}
                onChange={(e) => setNewTax({...newTax, name: e.target.value})}
                placeholder="e.g., Sales Tax, Service Fee, etc."
              />
            </div>

            <div className="space-y-2">
              <Label>Tax Type</Label>
              <RadioGroup
                value={newTax.type}
                onValueChange={(value: "percentage" | "fixed" | "combined") => 
                  setNewTax({...newTax, type: value})}
                className="space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="percentage" id="percentage" />
                  <Label htmlFor="percentage" className="flex items-center">
                    <Percent className="h-4 w-4 mr-2 text-muted-foreground" />
                    Percentage-Based
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="fixed" id="fixed" />
                  <Label htmlFor="fixed" className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                    Fixed Amount
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="combined" id="combined" />
                  <Label htmlFor="combined" className="flex items-center">
                    <span className="flex items-center mr-2 text-muted-foreground">
                      <Percent className="h-4 w-4" />
                      <span className="mx-1">+</span>
                      <DollarSign className="h-4 w-4" />
                    </span>
                    Combined (% + $)
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {(newTax.type === "percentage" || newTax.type === "combined") && (
              <div className="space-y-2">
                <Label htmlFor="percentage">Percentage (%)</Label>
                <Input
                  id="percentage"
                  type="number"
                  min="0"
                  step="0.01"
                  value={newTax.percentage || ''}
                  onChange={(e) => setNewTax({...newTax, percentage: parseFloat(e.target.value) || 0})}
                />
              </div>
            )}

            {(newTax.type === "fixed" || newTax.type === "combined") && (
              <div className="space-y-2">
                <Label htmlFor="fixed-amount">Fixed Amount ($)</Label>
                <Input
                  id="fixed-amount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={newTax.fixed_amount || ''}
                  onChange={(e) => setNewTax({...newTax, fixed_amount: parseFloat(e.target.value) || 0})}
                />
              </div>
            )}

            <div className="flex items-center space-x-2 pt-2">
              <Switch
                id="payment-fee"
                checked={newTax.is_payment_fee || false}
                onCheckedChange={(checked) => setNewTax({...newTax, is_payment_fee: checked})}
              />
              <Label htmlFor="payment-fee">This is a payment processing fee</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveTax}>
              {editingTax ? "Update Tax Rate" : "Add Tax Rate"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
