
import React from "react";
import { Customer } from "@/components/clients/mock-data";
import { 
  BillingSummary,
  InvoiceHistory
} from "./billing";
import { useBillingData } from "./billing/hooks/useBillingData";
import { ProductOverrides } from "./billing/ProductOverrides";
import { PaymentMethods } from "./billing/PaymentMethods";
import { useProducts } from "@/hooks/use-products";
import { ProductSearch } from "./billing/ProductSearch";

interface ClientBillingProps {
  client: Customer;
  clientId: string;
}

export function ClientBilling({ client, clientId }: ClientBillingProps) {
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

  const { products, createProductOverride } = useProducts();

  // Calculate the number of open invoices
  const openInvoiceCount = invoices.filter(inv => inv.status !== 'Paid').length;
  
  // Handler for adding product override from search component
  const handleAddProductOverride = async (product: any, overridePrice: number) => {
    await createProductOverride(clientId, product.id, overridePrice);
    // Refresh product overrides
    addProductOverride({
      client_id: clientId, // Add the client_id here to fix the TypeScript error
      name: product.name,
      standard_price: product.price,
      override_price: overridePrice,
      discount: ((product.price - overridePrice) / product.price * 100).toFixed(2) + '%'
    });
  };

  return (
    <div className="space-y-6">
      <BillingSummary 
        totalBilled={billingSummary?.total_billed || 0}
        lastPaymentAmount={billingSummary?.last_payment_amount || 0}
        lastPaymentDate={billingSummary?.last_payment_date}
        outstandingPayment={billingSummary?.outstanding_payment || client.outstandingPayment || 0}
        invoiceCount={invoices.length}
        openInvoiceCount={openInvoiceCount}
        isLoading={isLoading}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <PaymentMethods 
          paymentMethods={paymentMethods} 
          client={client} 
          onAddPaymentMethod={addPaymentMethod}
          isLoading={isLoading}
        />
        <ProductOverrides 
          productOverrides={productOverrides} 
          onAddProductOverride={(override) => addProductOverride(override)} 
          isLoading={isLoading}
          clientId={clientId}
          customAddComponent={
            <ProductSearch 
              onSelectProduct={handleAddProductOverride}
              clientId={clientId}
            />
          }
        />
      </div>
      
      <InvoiceHistory 
        invoices={invoices} 
        onAddInvoice={addInvoice}
        isLoading={isLoading}
      />
    </div>
  );
}
