
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
import { Edit, Trash, Plus, Percent, DollarSign } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface TaxRate {
  id: string;
  name: string;
  type: "percentage" | "fixed" | "combined";
  percentage?: number;
  fixedAmount?: number;
  enabled: boolean;
  isInternetBankingFee?: boolean;
}

// Sample data
const sampleTaxRates: TaxRate[] = [
  {
    id: "tax-1",
    name: "Sales Tax",
    type: "percentage",
    percentage: 7.5,
    enabled: true
  },
  {
    id: "tax-2",
    name: "Service Fee",
    type: "fixed",
    fixedAmount: 10,
    enabled: true
  },
  {
    id: "tax-3",
    name: "Processing Fee",
    type: "combined",
    percentage: 2.9,
    fixedAmount: 0.30,
    enabled: true,
    isInternetBankingFee: true
  }
];

export function TaxSettings() {
  const { toast } = useToast();
  const [taxRates, setTaxRates] = useState<TaxRate[]>(sampleTaxRates);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTax, setEditingTax] = useState<TaxRate | null>(null);
  
  const [newTax, setNewTax] = useState<Partial<TaxRate>>({
    name: "",
    type: "percentage",
    percentage: 0,
    fixedAmount: 0,
    enabled: true,
    isInternetBankingFee: false
  });

  const handleEditTax = (tax: TaxRate) => {
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
      fixedAmount: 0,
      enabled: true,
      isInternetBankingFee: false
    });
    setIsDialogOpen(true);
  };

  const handleDeleteTax = (id: string) => {
    setTaxRates(taxRates.filter(tax => tax.id !== id));
    toast({
      title: "Tax rate deleted",
      description: "The tax rate has been removed"
    });
  };

  const handleToggleTax = (id: string, enabled: boolean) => {
    setTaxRates(taxRates.map(tax => 
      tax.id === id ? { ...tax, enabled } : tax
    ));
    
    toast({
      title: enabled ? "Tax rate enabled" : "Tax rate disabled",
      description: `The tax rate has been ${enabled ? "enabled" : "disabled"}`
    });
  };

  const handleSaveTax = () => {
    if (!newTax.name) {
      toast({
        title: "Missing information",
        description: "Please enter a name for the tax rate",
        variant: "destructive"
      });
      return;
    }

    // Validate based on type
    if (newTax.type === "percentage" || newTax.type === "combined") {
      if (!newTax.percentage || newTax.percentage <= 0) {
        toast({
          title: "Invalid percentage",
          description: "Please enter a valid percentage greater than zero",
          variant: "destructive"
        });
        return;
      }
    }

    if (newTax.type === "fixed" || newTax.type === "combined") {
      if (!newTax.fixedAmount || newTax.fixedAmount <= 0) {
        toast({
          title: "Invalid amount",
          description: "Please enter a valid amount greater than zero",
          variant: "destructive"
        });
        return;
      }
    }

    if (editingTax) {
      // Update existing tax
      setTaxRates(taxRates.map(tax => 
        tax.id === editingTax.id ? { ...tax, ...newTax } as TaxRate : tax
      ));
      
      toast({
        title: "Tax rate updated",
        description: `${newTax.name} has been updated successfully`
      });
    } else {
      // Create new tax
      const newId = Math.random().toString(36).substring(2, 9);
      setTaxRates([
        ...taxRates,
        {
          id: newId,
          name: newTax.name || "",
          type: newTax.type || "percentage",
          percentage: newTax.percentage,
          fixedAmount: newTax.fixedAmount,
          enabled: newTax.enabled || true,
          isInternetBankingFee: newTax.isInternetBankingFee || false
        } as TaxRate
      ]);
      
      toast({
        title: "Tax rate created",
        description: `${newTax.name} has been created successfully`
      });
    }

    setIsDialogOpen(false);
  };

  const renderTaxRateValue = (tax: TaxRate) => {
    if (tax.type === "percentage") {
      return `${tax.percentage}%`;
    } else if (tax.type === "fixed") {
      return `$${tax.fixedAmount?.toFixed(2)}`;
    } else {
      return `${tax.percentage}% + $${tax.fixedAmount?.toFixed(2)}`;
    }
  };

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
                    {tax.isInternetBankingFee && (
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
                  value={newTax.fixedAmount || ''}
                  onChange={(e) => setNewTax({...newTax, fixedAmount: parseFloat(e.target.value) || 0})}
                />
              </div>
            )}

            <div className="flex items-center space-x-2 pt-2">
              <Switch
                id="internet-banking-fee"
                checked={newTax.isInternetBankingFee || false}
                onCheckedChange={(checked) => setNewTax({...newTax, isInternetBankingFee: checked})}
              />
              <Label htmlFor="internet-banking-fee">This is a payment processing fee</Label>
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
