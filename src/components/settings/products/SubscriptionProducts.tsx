
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, CreditCard, Clock, Calendar, AlertCircle } from "lucide-react";

export function SubscriptionProducts() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Subscription Products</h3>
          <p className="text-sm text-muted-foreground">
            Create and manage recurring subscription offerings
          </p>
        </div>
        <Button disabled>
          <Plus className="h-4 w-4 mr-2" />
          Add Subscription
        </Button>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-8 text-center space-y-5">
            <div className="bg-primary/10 p-3 rounded-full">
              <CreditCard className="h-6 w-6 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Subscription Management Coming Soon</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                We're working on adding support for subscription-based products with monthly or yearly billing cycles.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl w-full mt-4">
              <div className="border rounded-md p-4 flex flex-col items-center text-center space-y-2">
                <Calendar className="h-5 w-5 text-primary mb-1" />
                <h4 className="font-medium">Flexible Billing</h4>
                <p className="text-sm text-muted-foreground">Monthly & yearly subscription options</p>
              </div>
              
              <div className="border rounded-md p-4 flex flex-col items-center text-center space-y-2">
                <Clock className="h-5 w-5 text-primary mb-1" />
                <h4 className="font-medium">Automatic Renewals</h4>
                <p className="text-sm text-muted-foreground">Hassle-free recurring payments</p>
              </div>
              
              <div className="border rounded-md p-4 flex flex-col items-center text-center space-y-2">
                <AlertCircle className="h-5 w-5 text-primary mb-1" />
                <h4 className="font-medium">Smart Notifications</h4>
                <p className="text-sm text-muted-foreground">Payment reminders & renewal alerts</p>
              </div>
            </div>
            
            <Button variant="outline" disabled>
              Join Waitlist
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
