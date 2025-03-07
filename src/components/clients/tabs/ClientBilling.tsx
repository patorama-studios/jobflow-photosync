
import React from "react";
import { Customer } from "@/components/clients/mock-data";
import { 
  PaymentMethods, 
  ProductOverrides, 
  InvoiceHistory, 
  BillingSummary 
} from "./billing";
import { useBillingData } from "./billing/hooks/useBillingData";

interface ClientBillingProps {
  client: Customer;
}

export function ClientBilling({ client }: ClientBillingProps) {
  // Use our billing data hook
  const { 
    invoices, 
    productOverrides, 
    paymentMethods, 
    billingSummary,
    isLoading,
    addInvoice,
    addProductOverride,
    addPaymentMethod
  } = useBillingData(client.id);

  // Calculate the number of open invoices
  const openInvoiceCount = invoices.filter(inv => inv.status !== 'Paid').length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <PaymentMethods 
          paymentMethods={paymentMethods} 
          client={client} 
          onAddPaymentMethod={addPaymentMethod}
          isLoading={isLoading}
        />
        <ProductOverrides 
          productOverrides={productOverrides} 
          onAddProductOverride={addProductOverride} 
          isLoading={isLoading}
        />
      </div>
      
      <InvoiceHistory 
        invoices={invoices} 
        onAddInvoice={addInvoice}
        isLoading={isLoading}
      />
      
      <BillingSummary 
        totalBilled={billingSummary?.total_billed || 0}
        lastPaymentAmount={billingSummary?.last_payment_amount || 0}
        lastPaymentDate={billingSummary?.last_payment_date}
        outstandingPayment={billingSummary?.outstanding_payment || client.outstandingPayment || 0}
        invoiceCount={invoices.length}
        openInvoiceCount={openInvoiceCount}
        isLoading={isLoading}
      />
    </div>
  );
}
