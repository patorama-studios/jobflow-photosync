
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
import { Edit, Trash, Plus, Calendar, Percent, DollarSign } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { format } from "date-fns";

interface Coupon {
  id: string;
  code: string;
  description: string;
  type: "percentage" | "fixed";
  value: number;
  enabled: boolean;
  startDate?: Date;
  endDate?: Date;
  usageLimit?: number;
  usedCount: number;
}

// Sample data
const sampleCoupons: Coupon[] = [
  {
    id: "coupon-1",
    code: "WELCOME20",
    description: "20% off for new customers",
    type: "percentage",
    value: 20,
    enabled: true,
    startDate: new Date(2023, 0, 1),
    endDate: new Date(2023, 11, 31),
    usageLimit: 100,
    usedCount: 45
  },
  {
    id: "coupon-2",
    code: "SUMMER10",
    description: "$10 off summer promotion",
    type: "fixed",
    value: 10,
    enabled: true,
    startDate: new Date(2023, 5, 1),
    endDate: new Date(2023, 8, 30),
    usageLimit: 200,
    usedCount: 87
  },
  {
    id: "coupon-3",
    code: "LOYALTY25",
    description: "25% off for loyal customers",
    type: "percentage",
    value: 25,
    enabled: false,
    usageLimit: 50,
    usedCount: 0
  }
];

export function CouponCodes() {
  const { toast } = useToast();
  const [coupons, setCoupons] = useState<Coupon[]>(sampleCoupons);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  
  const [newCoupon, setNewCoupon] = useState<Partial<Coupon>>({
    code: "",
    description: "",
    type: "percentage",
    value: 0,
    enabled: true,
    usedCount: 0
  });

  const handleEditCoupon = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setNewCoupon({...coupon});
    setIsDialogOpen(true);
  };

  const handleAddCoupon = () => {
    setEditingCoupon(null);
    setNewCoupon({
      code: "",
      description: "",
      type: "percentage",
      value: 0,
      enabled: true,
      usedCount: 0
    });
    setIsDialogOpen(true);
  };

  const handleDeleteCoupon = (id: string) => {
    setCoupons(coupons.filter(coupon => coupon.id !== id));
    toast({
      title: "Coupon deleted",
      description: "The coupon has been removed"
    });
  };

  const handleToggleCoupon = (id: string, enabled: boolean) => {
    setCoupons(coupons.map(coupon => 
      coupon.id === id ? { ...coupon, enabled } : coupon
    ));
    
    toast({
      title: enabled ? "Coupon enabled" : "Coupon disabled",
      description: `The coupon has been ${enabled ? "enabled" : "disabled"}`
    });
  };

  const handleSaveCoupon = () => {
    if (!newCoupon.code || !newCoupon.description) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    if (!newCoupon.value || newCoupon.value <= 0) {
      toast({
        title: "Invalid value",
        description: "Please enter a valid discount value greater than zero",
        variant: "destructive"
      });
      return;
    }

    // Validate coupon code format (alphanumeric only)
    const codeRegex = /^[A-Z0-9]+$/;
    if (!codeRegex.test(newCoupon.code)) {
      toast({
        title: "Invalid coupon code",
        description: "Coupon code should only contain uppercase letters and numbers",
        variant: "destructive"
      });
      return;
    }

    // Check if coupon code already exists (except for the one being edited)
    const codeExists = coupons.some(
      coupon => coupon.code === newCoupon.code && coupon.id !== editingCoupon?.id
    );
    
    if (codeExists) {
      toast({
        title: "Duplicate coupon code",
        description: "This coupon code already exists",
        variant: "destructive"
      });
      return;
    }

    if (editingCoupon) {
      // Update existing coupon
      setCoupons(coupons.map(coupon => 
        coupon.id === editingCoupon.id ? { ...coupon, ...newCoupon } as Coupon : coupon
      ));
      
      toast({
        title: "Coupon updated",
        description: `${newCoupon.code} has been updated successfully`
      });
    } else {
      // Create new coupon
      const newId = Math.random().toString(36).substring(2, 9);
      setCoupons([
        ...coupons,
        {
          id: newId,
          code: newCoupon.code || "",
          description: newCoupon.description || "",
          type: newCoupon.type || "percentage",
          value: newCoupon.value || 0,
          enabled: newCoupon.enabled || true,
          startDate: newCoupon.startDate,
          endDate: newCoupon.endDate,
          usageLimit: newCoupon.usageLimit,
          usedCount: 0
        } as Coupon
      ]);
      
      toast({
        title: "Coupon created",
        description: `${newCoupon.code} has been created successfully`
      });
    }

    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Coupon Codes</h3>
          <p className="text-sm text-muted-foreground">
            Create and manage discount codes for your products
          </p>
        </div>
        <Button onClick={handleAddCoupon}>
          <Plus className="h-4 w-4 mr-2" />
          Add Coupon
        </Button>
      </div>

      {coupons.length === 0 ? (
        <div className="text-center p-8 border rounded-md">
          <p className="text-muted-foreground mb-4">No coupon codes found</p>
          <Button variant="outline" size="sm" onClick={handleAddCoupon}>
            Create Your First Coupon
          </Button>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Coupon Code</TableHead>
              <TableHead>Discount</TableHead>
              <TableHead>Validity</TableHead>
              <TableHead>Usage</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {coupons.map((coupon) => (
              <TableRow key={coupon.id}>
                <TableCell>
                  <div>
                    <div className="font-mono font-medium">{coupon.code}</div>
                    <div className="text-sm text-muted-foreground">{coupon.description}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    {coupon.type === "percentage" ? (
                      <div className="flex items-center">
                        <Percent className="h-4 w-4 mr-1 text-muted-foreground" />
                        {coupon.value}% off
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1 text-muted-foreground" />
                        {coupon.value} off
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {coupon.startDate || coupon.endDate ? (
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>
                        {coupon.startDate ? format(coupon.startDate, 'MMM d, yyyy') : 'Always'} - {' '}
                        {coupon.endDate ? format(coupon.endDate, 'MMM d, yyyy') : 'No expiry'}
                      </span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">No date limits</span>
                  )}
                </TableCell>
                <TableCell>
                  {coupon.usageLimit ? (
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm">{coupon.usedCount} / {coupon.usageLimit}</span>
                        <span className="text-xs text-muted-foreground">
                          {Math.round((coupon.usedCount / coupon.usageLimit) * 100)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div 
                          className="bg-primary h-1.5 rounded-full" 
                          style={{ width: `${(coupon.usedCount / coupon.usageLimit) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">Unlimited</span>
                  )}
                </TableCell>
                <TableCell>
                  <Switch
                    checked={coupon.enabled}
                    onCheckedChange={(checked) => handleToggleCoupon(coupon.id, checked)}
                  />
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => handleEditCoupon(coupon)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-destructive"
                    onClick={() => handleDeleteCoupon(coupon.id)}
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
              {editingCoupon ? "Edit Coupon" : "Create Coupon"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="coupon-code">Coupon Code</Label>
              <Input
                id="coupon-code"
                value={newCoupon.code}
                onChange={(e) => setNewCoupon({...newCoupon, code: e.target.value.toUpperCase()})}
                placeholder="e.g., SUMMER25"
                className="font-mono"
              />
              <p className="text-xs text-muted-foreground">
                Use only uppercase letters and numbers (e.g., SUMMER25, WELCOME10)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={newCoupon.description}
                onChange={(e) => setNewCoupon({...newCoupon, description: e.target.value})}
                placeholder="e.g., 25% off summer promotion"
              />
            </div>

            <div className="space-y-2">
              <Label>Discount Type</Label>
              <RadioGroup
                value={newCoupon.type}
                onValueChange={(value: "percentage" | "fixed") => 
                  setNewCoupon({...newCoupon, type: value})}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="percentage" id="percentage-discount" />
                  <Label htmlFor="percentage-discount" className="flex items-center">
                    <Percent className="h-4 w-4 mr-1 text-muted-foreground" />
                    Percentage
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="fixed" id="fixed-discount" />
                  <Label htmlFor="fixed-discount" className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-1 text-muted-foreground" />
                    Fixed Amount
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="discount-value">
                {newCoupon.type === "percentage" ? "Discount Percentage (%)" : "Discount Amount ($)"}
              </Label>
              <Input
                id="discount-value"
                type="number"
                min="0"
                step={newCoupon.type === "percentage" ? "1" : "0.01"}
                max={newCoupon.type === "percentage" ? "100" : undefined}
                value={newCoupon.value || ''}
                onChange={(e) => setNewCoupon({...newCoupon, value: parseFloat(e.target.value) || 0})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="usage-limit">Usage Limit (optional)</Label>
              <Input
                id="usage-limit"
                type="number"
                min="0"
                value={newCoupon.usageLimit || ''}
                onChange={(e) => {
                  const value = e.target.value === '' ? undefined : parseInt(e.target.value);
                  setNewCoupon({...newCoupon, usageLimit: value});
                }}
                placeholder="Leave empty for unlimited usage"
              />
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <Switch
                id="coupon-enabled"
                checked={newCoupon.enabled || false}
                onCheckedChange={(checked) => setNewCoupon({...newCoupon, enabled: checked})}
              />
              <Label htmlFor="coupon-enabled">Enable this coupon</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveCoupon}>
              {editingCoupon ? "Update Coupon" : "Create Coupon"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
