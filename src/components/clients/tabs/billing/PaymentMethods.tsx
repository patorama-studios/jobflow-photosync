
import React, { useState } from "react";
import { CreditCard, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { PaymentMethod } from "./types";
import { Customer } from "@/components/clients/mock-data";

interface PaymentMethodsProps {
  paymentMethods?: PaymentMethod[];
  client?: Customer;
  onAddPaymentMethod?: (method: Omit<PaymentMethod, 'id' | 'created_at'>) => Promise<any>;
  isLoading?: boolean;
}

export function PaymentMethods({ 
  paymentMethods = [],
  client,
  onAddPaymentMethod,
  isLoading = false
}: PaymentMethodsProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newMethod, setNewMethod] = useState({
    card_type: 'Visa',
    last_four: '',
    expiry_date: '',
    is_default: true
  });
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onAddPaymentMethod) return;
    
    try {
      await onAddPaymentMethod({
        client_id: '', // Will be added by the hook
        card_type: newMethod.card_type,
        last_four: newMethod.last_four,
        expiry_date: newMethod.expiry_date,
        is_default: newMethod.is_default
      });
      
      setIsDialogOpen(false);
      // Reset form
      setNewMethod({
        card_type: 'Visa',
        last_four: '',
        expiry_date: '',
        is_default: true
      });
    } catch (error) {
      console.error("Failed to add payment method:", error);
    }
  };

  return (
    <Card className="lg:col-span-1">
      <CardHeader>
        <CardTitle>Payment Methods</CardTitle>
        <CardDescription>
          Manage credit cards and payment information.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-4">
            <p className="text-muted-foreground">Loading payment methods...</p>
          </div>
        ) : paymentMethods.length > 0 ? (
          <div className="space-y-3">
            {paymentMethods.map((method) => (
              <div key={method.id} className="border rounded-md p-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium">{method.card_type}</span>
                    {method.is_default && (
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded">Default</span>
                    )}
                  </div>
                  <Button variant="ghost" size="sm">Edit</Button>
                </div>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>•••• •••• •••• {method.last_four}</p>
                  <p>Expires: {method.expiry_date}</p>
                </div>
              </div>
            ))}
          </div>
        ) : client?.billingInfo ? (
          <div className="border rounded-md p-4">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">{client.billingInfo.cardType}</span>
              </div>
              <Button variant="ghost" size="sm">Edit</Button>
            </div>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>•••• •••• •••• {client.billingInfo.lastFour}</p>
              <p>Expires: {client.billingInfo.expiryDate}</p>
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-muted-foreground mb-4">No payment methods found.</p>
            {onAddPaymentMethod && (
              <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Payment Method
              </Button>
            )}
          </div>
        )}
        
        {onAddPaymentMethod && (
          <div className="mt-4">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Card
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Payment Method</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="card_type">Card Type</Label>
                      <Select 
                        value={newMethod.card_type} 
                        onValueChange={value => setNewMethod({...newMethod, card_type: value})}
                      >
                        <SelectTrigger id="card_type">
                          <SelectValue placeholder="Select card type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Visa">Visa</SelectItem>
                          <SelectItem value="Mastercard">Mastercard</SelectItem>
                          <SelectItem value="American Express">American Express</SelectItem>
                          <SelectItem value="Discover">Discover</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="last_four">Last 4 Digits</Label>
                      <Input 
                        id="last_four" 
                        maxLength={4}
                        value={newMethod.last_four}
                        onChange={e => {
                          const value = e.target.value.replace(/\D/g, '');
                          if (value.length <= 4) {
                            setNewMethod({...newMethod, last_four: value});
                          }
                        }}
                        placeholder="1234"
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="expiry_date">Expiry Date (MM/YY)</Label>
                      <Input 
                        id="expiry_date" 
                        value={newMethod.expiry_date}
                        onChange={e => {
                          let value = e.target.value.replace(/[^\d/]/g, '');
                          
                          // Auto-format as MM/YY
                          if (value.length === 2 && !value.includes('/') && newMethod.expiry_date.length === 1) {
                            value += '/';
                          }
                          
                          if (value.length <= 5) {
                            setNewMethod({...newMethod, expiry_date: value});
                          }
                        }}
                        placeholder="MM/YY"
                        required
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="is_default" 
                        checked={newMethod.is_default}
                        onCheckedChange={(checked) => {
                          setNewMethod({...newMethod, is_default: checked as boolean});
                        }}
                      />
                      <Label htmlFor="is_default">Set as default payment method</Label>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Add Card</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
