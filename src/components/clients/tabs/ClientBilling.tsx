
import React from "react";
import { Customer } from "@/components/clients/mock-data";
import { 
  PaymentMethods, 
  ProductOverrides, 
  InvoiceHistory, 
  BillingSummary 
} from "./billing";
import { Invoice, ProductOverride } from "./billing/types";

interface ClientBillingProps {
  client: Customer;
}

export function ClientBilling({ client }: ClientBillingProps) {
  // Mock invoices data
  const invoices: Invoice[] = [
    {
      id: 'INV-001',
      date: 'Aug 15, 2023',
      amount: 1200,
      status: 'Paid',
      orderNumber: client.orders?.[0]?.orderNumber || 'ORD-2023-001'
    },
    {
      id: 'INV-002',
      date: 'Jul 30, 2023',
      amount: 950,
      status: 'Paid',
      orderNumber: client.orders?.[1]?.orderNumber || 'ORD-2023-025'
    },
    {
      id: 'INV-003',
      date: 'Jul 10, 2023',
      amount: 1500,
      status: 'Pending',
      orderNumber: client.orders?.[2]?.orderNumber || 'ORD-2023-078'
    }
  ];
  
  // Mock product overrides
  const productOverrides: ProductOverride[] = [
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

  // Total billed is the sum of all invoices
  const totalBilled = 4350; // Hardcoded for now, could be calculated from invoices
  const lastPaymentAmount = 950;
  const lastPaymentDate = 'Jul 30, 2023';

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <PaymentMethods client={client} />
        <ProductOverrides productOverrides={productOverrides} />
      </div>
      
      <InvoiceHistory invoices={invoices} />
      
      <BillingSummary 
        totalBilled={totalBilled}
        lastPaymentAmount={lastPaymentAmount}
        lastPaymentDate={lastPaymentDate}
        outstandingPayment={client.outstandingPayment}
      />
    </div>
  );
}
