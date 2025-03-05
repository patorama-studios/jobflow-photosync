
import { useState } from "react";
import { CreditCard, DollarSign, Check, Lock, Unlock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface Order {
  id: string;
  orderNumber: string;
  totalAmount: number;
  amountPaid: number;
  paymentStatus: string;
  paymentDueDate: string;
  paymentTerms: string;
  invoiceItems: {
    id: string;
    description: string;
    amount: number;
  }[];
}

interface PaymentSectionProps {
  order: Order;
  onPaymentComplete: () => void;
}

export function PaymentSection({ order, onPaymentComplete }: PaymentSectionProps) {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(order.totalAmount.toString());
  const [paymentSuccessful, setPaymentSuccessful] = useState(false);
  
  const outstandingAmount = order.totalAmount - order.amountPaid;
  
  const handleProcessPayment = () => {
    // Validate payment amount
    const amount = parseFloat(paymentAmount);
    if (isNaN(amount) || amount <= 0 || amount > outstandingAmount) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid payment amount.",
        variant: "destructive",
      });
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate payment processing with a timeout
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccessful(true);
      
      toast({
        title: "Payment Successful",
        description: `Payment of $${amount.toFixed(2)} has been processed successfully.`,
      });
      
      onPaymentComplete();
    }, 2000);
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Payment & Invoice
          </CardTitle>
          <CardDescription>
            Complete payment to unlock all content for download
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-primary/5 border-none">
                <CardContent className="p-4 text-center">
                  <p className="text-sm font-medium text-muted-foreground mb-1">Total Amount</p>
                  <p className="text-2xl font-bold">${order.totalAmount.toFixed(2)}</p>
                </CardContent>
              </Card>
              <Card className="bg-primary/5 border-none">
                <CardContent className="p-4 text-center">
                  <p className="text-sm font-medium text-muted-foreground mb-1">Amount Paid</p>
                  <p className="text-2xl font-bold text-green-600">${order.amountPaid.toFixed(2)}</p>
                </CardContent>
              </Card>
              <Card className="bg-primary/5 border-none">
                <CardContent className="p-4 text-center">
                  <p className="text-sm font-medium text-muted-foreground mb-1">Outstanding</p>
                  <p className="text-2xl font-bold text-amber-600">${outstandingAmount.toFixed(2)}</p>
                </CardContent>
              </Card>
              <Card className="bg-primary/5 border-none">
                <CardContent className="p-4 text-center">
                  <p className="text-sm font-medium text-muted-foreground mb-1">Due Date</p>
                  <p className="text-2xl font-bold">{new Date(order.paymentDueDate).toLocaleDateString()}</p>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3">Invoice Items</h3>
            <table className="w-full">
              <thead className="border-b">
                <tr className="text-left text-muted-foreground">
                  <th className="pb-2">Description</th>
                  <th className="pb-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {order.invoiceItems.map((item) => (
                  <tr key={item.id} className="border-b">
                    <td className="py-3">{item.description}</td>
                    <td className="py-3 text-right">${item.amount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td className="pt-3 font-bold">Total</td>
                  <td className="pt-3 text-right font-bold">${order.totalAmount.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
          
          {/* Payment Form */}
          <Card className="overflow-hidden">
            <CardHeader className="bg-primary/5">
              <CardTitle className="text-lg">
                {paymentSuccessful ? (
                  <div className="flex items-center gap-2 text-green-600">
                    <Check className="h-5 w-5" />
                    Payment Complete
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Make a Payment
                  </div>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              {paymentSuccessful ? (
                <div className="rounded-lg bg-green-50 p-4 text-green-700">
                  <div className="flex items-center mb-2">
                    <Check className="h-5 w-5 mr-2" />
                    <p className="font-medium">Payment Successful</p>
                  </div>
                  <p className="text-sm">
                    Your payment has been processed successfully. All content is now unlocked and available for download.
                  </p>
                  <div className="mt-4 flex items-center text-sm gap-2">
                    <Unlock className="h-4 w-4" />
                    Content Status: <span className="font-medium">Unlocked</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="rounded-lg bg-amber-50 p-4 text-amber-700 mb-4">
                    <div className="flex items-center mb-2">
                      <Lock className="h-5 w-5 mr-2" />
                      <p className="font-medium">Content is Currently Locked</p>
                    </div>
                    <p className="text-sm">
                      Complete payment to unlock all content for download. Once payment is received, you will have immediate access to all photos, videos, and documents.
                    </p>
                  </div>
                
                  <div>
                    <Label htmlFor="payment-amount">Payment Amount ($)</Label>
                    <Input
                      id="payment-amount"
                      type="number"
                      min="0"
                      step="0.01"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      placeholder={outstandingAmount.toString()}
                      className="mt-1"
                    />
                  </div>
                  
                  <div className="pt-2">
                    <Button 
                      className="w-full" 
                      onClick={handleProcessPayment} 
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <>Processing Payment...</>
                      ) : (
                        <>
                          <CreditCard className="h-4 w-4 mr-2" />
                          Pay ${parseFloat(paymentAmount).toFixed(2)}
                        </>
                      )}
                    </Button>
                    <p className="text-xs text-center text-muted-foreground mt-2">
                      Secure payment powered by Stripe
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
