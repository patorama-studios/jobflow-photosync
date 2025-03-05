
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@radix-ui/react-switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { CreditCard, Banknote } from "lucide-react";

export function PaymentSettings() {
  const { toast } = useToast();
  
  const handleSave = () => {
    toast({
      title: "Payment settings updated",
      description: "Your payment and order settings have been saved.",
    });
  };
  
  const currencies = ["USD", "EUR", "GBP", "CAD", "AUD", "JPY"];
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Payments & Order Settings</h2>
        <p className="text-muted-foreground">
          Configure payment processing, refunds, and order management
        </p>
      </div>
      
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-medium mb-4">Stripe Integration</h3>
          <div className="space-y-4">
            <div className="p-4 border rounded-md bg-muted/50 flex items-center space-x-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <CreditCard className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-medium">Stripe is not connected</p>
                <p className="text-sm text-muted-foreground">
                  Connect your Stripe account to process payments
                </p>
              </div>
              <Button className="ml-auto">Connect Stripe</Button>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="defaultCurrency">Default Currency</Label>
              <Select defaultValue="USD">
                <SelectTrigger id="defaultCurrency">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={currency} value={currency}>
                      {currency}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="allowPrePayment" className="block mb-1">Allow payments before order completion</Label>
                <p className="text-sm text-muted-foreground">
                  Clients can pay for services before work is delivered
                </p>
              </div>
              <Switch id="allowPrePayment" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="inAppPayment" className="block mb-1">Enable in-app payments</Label>
                <p className="text-sm text-muted-foreground">
                  Allow clients to pay directly within the app
                </p>
              </div>
              <Switch id="inAppPayment" defaultChecked />
            </div>
          </div>
        </div>
        
        <div className="pt-4 border-t">
          <h3 className="text-lg font-medium mb-4">Order Cancellations & Refunds</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="allowCancellations" className="block mb-1">Allow customers to cancel orders</Label>
                <p className="text-sm text-muted-foreground">
                  Customers can cancel orders themselves
                </p>
              </div>
              <Switch id="allowCancellations" defaultChecked />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cancellationTimeLimit">Cancellation Time Limit (hours)</Label>
              <Input id="cancellationTimeLimit" type="number" defaultValue="24" />
              <p className="text-sm text-muted-foreground">
                How long after ordering can customers cancel
              </p>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="automaticRefunds" className="block mb-1">Automatic refunds on cancellation</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically process refunds when orders are canceled
                </p>
              </div>
              <Switch id="automaticRefunds" defaultChecked />
            </div>
          </div>
        </div>
        
        <div className="pt-4 border-t">
          <h3 className="text-lg font-medium mb-4">Payment Reminders</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="sendReminders" className="block mb-1">Send payment reminders</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically send reminders for unpaid orders
                </p>
              </div>
              <Switch id="sendReminders" defaultChecked />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="reminderDays">Send reminder after fulfillment (days)</Label>
              <Input id="reminderDays" type="number" defaultValue="3" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="overdueDays">Mark as overdue after (days)</Label>
              <Input id="overdueDays" type="number" defaultValue="7" />
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button onClick={handleSave}>Save Payment Settings</Button>
      </div>
    </div>
  );
}
