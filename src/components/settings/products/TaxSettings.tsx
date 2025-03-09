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

type TaxRateType = "fixed" | "percentage" | "combined";

interface TaxRate {
  id: string;
  name: string;
  type: TaxRateType;
  percentage: number;
  fixed_amount: number;
  enabled: boolean;
  is_payment_fee: boolean;
}

export function TaxSettings() {
  const [taxRates, setTaxRates] = useState<TaxRate[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTax, setEditingTax] = useState<TaxRate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [newTax, setNewTax] = useState<TaxRate>({
    id: "",
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
      const { data, error } = await supabase
        .from('tax_settings')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      
      // Convert string type to TaxRateType
      const formattedData = data.map(item => ({
        ...item,
        type: item.type as TaxRateType
      }));
      
      setTaxRates(formattedData);
    } catch (error) {
      console.error("Error fetching tax rates:", error);
      toast.error("Failed to load tax settings");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTax = () => {
    setEditingTax(null);
    setNewTax({
      id: "",
      name: "",
      type: "percentage",
      percentage: 0,
      fixed_amount: 0,
      enabled: true,
      is_payment_fee: false
    });
    setIsDialogOpen(true);
  };

  const handleEditTax = (tax: TaxRate) => {
    setEditingTax(tax);
    setNewTax({ ...tax });
    setIsDialogOpen(true);
  };

  const handleDeleteTax = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tax_settings')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setTaxRates(taxRates.filter(tax => tax.id !== id));
      toast.success("Tax rate deleted successfully");
    } catch (error) {
      console.error("Error deleting tax rate:", error);
      toast.error("Failed to delete tax rate");
    }
  };

  const handleToggleTax = async (id: string, enabled: boolean) => {
    try {
      const { error } = await supabase
        .from('tax_settings')
        .update({ enabled })
        .eq('id', id);

      if (error) throw error;
      
      setTaxRates(taxRates.map(tax => 
        tax.id === id ? { ...tax, enabled } : tax
      ));
      
      toast.success(`Tax rate ${enabled ? 'enabled' : 'disabled'}`);
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

    setIsSubmitting(true);
    
    try {
      const taxData = {
        name: newTax.name,
        type: newTax.type,
        percentage: newTax.type !== "fixed" ? newTax.percentage : null,
        fixed_amount: newTax.type !== "percentage" ? newTax.fixed_amount : null,
        enabled: newTax.enabled,
        is_payment_fee: newTax.is_payment_fee
      };

      if (editingTax) {
        // Update existing tax
        const { error } = await supabase
          .from('tax_settings')
          .update(taxData)
          .eq('id', editingTax.id);

        if (error) throw error;
        
        setTaxRates(taxRates.map(tax => 
          tax.id === editingTax.id ? { ...tax, ...newTax } : tax
        ));
        
        toast.success("Tax rate updated successfully");
      } else {
        // Create new tax
        const { data, error } = await supabase
          .from('tax_settings')
          .insert([taxData])
          .select();

        if (error) throw error;
        
        if (data && data.length > 0) {
          // Ensure the type is correctly set
          const newTaxWithCorrectType = {
            ...data[0],
            type: data[0].type as TaxRateType
          };
          
          setTaxRates([...taxRates, newTaxWithCorrectType]);
        }
        
        toast.success("Tax rate created successfully");
      }
      
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error saving tax rate:", error);
      toast.error("Failed to save tax rate");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Tax Settings</h3>
          <p className="text-sm text-muted-foreground">
            Manage tax rates applied to your products and services
          </p>
        </div>
        <Button onClick={handleAddTax}>
          <Plus className="h-4 w-4 mr-2" />
          Add Tax Rate
        </Button>
      </div>

      {isLoading ? (
        <div>Loading tax rates...</div>
      ) : taxRates.length === 0 ? (
        <div className="text-center p-8 border rounded-md">
          <p className="text-muted-foreground mb-4">No tax rates found</p>
          <Button variant="outline" size="sm" onClick={handleAddTax}>
            Create Your First Tax Rate
          </Button>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Rate</TableHead>
              <TableHead>Payment Fee</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {taxRates.map((tax) => (
              <TableRow key={tax.id}>
                <TableCell>{tax.name}</TableCell>
                <TableCell>{tax.type}</TableCell>
                <TableCell>
                  {tax.type === "percentage" ? `${tax.percentage}%` : `$${tax.fixed_amount}`}
                </TableCell>
                <TableCell>
                  {tax.is_payment_fee ? "Yes" : "No"}
                </TableCell>
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
                  >
                    <Trash className="h-4 w-4" />
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
            <DialogTitle>{editingTax ? "Edit Tax Rate" : "Create Tax Rate"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={newTax.name}
                onChange={(e) => setNewTax({ ...newTax, name: e.target.value })}
                placeholder="e.g., Sales Tax"
              />
            </div>

            <div className="space-y-2">
              <Label>Type</Label>
              <RadioGroup
                defaultValue={newTax.type}
                onValueChange={(value: TaxRateType) => setNewTax({ ...newTax, type: value })}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="percentage" id="percentage" />
                  <Label htmlFor="percentage" className="flex items-center">
                    <Percent className="h-4 w-4 mr-1 text-muted-foreground" />
                    Percentage
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="fixed" id="fixed" />
                  <Label htmlFor="fixed" className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-1 text-muted-foreground" />
                    Fixed Amount
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {newTax.type !== "combined" && (
              <div className="space-y-2">
                <Label htmlFor="rate">
                  {newTax.type === "percentage" ? "Percentage (%)" : "Fixed Amount ($)"}
                </Label>
                <Input
                  id="rate"
                  type="number"
                  min="0"
                  step="0.01"
                  value={newTax.type === "percentage" ? newTax.percentage : newTax.fixed_amount}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value);
                    if (newTax.type === "percentage") {
                      setNewTax({ ...newTax, percentage: value });
                    } else {
                      setNewTax({ ...newTax, fixed_amount: value });
                    }
                  }}
                />
              </div>
            )}

            <div className="flex items-center space-x-2 pt-2">
              <Switch
                id="is_payment_fee"
                checked={newTax.is_payment_fee}
                onCheckedChange={(checked) => setNewTax({ ...newTax, is_payment_fee: checked })}
              />
              <Label htmlFor="is_payment_fee">Is Payment Fee</Label>
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <Switch
                id="enabled"
                checked={newTax.enabled}
                onCheckedChange={(checked) => setNewTax({ ...newTax, enabled: checked })}
              />
              <Label htmlFor="enabled">Enable this tax rate</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveTax} disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : editingTax ? "Update Tax Rate" : "Create Tax Rate"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
