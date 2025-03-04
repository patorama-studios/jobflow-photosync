
import { 
  CreditCard, 
  Package, 
  FileText, 
  ChevronRight, 
  ExternalLink, 
  Plus,
  Calendar,
  DollarSign
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Customer } from "@/components/customers/mock-data";

interface CustomerBillingProps {
  customer: Customer;
}

export function CustomerBilling({ customer }: CustomerBillingProps) {
  // Mock invoices data
  const invoices = [
    {
      id: 'INV-001',
      date: 'Aug 15, 2023',
      amount: 1200,
      status: 'Paid',
      orderNumber: customer.orders?.[0]?.orderNumber || 'ORD-2023-001'
    },
    {
      id: 'INV-002',
      date: 'Jul 30, 2023',
      amount: 950,
      status: 'Paid',
      orderNumber: customer.orders?.[1]?.orderNumber || 'ORD-2023-025'
    },
    {
      id: 'INV-003',
      date: 'Jul 10, 2023',
      amount: 1500,
      status: 'Pending',
      orderNumber: customer.orders?.[2]?.orderNumber || 'ORD-2023-078'
    }
  ];
  
  // Mock product overrides
  const productOverrides = [
    {
      id: 'PO-001',
      name: 'Premium Photography Package',
      standardPrice: 1200,
      overridePrice: 1000,
      discount: '16.67%'
    },
    {
      id: 'PO-002',
      name: '3D Virtual Tour',
      standardPrice: 800,
      overridePrice: 650,
      discount: '18.75%'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
            <CardDescription>
              Manage credit cards and payment information.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {customer.billingInfo ? (
              <div className="border rounded-md p-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium">{customer.billingInfo.cardType}</span>
                  </div>
                  <Button variant="ghost" size="sm">Edit</Button>
                </div>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>•••• •••• •••• {customer.billingInfo.lastFour}</p>
                  <p>Expires: {customer.billingInfo.expiryDate}</p>
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
        
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Product Overrides</CardTitle>
            <CardDescription>
              Custom pricing and product configurations for this customer.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead className="text-right">Standard Price</TableHead>
                    <TableHead className="text-right">Custom Price</TableHead>
                    <TableHead className="text-right">Discount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {productOverrides.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{product.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">${product.standardPrice}</TableCell>
                      <TableCell className="text-right">${product.overridePrice}</TableCell>
                      <TableCell className="text-right text-green-600">{product.discount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            <div className="mt-4 flex justify-end">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Product Override
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Invoice History</CardTitle>
            <CardDescription>
              View all invoices and payment statuses.
            </CardDescription>
          </div>
          <Button variant="outline" size="sm">
            <ExternalLink className="h-4 w-4 mr-2" />
            Xero Profile
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Order #</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{invoice.id}</span>
                      </div>
                    </TableCell>
                    <TableCell>{invoice.date}</TableCell>
                    <TableCell>{invoice.orderNumber}</TableCell>
                    <TableCell className="text-right">${invoice.amount}</TableCell>
                    <TableCell>
                      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${invoice.status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                        {invoice.status}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm">View</Button>
                        <Button variant="ghost" size="sm">Download</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Billing Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border rounded-md p-4">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">Total Billed YTD</span>
              </div>
              <p className="text-2xl font-bold">$4,350</p>
              <p className="text-sm text-muted-foreground mt-1">3 invoices</p>
            </div>
            <div className="border rounded-md p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">Last Payment</span>
              </div>
              <p className="text-2xl font-bold">$950</p>
              <p className="text-sm text-muted-foreground mt-1">Jul 30, 2023</p>
            </div>
            <div className="border rounded-md p-4">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">Outstanding</span>
              </div>
              <p className="text-2xl font-bold text-amber-600">${customer.outstandingPayment}</p>
              <p className="text-sm text-muted-foreground mt-1">1 open invoice</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
