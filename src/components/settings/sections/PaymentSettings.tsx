
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { CreditCard, Banknote, ShieldCheck, ArrowRight, CheckCircle } from "lucide-react";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function PaymentSettings() {
  const { toast } = useToast();
  const [stripeConnected, setStripeConnected] = useState(false);
  const [testMode, setTestMode] = useState(true);
  
  const handleSave = () => {
    toast({
      title: "Payment settings updated",
      description: "Your payment and order settings have been saved.",
    });
  };
  
  const handleConnectStripe = () => {
    // This would normally redirect to Stripe OAuth flow
    // For now, we'll simulate a successful connection
    setStripeConnected(true);
    toast({
      title: "Stripe Connected",
      description: "Your Stripe account has been successfully connected.",
    });
  };
  
  const handleDisconnectStripe = () => {
    setStripeConnected(false);
    toast({
      title: "Stripe Disconnected",
      description: "Your Stripe account has been disconnected.",
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
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Stripe Integration
            </CardTitle>
            <CardDescription>
              Connect your Stripe account to process payments and handle refunds
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 border rounded-md bg-muted/50 flex items-center space-x-4">
              <div className={`p-3 rounded-full ${stripeConnected ? 'bg-green-100' : 'bg-primary/10'}`}>
                {stripeConnected ? (
                  <CheckCircle className="h-6 w-6 text-green-600" />
                ) : (
                  <CreditCard className="h-6 w-6 text-primary" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium">
                    {stripeConnected ? 'Stripe is connected' : 'Stripe is not connected'}
                  </p>
                  {stripeConnected && <Badge variant="outline" className="text-xs">
                    {testMode ? 'TEST MODE' : 'LIVE MODE'}
                  </Badge>}
                </div>
                <p className="text-sm text-muted-foreground">
                  {stripeConnected 
                    ? 'Your account is ready to process payments and refunds' 
                    : 'Connect your Stripe account to process payments'}
                </p>
              </div>
              {stripeConnected ? (
                <Button variant="outline" className="ml-auto" onClick={handleDisconnectStripe}>Disconnect</Button>
              ) : (
                <Button className="ml-auto" onClick={handleConnectStripe}>Connect Stripe</Button>
              )}
            </div>
            
            {stripeConnected && (
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Test Mode</Label>
                    <p className="text-xs text-muted-foreground">
                      Use Stripe test environment for development
                    </p>
                  </div>
                  <Switch checked={testMode} onCheckedChange={setTestMode} />
                </div>
                
                <div className="rounded-md border p-4 bg-amber-50">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="h-5 w-5 text-amber-500 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-amber-800">Webhook Setup Required</h4>
                      <p className="text-xs text-amber-700 mt-1">
                        For automatic payment status updates, set up a Stripe webhook pointing to:
                      </p>
                      <code className="text-xs bg-white px-2 py-1 rounded border mt-2 block overflow-x-auto">
                        https://your-domain.com/api/stripe-webhook
                      </code>
                      <Button size="sm" variant="link" className="text-xs px-0 py-0 h-auto mt-1">
                        View webhook setup guide
                        <ArrowRight className="h-3 w-3 ml-1" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
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
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Banknote className="h-5 w-5" />
              Refund Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="allowRefunds" className="block mb-1">Enable automatic refunds</Label>
                <p className="text-sm text-muted-foreground">
                  Process refunds directly through the order management interface
                </p>
              </div>
              <Switch id="allowRefunds" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="partialRefunds" className="block mb-1">Allow partial refunds</Label>
                <p className="text-sm text-muted-foreground">
                  Enable the option to refund only a portion of the order amount
                </p>
              </div>
              <Switch id="partialRefunds" defaultChecked />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="refundTimeLimit">Refund Time Limit (days)</Label>
              <Input id="refundTimeLimit" type="number" defaultValue="30" />
              <p className="text-sm text-muted-foreground">
                Maximum number of days after payment that refunds are allowed
              </p>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="notifyCustomerRefund" className="block mb-1">Customer refund notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Send email notifications to customers when refunds are processed
                </p>
              </div>
              <Switch id="notifyCustomerRefund" defaultChecked />
            </div>
          </CardContent>
        </Card>
        
        <div className="pt-4 border-t">
          <h3 className="text-lg font-medium mb-4">Order Cancellations</h3>
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
