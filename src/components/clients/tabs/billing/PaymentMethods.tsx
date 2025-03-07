
import React from "react";
import { CreditCard, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Customer } from "@/components/clients/mock-data";

interface PaymentMethodsProps {
  client: Customer;
}

export function PaymentMethods({ client }: PaymentMethodsProps) {
  return (
    <Card className="lg:col-span-1">
      <CardHeader>
        <CardTitle>Payment Methods</CardTitle>
        <CardDescription>
          Manage credit cards and payment information.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {client.billingInfo ? (
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
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Payment Method
            </Button>
          </div>
        )}
        
        <div className="mt-4">
          <Button variant="outline" className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add New Card
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
