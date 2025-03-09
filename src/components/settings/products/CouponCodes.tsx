
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
import { Edit, Trash, Plus, Calendar, Percent, DollarSign } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Coupon {
  id: string;
  code: string;
  description: string;
  type: "percentage" | "fixed";
  value: number;
  enabled: boolean;
  start_date?: string;
  end_date?: string;
  usage_limit?: number;
  used_count: number;
  created_at?: string;
  updated_at?: string;
}

export function CouponCodes() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [newCoupon, setNewCoupon] = useState<Partial<Coupon>>({
    code: "",
    description: "",
    type: "percentage",
    value: 0,
    enabled: true,
    used_count: 0
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .order('code', { ascending: true });

      if (error) {
        throw error;
      }
      
      // Explicitly cast the type of each coupon to ensure it matches our interface
      const typedCoupons = data?.map(coupon => ({
        ...coupon,
        type: coupon.type as "percentage" | "fixed",
        value: Number(coupon.value),
        enabled: Boolean(coupon.enabled),
        used_count: Number(coupon.used_count || 0),
        usage_limit: coupon.usage_limit ? Number(coupon.usage_limit) : undefined
      })) || [];
      
      setCoupons(typedCoupons);
    } catch (error) {
      console.error("Error fetching coupons:", error);
      toast.error("Failed to load coupon codes");
    } finally {
      setIsLoading(false);
    }
  };

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
      used_count: 0
    });
    setIsDialogOpen(true);
  };

  const handleDeleteCoupon = async (id: string) => {
    try {
      const { error } = await supabase
        .from('coupons')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setCoupons(coupons.filter(coupon => coupon.id !== id));
      toast.success("Coupon deleted");
    } catch (error) {
      console.error("Error deleting coupon:", error);
      toast.error("Failed to delete coupon");
    }
  };

  const handleToggleCoupon = async (id: string, enabled: boolean) => {
    try {
      const { error } = await supabase
        .from('coupons')
        .update({ enabled })
        .eq('id', id);

      if (error) throw error;
      
      setCoupons(coupons.map(coupon => 
        coupon.id === id ? { ...coupon, enabled } : coupon
      ));
      
      toast.success(enabled ? "Coupon enabled" : "Coupon disabled");
    } catch (error) {
      console.error("Error toggling coupon:", error);
      toast.error("Failed to update coupon");
    }
  };

  const handleSaveCoupon = async () => {
    if (!newCoupon.code || !newCoupon.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!newCoupon.value || newCoupon.value <= 0) {
      toast.error("Please enter a valid discount value greater than zero");
      return;
    }

    // Validate coupon code format (alphanumeric only)
    const codeRegex = /^[A-Z0-9]+$/;
    if (!codeRegex.test(newCoupon.code)) {
      toast.error("Coupon code should only contain uppercase letters and numbers");
      return;
    }

    // Check if coupon code already exists (except for the one being edited)
    const codeExists = coupons.some(
      coupon => coupon.code === newCoupon.code && coupon.id !== editingCoupon?.id
    );
    
    if (codeExists) {
      toast.error("This coupon code already exists");
      return;
    }

    try {
      // Prepare data for Supabase, ensuring the type is correctly set
      const couponData = {
        code: newCoupon.code,
        description: newCoupon.description,
        type: newCoupon.type as "percentage" | "fixed",
        value: newCoupon.value,
        enabled: newCoupon.enabled,
        start_date: newCoupon.start_date,
        end_date: newCoupon.end_date,
        usage_limit: newCoupon.usage_limit,
        used_count: newCoupon.used_count || 0
      };

      if (editingCoupon) {
        // Update existing coupon
        const { error } = await supabase
          .from('coupons')
          .update(couponData)
          .eq('id', editingCoupon.id);

        if (error) throw error;
        
        setCoupons(coupons.map(coupon => 
          coupon.id === editingCoupon.id ? { ...coupon, ...couponData, id: editingCoupon.id } : coupon
        ));
        
        toast.success(`${newCoupon.code} has been updated successfully`);
      } else {
        // Create new coupon
        const { data, error } = await supabase
          .from('coupons')
          .insert([couponData])
          .select();

        if (error) throw error;
        
        if (data && data.length > 0) {
          // Ensure the returned data has the correct type
          const newCoupons = data.map(coupon => ({
            ...coupon,
            type: coupon.type as "percentage" | "fixed",
            value: Number(coupon.value),
            enabled: Boolean(coupon.enabled),
            used_count: Number(coupon.used_count || 0),
            usage_limit: coupon.usage_limit ? Number(coupon.usage_limit) : undefined
          }));
          
          setCoupons([...coupons, newCoupons[0]]);
        }
        
        toast.success(`${newCoupon.code} has been created successfully`);
      }
      
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error saving coupon:", error);
      toast.error("Failed to save coupon code");
    }
  };

  const getValidityString = (coupon: Coupon) => {
    if (coupon.start_date && coupon.end_date) {
      const startDate = format(new Date(coupon.start_date), 'MMM d, yyyy');
      const endDate = format(new Date(coupon.end_date), 'MMM d, yyyy');
      return `${startDate} - ${endDate}`;
    } else if (coupon.start_date) {
      return `Starting ${format(new Date(coupon.start_date), 'MMM d, yyyy')}`;
    } else if (coupon.end_date) {
      return `Until ${format(new Date(coupon.end_date), 'MMM d, yyyy')}`;
    } else {
      return 'No date limits';
    }
  };

  const getDiscountString = (coupon: Coupon) => {
    if (coupon.type === "percentage") {
      return `${coupon.value}% off`;
    } else {
      return `$${coupon.value} off`;
    }
  };

  const getUsageString = (coupon: Coupon) => {
    if (coupon.usage_limit) {
      return `${coupon.used_count} / ${coupon.usage_limit}`;
    } else {
      return `${coupon.used_count} / Unlimited`;
    }
  };

  const getUsagePercentage = (coupon: Coupon) => {
    if (coupon.usage_limit) {
      return Math.round((coupon.used_count / coupon.usage_limit) * 100);
    } else {
      return 0;
    }
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

      {isLoading ? (
        <div className="text-center p-8 border rounded-md">
          <p className="text-muted-foreground">Loading coupon codes...</p>
        </div>
      ) : coupons.length === 0 ? (
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
                        {getDiscountString(coupon)}
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1 text-muted-foreground" />
                        {getDiscountString(coupon)}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{getValidityString(coupon)}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {coupon.usage_limit ? (
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm">{getUsageString(coupon)}</span>
                        <span className="text-xs text-muted-foreground">
                          {getUsagePercentage(coupon)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div 
                          className="bg-primary h-1.5 rounded-full" 
                          style={{ width: `${getUsagePercentage(coupon)}%` }}
                        ></div>
                      </div>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">{getUsageString(coupon)}</span>
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
                value={newCoupon.usage_limit || ''}
                onChange={(e) => {
                  const value = e.target.value === '' ? undefined : parseInt(e.target.value);
                  setNewCoupon({...newCoupon, usage_limit: value});
                }}
                placeholder="Leave empty for unlimited usage"
              />
            </div>

            <div className="space-y-2">
              <Label>Validity Period (optional)</Label>
              <div className="flex space-x-2">
                <Input
                  type="date"
                  value={newCoupon.start_date ? format(new Date(newCoupon.start_date), 'yyyy-MM-dd') : ''}
                  onChange={(e) => {
                    const date = e.target.value ? new Date(e.target.value) : undefined;
                    setNewCoupon({...newCoupon, start_date: date ? date.toISOString() : undefined});
                  }}
                />
                <Input
                  type="date"
                  value={newCoupon.end_date ? format(new Date(newCoupon.end_date), 'yyyy-MM-dd') : ''}
                  onChange={(e) => {
                    const date = e.target.value ? new Date(e.target.value) : undefined;
                    setNewCoupon({...newCoupon, end_date: date ? date.toISOString() : undefined});
                  }}
                />
              </div>
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
